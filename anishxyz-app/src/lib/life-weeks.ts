export type WeekStart = "sunday" | "monday"
export type SpanMode = "range" | "label" | "range_then_label"

export type LifeWeeksTheme = {
  bg?: string
  fg?: string
  border?: string
}

export type LifeWeeksSettings = {
  start_date: string
  years: number
  week_start: WeekStart
  columns: number
  class_themes?: Record<string, LifeWeeksTheme>
  compact_mode: {
    enabled: boolean
    max_chars: number
  }
  span_rules: {
    mode: SpanMode
    max_span: number
    label_chars_per_tile: number
  }
}

export type LifeWeeksEvent = {
  id?: string
  date?: string
  start?: string
  end?: string
  emoji?: string
  label?: string
  compact?: string
  hover?: string
  class?: string
  theme?: LifeWeeksTheme
}

export type LifeWeeksPattern = {
  id: string
  type: "yearly"
  date: string
  start_year?: number
  end_year?: number
  emoji?: string
  label?: string
  compact?: string
  hover?: string
  class?: string
  theme?: LifeWeeksTheme
}

export type LifeWeeksException = {
  date: string
  remove?: boolean
  emoji?: string
  label?: string
  compact?: string
  hover?: string
  class?: string
  theme?: LifeWeeksTheme
}

export type LifeWeeksConfig = {
  version: number
  settings: LifeWeeksSettings
  events: LifeWeeksEvent[]
  patterns: LifeWeeksPattern[]
  exceptions: LifeWeeksException[]
}

type Candidate = {
  id: string
  priority: number
  source: "event" | "pattern" | "exception"
  isRange: boolean
  emoji?: string
  label?: string
  compact?: string
  hover?: string
  class?: string
  theme?: LifeWeeksTheme
  remove?: boolean
}

export type LifeWeeksTile = {
  index: number
  startDateISO: string
  monthYear: string
  event?: Candidate
  span: number
  skip: boolean
}

export type LifeWeeksData = {
  settings: LifeWeeksSettings
  weeks: LifeWeeksTile[]
}

const MS_PER_DAY = 24 * 60 * 60 * 1000
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
]

function parseISODate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map((v) => Number(v))
  return new Date(Date.UTC(y, m - 1, d))
}

function formatISODate(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, "0")
  const d = String(date.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function formatMonthYearUTC(date: Date): string {
  const month = MONTHS_SHORT[date.getUTCMonth()]
  const year = date.getUTCFullYear()
  return `${month} ${year}`
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY)
}

function addYears(date: Date, years: number): Date {
  const d = new Date(date.getTime())
  d.setUTCFullYear(d.getUTCFullYear() + years)
  return d
}

function startOfWeek(date: Date, weekStart: WeekStart): Date {
  const day = date.getUTCDay()
  const offset = weekStart === "monday" ? (day + 6) % 7 : day
  return addDays(date, -offset)
}

