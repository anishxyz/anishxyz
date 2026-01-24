"use client"

import React from "react"
import type { LifeWeeksData, LifeWeeksTile } from "@/lib/life-weeks"
import { cn } from "@/lib/utils"

type LifeWeeksExpandedProps = {
  data: LifeWeeksData
  today: Date | null
}

const TILE_SCALE = 1
const EXPANDED_COLUMNS = 26
const CONTAINER_PADDING_PX = 0
const MIN_TILE_PX = 6
const TEXT_PADDING_PX = 4

function getDisplayText(tile: LifeWeeksTile): string {
  const event = tile.event
  if (!event) return ""
  const parts = []
  if (event.emoji) parts.push(event.emoji)
  if (event.label) parts.push(event.label)
  return parts.join(" ")
}

function isFutureWeek(weekStartISO: string, today: Date): boolean {
  const [y, m, d] = weekStartISO.split("-").map((v) => Number(v))
  const weekStart = new Date(Date.UTC(y, m - 1, d))
  const now = new Date(today.getTime())
  now.setUTCHours(0, 0, 0, 0)
  return weekStart.getTime() > now.getTime()
}

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

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}

function getWeekRange(startISO: string, spanWeeks: number): { start: string; end: string } {
  const startDate = parseISODate(startISO)
  const endDate = addDays(startDate, Math.max(1, spanWeeks) * 7 - 1)
  return { start: startISO, end: formatISODate(endDate) }
}

export default function LifeWeeksExpanded({ data, today }: LifeWeeksExpandedProps) {
  const [tileSize, setTileSize] = React.useState<number | null>(null)
  const [measureFont, setMeasureFont] = React.useState<string>("")
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const measureRef = React.useRef<HTMLSpanElement | null>(null)

  React.useLayoutEffect(() => {
    const node = containerRef.current
    if (!node) return

    const update = () => {
      const width = node.getBoundingClientRect().width
      const usable = Math.max(1, width - CONTAINER_PADDING_PX)
      if (usable <= 1) return
      const size = Math.max(
        MIN_TILE_PX,
        Math.floor((usable / EXPANDED_COLUMNS) * TILE_SCALE)
      )
      setTileSize(size)
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

  React.useLayoutEffect(() => {
    if (!measureRef.current) return
    const style = getComputedStyle(measureRef.current)
    setMeasureFont(style.font)
  }, [])

  const expandedTiles = React.useMemo(() => {
    if (!tileSize) return []

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (ctx && measureFont) {
      ctx.font = measureFont
    }

    const tiles: Array<LifeWeeksTile & { span: number; weekSpan: number; visualSpan: number }> = []
    for (let i = 0; i < data.weeks.length; i += 1) {
      const week = data.weeks[i]
      const event = week.event
      const text = event ? getDisplayText(week) : ""
      const weekSpan = event?.isRange ? Math.max(1, event.rangeWeeks ?? 1) : 1

      let textSpan = 1
      if (event && text && ctx) {
        const width = ctx.measureText(text).width + TEXT_PADDING_PX * 2
        textSpan = Math.max(1, Math.ceil(width / tileSize))
      }

      let visualSpan = Math.max(weekSpan, textSpan)
      visualSpan = Math.min(visualSpan, data.weeks.length - i)

      tiles.push({ ...week, span: visualSpan, weekSpan, visualSpan })
      i += visualSpan - 1
    }

    return tiles
  }, [data.weeks, tileSize, measureFont])

  return (
    <div ref={containerRef} className="relative">
      <span
        ref={measureRef}
        className="pointer-events-none absolute -z-10 opacity-0 text-[9px]"
        aria-hidden="true"
      >
        Measure
      </span>
      <div
        className="grid gap-[2px] w-full"
        style={{
          gridTemplateColumns: `repeat(${EXPANDED_COLUMNS}, ${
            tileSize ? `${tileSize}px` : "12px"
          })`,
          gridAutoRows: tileSize ? `${tileSize}px` : "12px",
          visibility: tileSize ? "visible" : "hidden"
        }}
      >
        {expandedTiles.map((tile) => {
          const event = tile.event
          const future = today ? isFutureWeek(tile.startDateISO, today) : false
          const text = event ? getDisplayText(tile) : ""
          const range = getWeekRange(tile.startDateISO, tile.weekSpan)
          const hoverText = event?.hover ?? event?.label
          const rangeLabel = `${range.start} → ${range.end}`
          const title = hoverText ? `${hoverText} · ${rangeLabel}` : rangeLabel

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
                "relative flex h-full w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-[2px] border leading-none transition px-1 text-[9px]",
                event
                  ? "border-[#C50]/60 bg-[#C50]/20 text-[#C50]"
                  : "border-foreground/10 bg-foreground/5 text-foreground/30",
                future && "border-dotted bg-transparent text-foreground/20",
                event?.class
              )}
              style={{
                gridColumn: `span ${tile.visualSpan}`,
                ...themeStyle
              }}
              title={title}
              aria-label={hoverText ?? rangeLabel}
            >
              {text}
            </div>
          )
        })}
      </div>
    </div>
  )
}
