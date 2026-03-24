import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { getDiaSemanaAbrev } from '../lib/utils'
import Modal from '../components/Modal'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'

export default function Agenda() {
  const { user } = useAuth()
  const [semanaOffset, setSemanaOffset] = useState(0)
  const [sessoes, setSessoes] = useState([])
  const [alunos, setAlunos] = useState([])
  const [academias, setAcademias] = useState([])
  const [loading, setLoading] = useState(true)

  // Modal nova sessão
  const [modalNova, setModalNova] = useState(false)
  const [formNova, setFormNova] = useState({ aluno_id: '', academia_id: '', data_hora: '', duracao_minutos: 60, valor: '' })
  const [salvando, setSalvando] = useState(false)
  const [erroForm, setErroForm] = useState('')

  // Modal detalhe sessão
  const [sessaoSelecionada, setSessaoSelecionada] = useState(null)
  const [formStatus, setFormStatus] = useState({ status: '', observacoes: '' })

  const hoje = new Date()
  const inicioSemana = getInicioSemana(hoje, semanaOffset)
  const dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(inicioSemana)
    d.setDate(d.getDate() + i)
    return d
  })

  useEffect(() => {
    if (user) carregarDados()
  }, [user, semanaOffset])

  async function carregarDados() {
    setLoading(true)
    const inicio = dias[0].toISOString()
    const fim = new Date(dias[6])
    fim.setDate(fim.getDate() + 1)

    const [sessoesRes, alunosRes, academiasRes] = await Promise.all([
      supabase
        .from('sessoes')
        .select('*, alunos(nome), academias(nome)')
        .eq('personal_id', user.id)
        .gte('data_hora', inicio)
        .lt('data_hora', fim.toISOString())
        .order('data_hora'),
      supabase.from('alunos').select('id, nome, valor_aula').eq('personal_id', user.id).eq('ativo', true).order('nome'),
      supabase.from('personal_academias').select('academia_id, academias(id, nome)').eq('personal_id', user.id),
    ])

    setSessoes(sessoesRes.data || [])
    setAlunos(alunosRes.data || [])
    setAcademias((academiasRes.data || []).map((pa) => pa.academias))
    setLoading(false)
  }

  function getSessoesDia(dia) {
    return sessoes.filter((s) => {
      const d = new Date(s.data_hora)
      return d.getFullYear() === dia.getFullYear() && d.getMonth() === dia.getMonth() && d.getDate() === dia.getDate()
    })
  }

  function abrirModalNova(dia) {
    const dataStr = dia.toISOString().split('T')[0]
    setFormNova({ aluno_id: '', academia_id: '', data_hora: `${dataStr}T08:00`, duracao_minutos: 60, valor: '' })
    setErroForm('')
    setModalNova(true)
  }

  async function verificarSobreposicao(dataHoraISO, duracaoMin, sessaoIdExcluir = null) {
    const novaInicio = new Date(dataHoraISO)
    const novaFim = new Date(novaInicio.getTime() + duracaoMin * 60000)

    // Busca sessões do mesmo dia (margem de 24h) para checar sobreposição
    const diaInicio = new Date(novaInicio)
    diaInicio.setHours(0, 0, 0, 0)
    const diaFim = new Date(diaInicio)
    diaFim.setDate(diaFim.getDate() + 1)

    const { data: sessoesExistentes } = await supabase
      .from('sessoes')
      .select('id, data_hora, duracao_minutos, alunos(nome)')
      .eq('personal_id', user.id)
      .gte('data_hora', diaInicio.toISOString())
      .lt('data_hora', diaFim.toISOString())
      .neq('status', 'cancelada')

    if (!sessoesExistentes) return null

    for (const sessao of sessoesExistentes) {
      if (sessaoIdExcluir && sessao.id === sessaoIdExcluir) continue

      const existInicio = new Date(sessao.data_hora)
      const existFim = new Date(existInicio.getTime() + sessao.duracao_minutos * 60000)

      // Sobreposição: novaInicio < existFim AND novaFim > existInicio
      if (novaInicio < existFim && novaFim > existInicio) {
        const horaInicio = existInicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        const horaFim = existFim.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        const nomeAluno = sessao.alunos?.nome || 'aluno'
        return `Conflito de horário: já existe uma aula com ${nomeAluno} das ${horaInicio} às ${horaFim}`
      }
    }
    return null
  }

  async function handleCriarSessao(e) {
    e.preventDefault()
    setErroForm('')
    setSalvando(true)
    try {
      const dataHoraISO = new Date(formNova.data_hora).toISOString()
      const duracao = parseInt(formNova.duracao_minutos)

      const conflito = await verificarSobreposicao(dataHoraISO, duracao)
      if (conflito) {
        setErroForm(conflito)
        return
      }

      const dados = {
        aluno_id: formNova.aluno_id,
        academia_id: formNova.academia_id || null,
        data_hora: dataHoraISO,
        duracao_minutos: duracao,
        valor: formNova.valor ? parseFloat(formNova.valor) : null,
      }
      await supabase.from('sessoes').insert({ ...dados, personal_id: user.id })
      setModalNova(false)
      carregarDados()
    } catch {
      setErroForm('Erro ao agendar sessão')
    } finally {
      setSalvando(false)
    }
  }

  function abrirDetalheSessao(sessao) {
    setSessaoSelecionada(sessao)
    setFormStatus({ status: sessao.status, observacoes: sessao.observacoes || '' })
  }

  async function handleAtualizarSessao(e) {
    e.preventDefault()
    setSalvando(true)
    try {
      await supabase.from('sessoes').update(formStatus).eq('id', sessaoSelecionada.id)
      setSessaoSelecionada(null)
      carregarDados()
    } catch {
      // erro silencioso
    } finally {
      setSalvando(false)
    }
  }

  async function handleExcluirSessao() {
    if (!window.confirm('Excluir esta sessão?')) return
    await supabase.from('sessoes').delete().eq('id', sessaoSelecionada.id)
    setSessaoSelecionada(null)
    carregarDados()
  }

  const labelSemana = `${dias[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} — ${dias[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}`

  return (
    <div className="page agenda-page">
      <header className="page-header">
        <div className="page-header-row">
          <h1>Agenda</h1>
          <button className="btn btn-primary" onClick={() => abrirModalNova(hoje)}>+ Sessão</button>
        </div>
      </header>

      <div className="agenda-nav">
        <button className="btn btn-secondary" onClick={() => setSemanaOffset((s) => s - 1)}>← Anterior</button>
        <span className="agenda-semana-label">{labelSemana}</span>
        <button className="btn btn-secondary" onClick={() => setSemanaOffset((s) => s + 1)}>Próxima →</button>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="agenda-grid">
          {dias.map((dia) => {
            const sessoesDia = getSessoesDia(dia)
            const isHoje = dia.toDateString() === hoje.toDateString()

            return (
              <div key={dia.toISOString()} className={`agenda-dia ${isHoje ? 'agenda-dia-hoje' : ''}`}>
                <div className="agenda-dia-header">
                  <span className="agenda-dia-nome">{getDiaSemanaAbrev(dia.getDay())}</span>
                  <span className={`agenda-dia-num ${isHoje ? 'agenda-dia-num-hoje' : ''}`}>{dia.getDate()}</span>
                </div>

                <div className="agenda-dia-sessoes">
                  {sessoesDia.map((sessao) => (
                    <button
                      key={sessao.id}
                      className={`agenda-sessao agenda-sessao-${sessao.status}`}
                      onClick={() => abrirDetalheSessao(sessao)}
                    >
                      <span className="agenda-sessao-hora">
                        {new Date(sessao.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="agenda-sessao-aluno">{sessao.alunos?.nome}</span>
                    </button>
                  ))}
                </div>

                <button className="agenda-add-btn" onClick={() => abrirModalNova(dia)}>+</button>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal: Nova sessão */}
      <Modal aberto={modalNova} onFechar={() => setModalNova(false)} titulo="Nova sessão">
        <form onSubmit={handleCriarSessao}>
          {erroForm && <div className="erro-form">{erroForm}</div>}
          <div className="form-group">
            <label htmlFor="sessao-aluno">Aluno *</label>
            <select id="sessao-aluno" value={formNova.aluno_id} onChange={(e) => {
              const alunoId = e.target.value
              const aluno = alunos.find((a) => a.id === alunoId)
              setFormNova({ ...formNova, aluno_id: alunoId, valor: aluno?.valor_aula || '' })
            }} required>
              <option value="">Selecione...</option>
              {alunos.map((a) => (
                <option key={a.id} value={a.id}>{a.nome}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sessao-data">Data e hora *</label>
              <input id="sessao-data" type="datetime-local" value={formNova.data_hora} onChange={(e) => setFormNova({ ...formNova, data_hora: e.target.value })} required />
            </div>
            <div className="form-group">
              <label htmlFor="sessao-duracao">Duração (min)</label>
              <input id="sessao-duracao" type="number" value={formNova.duracao_minutos} onChange={(e) => setFormNova({ ...formNova, duracao_minutos: e.target.value })} min={15} step={15} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="sessao-valor">Valor (R$)</label>
            <input id="sessao-valor" type="number" step="0.01" min="0" placeholder="0,00" value={formNova.valor} onChange={(e) => setFormNova({ ...formNova, valor: e.target.value })} />
          </div>
          {academias.length > 0 && (
            <div className="form-group">
              <label htmlFor="sessao-academia">Academia</label>
              <select id="sessao-academia" value={formNova.academia_id} onChange={(e) => setFormNova({ ...formNova, academia_id: e.target.value })}>
                <option value="">Nenhuma</option>
                {academias.map((a) => (
                  <option key={a.id} value={a.id}>{a.nome}</option>
                ))}
              </select>
            </div>
          )}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setModalNova(false)}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={salvando}>{salvando ? 'Salvando...' : 'Agendar'}</button>
          </div>
        </form>
      </Modal>

      {/* Modal: Detalhe sessão */}
      <Modal aberto={!!sessaoSelecionada} onFechar={() => setSessaoSelecionada(null)} titulo="Detalhes da sessão">
        {sessaoSelecionada && (
          <form onSubmit={handleAtualizarSessao}>
            <div className="sessao-detalhe-info">
              <div className="dado">
                <span className="dado-label">Aluno</span>
                <span className="dado-valor">{sessaoSelecionada.alunos?.nome}</span>
              </div>
              <div className="dado">
                <span className="dado-label">Horário</span>
                <span className="dado-valor">
                  {new Date(sessaoSelecionada.data_hora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              </div>
              {sessaoSelecionada.academias?.nome && (
                <div className="dado">
                  <span className="dado-label">Academia</span>
                  <span className="dado-valor">{sessaoSelecionada.academias.nome}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="sessao-status">Status</label>
              <div className="status-options">
                {['agendada', 'realizada', 'cancelada', 'falta'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`status-option status-option-${s} ${formStatus.status === s ? 'status-option-ativo' : ''}`}
                    onClick={() => setFormStatus({ ...formStatus, status: s })}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="sessao-obs">Observações</label>
              <textarea
                id="sessao-obs"
                value={formStatus.observacoes}
                onChange={(e) => setFormStatus({ ...formStatus, observacoes: e.target.value })}
                rows={3}
                placeholder="Notas sobre a sessão..."
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-remover" onClick={handleExcluirSessao}>Excluir</button>
              <div style={{ flex: 1 }} />
              <button type="button" className="btn btn-secondary" onClick={() => setSessaoSelecionada(null)}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}

function getInicioSemana(date, offset = 0) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) + offset * 7
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}
