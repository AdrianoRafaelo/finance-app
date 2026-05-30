import TransactionForm from "@/components/TransactionForm"

export default function AddTransaction() {
  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Tambah Transaksi</h1>
      <TransactionForm />
    </div>
  )
}