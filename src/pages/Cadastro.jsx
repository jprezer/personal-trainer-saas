import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [cref, setCref] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const { cadastrar } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      await cadastrar(email, senha, nome)
      navigate('/')
    } catch (err) {
      if (err.message?.includes('already registered')) {
        setErro('Este email já está cadastrado')
      } else {
        setErro('Erro ao criar conta. Tente novamente.')
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-logo">FitAgenda</h1>
        <p className="auth-subtitulo">Crie sua conta gratuita</p>

        <form onSubmit={handleSubmit}>
          {erro && <div className="alert alert-erro">{erro}</div>}

          <div className="form-group">
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="João Silva"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cref">CREF <span className="opcional">(opcional)</span></label>
            <input
              id="cref"
              type="text"
              value={cref}
              onChange={(e) => setCref(e.target.value)}
              placeholder="000000-G/UF"
            />
          </div>

          <button className="btn btn-primary btn-full" type="submit" disabled={carregando}>
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="auth-link">
          Já tem conta? <Link to="/login">Faça login</Link>
        </p>
      </div>
    </div>
  )
}
