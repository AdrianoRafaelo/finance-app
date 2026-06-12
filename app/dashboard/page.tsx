export const dynamic = "force-dynamic"

import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import Chart from "@/components/Chart"
import UserGreeting from "@/components/UserGreeting"

const CATEGORY_META: Record<string, { label: string; icon: string; bg: string; fg: string }> = {
  keluarga: { label: "Keluarga", icon: "👨‍👩‍👧", bg: "from-violet-100 to-purple-100", fg: "text-violet-700" },
  pendidikan: { label: "Pendidikan", icon: "🎓", bg: "from-fuchsia-100 to-pink-100", fg: "text-fuchsia-700" },
  "hewan pelihara": { label: "Hewan pelihara", icon: "🐾", bg: "from-sky-100 to-blue-100", fg: "text-sky-700" },
  bioskop: { label: "Bioskop", icon: "🎬", bg: "from-pink-100 to-rose-100", fg: "text-pink-600" },
  kesehatan: { label: "Kesehatan", icon: "🩺", bg: "from-cyan-100 to-sky-100", fg: "text-cyan-700" },
  transportasi: { label: "Transportasi", icon: "🚍", bg: "from-emerald-100 to-lime-100", fg: "text-emerald-700" },
  pakaian: { label: "Pakaian", icon: "👕", bg: "from-emerald-100 to-teal-100", fg: "text-emerald-700" },
  makanan: { label: "Makanan", icon: "🥗", bg: "from-emerald-100 to-lime-100", fg: "text-emerald-700" },
  permainan: { label: "Permainan", icon: "🎮", bg: "from-rose-100 to-pink-100", fg: "text-rose-700" },
  buku: { label: "Buku", icon: "📚", bg: "from-orange-100 to-amber-100", fg: "text-orange-700" },
  olahraga: { label: "Olahraga", icon: "🏀", bg: "from-rose-100 to-orange-100", fg: "text-rose-600" },
  kafe: { label: "Kafe", icon: "☕", bg: "from-rose-100 to-orange-100", fg: "text-rose-700" },
}

function formatCurrency(value: number) {
  return value.toLocaleString("id-ID")
}

function getCategoryMeta(category: string) {
  const normalized = category.toLowerCase()
  const key = Object.keys(CATEGORY_META).find((metaKey) => normalized.includes(metaKey))
  return key
    ? CATEGORY_META[key]
    : { label: category, icon: "❔", bg: "from-slate-100 to-slate-100", fg: "text-slate-700" }
}

