import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function useSessoes() {
  const { user } = useAuth()
  const [sessoes, setSessoes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) carregarSessoes()
  }, [user])

  async function carregarSessoes() {
    setLoading(true)
    const { data, error } = await supabase
      .from('sessoes')
      .select('*, alunos(nome), academias(nome)')
      .eq('personal_id', user.id)
      .order('data_hora')

    if (!error) setSessoes(data || [])
    setLoading(false)
  }

  async function carregarSessoesSemana(inicio, fim) {
    const { data, error } = await supabase
      .from('sessoes')
      .select('*, alunos(nome), academias(nome)')
      .eq('personal_id', user.id)
      .gte('data_hora', inicio)
      .lt('data_hora', fim)
      .order('data_hora')

    if (error) throw error
    return data || []
  }

  async function criarSessao(dados) {
    const { data, error } = await supabase
      .from('sessoes')
      .insert({ ...dados, personal_id: user.id })
      .select('*, alunos(nome), academias(nome)')
      .single()

    if (error) throw error
    setSessoes((prev) => [...prev, data].sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora)))
    return data
  }

  async function atualizarSessao(id, dados) {
    const { data, error } = await supabase
      .from('sessoes')
      .update(dados)
      .eq('id', id)
      .select('*, alunos(nome), academias(nome)')
      .single()

    if (error) throw error
    setSessoes((prev) => prev.map((s) => (s.id === id ? data : s)))
    return data
  }

  async function excluirSessao(id) {
    const { error } = await supabase
      .from('sessoes')
      .delete()
      .eq('id', id)

    if (error) throw error
    setSessoes((prev) => prev.filter((s) => s.id !== id))
  }

  return { sessoes, loading, carregarSessoes, carregarSessoesSemana, criarSessao, atualizarSessao, excluirSessao }
}
