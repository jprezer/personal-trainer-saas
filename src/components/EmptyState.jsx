export default function EmptyState({ titulo, descricao, acao, onAcao }) {
  return (
    <div className="empty-state">
      <p className="empty-state-titulo">{titulo}</p>
      {descricao && <p className="empty-state-descricao">{descricao}</p>}
      {acao && (
        <button className="btn btn-primary" onClick={onAcao}>
          {acao}
        </button>
      )}
    </div>
  )
}