function formatMonth(month: string, offset: number) {
  const [year, monthNum] = month.split("-").map(Number)
  const date = new Date(year, monthNum - 1 + offset, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

function getCurrentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

function getGreeting() {
  const now = new Date()
  const hour = now.getHours()
  if (hour >= 4 && hour < 12) {
    return "selamat pagi"
  }
  if (hour >= 12 && hour < 15) {
    return "selamat siang"
  }
  if (hour >= 15 && hour < 18) {
    return "selamat sore"
  }
  return "selamat malam"
}

function isValidMonth(month: unknown): month is string {
  return typeof month === "string" && /^\d{4}-\d{2}$/.test(month)
}

function getSearchParam(searchParams: any, key: string) {
  if (!searchParams) return undefined
  if (typeof searchParams.get === "function") {
    return searchParams.get(key) ?? undefined
  }
  const value = searchParams[key]
  if (typeof value === "string") return value
  if (Array.isArray(value) && value.length > 0) return value[0]
  return undefined
}

export default async function DashboardPage({ searchParams }: any) {
  const resolvedSearchParams = await searchParams
  const monthParam = getSearchParam(resolvedSearchParams, "month")
  const categoryParam = getSearchParam(resolvedSearchParams, "category")
  const currentMonth = getCurrentMonth()
  const month = isValidMonth(monthParam) ? monthParam : currentMonth
  const selectedCategory = String(categoryParam || "all").toLowerCase().trim()

  const [year, monthNum] = month.split("-")
  const start = `${month}-01`
  const endDate = new Date(Number(year), Number(monthNum), 0)
  const lastDay = String(endDate.getDate()).padStart(2, "0")
  const end = `${month}-${lastDay}`

  const { data } = await supabase
    .from("transactions")
    .select("*")
    .gte("created_at", start)
    .lte("created_at", end)
    .order("created_at", { ascending: false })

  const transactions = data ?? []
  const total = transactions.reduce((acc, item) => {
    return item.type === "income" ? acc + item.amount : acc - item.amount
  }, 0)

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0)

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0)

  const categoryTotals = transactions.reduce(
    (acc: Record<string, { income: number; expense: number }>, item) => {
      const normalizedCategory = item.category.toLowerCase().trim()
      if (!acc[normalizedCategory]) {
        acc[normalizedCategory] = { income: 0, expense: 0 }
      }
      if (item.type === "income") {
        acc[normalizedCategory].income += item.amount
      } else {
        acc[normalizedCategory].expense += item.amount
      }
      return acc
    },
    {}
  )

  const categorySummary = Object.entries(categoryTotals)
    .map(([category, totals]) => {
      const netAmount = totals.income - totals.expense
      const type = netAmount >= 0 ? "income" : "expense"
      return {
        category,
        amount: Math.abs(netAmount),
        type,
      }
    })
    .sort((a, b) => b.amount - a.amount)

  const prevMonth = formatMonth(month, -1)
  const nextMonth = formatMonth(month, 1)

  const [prevYear, prevMonthNum] = prevMonth.split("-")
  const prevStart = `${prevMonth}-01`
  const prevEndDate = new Date(Number(prevYear), Number(prevMonthNum), 0)
  const prevLastDay = String(prevEndDate.getDate()).padStart(2, "0")
  const prevEnd = `${prevMonth}-${prevLastDay}`

  const { data: prevData } = await supabase
    .from("transactions")
    .select("*")
    .gte("created_at", prevStart)
    .lte("created_at", prevEnd)

  const prevTransactions = prevData ?? []
  const prevTotal = prevTransactions.reduce((acc, item) => {
    return item.type === "income" ? acc + item.amount : acc - item.amount
  }, 0)

  const savingsChange = prevTotal === 0 ? (total === 0 ? 0 : 100) : ((total - prevTotal) / Math.abs(prevTotal)) * 100

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-10">
      <div className="mx-auto w-full max-w-md px-4">
        <div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-600 via-sky-500 to-cyan-500 p-6 shadow-xl text-white">
          <div className="flex items-start justify-between gap-4">
            <UserGreeting />
            <div className="flex items-center gap-3">
              <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-white transition hover:bg-white/30">
                🔍
              </button>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-sm font-semibold uppercase text-white">
                {"A"}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[28px] bg-white/10 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-white/75">Saldo bulan ini</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight">Rp {formatCurrency(total)}</p>
            <div className="mt-3 flex items-center justify-between gap-3 text-sm text-white/80">
              <span>{new Date(`${month}-01`).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</span>
              <span className="rounded-3xl bg-white/15 px-3 py-1">Tabungan {savingsChange >= 0 ? "naik" : "turun"} {Math.abs(savingsChange).toFixed(1)}%</span>
            </div>

      
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-3xl bg-white/10 p-4 shadow-inner border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 text-red-100">-</span>
                  <p className="text-sm md:text-base font-medium text-white/80">Keluar</p>
                </div>
                <p className="mt-3 text-lg sm:text-xl font-semibold text-white">Rp {formatCurrency(expense)}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4 shadow-inner border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-100">+</span>
                  <p className="text-sm md:text-base font-medium text-white/80">Masuk</p>
                </div>
                <p className="mt-3 text-lg sm:text-xl font-semibold text-white">Rp {formatCurrency(income)}</p>
              </div>
            </div>
        </div>
        

        <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <Chart transactions={transactions} month={month} />
        </div>

        {categorySummary.length === 0 ? (
          <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
            Tidak ada transaksi pada bulan ini.
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-3">
            {categorySummary.map(({ category, amount, type }) => {
              const meta = getCategoryMeta(category)
              const isActive = selectedCategory === category
              return (
                <Link
                  key={category}
                  href={`/dashboard/category/${encodeURIComponent(category.toLowerCase().trim())}?month=${month}`}
                  className={`rounded-3xl border p-4 shadow-sm transition hover:shadow-md ${isActive ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-gradient-to-br"} ${isActive ? "text-blue-700" : meta.bg}`}
                >
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                    <span className={type === "income" ? "text-emerald-600" : "text-red-600"}>
                      {type}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                    <span className="text-slate-400">{meta.label}</span>
                  </div>
                  <p className="mt-4 text-base font-semibold text-slate-900">Rp {formatCurrency(amount)}</p>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
