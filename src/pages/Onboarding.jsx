import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Onboarding() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [etapa, setEtapa] = useState(1)
  const [salvando, setSalvando] = useState(false)

  // Etapa 1: Perfil
  const [perfil, setPerfil] = useState({ bio: '', telefone: '', especialidades: '' })
  // Etapa 2: Academia
  const [academia, setAcademia] = useState({ nome: '', endereco: '', cidade: '', estado: '' })
  // Etapa 3: Disponibilidade
  const [slots, setSlots] = useState([])
  const [slotForm, setSlotForm] = useState({ dia_semana: '1', hora_inicio: '08:00', hora_fim: '09:00' })

  function addSlot() {
    setSlots([...slots, { ...slotForm, dia_semana: parseInt(slotForm.dia_semana) }])
    setSlotForm({ dia_semana: '1', hora_inicio: '08:00', hora_fim: '09:00' })
  }

  function removeSlot(index) {
    setSlots(slots.filter((_, i) => i !== index))
  }

  async function finalizar() {
    setSalvando(true)
    try {
      // Salva perfil
      const especialidades = perfil.especialidades
        ? perfil.especialidades.split(',').map((s) => s.trim()).filter(Boolean)
        : []

      await supabase.from('profiles').update({
        bio: perfil.bio || null,
        telefone: perfil.telefone || null,
        especialidades,
      }).eq('id', user.id)

      // Salva academia (se preencheu)
      let academiaId = null
      if (academia.nome) {
        const { data: acad } = await supabase.from('academias').insert(academia).select().single()
        if (acad) {
          academiaId = acad.id
          await supabase.from('personal_academias').insert({ personal_id: user.id, academia_id: acad.id })
        }
      }

      // Salva disponibilidades
      if (slots.length > 0) {
        const disps = slots.map((s) => ({
          personal_id: user.id,
          academia_id: academiaId,
          dia_semana: s.dia_semana,
          hora_inicio: s.hora_inicio,
          hora_fim: s.hora_fim,
        }))
        await supabase.from('disponibilidades').insert(disps)
      }

      navigate('/dashboard')
    } catch {
      // erro silencioso
    } finally {
      setSalvando(false)
    }
  }

  const diasSemana = [
    { value: '1', label: 'Segunda' },
    { value: '2', label: 'Terça' },
    { value: '3', label: 'Quarta' },
    { value: '4', label: 'Quinta' },
    { value: '5', label: 'Sexta' },
    { value: '6', label: 'Sábado' },
    { value: '0', label: 'Domingo' },
  ]

  return (
    <div className="auth-page">
      <div className="onboarding-card">
        <h1 className="auth-logo">FitAgenda</h1>
        <div className="onboarding-progresso">
          <div className={`onboarding-step ${etapa >= 1 ? 'step-ativo' : ''}`}>1</div>
          <div className="onboarding-line" />
          <div className={`onboarding-step ${etapa >= 2 ? 'step-ativo' : ''}`}>2</div>
          <div className="onboarding-line" />
          <div className={`onboarding-step ${etapa >= 3 ? 'step-ativo' : ''}`}>3</div>
        </div>

        {etapa === 1 && (
          <div className="onboarding-etapa">
            <h2>Complete seu perfil</h2>
            <p className="text-muted">Conte um pouco sobre você e seu trabalho</p>

            <div className="form-group">
              <label htmlFor="ob-telefone">Telefone</label>
              <input id="ob-telefone" type="tel" value={perfil.telefone} onChange={(e) => setPerfil({ ...perfil, telefone: e.target.value })} placeholder="(41) 99999-9999" />
            </div>
            <div className="form-group">
              <label htmlFor="ob-bio">Bio</label>
              <textarea id="ob-bio" value={perfil.bio} onChange={(e) => setPerfil({ ...perfil, bio: e.target.value })} rows={3} placeholder="Descreva sua experiência e metodologia..." />
            </div>
            <div className="form-group">
              <label htmlFor="ob-espec">Especialidades <span className="opcional">(separadas por vírgula)</span></label>
              <input id="ob-espec" type="text" value={perfil.especialidades} onChange={(e) => setPerfil({ ...perfil, especialidades: e.target.value })} placeholder="musculação, funcional, pilates" />
            </div>

            <div className="onboarding-actions">
              <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Pular</button>
              <button className="btn btn-primary" onClick={() => setEtapa(2)}>Continuar</button>
            </div>
          </div>
        )}

        {etapa === 2 && (
          <div className="onboarding-etapa">
            <h2>Sua academia</h2>
            <p className="text-muted">Onde você atua? Pode adicionar mais depois.</p>

            <div className="form-group">
              <label htmlFor="ob-acad-nome">Nome da academia</label>
              <input id="ob-acad-nome" type="text" value={academia.nome} onChange={(e) => setAcademia({ ...academia, nome: e.target.value })} placeholder="Academia XYZ" />
            </div>
            <div className="form-group">
              <label htmlFor="ob-acad-end">Endereço</label>
              <input id="ob-acad-end" type="text" value={academia.endereco} onChange={(e) => setAcademia({ ...academia, endereco: e.target.value })} placeholder="Rua, número" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ob-acad-cidade">Cidade</label>
                <input id="ob-acad-cidade" type="text" value={academia.cidade} onChange={(e) => setAcademia({ ...academia, cidade: e.target.value })} placeholder="Curitiba" />
              </div>
              <div className="form-group">
                <label htmlFor="ob-acad-estado">Estado</label>
                <input id="ob-acad-estado" type="text" value={academia.estado} onChange={(e) => setAcademia({ ...academia, estado: e.target.value })} placeholder="PR" maxLength={2} />
              </div>
            </div>

            <div className="onboarding-actions">
              <button className="btn btn-secondary" onClick={() => setEtapa(1)}>Voltar</button>
              <button className="btn btn-primary" onClick={() => setEtapa(3)}>Continuar</button>
            </div>
          </div>
        )}

        {etapa === 3 && (
          <div className="onboarding-etapa">
            <h2>Seus horários</h2>
            <p className="text-muted">Configure sua disponibilidade semanal</p>

            <div className="onboarding-slot-form">
              <select value={slotForm.dia_semana} onChange={(e) => setSlotForm({ ...slotForm, dia_semana: e.target.value })}>
                {diasSemana.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <input type="time" value={slotForm.hora_inicio} onChange={(e) => setSlotForm({ ...slotForm, hora_inicio: e.target.value })} />
              <span className="text-muted">até</span>
              <input type="time" value={slotForm.hora_fim} onChange={(e) => setSlotForm({ ...slotForm, hora_fim: e.target.value })} />
              <button type="button" className="btn btn-secondary" onClick={addSlot}>+</button>
            </div>

            {slots.length > 0 && (
              <div className="onboarding-slots">
                {slots.map((slot, i) => (
                  <div key={i} className="onboarding-slot-item">
                    <span>{diasSemana.find((d) => d.value === String(slot.dia_semana))?.label}</span>
                    <span className="slot-horario">{slot.hora_inicio} — {slot.hora_fim}</span>
                    <button className="btn-remover-sm" onClick={() => removeSlot(i)}>&times;</button>
                  </div>
                ))}
              </div>
            )}

            <div className="onboarding-actions">
              <button className="btn btn-secondary" onClick={() => setEtapa(2)}>Voltar</button>
              <button className="btn btn-primary" onClick={finalizar} disabled={salvando}>
                {salvando ? 'Finalizando...' : 'Finalizar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
