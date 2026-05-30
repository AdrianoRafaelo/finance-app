import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  throw new Error(
    'Invalid Supabase URL. Set NEXT_PUBLIC_SUPABASE_URL to a valid HTTP or HTTPS URL.'
  )
}

if (!supabaseKey) {
  throw new Error(
    'Missing Supabase anon key. Set NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)