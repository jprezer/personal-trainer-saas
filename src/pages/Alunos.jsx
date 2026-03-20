import EmptyState from '../components/EmptyState'

export default function Alunos() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Alunos</h1>
      </header>
      <EmptyState
        titulo="Nenhum aluno cadastrado"
        descricao="O CRUD de alunos será implementado no Sprint 2"
      />
    </div>
  )
}
