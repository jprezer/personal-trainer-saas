import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { formatDataHora } from '../lib/utils'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [sessoesHoje, setSessoesHoje] = useState([])
  const [metricas, setMetricas] = useState({ totalAlunos: 0, aulasSemana: 0, aulasMes: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadDashboard()
  }, [user])

  async function loadDashboard() {
    setLoading(true)

    const hoje = new Date()
    const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).toISOString()
    const fimHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1).toISOString()

    const inicioSemana = new Date(hoje)
    inicioSemana.setDate(hoje.getDate() - hoje.getDay())
    inicioSemana.setHours(0, 0, 0, 0)

    const fimSemana = new Date(inicioSemana)
    fimSemana.setDate(inicioSemana.getDate() + 7)

    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString()
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1).toISOString()

    const [profileRes, sessoesHojeRes, alunosRes, sessoesSemanaRes, sessoesMesRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('sessoes').select('*, alunos(nome, objetivo, local_treino), academias(nome)').eq('personal_id', user.id).gte('data_hora', inicioHoje).lt('data_hora', fimHoje).order('data_hora'),
      supabase.from('alunos').select('id', { count: 'exact' }).eq('personal_id', user.id).eq('ativo', true),
      supabase.from('sessoes').select('id', { count: 'exact' }).eq('personal_id', user.id).gte('data_hora', inicioSemana.toISOString()).lt('data_hora', fimSemana.toISOString()),
      supabase.from('sessoes').select('id', { count: 'exact' }).eq('personal_id', user.id).gte('data_hora', inicioMes).lt('data_hora', fimMes),
    ])

    setProfile(profileRes.data)
    setSessoesHoje(sessoesHojeRes.data || [])
    setMetricas({
      totalAlunos: alunosRes.count || 0,
      aulasSemana: sessoesSemanaRes.count || 0,
      aulasMes: sessoesMesRes.count || 0,
    })
    setLoading(false)
  }

  if (loading) return <div className="loading">Carregando...</div>

  return (
    <div className="page">
      <header className="page-header">
        <h1>Olá, {profile?.nome || 'Personal'}</h1>
        <p className="text-muted">Aqui está o resumo do seu dia</p>
      </header>

      <div className="metricas-grid">
        <div className="metrica-card">
          <span className="metrica-valor">{metricas.totalAlunos}</span>
          <span className="metrica-label">Alunos ativos</span>
        </div>
        <div className="metrica-card">
          <span className="metrica-valor">{metricas.aulasSemana}</span>
          <span className="metrica-label">Aulas esta semana</span>
        </div>
        <div className="metrica-card">
          <span className="metrica-valor">{metricas.aulasMes}</span>
          <span className="metrica-label">Aulas este mês</span>
        </div>
      </div>

      <section className="section">
        <h2>Aulas de hoje</h2>
        {sessoesHoje.length === 0 ? (
          <EmptyState
            titulo="Nenhuma aula hoje"
            descricao="Aproveite pra organizar sua agenda da semana"
            acao="Ver agenda"
            onAcao={() => navigate('/agenda')}
          />
        ) : (
          <div className="sessoes-lista">
            {sessoesHoje.map((sessao) => {
              const local = sessao.academias?.nome || sessao.alunos?.local_treino
              const objetivo = sessao.alunos?.objetivo
              return (
                <div key={sessao.id} className="sessao-card sessao-card-dashboard">
                  <div className="sessao-hora">
                    {new Date(sessao.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="sessao-info">
                    <span className="sessao-aluno">{sessao.alunos?.nome}</span>
                    <div className="sessao-detalhes">
                      {local && <span className="sessao-local-tag">📍 {local}</span>}
                      {objetivo && <span className="sessao-objetivo-tag">{objetivo}</span>}
                    </div>
                  </div>
                  <StatusBadge status={sessao.status} />
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
