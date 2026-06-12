import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import TransactionItem from "@/components/TransactionItem"

function formatCurrency(value: number) {
  return value.toLocaleString("id-ID")
}

function isValidMonth(month: unknown): month is string {
  return typeof month === "string" && /^\d{4}-\d{2}$/.test(month)
}

export default async function CategoryDetail({ params, searchParams }: any) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const category = String(resolvedParams.category || "").toLowerCase().trim()

  const currentMonth = (() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  })()

  const month = isValidMonth(resolvedSearchParams?.month) ? resolvedSearchParams.month : currentMonth
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

  const transactions = (data ?? []).filter((t: any) => t.category && t.category.toLowerCase().trim() === category)

  const count = transactions.length
  const total = transactions.reduce((acc: number, t: any) => (t.type === "income" ? acc + t.amount : acc - t.amount), 0)

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-10">
      <div className="mx-auto w-full max-w-md px-4">
        <div className="rounded-[32px] border border-slate-200 bg-white px-6 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Detail kategori</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{category}</p>
            </div>
            <Link href={`/dashboard?month=${month}`} className="text-sm text-slate-500">
              ← Kembali
            </Link>
          </div>
            <div className="text-sm text-slate-400">Bulan: {month}</div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-3xl border border-slate-200 bg-red-50 p-4 shadow-sm">
              <p className="text-sm font-medium text-red-600">Jumlah transaksi</p>
              <p className="mt-2 text-2xl font-semibold text-red-600">{count}x</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-600">Total(net)</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">Rp {formatCurrency(Math.abs(total))}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-4">Daftar Transaksi</p>
          {transactions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
              Tidak ada transaksi untuk kategori ini di bulan yang dipilih.
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((t: any) => (
                <TransactionItem key={t.id} item={t} />
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
  )
}
