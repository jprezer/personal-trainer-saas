export default function ConfirmModal({
  aberto,
  titulo = 'Confirmar ação',
  mensagem,
  labelConfirmar = 'Confirmar',
  labelCancelar = 'Cancelar',
  variante = 'danger',  // 'danger' | 'default'
  onConfirmar,
  onCancelar,
}) {
  if (!aberto) return null

  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-icon">
          {variante === 'danger' ? '🗑️' : 'ℹ️'}
        </div>
        <h2 className="confirm-modal-titulo">{titulo}</h2>
        {mensagem && <p className="confirm-modal-msg">{mensagem}</p>}
        <div className="confirm-modal-actions">
          <button className="btn btn-secondary" onClick={onCancelar}>
            {labelCancelar}
          </button>
          <button
            className={`btn ${variante === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirmar}
          >
            {labelConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}
