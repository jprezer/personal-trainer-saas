import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { formatMoeda } from '../lib/utils'
import EmptyState from '../components/EmptyState'

export default function Financeiro() {
  const { user } = useAuth()
  const [sessoes, setSessoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [mesOffset, setMesOffset] = useState(0)
  const [filtroStatus, setFiltroStatus] = useState('todos') // todos, pago, pendente
  const [filtroAluno, setFiltroAluno] = useState('')
  const [alunos, setAlunos] = useState([])

  const hoje = new Date()
  const mesAtual = new Date(hoje.getFullYear(), hoje.getMonth() + mesOffset, 1)
  const inicioMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1)
  const fimMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 1)

  const labelMes = mesAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  useEffect(() => {
    if (user) carregarDados()
  }, [user, mesOffset])

  async function carregarDados() {
    setLoading(true)
    const [sessoesRes, alunosRes] = await Promise.all([
      supabase
        .from('sessoes')
        .select('*, alunos(id, nome), academias(nome)')
        .eq('personal_id', user.id)
        .gte('data_hora', inicioMes.toISOString())
        .lt('data_hora', fimMes.toISOString())
        .in('status', ['realizada', 'agendada', 'falta'])
        .order('data_hora', { ascending: false }),
      supabase
        .from('alunos')
        .select('id, nome')
        .eq('personal_id', user.id)
        .order('nome'),
    ])

    setSessoes(sessoesRes.data || [])
    setAlunos(alunosRes.data || [])
    setLoading(false)
  }

  async function togglePago(sessaoId, pagoAtual) {
    const { error } = await supabase
      .from('sessoes')
      .update({ pago: !pagoAtual })
      .eq('id', sessaoId)

    if (!error) {
      setSessoes((prev) =>
        prev.map((s) => (s.id === sessaoId ? { ...s, pago: !pagoAtual } : s))
      )
    }
  }

  async function handleEditarValor(sessaoId, valorAtual) {
    const input = window.prompt('Valor da sessão (R$):', valorAtual || '')
    if (input === null) return
    const valor = parseFloat(input.replace(',', '.'))
    if (isNaN(valor) || valor < 0) return

    const { error } = await supabase
      .from('sessoes')
      .update({ valor })
      .eq('id', sessaoId)

    if (!error) {
      setSessoes((prev) =>
        prev.map((s) => (s.id === sessaoId ? { ...s, valor } : s))
      )
    }
  }

  // Filtros
  const sessoesFiltradas = sessoes.filter((s) => {
    if (filtroStatus === 'pago' && !s.pago) return false
    if (filtroStatus === 'pendente' && s.pago) return false
    if (filtroAluno && s.alunos?.id !== filtroAluno) return false
    return true
  })

  // Resumo
  const totalSessoes = sessoes.filter((s) => s.status === 'realizada' || s.status === 'falta')
  const totalFaturamento = totalSessoes.reduce((acc, s) => acc + (Number(s.valor) || 0), 0)
  const totalRecebido = totalSessoes.filter((s) => s.pago).reduce((acc, s) => acc + (Number(s.valor) || 0), 0)
  const totalPendente = totalFaturamento - totalRecebido
  const sessoesSeValue = totalSessoes.filter((s) => s.valor == null || s.valor === 0).length

  return (
    <div className="page financeiro-page">
      <header className="page-header">
        <h1>Financeiro</h1>
      </header>

      {/* Navegação de mês */}
      <div className="agenda-nav">
        <button className="btn btn-secondary" onClick={() => setMesOffset((m) => m - 1)}>← Anterior</button>
        <span className="agenda-semana-label" style={{ textTransform: 'capitalize' }}>{labelMes}</span>
        <button className="btn btn-secondary" onClick={() => setMesOffset((m) => m + 1)}>Próximo →</button>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <>
          {/* Cards resumo */}
          <div className="metricas">
            <div className="metrica-card">
              <span className="metrica-valor">{formatMoeda(totalFaturamento)}</span>
              <span className="metrica-label">Faturamento</span>
            </div>
            <div className="metrica-card">
              <span className="metrica-valor" style={{ color: 'var(--green)' }}>{formatMoeda(totalRecebido)}</span>
              <span className="metrica-label">Recebido</span>
            </div>
            <div className="metrica-card">
              <span className="metrica-valor" style={{ color: totalPendente > 0 ? 'var(--yellow)' : 'var(--green)' }}>
                {formatMoeda(totalPendente)}
              </span>
              <span className="metrica-label">Pendente</span>
            </div>
          </div>

          {sessoesSeValue > 0 && (
            <div className="erro-form" style={{ background: 'rgba(250, 204, 21, 0.12)', borderColor: 'var(--yellow)', color: '#fde68a' }}>
              {sessoesSeValue} sessão(ões) sem valor definido. Defina o valor da aula no cadastro do aluno ou clique no valor para editar.
            </div>
          )}

          {/* Filtros */}
          <div className="financeiro-filtros">
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="financeiro-filtro-select"
            >
              <option value="todos">Todos</option>
              <option value="pago">Pagos</option>
              <option value="pendente">Pendentes</option>
            </select>
            <select
              value={filtroAluno}
              onChange={(e) => setFiltroAluno(e.target.value)}
              className="financeiro-filtro-select"
            >
              <option value="">Todos os alunos</option>
              {alunos.map((a) => (
                <option key={a.id} value={a.id}>{a.nome}</option>
              ))}
            </select>
          </div>

          {/* Lista de sessões */}
          {sessoesFiltradas.length === 0 ? (
            <EmptyState titulo="Nenhuma sessão encontrada" descricao="Altere os filtros ou agende sessões na agenda" />
          ) : (
            <div className="financeiro-lista">
              {sessoesFiltradas.map((sessao) => {
                const data = new Date(sessao.data_hora)
                const dataStr = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
                const horaStr = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

                return (
                  <div key={sessao.id} className={`financeiro-item ${sessao.pago ? 'financeiro-item-pago' : ''}`}>
                    <div className="financeiro-item-info">
                      <span className="financeiro-item-data">{dataStr} {horaStr}</span>
                      <span className="financeiro-item-aluno">{sessao.alunos?.nome}</span>
                      {sessao.academias?.nome && (
                        <span className="financeiro-item-academia">{sessao.academias.nome}</span>
                      )}
                    </div>
                    <div className="financeiro-item-status">
                      <span className={`financeiro-status-badge financeiro-status-${sessao.status}`}>
                        {sessao.status}
                      </span>
                    </div>
                    <button
                      className="financeiro-item-valor"
                      onClick={() => handleEditarValor(sessao.id, sessao.valor)}
                      title="Clique para editar o valor"
                    >
                      {sessao.valor ? formatMoeda(sessao.valor) : 'R$ —'}
                    </button>
                    <button
                      className={`financeiro-pago-btn ${sessao.pago ? 'financeiro-pago-btn-ativo' : ''}`}
                      onClick={() => togglePago(sessao.id, sessao.pago)}
                      title={sessao.pago ? 'Marcar como pendente' : 'Marcar como pago'}
                    >
                      {sessao.pago ? '✓ Pago' : 'Pendente'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
