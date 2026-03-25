import { Link } from 'react-router-dom'
import './LandingWhite.css'

export default function LandingWhite() {
  return (
    <div className="lw">
      <nav className="lw-nav">
        <span className="lw-logo">FitAgenda</span>
        <div className="lw-nav-links">
          <Link to="/login" className="lw-btn-ghost">Entrar</Link>
          <Link to="/cadastro" className="lw-btn-primary">Criar conta grátis</Link>
        </div>
      </nav>

      <section className="lw-hero">
        <div className="lw-hero-content">
          <div className="lw-badge">
            <span className="lw-badge-dot"></span>
            Gestão para personal trainers
          </div>
          <h1>
            Treine mais.<br />
            <span className="lw-grad-green">Organize melhor.</span><br />
            <span className="lw-grad-orange">Fature mais.</span>
          </h1>
          <p className="lw-hero-sub">
            O FitAgenda é a plataforma completa para personal trainers gerenciarem
            alunos, agendas, pagamentos e faturamento — tudo em um só lugar.
          </p>
          <div className="lw-hero-actions">
            <Link to="/cadastro" className="lw-btn-primary lw-btn-lg">Começar grátis</Link>
            <a href="#funcionalidades" className="lw-btn-ghost lw-btn-lg">Ver funcionalidades</a>
          </div>
          <p className="lw-hero-note">Sem cartão de crédito. Sem compromisso.</p>
        </div>

        <div className="lw-hero-visual">
          <div className="lw-mockup">
            <div className="lw-mockup-bar">
              <span className="dot r"></span><span className="dot y"></span><span className="dot g"></span>
              <span className="lw-mockup-title">FitAgenda</span>
            </div>
            <div className="lw-mockup-body">
              <div className="lw-mockup-greeting">Olá, Personal!</div>
              <div className="lw-mockup-sub">Resumo do seu dia</div>
              <div className="lw-mockup-cards">
                <div className="lw-mockup-card">
                  <span className="lw-card-num green">24</span>
                  <span className="lw-card-label">Alunos ativos</span>
                </div>
                <div className="lw-mockup-card">
                  <span className="lw-card-num orange">8</span>
                  <span className="lw-card-label">Aulas hoje</span>
                </div>
                <div className="lw-mockup-card">
                  <span className="lw-card-num green">R$4.800</span>
                  <span className="lw-card-label">Faturamento</span>
                </div>
              </div>
              <div className="lw-mockup-schedule-title">Próximas aulas</div>
              <div className="lw-mockup-row">
                <span className="lw-time">08:00</span>
                <span className="lw-name">Maria Silva</span>
                <span className="lw-status done">Realizada</span>
              </div>
              <div className="lw-mockup-row">
                <span className="lw-time">09:00</span>
                <span className="lw-name">João Pedro</span>
                <span className="lw-status sched">Agendada</span>
              </div>
              <div className="lw-mockup-row">
                <span className="lw-time">10:30</span>
                <span className="lw-name">Ana Costa</span>
                <span className="lw-status sched">Agendada</span>
              </div>
            </div>
          </div>
          <div className="lw-glow-green"></div>
          <div className="lw-glow-orange"></div>
        </div>
      </section>

      <div className="lw-stats">
        <div className="lw-stat"><span className="lw-stat-num">+200</span><span className="lw-stat-label">Personal trainers</span></div>
        <div className="lw-stat-divider"></div>
        <div className="lw-stat"><span className="lw-stat-num">+5.000</span><span className="lw-stat-label">Aulas agendadas</span></div>
        <div className="lw-stat-divider"></div>
        <div className="lw-stat"><span className="lw-stat-num">100%</span><span className="lw-stat-label">Mobile friendly</span></div>
        <div className="lw-stat-divider"></div>
        <div className="lw-stat"><span className="lw-stat-num">Grátis</span><span className="lw-stat-label">Para começar</span></div>
      </div>

      <section className="lw-features" id="funcionalidades">
        <div className="lw-section-header">
          <h2>Tudo que você precisa para<br /><span className="lw-grad-green">gerenciar seus alunos</span></h2>
          <p>Desenvolvido por quem entende a rotina de um personal trainer.</p>
        </div>
        <div className="lw-features-grid">
          {[
            { icon: '📋', title: 'Gestão de Alunos', desc: 'Cadastre alunos com informações completas: objetivo, observações, academia e valor da sessão.' },
            { icon: '📅', title: 'Agenda Semanal', desc: 'Visualize sua semana, agende aulas com proteção contra sobreposição de horários.', accent: 'orange' },
            { icon: '💰', title: 'Controle Financeiro', desc: 'Faturamento mensal, sessões pagas ou pendentes e visibilidade total da sua receita.' },
            { icon: '🏋️', title: 'Multi-Academia', desc: 'Trabalha em mais de uma academia? Cadastre todas e vincule alunos a cada uma.' },
            { icon: '⏰', title: 'Disponibilidade', desc: 'Configure horários por dia da semana e academia. O sistema valida conflitos.', accent: 'orange' },
            { icon: '📱', title: '100% Mobile', desc: 'Interface responsiva otimizada para celular. Gerencie tudo pelo smartphone.' },
          ].map((f, i) => (
            <div key={i} className={`lw-feature-card ${f.accent === 'orange' ? 'lw-feature-orange' : ''}`}>
              <div className="lw-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lw-steps">
        <div className="lw-section-header">
          <h2>Comece em <span className="lw-grad-orange">3 passos</span></h2>
          <p>Configuração rápida para você começar a organizar sua rotina.</p>
        </div>
        <div className="lw-steps-grid">
          <div className="lw-step"><div className="lw-step-num green">1</div><h3>Crie sua conta</h3><p>Cadastro rápido com email e senha. Sem burocracia.</p></div>
          <div className="lw-step-divider"></div>
          <div className="lw-step"><div className="lw-step-num orange">2</div><h3>Configure seu perfil</h3><p>Adicione suas academias e horários disponíveis no onboarding guiado.</p></div>
          <div className="lw-step-divider"></div>
          <div className="lw-step"><div className="lw-step-num green">3</div><h3>Comece a agendar</h3><p>Cadastre alunos, crie sessões e controle seus pagamentos.</p></div>
        </div>
      </section>

      <section className="lw-cta">
        <div className="lw-cta-inner">
          <h2>Pronto para <span className="lw-grad-orange">transformar</span> sua rotina?</h2>
          <p>Junte-se aos personal trainers que já usam o FitAgenda.</p>
          <Link to="/cadastro" className="lw-btn-primary lw-btn-lg">Criar conta grátis</Link>
        </div>
      </section>

      <footer className="lw-footer">
        <span className="lw-logo">FitAgenda</span>
        <p>Feito para personal trainers que levam a sério sua carreira.</p>
      </footer>
    </div>
  )
}
