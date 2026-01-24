"use client"

import React from "react"
import { LifeWeeksData, LifeWeeksTile } from "@/lib/life-weeks"
import { cn } from "@/lib/utils"
import LifeWeeksExpanded from "@/components/LifeWeeksExpanded"

type LifeWeeksProps = {
  data: LifeWeeksData
  todayISO?: string
}

function getCompactText(tile: LifeWeeksTile, maxChars: number): string {
  const event = tile.event
  if (!event) return ""
  const sliceText = (value: string) =>
    Array.from(value).slice(0, Math.max(1, maxChars)).join("")
  if (event.compact) return sliceText(event.compact)
  if (event.emoji) return event.emoji
  if (event.label) return sliceText(event.label)
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
  const gridRef = React.useRef<HTMLDivElement | null>(null)

  React.useLayoutEffect(() => {
    const node = gridRef.current
    if (!node) return

    const update = () => {
      const width = node.getBoundingClientRect().width
      if (width > 0) {
        setTileSize(width / data.settings.columns)
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
  }, [data.settings.columns])

  const tiles = React.useMemo(
    () => data.weeks.filter((tile) => !tile.skip),
    [data.weeks]
  )

  return (
    <div
      ref={gridRef}
      className="grid gap-[2px] w-full"
      style={{
        gridTemplateColumns: `repeat(${data.settings.columns}, ${
          tileSize ? `${tileSize}px` : "12px"
        })`,
        gridAutoRows: tileSize ? `${tileSize}px` : "12px",
        visibility: tileSize ? "visible" : "hidden"
      }}
    >
      {tiles.map((tile) => {
        const event = tile.event
        const future = today ? isFutureWeek(tile.startDateISO, today) : false
        const text = getCompactText(tile, data.settings.compact_mode.max_chars)
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
              "relative flex h-full w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-[2px] border leading-none transition px-0.5 text-[8px]",
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
  )
}

export default function LifeWeeks({ data, todayISO }: LifeWeeksProps) {
  const [compact, setCompact] = React.useState<boolean>(
    data.settings.compact_mode.enabled
  )

  const today = React.useMemo(() => {
    if (!todayISO) return null
    const [y, m, d] = todayISO.split("-").map((v) => Number(v))
    return new Date(Date.UTC(y, m - 1, d))
  }, [todayISO])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            className={cn(
              "rounded border px-2 py-1 transition",
              compact
                ? "border-[#C50] text-[#C50]"
                : "border-transparent text-foreground/60 hover:text-foreground"
            )}
            onClick={() => setCompact(true)}
          >
            Compact
          </button>
          <button
            type="button"
            className={cn(
              "rounded border px-2 py-1 transition",
              !compact
                ? "border-[#C50] text-[#C50]"
                : "border-transparent text-foreground/60 hover:text-foreground"
            )}
            onClick={() => setCompact(false)}
          >
            Expanded
          </button>
        </div>
      </div>

      {compact ? (
        <LifeWeeksCompact data={data} today={today} />
      ) : (
        <LifeWeeksExpanded data={data} today={today} />
      )}
    </div>
  )
}
