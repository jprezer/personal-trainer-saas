import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Dashboard from './pages/Dashboard'
import Agenda from './pages/Agenda'
import Alunos from './pages/Alunos'
import Configuracoes from './pages/Configuracoes'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/agenda" element={
            <ProtectedRoute>
              <Layout><Agenda /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/alunos" element={
            <ProtectedRoute>
              <Layout><Alunos /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/configuracoes" element={
            <ProtectedRoute>
              <Layout><Configuracoes /></Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
