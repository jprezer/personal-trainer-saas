import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './LandingPage.css'

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="lb">
      {/* Nav */}
      <nav className="lb-nav">
        <span className="lb-logo">FitAgenda</span>
        <div className="lb-nav-links">
          {user ? (
            <Link to="/dashboard" className="lb-btn-primary">Acessar painel</Link>
          ) : (
            <>
              <Link to="/login" className="lb-btn-ghost">Entrar</Link>
              <Link to="/cadastro" className="lb-btn-primary">Criar conta grátis</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="lb-hero">
        <div className="lb-hero-content">
          <div className="lb-badge">
            <span className="lb-badge-dot"></span>
            Gestão para personal trainers
          </div>
          <h1>
            Treine mais.<br />
            <span className="lb-grad-green">Organize melhor.</span><br />
            <span className="lb-grad-orange">Fature mais.</span>
          </h1>
          <p className="lb-hero-sub">
            O FitAgenda é a plataforma completa para personal trainers gerenciarem
            alunos, agendas, pagamentos e faturamento — tudo em um só lugar.
          </p>
          <div className="lb-hero-actions">
            <Link to="/cadastro" className="lb-btn-primary lb-btn-lg">Começar grátis</Link>
            <a href="#funcionalidades" className="lb-btn-ghost lb-btn-lg">Ver funcionalidades</a>
          </div>
          <p className="lb-hero-note">Sem cartão de crédito. Sem compromisso.</p>
        </div>

        <div className="lb-hero-visual">
          <div className="lb-mockup">
            <div className="lb-mockup-bar">
              <span className="dot r"></span><span className="dot y"></span><span className="dot g"></span>
              <span className="lb-mockup-title">FitAgenda</span>
            </div>
            <div className="lb-mockup-body">
              <div className="lb-mockup-greeting">Olá, Personal!</div>
              <div className="lb-mockup-sub">Resumo do seu dia</div>
              <div className="lb-mockup-cards">
                <div className="lb-mockup-card">
                  <span className="lb-card-num green">24</span>
                  <span className="lb-card-label">Alunos ativos</span>
                </div>
                <div className="lb-mockup-card">
                  <span className="lb-card-num orange">8</span>
                  <span className="lb-card-label">Aulas hoje</span>
                </div>
                <div className="lb-mockup-card">
                  <span className="lb-card-num green">R$4.800</span>
                  <span className="lb-card-label">Faturamento</span>
                </div>
              </div>
              <div className="lb-mockup-schedule-title">Próximas aulas</div>
              <div className="lb-mockup-row">
                <span className="lb-time">08:00</span>
                <span className="lb-name">Maria Silva</span>
                <span className="lb-status done">Realizada</span>
              </div>
              <div className="lb-mockup-row">
                <span className="lb-time">09:00</span>
                <span className="lb-name">João Pedro</span>
                <span className="lb-status sched">Agendada</span>
              </div>
              <div className="lb-mockup-row">
                <span className="lb-time">10:30</span>
                <span className="lb-name">Ana Costa</span>
                <span className="lb-status sched">Agendada</span>
              </div>
            </div>
          </div>
          <div className="lb-glow-green"></div>
          <div className="lb-glow-orange"></div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="lb-stats">
        <div className="lb-stat">
          <span className="lb-stat-num">+200</span>
          <span className="lb-stat-label">Personal trainers</span>
        </div>
        <div className="lb-stat-divider"></div>
        <div className="lb-stat">
          <span className="lb-stat-num">+5.000</span>
          <span className="lb-stat-label">Aulas agendadas</span>
        </div>
        <div className="lb-stat-divider"></div>
        <div className="lb-stat">
          <span className="lb-stat-num">100%</span>
          <span className="lb-stat-label">Mobile friendly</span>
        </div>
        <div className="lb-stat-divider"></div>
        <div className="lb-stat">
          <span className="lb-stat-num">Grátis</span>
          <span className="lb-stat-label">Para começar</span>
        </div>
      </div>

      {/* Features */}
      <section className="lb-features" id="funcionalidades">
        <div className="lb-section-header">
          <h2>Tudo que você precisa para<br /><span className="lb-grad-green">gerenciar seus alunos</span></h2>
          <p>Desenvolvido por quem entende a rotina de um personal trainer.</p>
        </div>
        <div className="lb-features-grid">
          {[
            { icon: '📋', title: 'Gestão de Alunos', desc: 'Cadastre alunos com informações completas: objetivo, observações, academia e valor da sessão.' },
            { icon: '📅', title: 'Agenda Semanal', desc: 'Visualize sua semana, agende aulas com proteção contra sobreposição de horários.', accent: 'orange' },
            { icon: '💰', title: 'Controle Financeiro', desc: 'Faturamento mensal, sessões pagas ou pendentes e visibilidade total da sua receita.' },
            { icon: '🏋️', title: 'Multi-Academia', desc: 'Trabalha em mais de uma academia? Cadastre todas e vincule alunos a cada uma.' },
            { icon: '⏰', title: 'Disponibilidade', desc: 'Configure horários por dia da semana e academia. O sistema valida conflitos.', accent: 'orange' },
            { icon: '📱', title: '100% Mobile', desc: 'Interface responsiva otimizada para celular. Gerencie tudo pelo smartphone.' },
          ].map((f, i) => (
            <div key={i} className={`lb-feature-card ${f.accent === 'orange' ? 'lb-feature-orange' : ''}`}>
              <div className="lb-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="lb-steps">
        <div className="lb-section-header">
          <h2>Comece em <span className="lb-grad-orange">3 passos</span></h2>
          <p>Configuração rápida para você começar a organizar sua rotina.</p>
        </div>
        <div className="lb-steps-grid">
          <div className="lb-step">
            <div className="lb-step-num green">1</div>
            <h3>Crie sua conta</h3>
            <p>Cadastro rápido com email e senha. Sem burocracia.</p>
          </div>
          <div className="lb-step-divider"></div>
          <div className="lb-step">
            <div className="lb-step-num orange">2</div>
            <h3>Configure seu perfil</h3>
            <p>Adicione suas academias e horários disponíveis no onboarding guiado.</p>
          </div>
          <div className="lb-step-divider"></div>
          <div className="lb-step">
            <div className="lb-step-num green">3</div>
            <h3>Comece a agendar</h3>
            <p>Cadastre alunos, crie sessões e controle seus pagamentos.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lb-cta">
        <div className="lb-cta-inner">
          <h2>Pronto para <span className="lb-grad-orange">transformar</span> sua rotina?</h2>
          <p>Junte-se aos personal trainers que já usam o FitAgenda.</p>
          <Link to="/cadastro" className="lb-btn-primary lb-btn-lg">Criar conta grátis</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="lb-footer">
        <span className="lb-logo">FitAgenda</span>
        <p>Feito para personal trainers que levam a sério sua carreira.</p>
      </footer>
    </div>
  )
}
