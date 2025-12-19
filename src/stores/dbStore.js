import { defineStore } from 'pinia'
import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true } },
)

export const usedbStore = defineStore('dbStore', () => {
  const router = useRouter()
  const appointments = ref([])
  const user = ref({})

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    if (error) throw error

    user.value = data
    router.push('/home')

    return user.value
  }

  const handleLogin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) throw error

    user.value = data
    router.push('/home')

    return user
  }

  const handleUserRegister = async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { first_name: username },
      },
    })
    if (error) throw error

    user.value = data
    router.push('/home')

    return user
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) throw error

    user.value = {}
    router.push('/')
    console.log(user.value)

    return user.value
  }

  const getAppointments = async () => {
    const { data, error } = await supabase.from('appointment').select('*')

    if (error) throw error

    appointments.value = data ?? []

    return appointments.value
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

  return {
    appointments,
    user,
    handleGoogleLogin,
    handleLogin,
    handleUserRegister,
    handleLogout,
    getAppointments,
    addAppointment,
    removeAppointment,
  }
})
