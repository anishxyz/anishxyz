"use client"

import React from 'react'

function computeYearsSince(dateISO: string): string {
  const start = new Date(dateISO).getTime()
  const now = Date.now()
  const diffMs = Math.max(0, now - start)
  const msPerYear = 365.2425 * 24 * 60 * 60 * 1000
  const years = diffMs / msPerYear
  return years.toFixed(5)
}

export default function Age() {
  const [value, setValue] = React.useState<string>("")

  React.useEffect(() => {
    // Compute immediately on mount
    setValue(computeYearsSince("2003-02-23T00:00:00Z"))
    // Update roughly hourly; 3-decimal precision changes about every 8.7 hours
    const id = setInterval(() => {
      setValue(computeYearsSince("2003-02-23T00:00:00Z"))
    }, 60 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  if (!value) return null

  return <div aria-label="age in years">{value} years</div>
}


