import EmptyState from '../components/EmptyState'

export default function Agenda() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Agenda</h1>
      </header>
      <EmptyState
        titulo="Agenda em construção"
        descricao="A visualização semanal será implementada no Sprint 3"
      />
    </div>
  )
}
