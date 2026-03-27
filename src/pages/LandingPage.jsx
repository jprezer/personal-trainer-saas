import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './LandingPage.css'

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="lw">

      {/* ── Nav ── */}
      <nav className="lw-nav">
        <span className="lw-logo">FitAgenda</span>
        <div className="lw-nav-links">
          {user ? (
            <Link to="/dashboard" className="lw-btn-primary">Acessar painel</Link>
          ) : (
            <>
              <Link to="/login" className="lw-btn-ghost">Entrar</Link>
              <Link to="/cadastro" className="lw-btn-primary">Criar conta grátis</Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
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
            <Link to="/cadastro" className="lw-btn-primary lw-btn-lg">Começar grátis →</Link>
            <a href="#funcionalidades" className="lw-btn-ghost lw-btn-lg">Ver funcionalidades</a>
          </div>
          <div className="lw-social-proof">
            <div className="lw-avatars">
              {['M','J','A','R','C'].map((l,i) => (
                <span key={i} className="lw-avatar" style={{ zIndex: 5 - i }}>{l}</span>
              ))}
            </div>
            <span className="lw-social-text">+200 personals já usam o FitAgenda</span>
          </div>
        </div>

        <div className="lw-hero-visual">
          {/* Badge flutuante esquerdo */}
          <div className="lw-float-badge lw-float-left">
            <span className="lw-float-icon lw-float-green">✓</span>
            <div>
              <div className="lw-float-title">Novo aluno</div>
              <div className="lw-float-sub">Ana Beatriz · agora</div>
            </div>
          </div>

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
                  <span className="lw-card-num green">R$4.8k</span>
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

          {/* Badge flutuante direito */}
          <div className="lw-float-badge lw-float-right">
            <span className="lw-float-icon lw-float-orange">💰</span>
            <div>
              <div className="lw-float-title">R$ 4.800 recebido</div>
              <div className="lw-float-sub">Março de 2026</div>
            </div>
          </div>

          <div className="lw-glow-green"></div>
          <div className="lw-glow-orange"></div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="lw-stats">
        {[
          { num: '+200', label: 'Personal trainers' },
          { num: '+5.000', label: 'Aulas agendadas' },
          { num: '100%', label: 'Mobile friendly' },
          { num: 'Grátis', label: 'Para começar' },
        ].map((s, i) => (
          <div key={i} className="lw-stat">
            <span className="lw-stat-num">{s.num}</span>
            <span className="lw-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Features Bento ── */}
      <section className="lw-features" id="funcionalidades">
        <div className="lw-section-header">
          <div className="lw-section-tag">Funcionalidades</div>
          <h2>Tudo que você precisa para<br /><span className="lw-grad-green">gerenciar seus alunos</span></h2>
          <p>Desenvolvido por quem entende a rotina de um personal trainer.</p>
        </div>
        <div className="lw-bento">
          {/* Coluna esquerda — Agenda tall */}
          <div className="lw-bento-card lw-bento-tall lw-bento-green">
            <div className="lw-bento-icon">📅</div>
            <h3>Agenda Semanal</h3>
            <p>Visualize sua semana completa, agende aulas e o sistema bloqueia automaticamente conflitos de horário entre alunos.</p>
            <div className="lw-bento-spacer" />
            <div className="lw-bento-tag">Anti-sobreposição</div>
          </div>
          {/* 2×2 direita */}
          <div className="lw-bento-card lw-bento-orange">
            <div className="lw-bento-icon">📋</div>
            <h3>Gestão de Alunos</h3>
            <p>Cadastro completo com objetivo, dias de treino, local e formato de cobrança.</p>
          </div>
          <div className="lw-bento-card">
            <div className="lw-bento-icon">💰</div>
            <h3>Controle Financeiro</h3>
            <p>Faturamento com separação entre alunos mensais e por aula.</p>
          </div>
          <div className="lw-bento-card">
            <div className="lw-bento-icon">🏋️</div>
            <h3>Multi-Academia</h3>
            <p>Trabalha em mais de um local? Cadastre todos e vincule cada aluno.</p>
          </div>
          <div className="lw-bento-card">
            <div className="lw-bento-icon">📱</div>
            <h3>100% Mobile</h3>
            <p>Instale direto na tela inicial do celular. Funciona como app nativo, sem loja.</p>
            <div className="lw-bento-tag lw-bento-tag-orange">PWA</div>
          </div>
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="lw-steps">
        <div className="lw-section-header">
          <div className="lw-section-tag">Como funciona</div>
          <h2>Comece em <span className="lw-grad-orange">3 passos</span></h2>
          <p>Configuração rápida para você começar a organizar sua rotina.</p>
        </div>
        <div className="lw-steps-grid">
          <div className="lw-step">
            <div className="lw-step-num green">1</div>
            <h3>Crie sua conta</h3>
            <p>Cadastro rápido com email e senha. Sem burocracia, sem cartão.</p>
          </div>
          <div className="lw-step-divider"></div>
          <div className="lw-step">
            <div className="lw-step-num orange">2</div>
            <h3>Configure seu perfil</h3>
            <p>Adicione seus alunos, horários e defina o formato de cobrança.</p>
          </div>
          <div className="lw-step-divider"></div>
          <div className="lw-step">
            <div className="lw-step-num green">3</div>
            <h3>Comece a agendar</h3>
            <p>Crie sessões, controle pagamentos e acompanhe seu faturamento.</p>
          </div>
        </div>
      </section>

      {/* ── CTA dark ── */}
      <section className="lw-cta">
        <div className="lw-cta-inner">
          <div className="lw-cta-glow-green"></div>
          <div className="lw-cta-glow-orange"></div>
          <div className="lw-cta-badge">Comece hoje, é grátis</div>
          <h2>Pronto para <span className="lw-grad-orange">transformar</span><br />sua rotina?</h2>
          <p>Junte-se aos personal trainers que já usam o FitAgenda para organizar alunos, agenda e faturamento.</p>
          <Link to="/cadastro" className="lw-btn-cta">Criar conta grátis →</Link>
          <p className="lw-cta-note">Sem cartão de crédito · Acesso imediato</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lw-footer">
        <div className="lw-footer-inner">
          <div>
            <span className="lw-logo">FitAgenda</span>
            <p className="lw-footer-sub">Feito para personal trainers que levam a sério sua carreira.</p>
          </div>
          <div className="lw-footer-links">
            <Link to="/login">Entrar</Link>
            <Link to="/cadastro">Criar conta</Link>
          </div>
        </div>
        <div className="lw-footer-copy">© 2026 FitAgenda. Todos os direitos reservados.</div>
      </footer>

    </div>
  )
}
