# FitAgenda — Personal Trainer SaaS

## Stack
- **React 19 + Vite** — frontend
- **Supabase** (PostgreSQL + Auth + RLS) — backend, projeto `avpknlnqiahxkegrxvia`
- **React Router v6** — navegação
- **Deploy:** Vercel, auto-deploy no push para `main`
- **Dev:** `npm run dev` → localhost:5173

## Variáveis de ambiente
O arquivo `.env` está presente localmente mas não commitado. No outro computador, criar `.env` na raiz:
```
VITE_SUPABASE_URL=https://avpknlnqiahxkegrxvia.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGtubG5xaWFoeGtlZ3J4dmlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMTM1ODMsImV4cCI6MjA4OTU4OTU4M30.LrMmWUNICEA36egf9Ed3IoF0jbU02Loh51VEOPO6zKA
```

## Estrutura de rotas
```
/                → LandingPage (pública)
/login           → Login
/cadastro        → Cadastro
/onboarding      → Onboarding (protegida) — só perfil, academia/disponibilidade são Sprint 5
/dashboard       → Dashboard (protegida)
/agenda          → Agenda semanal (protegida)
/alunos          → Lista de alunos (protegida)
/alunos/:id      → Detalhe do aluno (protegida)
/financeiro      → Controle financeiro (protegida)
/configuracoes   → Configurações (protegida)
```

## Identidade visual
- **Tema:** fundo branco, cards em `#f8f8f8`, bordas claras
- **Accent verde:** `#059669` (logo, links ativos, accent)
- **Accent laranja:** `#f97316` (botões primários, CTAs)
- **Sistema de CSS variables** em `src/index.css` — todos os componentes usam `var(--bg)`, `var(--text)`, etc.
- **Fontes:** DM Sans (corpo) + DM Mono (mono/números)
- **Não usar temas escuros** — a identidade branca/clara é a definitiva

## Regras de negócio implementadas
- **Sobreposição de horários:** `useSessoes.js` bloqueia agendamento se outro aluno já tem sessão no mesmo horário (considera duração). Ex: sessão às 08:00 de 60min bloqueia 08:00–08:59.
- **Sessões têm status:** `agendada`, `realizada`, `cancelada`, `falta`
- **Valor por sessão:** cada aluno tem `valor_sessao`, editável inline na tela de Financeiro
- **Pagamento:** cada sessão tem flag `pago` (boolean), marcada diretamente na tela Financeiro

## Funcionalidades por página

### Dashboard
- Métricas: alunos ativos, sessões hoje, sessões do mês, receita do mês
- Lista de próximas sessões do dia

### Agenda
- Visualização semanal (7 colunas)
- Botão `+` por dia abre modal para criar sessão
- Clique na sessão abre modal de detalhe com troca de status
- Navegação por semana (anterior/próxima)

### Alunos
- Grid de cards com busca por nome
- Detalhe do aluno: dados completos, sessões recentes, editar perfil, excluir

### Financeiro
- Filtro por mês
- Lista todas as sessões com: data, aluno, academia, status, valor (editável), botão pago/pendente
- Totais: total do mês e total pago

### Configurações
- Aba **Perfil:** nome, CREF, bio, telefone, especialidades
- Abas **Academias** e **Disponibilidade** estão desabilitadas com badge "em breve" (aguardando Sprint 5)

## Hooks
- `useAlunos` — CRUD de alunos
- `useSessoes` — CRUD de sessões + validação de sobreposição
- `useAcademias` — academias do personal (usado internamente)
- `useDisponibilidades` — disponibilidades por dia/academia
- `useProfile` — perfil do usuário autenticado

## Mobile
- Sidebar desktop escondida em `max-width: 768px`
- Header móvel sticky no topo
- Bottom nav fixo com 5 ícones (Início, Agenda, Alunos, Financeiro, Config)
- Modais viram bottom sheets no mobile (slide de baixo)

## Próximas sprints pendentes

### Sprint 5 — Academias e Disponibilidade
- Tela para cadastrar/editar academias vinculadas ao personal
- Tela para configurar horários disponíveis por dia da semana e academia
- Validação de disponibilidade ao criar sessão

### Ideias futuras
- Notificações / lembretes de sessão
- Relatórios de desempenho por aluno
- Exportar financeiro como PDF/CSV
- App mobile nativo (React Native)

## Fluxo de autenticação
1. Novo usuário → `/cadastro` → cria conta Supabase → redireciona `/onboarding`
2. Onboarding → preenche perfil → redireciona `/dashboard`
3. Login existente → `/login` → redireciona `/dashboard`
4. Usuário logado em `/` vê botão "Acessar painel" → `/dashboard`

## Convenções de código
- Componentes em PascalCase, hooks em camelCase com prefixo `use`
- CSS por arquivo: cada página tem seu `.css` para estilos específicos; design system global em `src/index.css`
- Classes CSS com prefixo por contexto: `lw-` (landing), `agenda-`, `financeiro-`, etc.
- Português no código e nos textos da UI
