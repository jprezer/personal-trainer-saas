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

    // Gera sessões pendentes automaticamente se tiver dias e horário configurados
    if (data.dias_treino?.length && data.horario_padrao) {
      await gerarSessoesPendentes(data)
    }

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

  /**
   * Cria sessões pendentes para as próximas 4 semanas com base nos dias/horário do aluno.
   * Ignora dias que já tiverem sessão cadastrada no mesmo horário.
   */
  async function gerarSessoesPendentes(aluno) {
    if (!aluno.dias_treino?.length || !aluno.horario_padrao) return

    const [hh, mm] = aluno.horario_padrao.split(':').map(Number)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const fim = new Date(hoje)
    fim.setDate(fim.getDate() + 28) // 4 semanas

    // Busca sessões já existentes do aluno no período para evitar duplicatas
    const { data: existentes } = await supabase
      .from('sessoes')
      .select('data_hora')
      .eq('aluno_id', aluno.id)
      .gte('data_hora', hoje.toISOString())
      .lte('data_hora', fim.toISOString())

    const horariosExistentes = new Set(
      (existentes || []).map((s) => {
        const d = new Date(s.data_hora)
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      })
    )

    const novasSessoes = []
    const cursor = new Date(hoje)

    while (cursor <= fim) {
      const diaSemana = cursor.getDay() // 0=Dom, 1=Seg, ..., 6=Sab
      const chave = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`

      if (aluno.dias_treino.includes(diaSemana) && !horariosExistentes.has(chave)) {
        const dataHora = new Date(cursor)
        dataHora.setHours(hh, mm, 0, 0)

        novasSessoes.push({
          personal_id: user.id,
          aluno_id: aluno.id,
          data_hora: dataHora.toISOString(),
          duracao_minutos: 60,
          status: 'pendente',
          valor: aluno.valor_aula || null,
        })
      }

      cursor.setDate(cursor.getDate() + 1)
    }

    if (novasSessoes.length > 0) {
      await supabase.from('sessoes').insert(novasSessoes)
    }
  }

  return { alunos, loading, carregarAlunos, buscarAluno, criarAluno, atualizarAluno, excluirAluno, gerarSessoesPendentes }
}
