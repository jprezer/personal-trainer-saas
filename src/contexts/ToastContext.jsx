import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((mensagem, tipo = 'sucesso', duracao = 3500) => {
    const id = ++idCounter
    setToasts((prev) => [...prev, { id, mensagem, tipo }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duracao)
  }, [])

  function remover(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.tipo}`}>
            <span className="toast-icon">
              {toast.tipo === 'sucesso' && '✓'}
              {toast.tipo === 'erro' && '✕'}
              {toast.tipo === 'aviso' && '⚠'}
            </span>
            <span className="toast-msg">{toast.mensagem}</span>
            <button className="toast-fechar" onClick={() => remover(toast.id)}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast deve ser usado dentro de ToastProvider')
  return ctx
}
