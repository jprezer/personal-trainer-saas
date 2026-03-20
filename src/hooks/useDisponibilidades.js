import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function useDisponibilidades() {
  const { user } = useAuth()
  const [disponibilidades, setDisponibilidades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) carregarDisponibilidades()
  }, [user])

  async function carregarDisponibilidades() {
    setLoading(true)
    const { data, error } = await supabase
      .from('disponibilidades')
      .select('*, academias(nome)')
      .eq('personal_id', user.id)
      .order('dia_semana')
      .order('hora_inicio')

    if (!error) setDisponibilidades(data || [])
    setLoading(false)
  }

  async function criarDisponibilidade(dados) {
    const { data, error } = await supabase
      .from('disponibilidades')
      .insert({ ...dados, personal_id: user.id })
      .select('*, academias(nome)')
      .single()

    if (error) throw error
    setDisponibilidades((prev) =>
      [...prev, data].sort((a, b) => a.dia_semana - b.dia_semana || a.hora_inicio.localeCompare(b.hora_inicio))
    )
    return data
  }

  async function excluirDisponibilidade(id) {
    const { error } = await supabase
      .from('disponibilidades')
      .delete()
      .eq('id', id)

    if (error) throw error
    setDisponibilidades((prev) => prev.filter((d) => d.id !== id))
  }

  return { disponibilidades, loading, carregarDisponibilidades, criarDisponibilidade, excluirDisponibilidade }
}
