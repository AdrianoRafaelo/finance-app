"use client"

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
    <div className="bg-white border rounded-xl px-4 py-2 flex justify-between items-center shadow-sm">
      
      {/* LEFT */}
      <div>
        <p className="font-medium text-sm">{item.category}</p>
        {item.note && (
          <p className="text-xs text-gray-500">{item.note}</p>
        )}
      </div>

      {/* RIGHT */}
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

        <div className="flex items-center justify-end gap-2">
          <span className="text-[10px] text-gray-400">
            {item.type}
          </span>

          <button
            onClick={handleDelete}
            className="text-[10px] text-red-400"
          >
            hapus
          </button>
        </div>
      </div>
    </div>
  )
}
