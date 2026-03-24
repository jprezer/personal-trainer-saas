import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const links = [
    { to: '/', label: 'Início', icon: '⌂' },
    { to: '/agenda', label: 'Agenda', icon: '▦' },
    { to: '/alunos', label: 'Alunos', icon: '◉' },
    { to: '/financeiro', label: 'Financeiro', icon: '$' },
    { to: '/configuracoes', label: 'Config', icon: '⚙' },
  ]

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">FitAgenda</h1>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end={link.to === '/'}
            >
              <span className="nav-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="user-email">{user?.email}</span>
          <button className="btn-logout" onClick={handleLogout}>Sair</button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="mobile-header">
        <span className="logo">FitAgenda</span>
        <button className="btn-logout" onClick={handleLogout}>Sair</button>
      </header>

      <main className="main-content">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `bottom-nav-link ${isActive ? 'active' : ''}`}
            end={link.to === '/'}
          >
            <span className="bottom-nav-icon">{link.icon}</span>
            <span className="bottom-nav-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
