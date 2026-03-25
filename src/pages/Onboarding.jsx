import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Onboarding() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [salvando, setSalvando] = useState(false)

  const [perfil, setPerfil] = useState({ bio: '', telefone: '', especialidades: '' })

  async function finalizar() {
    setSalvando(true)
    try {
      const especialidades = perfil.especialidades
        ? perfil.especialidades.split(',').map((s) => s.trim()).filter(Boolean)
        : []

      await supabase.from('profiles').update({
        bio: perfil.bio || null,
        telefone: perfil.telefone || null,
        especialidades,
      }).eq('id', user.id)

      navigate('/dashboard')
    } catch {
      // erro silencioso
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="onboarding-card">
        <h1 className="auth-logo">FitAgenda</h1>

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
            <button className="btn btn-primary" onClick={finalizar} disabled={salvando}>
              {salvando ? 'Salvando...' : 'Concluir'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
