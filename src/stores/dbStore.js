import { defineStore } from 'pinia'
import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true } },
)

export const usedbStore = defineStore('dbStore', () => {
  const appointments = ref([])

  const getAppointments = async () => {
    const { data, error } = await supabase.from('appointment').select('*')

    if (error) throw error

    appointments.value = data ?? []

    return appointments.value
  }

  const handleLogin = async () => {
    const { user, error } = await supabase.auth.signInWithSSO({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/home' },
    })

    if (error) throw error

    return user
  }

  const addAppointment = async (appointment) => {
    const { data, error } = await supabase
      .from('appointment')
      .insert([appointment], { returning: 'minimal' })

    if (error) throw error

    getAppointments()

    return data
  }

  const removeAppointment = async (appointment) => {
    const { data, error } = await supabase
      .from('appointment')
      .delete()
      .eq('event_id', appointment.event_id)

    if (error) throw error

    getAppointments()

    return data
  }

  return { appointments, getAppointments, handleLogin, addAppointment, removeAppointment }
})
