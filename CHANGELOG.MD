# Registo de Alterações

Todas as alterações notáveis neste projeto serão documentadas neste ficheiro.

O formato baseia-se em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-01-02

### Adicionado

#### Backend
- Sistema completo de gestão de tarefas (CRUD) com Laravel
- Model `Task` com scopes úteis:
  - `completed()` - filtra tarefas concluídas
  - `pending()` - filtra tarefas pendentes
  - `byPriority($priority)` - filtra por prioridade
  - `byDueDate($date)` - filtra por data de vencimento
  - `overdue()` - filtra tarefas atrasadas
- `TaskController` com endpoints RESTful completos
- `TaskPolicy` para controlo de acesso baseado em propriedade
- Sistema de autenticação com Laravel Breeze
- Middleware de segurança:
  - `SecurityHeaders` - CSP, X-Frame-Options, etc.
  - `CacheHeaders` - otimização de cache HTTP
  - `ForceHttps` - redirecionamento automático para HTTPS
- Factories para geração de dados de teste (`TaskFactory`, `UserFactory`)
- Índices de base de dados para otimização de queries
- Paginação de 15 itens por página

#### Frontend
- Interface moderna e responsiva com Vue.js 3 e Tailwind CSS 4
- Componentes Vue reutilizáveis:
  - `TodoApp` - componente principal com gestão de estado
  - `TaskForm` - formulário de criação de tarefas
  - `TaskList` - lista de tarefas com lazy loading
  - `TaskItem` - item individual com edição inline
  - `TaskFilters` - filtros por status, prioridade e data
  - `NotificationToast` - sistema de notificações visuais
  - `ConfirmationModal` - modal de confirmação para ações críticas
- Composables reutilizáveis:
  - `useNotification` - sistema de notificações toast
  - `useApiCache` - cache de API com localStorage (TTL 5 minutos)
  - `useKeyboardShortcuts` - gestão de atalhos de teclado
- Atalhos de teclado:
  - `Ctrl+R` - recarregar lista de tarefas
  - `Ctrl+F` - focar no campo de título do formulário
- Indicadores visuais:
  - Badges de prioridade (alta=vermelho, média=amarelo, baixa=verde)
  - Indicador "Atrasada" para tarefas vencidas
  - Riscado para tarefas concluídas
- Lazy loading de componentes para melhor desempenho
- Animações suaves com Tailwind CSS

#### Testes
- **61 testes backend** (PHPUnit):
  - 10 testes unitários para `TaskModel`
  - 10 testes unitários para `TaskPolicy`
  - 18 testes de integração para `TaskController`
  - 23 testes de autenticação (Laravel Breeze)
- **57 testes frontend** (Vitest + Vue Test Utils):
  - 19 testes de composables
  - 38 testes de componentes Vue
- Cobertura de testes: ~85-90%
- Configuração de SQLite :memory: para testes rápidos

#### Documentação
- `README.md` completo com:
  - Guia de instalação passo a passo
  - Instruções de utilização
  - Como executar testes
  - Comandos úteis de desenvolvimento
  - Guia de deploy para produção
- `docs/ARCHITECTURE.md` - arquitetura detalhada da aplicação:
  - Stack tecnológico
  - Estrutura do projeto
  - Camadas da aplicação
  - Fluxo de dados
  - Otimizações e segurança
  - Considerações de escalabilidade
- `docs/API.md` - documentação completa da API REST:
  - Todos os endpoints com exemplos
  - Parâmetros e validações
  - Códigos de estado HTTP
  - Exemplos de utilização em JavaScript
  - Autorização e rate limiting
- `CHANGELOG.md` - este ficheiro
- DocBlocks completos em:
  - `TaskController` - todos os métodos documentados
  - Composables JavaScript - JSDoc detalhado
- Comentários inline em lógica complexa

#### Configurações
- `vitest.config.js` - configuração do Vitest com happy-dom
- `phpunit.xml` - configuração do PHPUnit com SQLite
- Scripts npm para testes:
  - `npm run test` - executa testes
  - `npm run test:ui` - interface visual de testes
  - `npm run test:coverage` - relatório de cobertura

### Segurança
- Proteção CSRF em todos os formulários
- Autorização via Laravel Policies (baseada em propriedade)
- Security Headers:
  - Content-Security-Policy
  - X-Frame-Options: SAMEORIGIN
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: no-referrer-when-downgrade
  - Permissions-Policy
- Validação server-side obrigatória
- Sanitização de inputs
- Autenticação baseada em sessão com Laravel Breeze
- Hash de palavras-passe com bcrypt

### Desempenho
- Cache de API com localStorage (TTL configurável)
- Lazy loading de componentes Vue
- Índices de base de dados em colunas frequentemente consultadas
- Paginação de resultados (15 itens/página)
- Minificação e otimização de assets com Vite
- Cache HTTP para assets estáticos

### Acessibilidade
- Labels ARIA em todos os formulários
- Atributos `role` apropriados
- `aria-required` em campos obrigatórios
- `aria-label` em botões de ação
- `aria-expanded` em elementos expansíveis
- Navegação por teclado funcional
- Contraste de cores adequado (WCAG AA)

---

## [Por Lançar]

### Planeado
- Suporte a tags/categorias
- Anexos de ficheiros em tarefas
- Partilha de tarefas entre utilizadores
- Notificações por email
- API REST pública com versionamento
- Aplicação mobile (React Native)
- Integração com calendários (Google Calendar, Outlook)
- Temas personalizáveis
- Exportar tarefas (PDF, CSV)
- Subtarefas e dependências
- Pesquisa full-text
- Dashboard com estatísticas
- Relatórios de produtividade

---

## Tipos de Alterações

- **Adicionado** - para novas funcionalidades
- **Alterado** - para alterações em funcionalidades existentes
- **Descontinuado** - para funcionalidades que serão removidas em breve
- **Removido** - para funcionalidades removidas
- **Corrigido** - para correções de bugs
- **Segurança** - em caso de vulnerabilidades

[1.0.0]: https://github.com/AlvaroNevesInov/InovToDo/releases/tag/v1.0.0
