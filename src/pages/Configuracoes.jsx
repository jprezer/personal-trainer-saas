import { useState } from 'react'
import useProfile from '../hooks/useProfile'
import useAcademias from '../hooks/useAcademias'
import useDisponibilidades from '../hooks/useDisponibilidades'
import Modal from '../components/Modal'
import { getDiaSemana, formatHora } from '../lib/utils'

export default function Configuracoes() {
  const { profile, loading: loadingProfile, atualizarProfile } = useProfile()
  const { academias, loading: loadingAcademias, adicionarAcademia, removerAcademia } = useAcademias()
  const { disponibilidades, loading: loadingDisp, criarDisponibilidade, excluirDisponibilidade } = useDisponibilidades()

  const [tab, setTab] = useState('perfil')

  if (loadingProfile) return <div className="loading">Carregando...</div>

  return (
    <div className="page">
      <header className="page-header">
        <h1>Configurações</h1>
      </header>

      <div className="tabs">
        <button className={`tab ${tab === 'perfil' ? 'tab-ativo' : ''}`} onClick={() => setTab('perfil')}>
          Perfil
        </button>
        <button className="tab tab-desabilitado" disabled title="Em breve">
          Academias <span className="badge-breve">em breve</span>
        </button>
        <button className="tab tab-desabilitado" disabled title="Em breve">
          Disponibilidade <span className="badge-breve">em breve</span>
        </button>
      </div>

      {tab === 'perfil' && <TabPerfil profile={profile} onSalvar={atualizarProfile} />}
    </div>
  )
}

