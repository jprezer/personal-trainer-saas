import { useState, useEffect } from 'react'

/**
 * Detecta se está no iOS Safari
 */
function isIosSafari() {
  const ua = window.navigator.userAgent
  const isIos = /iphone|ipad|ipod/i.test(ua)
  const isSafari = /safari/i.test(ua) && !/chrome/i.test(ua) && !/crios/i.test(ua)
  return isIos && isSafari
}

/**
 * Detecta se já está instalado como PWA (modo standalone)
 */
function jaInstalado() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
}

export default function InstallPWA() {
  // deferredPrompt: evento beforeinstallprompt capturado (Android/Chrome)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [mostrarBanner, setMostrarBanner] = useState(false)
  const [mostrarIos, setMostrarIos] = useState(false)
  const [instalando, setInstalando] = useState(false)

  useEffect(() => {
    // Não mostra nada se já está instalado
    if (jaInstalado()) return

    // Já dispensou antes nesta sessão
    if (sessionStorage.getItem('pwa-dispensado')) return

    // Android / Chrome — captura o evento nativo
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setMostrarBanner(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // iOS Safari — mostra instruções manuais
    if (isIosSafari()) {
      // Pequeno delay para não aparecer na primeira abertura
      const t = setTimeout(() => setMostrarBanner(true), 3000)
      return () => {
        clearTimeout(t)
        window.removeEventListener('beforeinstallprompt', handler)
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function dispensar() {
    sessionStorage.setItem('pwa-dispensado', '1')
    setMostrarBanner(false)
    setMostrarIos(false)
  }

  async function instalar() {
    if (!deferredPrompt) {
      // iOS: mostra modal com instruções
      setMostrarIos(true)
      return
    }

    // Android: abre prompt nativo do browser
    setInstalando(true)
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setMostrarBanner(false)
    setInstalando(false)
    if (outcome === 'accepted') sessionStorage.setItem('pwa-dispensado', '1')
  }

  if (!mostrarBanner) return null

  return (
    <>
      {/* Banner de instalação */}
      <div className="pwa-banner">
        <div className="pwa-banner-icone">📲</div>
        <div className="pwa-banner-texto">
          <span className="pwa-banner-titulo">Instale o FitAgenda</span>
          <span className="pwa-banner-desc">Acesse direto da tela inicial, sem abrir o browser</span>
        </div>
        <div className="pwa-banner-acoes">
          <button className="btn btn-primary pwa-btn-instalar" onClick={instalar} disabled={instalando}>
            {instalando ? '...' : 'Instalar'}
          </button>
          <button className="pwa-btn-fechar" onClick={dispensar} aria-label="Dispensar">✕</button>
        </div>
      </div>

      {/* Modal iOS com instruções passo a passo */}
      {mostrarIos && (
        <div className="pwa-ios-overlay" onClick={dispensar}>
          <div className="pwa-ios-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pwa-ios-header">
              <span className="pwa-ios-titulo">Adicionar à tela inicial</span>
              <button className="pwa-btn-fechar" onClick={dispensar}>✕</button>
            </div>
            <ol className="pwa-ios-passos">
              <li>
                <span className="pwa-ios-num">1</span>
                <span>Toque no botão de compartilhamento</span>
                <span className="pwa-ios-icone">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline points="16 6 12 2 8 6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                </span>
              </li>
              <li>
                <span className="pwa-ios-num">2</span>
                <span>Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong></span>
              </li>
              <li>
                <span className="pwa-ios-num">3</span>
                <span>Toque em <strong>"Adicionar"</strong> para confirmar</span>
              </li>
            </ol>
            <div className="pwa-ios-seta" />
          </div>
        </div>
      )}
    </>
  )
}
