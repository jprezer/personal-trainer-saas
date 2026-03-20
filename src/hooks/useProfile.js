import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) carregarProfile()
  }, [user])

  async function carregarProfile() {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!error) setProfile(data)
    setLoading(false)
  }

  async function atualizarProfile(dados) {
    const { data, error } = await supabase
      .from('profiles')
      .update(dados)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error
    setProfile(data)
    return data
  }

  return { profile, loading, carregarProfile, atualizarProfile }
}