function TabPerfil({ profile, onSalvar }) {
  const [form, setForm] = useState({
    nome: profile?.nome || '',
    bio: profile?.bio || '',
    telefone: profile?.telefone || '',
    cref: profile?.cref || '',
    especialidades: profile?.especialidades?.join(', ') || '',
  })
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSalvando(true)
    setMensagem('')

    try {
      const dados = {
        ...form,
        especialidades: form.especialidades
          ? form.especialidades.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      }
      await onSalvar(dados)
      setMensagem('Perfil salvo com sucesso!')
    } catch {
      setMensagem('Erro ao salvar perfil.')
    } finally {
      setSalvando(false)
      setTimeout(() => setMensagem(''), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="config-section">
      {mensagem && (
        <div className={`alert ${mensagem.includes('Erro') ? 'alert-erro' : 'alert-sucesso'}`}>
          {mensagem}
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nome">Nome</label>
          <input id="nome" type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        </div>
        <div className="form-group">
          <label htmlFor="cref">CREF</label>
          <input id="cref" type="text" value={form.cref} onChange={(e) => setForm({ ...form, cref: e.target.value })} placeholder="000000-G/UF" />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="bio">Bio</label>
        <textarea id="bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Fale um pouco sobre você e seu trabalho..." />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="telefone">Telefone</label>
          <input id="telefone" type="tel" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} placeholder="(41) 99999-9999" />
        </div>
        <div className="form-group">
          <label htmlFor="especialidades">Especialidades <span className="opcional">(separadas por vírgula)</span></label>
          <input id="especialidades" type="text" value={form.especialidades} onChange={(e) => setForm({ ...form, especialidades: e.target.value })} placeholder="musculação, funcional, pilates" />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={salvando}>
        {salvando ? 'Salvando...' : 'Salvar perfil'}
      </button>
    </form>
  )
}

function TabAcademias({ academias, loading, onAdicionar, onRemover }) {
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState({ nome: '', endereco: '', cidade: '', estado: '' })
  const [salvando, setSalvando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSalvando(true)
    try {
      await onAdicionar(form)
      setModalAberto(false)
      setForm({ nome: '', endereco: '', cidade: '', estado: '' })
    } catch {
      // erro silencioso
    } finally {
      setSalvando(false)
    }
  }

  async function handleRemover(id, nome) {
    if (!window.confirm(`Remover ${nome} das suas academias?`)) return
    await onRemover(id)
  }

  if (loading) return <div className="loading">Carregando...</div>

  return (
    <div className="config-section">
      <div className="config-section-header">
        <p className="text-muted">Academias onde você atua</p>
        <button className="btn btn-primary" onClick={() => setModalAberto(true)}>+ Academia</button>
      </div>

      {academias.length === 0 ? (
        <div className="config-vazio">Nenhuma academia cadastrada</div>
      ) : (
        <div className="config-lista">
          {academias.map((a) => (
            <div key={a.id} className="config-item">
              <div>
                <span className="config-item-nome">{a.nome}</span>
                {a.endereco && <span className="config-item-detalhe">{a.endereco}{a.cidade ? ` — ${a.cidade}/${a.estado}` : ''}</span>}
              </div>
              <button className="btn-remover" onClick={() => handleRemover(a.id, a.nome)}>Remover</button>
            </div>
          ))}
        </div>
      )}

      <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)} titulo="Nova academia">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="acad-nome">Nome *</label>
            <input id="acad-nome" type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome da academia" required />
          </div>
          <div className="form-group">
            <label htmlFor="acad-endereco">Endereço</label>
            <input id="acad-endereco" type="text" value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} placeholder="Rua, número" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="acad-cidade">Cidade</label>
              <input id="acad-cidade" type="text" value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} placeholder="Curitiba" />
            </div>
            <div className="form-group">
              <label htmlFor="acad-estado">Estado</label>
              <input id="acad-estado" type="text" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} placeholder="PR" maxLength={2} />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setModalAberto(false)}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={salvando}>{salvando ? 'Salvando...' : 'Adicionar'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function TabDisponibilidade({ disponibilidades, academias, loading, onCriar, onExcluir }) {
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState({ academia_id: '', dia_semana: '1', hora_inicio: '08:00', hora_fim: '09:00' })
  const [salvando, setSalvando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSalvando(true)
    try {
      await onCriar({
        ...form,
        dia_semana: parseInt(form.dia_semana),
        academia_id: form.academia_id || null,
      })
      setModalAberto(false)
    } catch {
      // erro silencioso
    } finally {
      setSalvando(false)
    }
  }

  if (loading) return <div className="loading">Carregando...</div>

  const diasAgrupados = {}
  disponibilidades.forEach((d) => {
    const dia = d.dia_semana
    if (!diasAgrupados[dia]) diasAgrupados[dia] = []
    diasAgrupados[dia].push(d)
  })

  return (
    <div className="config-section">
      <div className="config-section-header">
        <p className="text-muted">Horários disponíveis para aulas</p>
        <button className="btn btn-primary" onClick={() => setModalAberto(true)}>+ Horário</button>
      </div>

      {disponibilidades.length === 0 ? (
        <div className="config-vazio">Nenhum horário configurado</div>
      ) : (
        <div className="disp-grid">
          {Object.entries(diasAgrupados).map(([dia, slots]) => (
            <div key={dia} className="disp-dia">
              <h3 className="disp-dia-nome">{getDiaSemana(parseInt(dia))}</h3>
              {slots.map((slot) => (
                <div key={slot.id} className="disp-slot">
                  <span className="disp-horario">{formatHora(slot.hora_inicio)} — {formatHora(slot.hora_fim)}</span>
                  {slot.academias?.nome && <span className="disp-academia">{slot.academias.nome}</span>}
                  <button className="btn-remover-sm" onClick={() => onExcluir(slot.id)}>&times;</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)} titulo="Novo horário">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="disp-dia">Dia da semana *</label>
            <select id="disp-dia" value={form.dia_semana} onChange={(e) => setForm({ ...form, dia_semana: e.target.value })}>
              <option value="1">Segunda</option>
              <option value="2">Terça</option>
              <option value="3">Quarta</option>
              <option value="4">Quinta</option>
              <option value="5">Sexta</option>
              <option value="6">Sábado</option>
              <option value="0">Domingo</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="disp-inicio">Início *</label>
              <input id="disp-inicio" type="time" value={form.hora_inicio} onChange={(e) => setForm({ ...form, hora_inicio: e.target.value })} required />
            </div>
            <div className="form-group">
              <label htmlFor="disp-fim">Fim *</label>
              <input id="disp-fim" type="time" value={form.hora_fim} onChange={(e) => setForm({ ...form, hora_fim: e.target.value })} required />
            </div>
          </div>
          {academias.length > 0 && (
            <div className="form-group">
              <label htmlFor="disp-academia">Academia</label>
              <select id="disp-academia" value={form.academia_id} onChange={(e) => setForm({ ...form, academia_id: e.target.value })}>
                <option value="">Nenhuma (avulso)</option>
                {academias.map((a) => (
                  <option key={a.id} value={a.id}>{a.nome}</option>
                ))}
              </select>
            </div>
          )}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setModalAberto(false)}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={salvando}>{salvando ? 'Salvando...' : 'Adicionar'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
