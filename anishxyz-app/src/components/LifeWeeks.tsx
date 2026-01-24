"use client"

import React from "react"
import { LifeWeeksData } from "@/lib/life-weeks"
import LifeWeeksExpanded from "@/components/LifeWeeksExpanded"

type LifeWeeksProps = {
  data: LifeWeeksData
  todayISO?: string
}

export default function LifeWeeks({ data, todayISO }: LifeWeeksProps) {
  const today = React.useMemo(() => {
    if (!todayISO) return null
    const [y, m, d] = todayISO.split("-").map((v) => Number(v))
    return new Date(Date.UTC(y, m - 1, d))
  }, [todayISO])

  return (
    <LifeWeeksExpanded data={data} today={today} />
  )
}
