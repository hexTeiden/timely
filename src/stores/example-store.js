import { defineStore } from 'pinia'
import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'

// Expect Vite env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
// const { VITE_SUPABASE_URL: supabaseURL, VITE_SUPABASE_ANON_KEY: supabaseAnonKey } = import.meta.env

// if (!supabaseURL || !supabaseAnonKey) {
//   // Don't print keys; just guide setup
//   console.error(
//     'Supabase not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file and restart the dev server',
//   )
// }

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

export const usedbStore = defineStore('dbStore', () => {
  const test = ref([])

  const getTest = async () => {
    const { data, error } = await supabase.from('test').select('*')

    if (error) throw error

    test.value = data ?? []

    return test.value
  }

  return { test, getTest }
})
