import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { formatMoeda } from '../lib/utils'
import EmptyState from '../components/EmptyState'
import CustomSelect from '../components/CustomSelect'

export default function Financeiro() {
  const { user } = useAuth()
  const [sessoes, setSessoes] = useState([])
  const [alunosMensais, setAlunosMensais] = useState([])
  const [pagamentos, setPagamentos] = useState([])
  const [alunosTodos, setAlunosTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [mesOffset, setMesOffset] = useState(0)
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [filtroAluno, setFiltroAluno] = useState('')

  const hoje = new Date()
  const mesAtual = new Date(hoje.getFullYear(), hoje.getMonth() + mesOffset, 1)
  const inicioMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1)
  const fimMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 1)
  const mesISO = `${mesAtual.getFullYear()}-${String(mesAtual.getMonth() + 1).padStart(2, '0')}-01`
  const labelMes = mesAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  useEffect(() => {
    if (user) carregarDados()
  }, [user, mesOffset])

  async function carregarDados() {
    setLoading(true)
    const [sessoesRes, alunosRes, pagamentosRes] = await Promise.all([
      supabase
        .from('sessoes')
        .select('*, alunos(id, nome, formato_cobranca), academias(nome)')
        .eq('personal_id', user.id)
        .gte('data_hora', inicioMes.toISOString())
        .lt('data_hora', fimMes.toISOString())
        .in('status', ['realizada', 'agendada', 'falta'])
        .order('data_hora', { ascending: false }),
      supabase
        .from('alunos')
        .select('id, nome, formato_cobranca, valor_mensal, valor_aula')
        .eq('personal_id', user.id)
        .eq('ativo', true)
        .order('nome'),
      supabase
        .from('pagamentos_mensais')
        .select('*')
        .eq('personal_id', user.id)
        .eq('mes', mesISO),
    ])

    const todos = alunosRes.data || []
    setSessoes(sessoesRes.data || [])
    setAlunosTodos(todos)
    setAlunosMensais(todos.filter((a) => a.formato_cobranca === 'mensal'))
    setPagamentos(pagamentosRes.data || [])
    setLoading(false)
  }

  async function togglePago(sessaoId, pagoAtual) {
    const { error } = await supabase
      .from('sessoes')
      .update({ pago: !pagoAtual })
      .eq('id', sessaoId)
    if (!error) setSessoes((prev) => prev.map((s) => s.id === sessaoId ? { ...s, pago: !pagoAtual } : s))
  }

  async function handleEditarValor(sessaoId, valorAtual) {
    const input = window.prompt('Valor da sessão (R$):', valorAtual || '')
    if (input === null) return
    const valor = parseFloat(input.replace(',', '.'))
    if (isNaN(valor) || valor < 0) return
    const { error } = await supabase.from('sessoes').update({ valor }).eq('id', sessaoId)
    if (!error) setSessoes((prev) => prev.map((s) => s.id === sessaoId ? { ...s, valor } : s))
  }

  async function toggleMensalidadePaga(aluno) {
    const pag = pagamentos.find((p) => p.aluno_id === aluno.id)
    if (pag) {
      const { error } = await supabase
        .from('pagamentos_mensais')
        .update({ pago: !pag.pago })
        .eq('id', pag.id)
      if (!error) setPagamentos((prev) => prev.map((p) => p.id === pag.id ? { ...p, pago: !pag.pago } : p))
    } else {
      const { data, error } = await supabase
        .from('pagamentos_mensais')
        .insert({ personal_id: user.id, aluno_id: aluno.id, mes: mesISO, valor: aluno.valor_mensal || null, pago: true })
        .select()
        .single()
      if (!error) setPagamentos((prev) => [...prev, data])
    }
  }

  // ── Separar sessões por tipo de cobrança ──
  const sessoesPorAula = sessoes.filter((s) => s.alunos?.formato_cobranca !== 'mensal')

  // ── Mensalidades do mês ──
  const mensalidadesDoMes = alunosMensais.map((aluno) => {
    const pag = pagamentos.find((p) => p.aluno_id === aluno.id)
    return {
      aluno,
      pago: pag?.pago || false,
      valor: pag?.valor ?? aluno.valor_mensal ?? null,
      pagamento_id: pag?.id || null,
    }
  })

  // ── Totais ──
  const sessoesRealizadas = sessoesPorAula.filter((s) => s.status === 'realizada' || s.status === 'falta')
  const totalSessoes = sessoesRealizadas.reduce((acc, s) => acc + (Number(s.valor) || 0), 0)
  const totalSessoesPago = sessoesRealizadas.filter((s) => s.pago).reduce((acc, s) => acc + (Number(s.valor) || 0), 0)
  const totalMensalidades = mensalidadesDoMes.reduce((acc, m) => acc + (Number(m.valor) || 0), 0)
  const totalMensalidadesPago = mensalidadesDoMes.filter((m) => m.pago).reduce((acc, m) => acc + (Number(m.valor) || 0), 0)
  const totalFaturamento = totalSessoes + totalMensalidades
  const totalRecebido = totalSessoesPago + totalMensalidadesPago
  const totalPendente = totalFaturamento - totalRecebido
  const sessoesSeValue = sessoesRealizadas.filter((s) => !s.valor).length

  // ── Filtro das sessões ──
  const sessoesFiltradas = sessoesPorAula.filter((s) => {
    if (filtroStatus === 'pago' && !s.pago) return false
    if (filtroStatus === 'pendente' && s.pago) return false
    if (filtroAluno && s.alunos?.id !== filtroAluno) return false
    return true
  })

  const semMovimentacao = sessoesPorAula.length === 0 && alunosMensais.length === 0

  return (
    <div className="page financeiro-page">
      <header className="page-header">
        <h1>Financeiro</h1>
      </header>

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
            <div className="financeiro-aviso">
              ⚠️ {sessoesSeValue} sessão(ões) sem valor definido. Defina o valor da aula no cadastro do aluno ou clique no valor para editar.
            </div>
          )}

          {semMovimentacao && (
            <EmptyState titulo="Nenhuma movimentação" descricao="Sessões e mensalidades do mês aparecerão aqui" />
          )}

          {/* ── Mensalidades ── */}
          {alunosMensais.length > 0 && (
            <div className="financeiro-section">
              <h2 className="financeiro-section-title">Mensalidades</h2>
              <div className="financeiro-lista">
                {mensalidadesDoMes.map(({ aluno, pago, valor }) => (
                  <div key={aluno.id} className={`financeiro-item ${pago ? 'financeiro-item-pago' : ''}`}>
                    <div className="financeiro-item-info">
                      <span className="financeiro-item-aluno">{aluno.nome}</span>
                      <span className="financeiro-item-data" style={{ textTransform: 'capitalize' }}>
                        {labelMes}
                      </span>
                    </div>
                    <div className="financeiro-item-status">
                      <span className="financeiro-badge-mensal">mensal</span>
                    </div>
                    <span className="financeiro-item-valor financeiro-item-valor-fixo">
                      {valor ? formatMoeda(valor) : 'R$ —'}
                    </span>
                    <button
                      className={`financeiro-pago-btn ${pago ? 'financeiro-pago-btn-ativo' : ''}`}
                      onClick={() => toggleMensalidadePaga(aluno)}
                    >
                      {pago ? '✓ Pago' : 'Pendente'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Sessões por aula ── */}
          {sessoesPorAula.length > 0 && (
            <div className="financeiro-section">
              {alunosMensais.length > 0 && (
                <h2 className="financeiro-section-title">Sessões (por aula)</h2>
              )}

              <div className="financeiro-filtros">
                <CustomSelect
                  value={filtroStatus}
                  onChange={setFiltroStatus}
                  options={[
                    { value: 'todos', label: 'Todos' },
                    { value: 'pago', label: 'Pagos' },
                    { value: 'pendente', label: 'Pendentes' },
                  ]}
                />
                <CustomSelect
                  value={filtroAluno}
                  onChange={setFiltroAluno}
                  options={[
                    { value: '', label: 'Todos os alunos' },
                    ...alunosTodos
                      .filter((a) => a.formato_cobranca !== 'mensal')
                      .map((a) => ({ value: a.id, label: a.nome })),
                  ]}
                />
              </div>

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
                        >
                          {sessao.pago ? '✓ Pago' : 'Pendente'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
