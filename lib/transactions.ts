import { supabase } from './supabaseClient'
import { Transaction } from '@/types/transaction'

export async function getTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return data
}

export async function addTransaction(transaction: Transaction) {
  const { error } = await supabase
    .from('transactions')
    .insert([transaction])

  if (error) console.error(error)
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)

  if (error) console.error(error)
}