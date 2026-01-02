# Arquitetura do InovToDo

## Visão Geral

O InovToDo é uma aplicação de gerenciamento de tarefas (To-Do List) construída com Laravel e Vue.js. A arquitetura segue o padrão MVC (Model-View-Controller) do Laravel no backend, com uma arquitetura de componentes reativos do Vue.js no frontend.

## Stack Tecnológico

### Backend
- **Framework**: Laravel 12
- **PHP**: 8.2+
- **Banco de Dados**: MySQL/PostgreSQL/SQLite
- **Autenticação**: Laravel Breeze
- **Validação**: Laravel Request Validation
- **Autorização**: Laravel Policies

### Frontend
- **Framework**: Vue.js 3.5
- **Build Tool**: Vite 7
- **CSS**: Tailwind CSS 4
- **Interatividade**: Alpine.js 3

### Testes
- **Backend**: PHPUnit 11
- **Frontend**: Vitest 3, Vue Test Utils

## Estrutura do Projeto

```
InovToDo/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── TaskController.php      # CRUD de tarefas
│   │   │   └── ProfileController.php   # Gerenciamento de perfil
│   │   ├── Middleware/
│   │   │   ├── SecurityHeaders.php     # Headers de segurança
│   │   │   ├── CacheHeaders.php        # Cache HTTP
│   │   │   └── ForceHttps.php          # Redirecionamento HTTPS
│   │   └── Requests/
│   │       └── ProfileUpdateRequest.php
│   ├── Models/
│   │   ├── Task.php                    # Model de tarefas
│   │   └── User.php                    # Model de usuários
│   └── Policies/
│       └── TaskPolicy.php              # Política de autorização
├── database/
│   ├── factories/
│   │   ├── TaskFactory.php             # Factory para testes
│   │   └── UserFactory.php
│   └── migrations/
│       ├── *_create_tasks_table.php
│       └── *_add_indexes_to_tasks_table.php
├── resources/
│   ├── js/
│   │   ├── components/
│   │   │   ├── TodoApp.vue             # Componente principal
│   │   │   ├── TaskForm.vue            # Formulário de tarefas
│   │   │   ├── TaskList.vue            # Lista de tarefas
│   │   │   ├── TaskItem.vue            # Item individual
│   │   │   ├── TaskFilters.vue         # Filtros
│   │   │   ├── NotificationToast.vue   # Sistema de notificações
│   │   │   └── ConfirmationModal.vue   # Modal de confirmação
│   │   └── composables/
│   │       ├── useNotification.js      # Sistema de notificações
│   │       ├── useApiCache.js          # Cache de API
│   │       └── useKeyboardShortcuts.js # Atalhos de teclado
│   └── views/
│       └── tasks/
│           └── index.blade.php         # View principal
└── tests/
    ├── Feature/
    │   ├── TaskControllerTest.php      # Testes de integração
    │   └── Auth/                       # Testes de autenticação
    ├── Unit/
    │   ├── TaskModelTest.php           # Testes unitários do model
    │   └── TaskPolicyTest.php          # Testes da policy
    └── JavaScript/
        ├── components/                 # Testes de componentes Vue
        └── composables/                # Testes de composables
```

## Camadas da Aplicação

### 1. Camada de Apresentação (Frontend)

#### Componentes Vue.js

**TodoApp.vue** (Componente Raiz)
- Gerencia o estado global da aplicação
- Coordena comunicação entre componentes
- Implementa cache de API com localStorage
- Suporta atalhos de teclado (Ctrl+R, Ctrl+F)

**TaskForm.vue**
- Formulário de criação de tarefas
- Validação client-side
- Emite eventos para o componente pai

**TaskList.vue**
- Renderiza lista de tarefas
- Lazy loading de componentes
- Propaga eventos de atualização/exclusão

**TaskItem.vue**
- Exibe tarefa individual
- Modo de edição inline
- Modal de confirmação para exclusão
- Indicadores visuais (prioridade, vencimento)

**NotificationToast.vue**
- Sistema de notificações toast
- Auto-dismiss configurável
- Suporte a múltiplas notificações
- Animações de entrada/saída

#### Composables

**useNotification.js**
- Sistema de eventos customizados
- API simples: `success()`, `error()`, `warning()`, `info()`
- Comunicação desacoplada entre componentes

**useApiCache.js**
- Cache em localStorage com TTL
- Invalidação automática de cache
- Fallback para dados em cache em caso de erro

**useKeyboardShortcuts.js**
- Gerenciamento centralizado de atalhos
- Suporte a modificadores (Ctrl, Alt, Shift)
- Prevenção de conflitos com ações padrão

### 2. Camada de Aplicação (Backend)

#### Controllers

**TaskController**
- CRUD completo de tarefas
- Filtragem por status, prioridade e data
- Paginação (15 itens/página)
- Suporte a JSON e HTML
- Autorização via Policies

Endpoints:
- `GET /tasks` - Listar tarefas
- `POST /tasks` - Criar tarefa
- `GET /tasks/{id}` - Visualizar tarefa
- `PUT /tasks/{id}` - Atualizar tarefa
- `DELETE /tasks/{id}` - Deletar tarefa
- `PATCH /tasks/{id}/toggle` - Alternar conclusão