function diffWeeks(start: Date, end: Date): number {
  const diffMs = end.getTime() - start.getTime()
  return Math.floor(diffMs / (MS_PER_DAY * 7))
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function makeCandidateId(base: string, suffix: string): string {
  return `${base}-${suffix}`
}

function computeLabelSpan(
  text: string,
  charsPerTile: number,
  maxSpan: number
): number {
  if (!text) return 1
  const raw = Math.ceil(text.length / Math.max(1, charsPerTile))
  return clamp(raw, 1, maxSpan)
}

export function buildLifeWeeks(config: LifeWeeksConfig): LifeWeeksData {
  const settings = config.settings
  const gridStart = startOfWeek(parseISODate(settings.start_date), settings.week_start)
  const gridEnd = startOfWeek(
    addYears(parseISODate(settings.start_date), settings.years),
    settings.week_start
  )
  const totalWeeks = diffWeeks(gridStart, gridEnd) + 1
  const weeks: LifeWeeksTile[] = Array.from({ length: totalWeeks }, (_, index) => {
    const startDate = addDays(gridStart, index * 7)
    return {
      index,
      startDateISO: formatISODate(startDate),
      monthYear: formatMonthYearUTC(startDate),
      span: 1,
      skip: false
    }
  })

  const candidatesByWeek = new Map<number, Candidate[]>()

  const addCandidate = (weekIndex: number, candidate: Candidate) => {
    if (weekIndex < 0 || weekIndex >= totalWeeks) return
    const list = candidatesByWeek.get(weekIndex)
    if (list) {
      list.push(candidate)
    } else {
      candidatesByWeek.set(weekIndex, [candidate])
    }
  }

  const weekIndexForDate = (dateStr: string) => {
    const start = startOfWeek(parseISODate(dateStr), settings.week_start)
    return diffWeeks(gridStart, start)
  }

  config.events.forEach((event, idx) => {
    const id = event.id ?? makeCandidateId("event", String(idx))
    const candidate: Candidate = {
      id,
      priority: 2,
      source: "event",
      isRange: Boolean(event.start || event.end),
      emoji: event.emoji,
      label: event.label,
      compact: event.compact,
      hover: event.hover,
      class: event.class,
      theme: event.theme
    }

    if (event.date) {
      addCandidate(weekIndexForDate(event.date), candidate)
      return
    }

    if (event.start && event.end) {
      const startWeek = weekIndexForDate(event.start)
      const endWeek = weekIndexForDate(event.end)
      for (let i = startWeek; i <= endWeek; i += 1) {
        addCandidate(i, candidate)
      }
    }
  })

  config.patterns.forEach((pattern, idx) => {
    if (pattern.type !== "yearly") return
    const baseYear = parseISODate(settings.start_date).getUTCFullYear()
    const startYear = pattern.start_year ?? baseYear
    const endYear = pattern.end_year ?? baseYear + settings.years
    const id = pattern.id ?? makeCandidateId("pattern", String(idx))
    const candidate: Candidate = {
      id,
      priority: 1,
      source: "pattern",
      isRange: false,
      emoji: pattern.emoji,
      label: pattern.label,
      compact: pattern.compact,
      hover: pattern.hover,
      class: pattern.class,
      theme: pattern.theme
    }

    for (let year = startYear; year <= endYear; year += 1) {
      const dateStr = `${year}-${pattern.date}`
      addCandidate(weekIndexForDate(dateStr), candidate)
    }
  })

  config.exceptions.forEach((exception, idx) => {
    const id = makeCandidateId("exception", String(idx))
    const candidate: Candidate = {
      id,
      priority: 3,
      source: "exception",
      isRange: false,
      emoji: exception.emoji,
      label: exception.label,
      compact: exception.compact,
      hover: exception.hover,
      class: exception.class,
      theme: exception.theme,
      remove: exception.remove
    }
    addCandidate(weekIndexForDate(exception.date), candidate)
  })

  const resolved: Array<Candidate | undefined> = weeks.map((_, idx) => {
    const list = candidatesByWeek.get(idx)
    if (!list || list.length === 0) return undefined
    const winner = list
      .slice()
      .sort((a, b) => {
        if (a.priority !== b.priority) return b.priority - a.priority
        return a.id.localeCompare(b.id)
      })[0]
    if (winner.remove) return undefined
    return winner
  })

  for (let i = 0; i < weeks.length; i += 1) {
    const winner = resolved[i]
    if (!winner) continue
    if (weeks[i].skip) continue

    let span = 1
    let blockEnd = i
    while (blockEnd + 1 < weeks.length && resolved[blockEnd + 1]?.id === winner.id) {
      blockEnd += 1
    }

    if (winner.isRange) {
      span = blockEnd - i + 1
    } else if (settings.span_rules.mode !== "range") {
      const text = `${winner.emoji ?? ""}${winner.label ?? ""}`
      span = computeLabelSpan(
        text,
        settings.span_rules.label_chars_per_tile,
        settings.span_rules.max_span
      )

      if (settings.span_rules.mode === "range_then_label") {
        span = Math.max(span, 1)
      }

      for (let s = 1; s < span && i + s < weeks.length; s += 1) {
        if (resolved[i + s]) {
          span = s
          break
        }
      }
    }

    span = clamp(span, 1, settings.span_rules.max_span)
    weeks[i].event = winner
    weeks[i].span = span

    for (let s = 1; s < span && i + s < weeks.length; s += 1) {
      weeks[i + s].skip = true
    }
  }

  return { settings, weeks }
}
