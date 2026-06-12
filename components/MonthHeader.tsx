"use client"

import { useSearchParams } from "next/navigation"
import { useMemo } from "react"

function formatMonthLabel(month: string) {
  try {
    return new Date(`${month}-01`).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
  } catch (e) {
    return month
  }
}

export default function MonthHeader({ serverMonth }: { serverMonth?: string }) {
  const searchParams = useSearchParams()
  const monthParam = searchParams?.get("month") ?? undefined

  const month = useMemo(() => {
    if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) return monthParam
    if (serverMonth && /^\d{4}-\d{2}$/.test(serverMonth)) return serverMonth
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  }, [monthParam, serverMonth])

  const label = formatMonthLabel(month)

  return (
    <div>
      <div className="text-center font-medium text-slate-900">{label}</div>
      <div className="text-center text-xs text-slate-400">{month}</div>
    </div>
  )
}
