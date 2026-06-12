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

export async function updateTransaction(id: string, transaction: Partial<Transaction>) {
  const { error } = await supabase
    .from('transactions')
    .update(transaction)
    .eq('id', id)

  if (error) console.error(error)
}

export async function getTransactionById(id: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(error)
    return null
  }

  return data
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)

  if (error) console.error(error)
}
