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
  const calendars = ref([])
  const user = ref({})
  const appUser = ref(null) // public.user row matching the logged-in auth user

  const ensureAppUser = async () => {
    const authUser = user.value
    if (!authUser?.email) return null
    // Look up existing public.user row by email
    const { data: existing, error: selErr } = await supabase
      .from('user')
      .select('*')
      .eq('email', authUser.email)
      .maybeSingle()
    if (selErr) throw selErr
    if (existing) {
      appUser.value = existing
      return existing
    }
    // Create one
    const { data: created, error: insErr } = await supabase
      .from('user')
      .insert([{
        name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
        email: authUser.email,
        password: 'oauth',
      }])
      .select()
      .single()
    if (insErr) throw insErr
    appUser.value = created
    return created
  }

  const getCalendars = async () => {
    if (!appUser.value) await ensureAppUser()
    if (!appUser.value) { calendars.value = []; return [] }
    const { data, error } = await supabase
      .from('calendar')
      .select('*')
      .eq('owner_id', appUser.value.user_id)
    if (error) throw error
    calendars.value = data ?? []
    return calendars.value
  }

  const ensureDefaultCalendar = async () => {
    if (!appUser.value) await ensureAppUser()
    if (!appUser.value) throw new Error('Kein App-Benutzer verfügbar')
    await getCalendars()
    if (calendars.value.length > 0) return calendars.value[0]
    const { data, error } = await supabase
      .from('calendar')
      .insert([{
        name: 'Mein Kalender',
        color: '#ff00aa',
        owner_id: appUser.value.user_id,
      }])
      .select()
      .single()
    if (error) throw error
    calendars.value = [data]
    return data
  }

  const initAuth = async () => {
    const { data } = await supabase.auth.getSession()
    if (data?.session) {
      user.value = data.session.user
      try { await ensureAppUser() } catch (e) { console.error('ensureAppUser', e) }
      if (router.currentRoute.value.path === '/') router.push('/home')
    } else {
      if (router.currentRoute.value.path !== '/') router.push('/')
    }
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        user.value = session.user
        try { await ensureAppUser() } catch (e) { console.error('ensureAppUser', e) }
        if (event === 'SIGNED_IN' && router.currentRoute.value.path === '/') {
          router.push('/home')
        }
      } else {
        user.value = {}
        appUser.value = null
      }
    })
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/home' },
    })
    if (error) throw error
    // browser is now redirecting to Google — don't touch state here.
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
    if (!appUser.value) await ensureAppUser()
    if (!calendars.value.length) await getCalendars()
    const ids = calendars.value.map(c => c.calender_id)
    if (!ids.length) { appointments.value = []; return [] }
    const { data, error } = await supabase
      .from('appointment')
      .select('*')
      .in('calendar_id', ids)
    if (error) throw error
    appointments.value = data ?? []
    return appointments.value
  }

  const addAppointment = async (appointment) => {
    const { data, error } = await supabase
      .from('appointment')
      .insert([appointment])
      .select()
      .single()
    if (error) throw error
    if (data) appointments.value = [...appointments.value, data]
  }

  const updateAppointment = async (id, fields) => {
    const { data, error } = await supabase
      .from('appointment')
      .update(fields)
      .eq('event_id', id)
      .select()
      .single()
    if (error) throw error
    if (data) {
      appointments.value = appointments.value.map(a =>
        a.event_id === id ? data : a
      )
    }
  }

  const removeAppointment = async (appointment) => {
    const prev = appointments.value
    appointments.value = prev.filter(a => a.event_id !== appointment.event_id)
    const { error } = await supabase
      .from('appointment')
      .delete()
      .eq('event_id', appointment.event_id)
    if (error) {
      appointments.value = prev
      throw error
    }
  }

  return {
    appointments,
    calendars,
    user,
    appUser,
    initAuth,
    ensureAppUser,
    getCalendars,
    ensureDefaultCalendar,
    handleGoogleLogin,
    handleLogin,
    handleUserRegister,
    handleLogout,
    getAppointments,
    addAppointment,
    updateAppointment,
    removeAppointment,
  }
})
