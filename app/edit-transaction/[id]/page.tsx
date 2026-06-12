import { supabase } from "@/lib/supabaseClient"
import TransactionForm from "@/components/TransactionForm"
import { notFound } from "next/navigation"

export default async function EditTransactionPage({ params }: any) {
  const resolvedParams = await params
  const { id } = resolvedParams
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    return notFound()
  }

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Transaksi</h1>
      <TransactionForm transaction={data} transactionId={id} />
    </div>
  )
}
