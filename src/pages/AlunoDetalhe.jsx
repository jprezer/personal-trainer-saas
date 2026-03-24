import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatDataHora, formatMoeda } from '../lib/utils'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'

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

  async function handleSalvar(e) {
    e.preventDefault()
    setErro('')
    setSalvando(true)

    try {
      const { id: _, personal_id, criado_em, ...dados } = form
      if (!dados.data_nascimento) dados.data_nascimento = null
      if (!dados.email) dados.email = null
      if (!dados.telefone) dados.telefone = null

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
              <label htmlFor="objetivo">Objetivo</label>
              <select
                id="objetivo"
                value={form.objetivo || ''}
                onChange={(e) => setForm({ ...form, objetivo: e.target.value })}
              >
                <option value="">Selecione...</option>
                <option value="emagrecimento">Emagrecimento</option>
                <option value="hipertrofia">Hipertrofia</option>
                <option value="condicionamento">Condicionamento</option>
                <option value="reabilitação">Reabilitação</option>
                <option value="qualidade de vida">Qualidade de vida</option>
                <option value="outro">Outro</option>
              </select>
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
            <div className="form-group">
              <label htmlFor="valor_aula">Valor da aula (R$)</label>
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
          </div>

          <div className="form-group">
            <label htmlFor="observacoes">Observações</label>
            <textarea
              id="observacoes"
              value={form.observacoes || ''}
              onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              rows={3}
            />
          </div>

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
            {aluno.valor_aula && (
              <div className="dado">
                <span className="dado-label">Valor da aula</span>
                <span className="dado-valor">{formatMoeda(aluno.valor_aula)}</span>
              </div>
            )}
            <div className="dado">
              <span className="dado-label">Aulas realizadas</span>
              <span className="dado-valor">{sessoesRealizadas}</span>
            </div>
          </div>
          {aluno.observacoes && (
            <div className="dado" style={{ marginTop: 16 }}>
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
