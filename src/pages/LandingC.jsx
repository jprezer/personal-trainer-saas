import { Link } from 'react-router-dom'
import './LandingC.css'

export default function LandingC() {
  return (
    <div className="lc">
      {/* Nav */}
      <nav className="lc-nav">
        <span className="lc-logo">FitAgenda</span>
        <div className="lc-nav-links">
          <Link to="/login" className="lc-btn-ghost">Entrar</Link>
          <Link to="/cadastro" className="lc-btn-primary">Criar conta grátis</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="lc-hero">
        <div className="lc-hero-bg">
          <div className="lc-hero-glow"></div>
        </div>
        <div className="lc-hero-content">
          <div className="lc-badge">Gestão para personal trainers</div>
          <h1>
            Organize sua agenda,<br />
            <span className="lc-highlight">controle seus alunos</span><br />
            e fature mais.
          </h1>
          <p className="lc-hero-sub">
            O FitAgenda é a plataforma completa para personal trainers gerenciarem
            alunos, agendas, pagamentos e faturamento — tudo em um só lugar.
          </p>
          <div className="lc-hero-actions">
            <Link to="/cadastro" className="lc-btn-primary lc-btn-lg">Começar grátis</Link>
            <a href="#funcionalidades" className="lc-btn-ghost lc-btn-lg">Ver funcionalidades</a>
          </div>
          <p className="lc-hero-note">Sem cartão de crédito. Sem compromisso.</p>
        </div>

        <div className="lc-hero-visual">
          <div className="lc-mockup">
            <div className="lc-mockup-bar">
              <span className="dot r"></span><span className="dot y"></span><span className="dot g"></span>
              <span className="lc-mockup-title">FitAgenda</span>
            </div>
            <div className="lc-mockup-body">
              <div className="lc-mockup-greeting">Olá, Personal!</div>
              <div className="lc-mockup-sub">Resumo do seu dia</div>
              <div className="lc-mockup-cards">
                <div className="lc-mockup-card">
                  <span className="lc-card-num">24</span>
                  <span className="lc-card-label">Alunos ativos</span>
                </div>
                <div className="lc-mockup-card">
                  <span className="lc-card-num">8</span>
                  <span className="lc-card-label">Aulas hoje</span>
                </div>
                <div className="lc-mockup-card">
                  <span className="lc-card-num">R$4.8k</span>
                  <span className="lc-card-label">Faturamento</span>
                </div>
              </div>
              <div className="lc-mockup-schedule-title">Próximas aulas</div>
              {[
                { time: '08:00', name: 'Maria Silva', status: 'Realizada', type: 'done' },
                { time: '09:00', name: 'João Pedro', status: 'Agendada', type: 'sched' },
                { time: '10:30', name: 'Ana Costa', status: 'Agendada', type: 'sched' },
              ].map((row, i) => (
                <div key={i} className="lc-mockup-row">
                  <span className="lc-time">{row.time}</span>
                  <span className="lc-name">{row.name}</span>
                  <span className={`lc-status ${row.type}`}>{row.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Diagonal divider */}
      <div className="lc-divider"></div>

      {/* Features — fundo alternado */}
      <section className="lc-features" id="funcionalidades">
        <div className="lc-section-header">
          <h2>Tudo que você precisa para<br /><span className="lc-highlight">gerenciar seus alunos</span></h2>
          <p>Desenvolvido por quem entende a rotina de um personal trainer.</p>
        </div>
        <div className="lc-features-grid">
          {[
            { icon: '📋', title: 'Gestão de Alunos', desc: 'Cadastre alunos com informações completas: objetivo, observações, academia e valor da sessão.' },
            { icon: '📅', title: 'Agenda Semanal', desc: 'Visualize sua semana, agende aulas com proteção contra sobreposição de horários.' },
            { icon: '💰', title: 'Controle Financeiro', desc: 'Faturamento mensal, sessões pagas ou pendentes e visibilidade total da sua receita.' },
            { icon: '🏋️', title: 'Multi-Academia', desc: 'Trabalha em mais de uma academia? Cadastre todas e vincule alunos a cada uma.' },
            { icon: '⏰', title: 'Disponibilidade', desc: 'Configure horários por dia da semana e academia. O sistema valida conflitos.' },
            { icon: '📱', title: '100% Mobile', desc: 'Interface responsiva otimizada para celular. Gerencie tudo pelo smartphone.' },
          ].map((f, i) => (
            <div key={i} className="lc-feature-card">
              <div className="lc-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps — fundo gradiente */}
      <section className="lc-steps">
        <div className="lc-steps-bg"></div>
        <div className="lc-steps-inner">
          <div className="lc-section-header light">
            <h2>Comece em <span className="lc-highlight-light">3 passos</span></h2>
            <p>Configuração rápida para você começar a organizar sua rotina.</p>
          </div>
          <div className="lc-steps-grid">
            <div className="lc-step">
              <div className="lc-step-num">01</div>
              <h3>Crie sua conta</h3>
              <p>Cadastro rápido com email e senha. Sem burocracia.</p>
            </div>
            <div className="lc-step-arrow">→</div>
            <div className="lc-step">
              <div className="lc-step-num">02</div>
              <h3>Configure seu perfil</h3>
              <p>Adicione suas academias e horários no onboarding guiado.</p>
            </div>
            <div className="lc-step-arrow">→</div>
            <div className="lc-step">
              <div className="lc-step-num">03</div>
              <h3>Comece a agendar</h3>
              <p>Cadastre alunos, crie sessões e controle pagamentos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lc-cta">
        <h2>Pronto para organizar sua rotina?</h2>
        <p>Junte-se aos personal trainers que já usam o FitAgenda.</p>
        <Link to="/cadastro" className="lc-btn-primary lc-btn-lg">Criar conta grátis</Link>
      </section>

      {/* Footer */}
      <footer className="lc-footer">
        <span className="lc-logo">FitAgenda</span>
        <p>Feito para personal trainers que levam a sério sua carreira.</p>
      </footer>
    </div>
  )
}
