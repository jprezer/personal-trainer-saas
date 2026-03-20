export default function Modal({ aberto, onFechar, titulo, children }) {
  if (!aberto) return null

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{titulo}</h2>
          <button className="modal-fechar" onClick={onFechar}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}
