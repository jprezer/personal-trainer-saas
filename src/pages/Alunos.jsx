import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAlunos from '../hooks/useAlunos'
import Modal from '../components/Modal'
import EmptyState from '../components/EmptyState'

export default function Alunos() {
  const { alunos, loading, criarAluno } = useAlunos()
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    email: '',
    data_nascimento: '',
    objetivo: '',
    observacoes: '',
  })

  const alunosFiltrados = alunos.filter((a) =>
    a.nome.toLowerCase().includes(busca.toLowerCase())
  )

  const alunosAtivos = alunosFiltrados.filter((a) => a.ativo)
  const alunosInativos = alunosFiltrados.filter((a) => !a.ativo)

  function abrirModal() {
    setForm({ nome: '', telefone: '', email: '', data_nascimento: '', objetivo: '', observacoes: '' })
    setErro('')
    setModalAberto(true)
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
              <label htmlFor="objetivo">Objetivo</label>
              <select
                id="objetivo"
                value={form.objetivo}
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

          <div className="form-group">
            <label htmlFor="observacoes">Observações</label>
            <textarea
              id="observacoes"
              value={form.observacoes}
              onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              placeholder="Lesões, restrições, preferências..."
              rows={3}
            />
          </div>

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
