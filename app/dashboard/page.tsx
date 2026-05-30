import { supabase } from "@/lib/supabaseClient"
import TransactionItem from "@/components/TransactionItem"
import Chart from "@/components/Chart"

export default async function Dashboard({
  searchParams,
}: {
  searchParams?: { month?: string }
}) {
  // ✅ default bulan
  const currentMonth = new Date().toISOString().slice(0, 7)
  const month = searchParams?.month || currentMonth

  const [year, monthNum] = month.split("-")
  const start = `${month}-01`
  
  // ✅ hitung hari terakhir bulan (hindari hardcode 31)
  const endDate = new Date(Number(year), Number(monthNum), 0)
  const lastDay = String(endDate.getDate()).padStart(2, "0")
  const end = `${month}-${lastDay}`

  // ✅ ambil semua data untuk chart
  const { data: allData } = await supabase
    .from("transactions")
    .select("*")

  // ✅ ambil data untuk bulan tertentu
  const { data } = await supabase
    .from("transactions")
    .select("*")
    .gte("created_at", start)
    .lte("created_at", end)
    .order("created_at", { ascending: false })

  const transactions = data ?? []
  const allTransactions = allData ?? []

  // ✅ hitung saldo
  const total = transactions.reduce((acc, item) => {
    return item.type === "income"
      ? acc + item.amount
      : acc - item.amount
  }, 0)

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0)

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0)

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Dashboard
      </h1>

      {/* ✅ filter */}
      <form className="mb-4 flex items-center gap-2">
        <input
          type="month"
          name="month"
          defaultValue={month}
          className="border px-3 py-2 rounded"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Filter
        </button>
      </form>

      {/* ✅ summary */}
      <div className="mb-6 space-y-3 shadow-md">
  
  {/* ✅ SALDO FULL */}
  <div className="bg-blue-500 text-white p-4 rounded-2xl shadow">

<p className="text-sm">💰 Saldo</p>
    <p className="text-xl font-bold">Rp {total}</p>
  </div>

  {/* ✅ ROW 2 (INCOME + EXPENSE) */}
  <div className="grid grid-cols-2 gap-3">

    <div className="bg-green-500 text-white p-4 rounded-2xl shadow">

<p className="text-sm">📈 Income</p>
      <p className="text-lg font-bold">Rp {income}</p>
    </div>

    <div className="bg-red-500 text-white p-4 rounded-2xl shadow">

<p className="text-sm">📉 Expense</p>
      <p className="text-lg font-bold">Rp {expense}</p>
    </div>

  </div>
</div>

      {/* ✅ CHART */}
      <Chart transactions={allTransactions} />

      {/* ✅ LIST */}
      <div className="space-y-2 hover:bg-gray-50 transition">
        {transactions.map((item) => (
          <TransactionItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}