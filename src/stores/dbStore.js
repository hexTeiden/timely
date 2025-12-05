import { defineStore } from 'pinia'
import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true } },
)

export const usedbStore = defineStore('dbStore', () => {
  const termine = ref([])

  const getTermine = async () => {
    const { data, error } = await supabase.from('termine').select('*')

    if (error) throw error

    termine.value = data ?? []

    return termine.value
  }

  const handleLogin = async () => {
    const { user, error } = await supabase.auth.signInWithSSO({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/home' },
    })

    if (error) throw error

    return user
  }

  const addTermin = async (termin) => {
    const { data, error } = await supabase
      .from('termine')
      .insert([termin], { returning: 'minimal' })

    if (error) throw error

    getTermine()

    return data
  }

  const removeTermin = async (id) => {
    const { data, error } = await supabase.from('termine').delete().eq('id', id)

    if (error) throw error

    getTermine()

    return data
  }

  return { termine, getTermine, handleLogin, addTermin, removeTermin }
})
