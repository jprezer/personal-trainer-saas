import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function useAlunos() {
  const { user } = useAuth()
  const [alunos, setAlunos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) carregarAlunos()
  }, [user])

  async function carregarAlunos() {
    setLoading(true)
    const { data, error } = await supabase
      .from('alunos')
      .select('*')
      .eq('personal_id', user.id)
      .order('nome')

    if (!error) setAlunos(data || [])
    setLoading(false)
  }

  async function buscarAluno(id) {
    const { data, error } = await supabase
      .from('alunos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async function criarAluno(dados) {
    const { data, error } = await supabase
      .from('alunos')
      .insert({ ...dados, personal_id: user.id })
      .select()
      .single()

    if (error) throw error
    setAlunos((prev) => [...prev, data].sort((a, b) => a.nome.localeCompare(b.nome)))
    return data
  }

  async function atualizarAluno(id, dados) {
    const { data, error } = await supabase
      .from('alunos')
      .update(dados)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setAlunos((prev) => prev.map((a) => (a.id === id ? data : a)))
    return data
  }

  async function excluirAluno(id) {
    const { error } = await supabase
      .from('alunos')
      .delete()
      .eq('id', id)

    if (error) throw error
    setAlunos((prev) => prev.filter((a) => a.id !== id))
  }

  return { alunos, loading, carregarAlunos, buscarAluno, criarAluno, atualizarAluno, excluirAluno }
}
