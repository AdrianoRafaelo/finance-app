"use client"

import Link from "next/link"
import { deleteTransaction } from "@/lib/transactions"
import { useRouter } from "next/navigation"

import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-white rounded-xl px-4 py-2"
></motion.div>

export default function TransactionItem({ item }: any) {
  const router = useRouter()

  const handleDelete = async () => {
    await deleteTransaction(item.id)
    router.refresh()
  }

  return (
    <div className="bg-white border rounded-xl px-4 py-2 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-sm">{item.category}</p>
          {item.note && <p className="text-xs text-gray-500">{item.note}</p>}
          {item.created_at && (
            <p className="text-[10px] text-slate-400">{new Date(item.created_at).toLocaleDateString()}</p>
          )}
        </div>

        <div className="text-right">
          <p
            className={`text-sm font-semibold ${
              item.type === "income"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            Rp {item.amount.toLocaleString()}
          </p>

          <div className="mt-2 flex items-center justify-end gap-3 text-[10px]">
            <Link
              href={`/edit-transaction/${item.id}`}
              className="rounded-full border border-blue-200 px-3 py-1 text-blue-600 hover:bg-blue-50"
            >
              edit
            </Link>
            <button
              onClick={handleDelete}
              className="rounded-full border border-red-200 px-3 py-1 text-red-600 hover:bg-red-50"
            >
              hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
