import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './LandingPage.css'

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="landing">
      {/* Nav */}
      <nav className="landing-nav">
        <span className="landing-logo">FitAgenda</span>
        <div className="landing-nav-links">
          {user ? (
            <Link to="/dashboard" className="landing-btn-primary">Acessar painel</Link>
          ) : (
            <>
              <Link to="/login" className="landing-btn-ghost">Entrar</Link>
              <Link to="/cadastro" className="landing-btn-primary">Criar conta grátis</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-badge">Gestão para personal trainers</div>
          <h1>
            Organize sua agenda,<br />
            <span className="landing-gradient">controle seus alunos</span><br />
            e fature mais.
          </h1>
          <p className="landing-hero-sub">
            O FitAgenda é a plataforma completa para personal trainers gerenciarem
            alunos, agendas, pagamentos e faturamento — tudo em um só lugar.
          </p>
          <div className="landing-hero-actions">
            <Link to="/cadastro" className="landing-btn-primary landing-btn-lg">
              Começar grátis
            </Link>
            <a href="#funcionalidades" className="landing-btn-ghost landing-btn-lg">
              Ver funcionalidades
            </a>
          </div>
          <p className="landing-hero-note">Sem cartão de crédito. Sem compromisso.</p>
        </div>

        {/* App preview mockup */}
        <div className="landing-hero-visual">
          <div className="landing-mockup">
            <div className="landing-mockup-bar">
              <span className="dot"></span><span className="dot"></span><span className="dot"></span>
              <span className="mockup-title">FitAgenda</span>
            </div>
            <div className="landing-mockup-body">
              <div className="mockup-greeting">Olá, Personal!</div>
              <div className="mockup-subtitle">Resumo do seu dia</div>
              <div className="mockup-cards">
                <div className="mockup-card">
                  <span className="mockup-card-num">24</span>
                  <span className="mockup-card-label">Alunos ativos</span>
                </div>
                <div className="mockup-card">
                  <span className="mockup-card-num">8</span>
                  <span className="mockup-card-label">Aulas hoje</span>
                </div>
                <div className="mockup-card">
                  <span className="mockup-card-num">R$ 4.800</span>
                  <span className="mockup-card-label">Faturamento</span>
                </div>
              </div>
              <div className="mockup-schedule-title">Próximas aulas</div>
              <div className="mockup-schedule-item">
                <span className="mockup-time">08:00</span>
                <span className="mockup-name">Maria Silva</span>
                <span className="mockup-status done">Realizada</span>
              </div>
              <div className="mockup-schedule-item">
                <span className="mockup-time">09:00</span>
                <span className="mockup-name">João Pedro</span>
                <span className="mockup-status scheduled">Agendada</span>
              </div>
              <div className="mockup-schedule-item">
                <span className="mockup-time">10:30</span>
                <span className="mockup-name">Ana Costa</span>
                <span className="mockup-status scheduled">Agendada</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features" id="funcionalidades">
        <div className="landing-section-header">
          <h2>Tudo que você precisa para<br /><span className="landing-gradient">gerenciar seus alunos</span></h2>
          <p>Desenvolvido por quem entende a rotina de um personal trainer.</p>
        </div>

        <div className="landing-features-grid">
          <div className="landing-feature-card">
            <div className="landing-feature-icon">📋</div>
            <h3>Gestão de Alunos</h3>
            <p>Cadastre alunos com informações completas: objetivo, observações, academia e valor da sessão. Tudo organizado em um só lugar.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">📅</div>
            <h3>Agenda Semanal</h3>
            <p>Visualize sua semana inteira, agende aulas com proteção contra sobreposição de horários e gerencie status de cada sessão.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">💰</div>
            <h3>Controle Financeiro</h3>
            <p>Acompanhe faturamento mensal, marque sessões como pagas ou pendentes e tenha visibilidade total da sua receita.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">🏋️</div>
            <h3>Multi-Academia</h3>
            <p>Trabalha em mais de uma academia? Cadastre todas e vincule alunos e disponibilidades a cada uma delas.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">⏰</div>
            <h3>Disponibilidade</h3>
            <p>Configure seus horários disponíveis por dia da semana e academia. O sistema valida automaticamente conflitos.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">📱</div>
            <h3>100% Mobile</h3>
            <p>Interface responsiva otimizada para celular. Gerencie tudo pelo seu smartphone entre um aluno e outro.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="landing-steps">
        <div className="landing-section-header">
          <h2>Comece em <span className="landing-gradient">3 passos</span></h2>
          <p>Configuração rápida para você começar a organizar sua rotina.</p>
        </div>

        <div className="landing-steps-grid">
          <div className="landing-step">
            <div className="landing-step-num">1</div>
            <h3>Crie sua conta</h3>
            <p>Cadastro rápido com email e senha. Sem burocracia.</p>
          </div>
          <div className="landing-step-divider"></div>
          <div className="landing-step">
            <div className="landing-step-num">2</div>
            <h3>Configure seu perfil</h3>
            <p>Adicione suas academias e horários disponíveis no onboarding guiado.</p>
          </div>
          <div className="landing-step-divider"></div>
          <div className="landing-step">
            <div className="landing-step-num">3</div>
            <h3>Comece a agendar</h3>
            <p>Cadastre alunos, crie sessões e controle seus pagamentos.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <h2>Pronto para organizar sua rotina?</h2>
        <p>Junte-se aos personal trainers que já usam o FitAgenda para gerenciar seus alunos e faturamento.</p>
        <Link to="/cadastro" className="landing-btn-primary landing-btn-lg">
          Criar conta grátis
        </Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <span className="landing-logo">FitAgenda</span>
        <p>Feito para personal trainers que levam a sério sua carreira.</p>
      </footer>
    </div>
  )
}
