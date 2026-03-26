import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatDataHora, formatMoeda } from '../lib/utils'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'
import CustomSelect from '../components/CustomSelect'

const DIAS = [
  { valor: 1, label: 'Seg' },
  { valor: 2, label: 'Ter' },
  { valor: 3, label: 'Qua' },
  { valor: 4, label: 'Qui' },
  { valor: 5, label: 'Sex' },
  { valor: 6, label: 'Sáb' },
  { valor: 0, label: 'Dom' },
]

const OBJETIVOS = [
  { value: '', label: 'Selecione...' },
  { value: 'emagrecimento', label: 'Emagrecimento' },
  { value: 'hipertrofia', label: 'Hipertrofia' },
  { value: 'condicionamento', label: 'Condicionamento' },
  { value: 'reabilitação', label: 'Reabilitação' },
  { value: 'qualidade de vida', label: 'Qualidade de vida' },
  { value: 'outro', label: 'Outro' },
]

export default function AlunoDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [aluno, setAluno] = useState(null)
  const [sessoes, setSessoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({})

  useEffect(() => {
    carregarDados()
  }, [id])

  async function carregarDados() {
    setLoading(true)

    const [alunoRes, sessoesRes] = await Promise.all([
      supabase.from('alunos').select('*').eq('id', id).single(),
      supabase
        .from('sessoes')
        .select('*, academias(nome)')
        .eq('aluno_id', id)
        .order('data_hora', { ascending: false }),
    ])

    if (alunoRes.error) {
      navigate('/alunos')
      return
    }

    setAluno(alunoRes.data)
    setForm(alunoRes.data)
    setSessoes(sessoesRes.data || [])
    setLoading(false)
  }

  function toggleDia(dia) {
    setForm((prev) => {
      const dias = prev.dias_treino || []
      return {
        ...prev,
        dias_treino: dias.includes(dia) ? dias.filter((d) => d !== dia) : [...dias, dia],
      }
    })
  }

  async function handleSalvar(e) {
    e.preventDefault()
    setErro('')
    setSalvando(true)

    try {
      const { id: _, personal_id, criado_em, ...dados } = form
      if (!dados.data_nascimento) dados.data_nascimento = null
      if (!dados.email) dados.email = null
      if (!dados.telefone) dados.telefone = null
      if (!dados.horario_padrao) dados.horario_padrao = null
      if (!dados.valor_aula) dados.valor_aula = null
      if (!dados.valor_mensal) dados.valor_mensal = null
      if (!dados.local_treino) dados.local_treino = null

      const { data, error } = await supabase
        .from('alunos')
        .update(dados)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setAluno(data)
      setForm(data)
      setEditando(false)
    } catch (err) {
      setErro('Erro ao salvar. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  async function toggleAtivo() {
    const { data, error } = await supabase
      .from('alunos')
      .update({ ativo: !aluno.ativo })
      .eq('id', id)
      .select()
      .single()

    if (!error) {
      setAluno(data)
      setForm(data)
    }
  }

  async function handleExcluir() {
    if (!window.confirm(`Excluir ${aluno.nome}? Essa ação não pode ser desfeita.`)) return
    const { error } = await supabase.from('alunos').delete().eq('id', id)
    if (!error) navigate('/alunos')
  }

  if (loading) return <div className="loading">Carregando...</div>
  if (!aluno) return null

  const sessoesRealizadas = sessoes.filter((s) => s.status === 'realizada').length
  const diasOrdenados = (aluno.dias_treino || [])
    .slice()
    .sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b))

  return (
    <div className="page">
      <header className="page-header">
        <button className="btn-voltar" onClick={() => navigate('/alunos')}>
          ← Alunos
        </button>
        <div className="page-header-row">
          <div className="aluno-detalhe-header">
            <span className="aluno-avatar aluno-avatar-lg">{aluno.nome.charAt(0).toUpperCase()}</span>
            <div>
              <h1>{aluno.nome}</h1>
              {aluno.objetivo && <span className="aluno-objetivo">{aluno.objetivo}</span>}
            </div>
          </div>
          <div className="aluno-detalhe-acoes">
            {!editando && (
              <button className="btn btn-secondary" onClick={() => setEditando(true)}>
                Editar
              </button>
            )}
            <button className="btn btn-secondary" onClick={toggleAtivo}>
              {aluno.ativo ? 'Desativar' : 'Reativar'}
            </button>
          </div>
        </div>
      </header>

      {editando ? (
        <form onSubmit={handleSalvar} className="aluno-form-editar">
          {erro && <div className="alert alert-erro">{erro}</div>}

          {/* ── Dados pessoais ── */}
          <div className="form-section-label">Dados pessoais</div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nome">Nome *</label>
              <input
                id="nome"
                type="text"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Objetivo</label>
              <CustomSelect
                value={form.objetivo || ''}
                onChange={(val) => setForm({ ...form, objetivo: val })}
                options={OBJETIVOS}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <input
                id="telefone"
                type="tel"
                value={form.telefone || ''}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={form.email || ''}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nascimento">Data de nascimento</label>
              <input
                id="nascimento"
                type="date"
                value={form.data_nascimento || ''}
                onChange={(e) => setForm({ ...form, data_nascimento: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="observacoes">Observações</label>
            <textarea
              id="observacoes"
              value={form.observacoes || ''}
              onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              rows={2}
            />
          </div>

          {/* ── Treino ── */}
          <div className="form-section-label" style={{ marginTop: 8 }}>Treino</div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label htmlFor="local_treino">Local / Academia</label>
              <input
                id="local_treino"
                type="text"
                value={form.local_treino || ''}
                onChange={(e) => setForm({ ...form, local_treino: e.target.value })}
                placeholder="Ex: Smart Fit, Academia X..."
              />
            </div>
            <div className="form-group">
              <label htmlFor="horario_padrao">Horário padrão</label>
              <input
                id="horario_padrao"
                type="time"
                value={form.horario_padrao || ''}
                onChange={(e) => setForm({ ...form, horario_padrao: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Dias de treino</label>
            <div className="dias-pills">
              {DIAS.map((dia) => (
                <button
                  key={dia.valor}
                  type="button"
                  className={`dia-pill ${(form.dias_treino || []).includes(dia.valor) ? 'dia-pill-ativo' : ''}`}
                  onClick={() => toggleDia(dia.valor)}
                >
                  {dia.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Cobrança ── */}
          <div className="form-section-label" style={{ marginTop: 8 }}>Cobrança</div>

          <div className="form-group">
            <label>Formato de cobrança</label>
            <div className="cobranca-toggle">
              <button
                type="button"
                className={`cobranca-opt ${(form.formato_cobranca || 'por_aula') === 'por_aula' ? 'cobranca-opt-ativo' : ''}`}
                onClick={() => setForm({ ...form, formato_cobranca: 'por_aula' })}
              >
                Por aula
              </button>
              <button
                type="button"
                className={`cobranca-opt ${form.formato_cobranca === 'mensal' ? 'cobranca-opt-ativo' : ''}`}
                onClick={() => setForm({ ...form, formato_cobranca: 'mensal' })}
              >
                Mensal
              </button>
            </div>
          </div>

          {(form.formato_cobranca || 'por_aula') === 'por_aula' ? (
            <div className="form-group">
              <label htmlFor="valor_aula">Valor por aula (R$)</label>
              <input
                id="valor_aula"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={form.valor_aula || ''}
                onChange={(e) => setForm({ ...form, valor_aula: e.target.value })}
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="valor_mensal">Valor mensal (R$)</label>
              <input
                id="valor_mensal"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={form.valor_mensal || ''}
                onChange={(e) => setForm({ ...form, valor_mensal: e.target.value })}
              />
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => { setEditando(false); setForm(aluno) }}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      ) : (
        <div className="aluno-dados">

          {/* Info cards */}
          <div className="dados-grid">
            {aluno.telefone && (
              <div className="dado">
                <span className="dado-label">Telefone</span>
                <span className="dado-valor">{aluno.telefone}</span>
              </div>
            )}
            {aluno.email && (
              <div className="dado">
                <span className="dado-label">Email</span>
                <span className="dado-valor">{aluno.email}</span>
              </div>
            )}
            {aluno.data_nascimento && (
              <div className="dado">
                <span className="dado-label">Nascimento</span>
                <span className="dado-valor">{new Date(aluno.data_nascimento + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
              </div>
            )}
            <div className="dado">
              <span className="dado-label">Aulas realizadas</span>
              <span className="dado-valor">{sessoesRealizadas}</span>
            </div>
          </div>

          {/* Treino */}
          {(aluno.local_treino || (aluno.dias_treino?.length > 0) || aluno.horario_padrao) && (
            <div className="aluno-treino-info">
              {aluno.local_treino && (
                <div className="dado">
                  <span className="dado-label">Local de treino</span>
                  <span className="dado-valor">📍 {aluno.local_treino}</span>
                </div>
              )}
              {aluno.horario_padrao && (
                <div className="dado">
                  <span className="dado-label">Horário padrão</span>
                  <span className="dado-valor">🕐 {aluno.horario_padrao.slice(0, 5)}</span>
                </div>
              )}
              {aluno.dias_treino?.length > 0 && (
                <div className="dado">
                  <span className="dado-label">Dias de treino</span>
                  <div className="dias-pills dias-pills-readonly">
                    {DIAS.map((dia) => (
                      <span
                        key={dia.valor}
                        className={`dia-pill ${diasOrdenados.includes(dia.valor) ? 'dia-pill-ativo' : 'dia-pill-inativo'}`}
                      >
                        {dia.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cobrança */}
          <div className="dado" style={{ marginTop: 8 }}>
            <span className="dado-label">Cobrança</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span className="dado-valor">
                {aluno.formato_cobranca === 'mensal' ? 'Mensal' : 'Por aula'}
              </span>
              {aluno.formato_cobranca === 'mensal' && aluno.valor_mensal && (
                <span className="dado-valor" style={{ color: 'var(--accent)', fontWeight: 700 }}>
                  {formatMoeda(aluno.valor_mensal)}/mês
                </span>
              )}
              {(aluno.formato_cobranca !== 'mensal') && aluno.valor_aula && (
                <span className="dado-valor" style={{ color: 'var(--accent)', fontWeight: 700 }}>
                  {formatMoeda(aluno.valor_aula)}/aula
                </span>
              )}
            </div>
          </div>

          {aluno.observacoes && (
            <div className="dado" style={{ marginTop: 8 }}>
              <span className="dado-label">Observações</span>
              <span className="dado-valor">{aluno.observacoes}</span>
            </div>
          )}
        </div>
      )}

      <section className="section">
        <h2>Histórico de sessões</h2>
        {sessoes.length === 0 ? (
          <EmptyState titulo="Nenhuma sessão registrada" descricao="As sessões deste aluno aparecerão aqui" />
        ) : (
          <div className="sessoes-lista">
            {sessoes.map((sessao) => (
              <div key={sessao.id} className="sessao-card">
                <div className="sessao-hora">
                  {formatDataHora(sessao.data_hora)}
                </div>
                <div className="sessao-info">
                  {sessao.academias?.nome && <span className="sessao-academia">{sessao.academias.nome}</span>}
                  {sessao.observacoes && <span className="sessao-obs">{sessao.observacoes}</span>}
                </div>
                <StatusBadge status={sessao.status} />
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="aluno-danger-zone">
        <button className="btn btn-danger" onClick={handleExcluir}>
          Excluir aluno
        </button>
      </div>
    </div>
  )
}
