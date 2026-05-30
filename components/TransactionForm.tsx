"use client"

import { useState } from "react"
import { addTransaction } from "@/lib/transactions"
import { useRouter } from "next/navigation"

export default function TransactionForm() {
  const router = useRouter()

  const [amount, setAmount] = useState("")
  const [type, setType] = useState("expense")
  const [category, setCategory] = useState("")
  const [note, setNote] = useState("")

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    await addTransaction({
      amount: Number(amount),
      type: type as any,
      category,
      note,
    })

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ✅ JUMLAH */}
        <div>
          <label className="text-sm text-gray-500">💰 Jumlah</label>
          <input
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mt-1 text-2xl font-bold border p-3 rounded-xl focus:outline-none"
          />
        </div>

        {/* ✅ TYPE (toggle gaya fintech) */}
        <div className="flex bg-gray-100 rounded-xl">
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 py-2 rounded-xl ${
              type === "income"
                ? "bg-green-500 text-white"
                : ""
            }`}
          >
            Income
          </button>

          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 py-2 rounded-xl ${
              type === "expense"
                ? "bg-red-500 text-white"
                : ""
            }`}
          >
            Expense
          </button>
        </div>

        {/* ✅ KATEGORI */}
        <div>
          <label className="text-sm text-gray-500">📂 Kategori</label>
          <input
            placeholder="contoh: makan"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 border p-3 rounded-xl"
          />
        </div>

        {/* ✅ CATATAN */}
        <div>
          <label className="text-sm text-gray-500">📝 Catatan</label>
          <input
            placeholder="optional"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full mt-1 border p-3 rounded-xl"
          />
        </div>

        {/* ✅ BUTTON */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold shadow"
        >
          Simpan
        </button>
      </form>
    </div>
  )
}
