import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import TransactionItem from "@/components/TransactionItem"
import Chart from "@/components/Chart"
export const dynamic = "force-dynamic";

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

function isValidMonth(month: unknown): month is string {
  return typeof month === "string" && /^\d{4}-\d{2}$/.test(month)
}

export default async function Dashboard({ searchParams }: any) {
  const currentMonth = getCurrentMonth()
  const month = isValidMonth(searchParams?.month) ? searchParams.month : currentMonth
  const selectedCategory = String(searchParams?.category || "all").toLowerCase().trim()

  const [year, monthNum] = month.split("-")
  const start = `${month}-01`
  const endDate = new Date(Number(year), Number(monthNum), 0)
  const lastDay = String(endDate.getDate()).padStart(2, "0")
  const end = `${month}-${lastDay}`

  const { data: allData } = await supabase
    .from("transactions")
    .select("*")

  const { data } = await supabase
    .from("transactions")
    .select("*")
    .gte("created_at", start)
    .lte("created_at", end)
    .order("created_at", { ascending: false })

  const transactions = data ?? []
  const allTransactions = allData ?? []
  const filteredTransactions =
    selectedCategory === "all"
      ? transactions
      : transactions.filter((t) => t.category.toLowerCase().trim() === selectedCategory)

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

  const showCategorySummary = selectedCategory === "all"

  const monthLabel = new Date(`${month}-01`).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  })

  const prevMonth = formatMonth(month, -1)
  const nextMonth = formatMonth(month, 1)

  return (
    <div className="min-h-screen bg-slate-50 pb-10 pt-28">
      <div className="mx-auto w-full max-w-md px-4">
        <div className="rounded-[32px] border border-slate-200 bg-white px-6 py-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Saldo keseluruhan</p>
          <div className="mt-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-4xl font-semibold tracking-tight text-slate-900">
                Rp {formatCurrency(total)}
              </p>
            </div>
            <button className="rounded-2xl border border-slate-200 bg-slate-100 px-3 py-2 text-slate-600 transition hover:bg-slate-200">
              <Link href="/add-transaction">✏️</Link>
            </button>
          </div>

          <div className="mt-6 grid grid-cols-[auto_1fr_auto] items-center gap-3 text-sm text-slate-600">
            <Link
              href={`/dashboard?month=${prevMonth}${selectedCategory !== "all" ? `&category=${encodeURIComponent(selectedCategory)}` : ""}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              ←
            </Link>

            <div className="text-center font-medium text-slate-900">{monthLabel}</div>

            <Link
              href={`/dashboard?month=${nextMonth}${selectedCategory !== "all" ? `&category=${encodeURIComponent(selectedCategory)}` : ""}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              →
            </Link>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-3xl border border-slate-200 bg-red-50 p-4 shadow-sm">
            <p className="text-sm font-medium text-red-600">Pengeluaran</p>
            <p className="mt-2 text-2xl font-semibold text-red-600">Rp {formatCurrency(expense)}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-emerald-50 p-4 shadow-sm">
            <p className="text-sm font-medium text-emerald-700">Pendapatan</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-700">Rp {formatCurrency(income)}</p>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <Chart transactions={allTransactions} />
        </div>

        {showCategorySummary && (
          <div className="mt-5 grid gap-3">
            {categorySummary.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
                Tidak ada transaksi pada bulan ini.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {categorySummary.map(({ category, amount, type }) => {
                  const meta = getCategoryMeta(category)
                  const isActive = selectedCategory === category
                  return (
                    <Link
                      key={category}
                      href={`/dashboard?month=${month}&category=${encodeURIComponent(category.toLowerCase().trim())}`}
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
        )}

        {/* <div className="mt-2 space-y-3">
          {filteredTransactions.map((item: any) => (
            <TransactionItem key={item.id} item={item} />
          ))}
        </div> */}
      </div>
    </div>
  )
}