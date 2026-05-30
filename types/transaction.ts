export type Transaction = {
  id?: string
  type: 'income' | 'expense'
  amount: number
  category: string
  note?: string
}

export type TransactionWithTimestamp = Transaction & {
  created_at: string
}