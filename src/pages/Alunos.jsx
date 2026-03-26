import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAlunos from '../hooks/useAlunos'
import Modal from '../components/Modal'
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

const formInicial = {
  nome: '',
  telefone: '',
  email: '',
  data_nascimento: '',
  objetivo: '',
  observacoes: '',
  local_treino: '',
  dias_treino: [],
  formato_cobranca: 'por_aula',
  valor_aula: '',
  valor_mensal: '',
  horario_padrao: '',
}

export default function Alunos() {
  const { alunos, loading, criarAluno } = useAlunos()
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState(formInicial)

  const alunosFiltrados = alunos.filter((a) =>
    a.nome.toLowerCase().includes(busca.toLowerCase())
  )
  const alunosAtivos = alunosFiltrados.filter((a) => a.ativo)
  const alunosInativos = alunosFiltrados.filter((a) => !a.ativo)

  function abrirModal() {
    setForm(formInicial)
    setErro('')
    setModalAberto(true)
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

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSalvando(true)

    try {
      const dados = { ...form }
      if (!dados.data_nascimento) dados.data_nascimento = null
      if (!dados.email) dados.email = null
      if (!dados.telefone) dados.telefone = null
      if (!dados.horario_padrao) dados.horario_padrao = null
      if (!dados.valor_aula) dados.valor_aula = null
      if (!dados.valor_mensal) dados.valor_mensal = null
      if (!dados.local_treino) dados.local_treino = null

      await criarAluno(dados)
      setModalAberto(false)
    } catch (err) {
      setErro('Erro ao cadastrar aluno. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  if (loading) return <div className="loading">Carregando...</div>

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header-row">
          <h1>Alunos</h1>
          <button className="btn btn-primary" onClick={abrirModal}>
            + Novo aluno
          </button>
        </div>
      </header>

      {alunos.length > 0 && (
        <div className="busca-container">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input-busca"
          />
        </div>
      )}

      {alunos.length === 0 ? (
        <EmptyState
          titulo="Nenhum aluno cadastrado"
          descricao="Adicione seu primeiro aluno pra começar a organizar sua agenda"
          acao="+ Novo aluno"
          onAcao={abrirModal}
        />
      ) : alunosFiltrados.length === 0 ? (
        <EmptyState titulo="Nenhum aluno encontrado" descricao={`Sem resultados para "${busca}"`} />
      ) : (
        <>
          <div className="alunos-grid">
            {alunosAtivos.map((aluno) => (
              <div
                key={aluno.id}
                className="aluno-card"
                onClick={() => navigate(`/alunos/${aluno.id}`)}
              >
                <div className="aluno-card-header">
                  <span className="aluno-avatar">{aluno.nome.charAt(0).toUpperCase()}</span>
                  <div className="aluno-card-info">
                    <span className="aluno-nome">{aluno.nome}</span>
                    {aluno.objetivo && <span className="aluno-objetivo">{aluno.objetivo}</span>}
                  </div>
                </div>
                <div className="aluno-card-meta">
                  {aluno.local_treino && (
                    <span className="aluno-card-local">📍 {aluno.local_treino}</span>
                  )}
                  {aluno.dias_treino?.length > 0 && (
                    <span className="aluno-card-dias">
                      {aluno.dias_treino
                        .sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b))
                        .map((d) => DIAS.find((x) => x.valor === d)?.label)
                        .join(' · ')}
                    </span>
                  )}
                </div>
                {aluno.telefone && <span className="aluno-telefone">{aluno.telefone}</span>}
              </div>
            ))}
          </div>

          {alunosInativos.length > 0 && (
            <div className="section">
              <h2 className="text-muted">Inativos ({alunosInativos.length})</h2>
              <div className="alunos-grid">
                {alunosInativos.map((aluno) => (
                  <div
                    key={aluno.id}
                    className="aluno-card aluno-inativo"
                    onClick={() => navigate(`/alunos/${aluno.id}`)}
                  >
                    <div className="aluno-card-header">
                      <span className="aluno-avatar">{aluno.nome.charAt(0).toUpperCase()}</span>
                      <div className="aluno-card-info">
                        <span className="aluno-nome">{aluno.nome}</span>
                        {aluno.objetivo && <span className="aluno-objetivo">{aluno.objetivo}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)} titulo="Novo aluno">
        <form onSubmit={handleSubmit}>
          {erro && <div className="alert alert-erro">{erro}</div>}

          {/* ── Dados pessoais ── */}
          <div className="form-section-label">Dados pessoais</div>

          <div className="form-group">
            <label htmlFor="nome">Nome *</label>
            <input
              id="nome"
              type="text"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Nome do aluno"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <input
                id="telefone"
                type="tel"
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                placeholder="(41) 99999-9999"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="aluno@email.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nascimento">Data de nascimento</label>
              <input
                id="nascimento"
                type="date"
                value={form.data_nascimento}
                onChange={(e) => setForm({ ...form, data_nascimento: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Objetivo</label>
              <CustomSelect
                value={form.objetivo}
                onChange={(val) => setForm({ ...form, objetivo: val })}
                options={OBJETIVOS}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="observacoes">Observações</label>
            <textarea
              id="observacoes"
              value={form.observacoes}
              onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              placeholder="Lesões, restrições, preferências..."
              rows={2}
            />
          </div>

          {/* ── Configuração de treino ── */}
          <div className="form-section-label" style={{ marginTop: 8 }}>Treino</div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label htmlFor="local_treino">Local / Academia</label>
              <input
                id="local_treino"
                type="text"
                value={form.local_treino}
                onChange={(e) => setForm({ ...form, local_treino: e.target.value })}
                placeholder="Ex: Smart Fit, Academia X, Ar livre..."
              />
            </div>
            <div className="form-group">
              <label htmlFor="horario_padrao">Horário padrão</label>
              <input
                id="horario_padrao"
                type="time"
                value={form.horario_padrao}
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

          {/* ── Financeiro ── */}
          <div className="form-section-label" style={{ marginTop: 8 }}>Cobrança</div>

          <div className="form-group">
            <label>Formato de cobrança</label>
            <div className="cobranca-toggle">
              <button
                type="button"
                className={`cobranca-opt ${form.formato_cobranca === 'por_aula' ? 'cobranca-opt-ativo' : ''}`}
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

          {form.formato_cobranca === 'por_aula' ? (
            <div className="form-group">
              <label htmlFor="valor_aula">Valor por aula (R$)</label>
              <input
                id="valor_aula"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={form.valor_aula}
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
                value={form.valor_mensal}
                onChange={(e) => setForm({ ...form, valor_mensal: e.target.value })}
              />
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setModalAberto(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
