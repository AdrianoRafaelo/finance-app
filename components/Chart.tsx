"use client"

import { useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

// Chart mingguan: mengagregasi per-minggu (Senin sebagai awal minggu)
export default function Chart({ transactions, month }: any) {
  const transactionsArr: any[] = transactions ?? []

  const getMondayKey = (dateInput: string | Date) => {
    const d = typeof dateInput === "string" ? new Date(dateInput) : new Date(dateInput)
    const day = d.getDay()
    const diff = (day + 6) % 7 // jumlah hari sejak Senin
    const monday = new Date(d)
    monday.setDate(d.getDate() - diff)
    monday.setHours(0, 0, 0, 0)
    return monday.toISOString().slice(0, 10) // YYYY-MM-DD
  }

  const weeks = useMemo(() => {
    const arr: string[] = []

    if (month && typeof month === "string" && /^\d{4}-\d{2}$/.test(month)) {
      const [y, m] = month.split("-").map(Number)
      const first = new Date(y, m - 1, 1)
      const last = new Date(y, m, 0)

      let current = new Date(getMondayKey(first))
      while (current <= last) {
        arr.push(current.toISOString().slice(0, 10))
        current = new Date(current)
        current.setDate(current.getDate() + 7)
      }
      // ensure at least one week
      if (arr.length === 0) arr.push(getMondayKey(first))
    } else {
      // fallback: last 12 weeks ending this week
      const WEEKS = 12
      const today = new Date()
      const currentMonday = new Date(getMondayKey(today))
      for (let i = WEEKS - 1; i >= 0; i--) {
        const d = new Date(currentMonday)
        d.setDate(currentMonday.getDate() - i * 7)
        arr.push(d.toISOString().slice(0, 10))
      }
    }

    return arr
  }, [transactionsArr, month])

  const grouped = useMemo(() => {
    const g: Record<string, { income: number; expense: number }> = {}
    weeks.forEach((w) => (g[w] = { income: 0, expense: 0 }))

    transactionsArr.forEach((t) => {
      if (!t?.created_at) return
      const key = getMondayKey(t.created_at)
      if (!g[key]) return
      if (t.type === "income") g[key].income += t.amount
      else g[key].expense += t.amount
    })

    return g
  }, [weeks, transactionsArr])

  const data = weeks.map((w) => {
    const d = new Date(w)
    const label = d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })
    return {
      week: label,
      start: w,
      income: grouped[w]?.income ?? 0,
      expense: grouped[w]?.expense ?? 0,
    }
  })

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Grafik Mingguan (12 minggu)</h2>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip labelFormatter={(label: any, payload: any) => `Minggu mulai ${payload?.[0]?.payload?.start ?? label}`} />
          <Legend />

          <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={3} />
          <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