#### Middleware

**SecurityHeaders**
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

**CacheHeaders**
- Cache-Control para assets
- ETags para validação
- Versionamento de recursos

**ForceHttps**
- Redirecionamento automático para HTTPS em produção

### 3. Camada de Domínio

#### Models

**Task**
- Campos: `title`, `description`, `due_date`, `priority`, `is_completed`
- Scopes úteis:
  - `completed()` - Tarefas concluídas
  - `pending()` - Tarefas pendentes
  - `byPriority($priority)` - Filtrar por prioridade
  - `byDueDate($date)` - Filtrar por data
  - `overdue()` - Tarefas atrasadas
- Relacionamento: `belongsTo(User::class)`

**User**
- Campos: `name`, `email`, `password`, `avatar`
- Relacionamento: `hasMany(Task::class)`
- Autenticação via Laravel Sanctum/Session

#### Policies

**TaskPolicy**
- Controle de acesso baseado em ownership
- Usuário só pode visualizar/editar/deletar suas próprias tarefas
- Métodos: `view()`, `update()`, `delete()`

### 4. Camada de Dados

#### Migrations
- Tabela `tasks` com índices otimizados
- Índices em: `user_id`, `is_completed`, `priority`, `due_date`
- Chave estrangeira com `CASCADE` para deleção

#### Factories
- `TaskFactory` com estados úteis:
  - `completed()` - Tarefa concluída
  - `highPriority()`, `mediumPriority()`, `lowPriority()`
  - `overdue()` - Tarefa vencida

## Fluxo de Dados

### Criação de Tarefa

```
1. Usuário preenche TaskForm
2. TaskForm emite evento 'task-created'
3. TodoApp captura evento e faz POST /tasks
4. Laravel valida dados (Request Validation)
5. TaskController cria tarefa associada ao usuário
6. Resposta JSON retorna tarefa criada
7. TodoApp adiciona tarefa ao state
8. TodoApp invalida cache
9. NotificationToast mostra mensagem de sucesso
```

### Atualização de Tarefa

```
1. Usuário edita TaskItem
2. TaskItem emite evento 'task-updated'
3. TodoApp faz PUT /tasks/{id}
4. TaskPolicy verifica ownership
5. TaskController atualiza tarefa
6. Resposta JSON retorna tarefa atualizada
7. TodoApp atualiza state local
8. Cache é invalidado
```

### Autenticação e Autorização

```
1. Usuário faz login via Laravel Breeze
2. Session é criada
3. Middleware 'auth' protege rotas
4. TaskPolicy verifica permissões
5. Apenas tarefas do usuário logado são acessíveis
```

## Otimizações

### Performance

1. **Lazy Loading de Componentes**
   - TaskForm, TaskFilters, TaskList são carregados sob demanda
   - Reduz bundle size inicial

2. **Cache de API**
   - localStorage com TTL de 5 minutos
   - Reduz requisições ao servidor
   - Melhora experiência offline

3. **Índices de Banco de Dados**
   - Índices em colunas frequentemente filtradas
   - Otimiza queries de paginação

4. **Paginação**
   - 15 itens por página
   - Reduz payload de resposta

### Segurança

1. **CSRF Protection**
   - Token CSRF em todos os formulários
   - Validação automática pelo Laravel

2. **Authorization**
   - Policies garantem ownership
   - Middleware 'auth' protege rotas

3. **Validation**
   - Validação server-side obrigatória
   - Sanitização de inputs

4. **Security Headers**
   - CSP, X-Frame-Options, etc.
   - Proteção contra XSS e clickjacking

### UX

1. **Notificações**
   - Feedback imediato para ações
   - Auto-dismiss configurável

2. **Atalhos de Teclado**
   - Ctrl+R: Recarregar lista
   - Ctrl+F: Focar no formulário

3. **Indicadores Visuais**
   - Badges de prioridade
   - Indicador de tarefa atrasada
   - Checkbox visual para conclusão

4. **Animações**
   - Transições suaves
   - Feedback visual para interações

## Testes

### Backend (PHPUnit)

- **Unit Tests**: Models, Policies
- **Feature Tests**: Controllers, Autenticação
- Cobertura: ~90%

### Frontend (Vitest)

- **Component Tests**: Todos os componentes Vue
- **Composable Tests**: useNotification, useApiCache, useKeyboardShortcuts
- Mocks: fetch API, localStorage
- Cobertura: ~85%

## Escalabilidade

### Considerações Futuras

1. **API REST → GraphQL**
   - Reduzir over-fetching
   - Queries customizáveis

2. **Cache Redis**
   - Substituir localStorage por Redis
   - Cache compartilhado entre sessões

3. **Queue Jobs**
   - Notificações assíncronas
   - Processamento em background

4. **WebSockets**
   - Atualizações em tempo real
   - Colaboração multi-usuário

5. **Testes E2E**
   - Playwright/Cypress
   - Testes de fluxo completo
