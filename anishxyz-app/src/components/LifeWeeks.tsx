"use client"

import React from "react"
import { LifeWeeksData, LifeWeeksTile } from "@/lib/life-weeks"
import { cn } from "@/lib/utils"
import LifeWeeksExpanded from "@/components/LifeWeeksExpanded"

type LifeWeeksProps = {
  data: LifeWeeksData
  todayISO?: string
}

function getCompactText(tile: LifeWeeksTile): string {
  const event = tile.event
  if (!event) return ""
  if (typeof event.compact === "string" && event.compact.length > 0) {
    return Array.from(event.compact).slice(0, 2).join("")
  }
  if (event.emoji) return event.emoji
  if (event.label) return Array.from(event.label).slice(0, 1).join("")
  return ""
}

function isFutureWeek(weekStartISO: string, today: Date): boolean {
  const [y, m, d] = weekStartISO.split("-").map((v) => Number(v))
  const weekStart = new Date(Date.UTC(y, m - 1, d))
  const now = new Date(today.getTime())
  now.setUTCHours(0, 0, 0, 0)
  return weekStart.getTime() > now.getTime()
}

function LifeWeeksCompact({ data, today }: { data: LifeWeeksData; today: Date | null }) {
  const [tileSize, setTileSize] = React.useState<number | null>(null)
  const [columns, setColumns] = React.useState<number>(data.settings.columns)
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const gapPx = 2
  const minTilePx = 10

  React.useLayoutEffect(() => {
    const node = containerRef.current
    if (!node) return

    const update = () => {
      const width = node.getBoundingClientRect().width
      if (width > 0) {
        const maxColumns = data.settings.columns
        const columnsForWidth = Math.max(
          1,
          Math.floor((width + gapPx) / (minTilePx + gapPx))
        )
        const nextColumns = Math.min(maxColumns, columnsForWidth)
        const usable = Math.max(1, width - gapPx * (nextColumns - 1))
        setColumns(nextColumns)
        setTileSize(Math.floor(usable / nextColumns))
      }
    }

    update()

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update)
      return () => window.removeEventListener("resize", update)
    }

    const observer = new ResizeObserver(() => update())
    observer.observe(node)
    return () => observer.disconnect()
  }, [data.settings.columns, minTilePx])

  const tiles = React.useMemo(() => {
    const resolved: LifeWeeksTile[] = []
    let remaining = 0
    let activeEvent: LifeWeeksTile["event"] | undefined

    data.weeks.forEach((week) => {
      if (week.event) {
        activeEvent = week.event
        remaining = week.event.isRange
          ? Math.max(1, week.event.rangeWeeks ?? 1)
          : 1
      }

      let event = week.event
      if (!event && remaining > 1 && activeEvent?.isRange) {
        event = activeEvent
      }

      resolved.push({ ...week, event })

      if (remaining > 0) remaining -= 1
    })

    return resolved
  }, [data.weeks])

  return (
    <div ref={containerRef} className="w-full">
      <div
        className="grid gap-[2px] w-full"
        style={{
          gridTemplateColumns: `repeat(${columns}, ${tileSize ? `${tileSize}px` : "8px"})`,
          gridAutoRows: tileSize ? `${tileSize}px` : "8px",
          visibility: tileSize ? "visible" : "hidden"
        }}
      >
        {tiles.map((tile) => {
          const event = tile.event
          const future = today ? isFutureWeek(tile.startDateISO, today) : false
          const text = getCompactText(tile)
          const monthYear = tile.monthYear
          const hoverText = event?.hover ?? event?.label
          const title = hoverText ? `${hoverText} · ${monthYear}` : monthYear

          const themeStyle: React.CSSProperties = {}
          const classTheme = event?.class
            ? data.settings.class_themes?.[event.class]
            : undefined
          const resolvedTheme = event?.theme ?? classTheme

          if (resolvedTheme?.bg) themeStyle.backgroundColor = resolvedTheme.bg
          if (resolvedTheme?.fg) themeStyle.color = resolvedTheme.fg
          if (resolvedTheme?.border) themeStyle.borderColor = resolvedTheme.border

          if (future) {
            themeStyle.backgroundColor = "transparent"
          }

          return (
            <div
              key={`${tile.startDateISO}-${tile.index}`}
              className={cn(
                "relative flex h-full w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-[2px] border leading-none transition text-[7px]",
                event
                  ? "border-[#C50]/60 bg-[#C50]/20 text-[#C50]"
                  : "border-foreground/10 bg-foreground/5 text-foreground/30",
                future && "border-dotted bg-transparent text-foreground/20",
                event?.class
              )}
              style={{
                gridColumn: "span 1",
                ...themeStyle
              }}
              title={title}
              aria-label={event?.label ?? "week"}
            >
              {text}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function LifeWeeks({ data, todayISO }: LifeWeeksProps) {
  const [view, setView] = React.useState<"expanded" | "compact">("expanded")

  const today = React.useMemo(() => {
    if (!todayISO) return null
    const [y, m, d] = todayISO.split("-").map((v) => Number(v))
    return new Date(Date.UTC(y, m - 1, d))
  }, [todayISO])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center sm:justify-start">
        <div className="flex flex-col items-start gap-1 text-left text-xs font-mono">
          <button
            type="button"
            className={cn(
              "text-foreground/70 hover:text-foreground transition",
              view === "expanded" && "text-foreground"
            )}
            onClick={() => setView("expanded")}
            aria-pressed={view === "expanded"}
          >
            [{view === "expanded" ? "X" : " "}] Expanded
          </button>
          <button
            type="button"
            className={cn(
              "text-foreground/70 hover:text-foreground transition",
              view === "compact" && "text-foreground"
            )}
            onClick={() => setView("compact")}
            aria-pressed={view === "compact"}
          >
            [{view === "compact" ? "X" : " "}] Compact
          </button>
        </div>
      </div>

      {view === "compact" ? (
        <LifeWeeksCompact data={data} today={today} />
      ) : (
        <LifeWeeksExpanded data={data} today={today} />
      )}
    </div>
  )
}
