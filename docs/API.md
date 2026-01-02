# API Documentation - InovToDo

## Visão Geral

A API do InovToDo fornece endpoints RESTful para gerenciamento de tarefas. Todos os endpoints requerem autenticação via sessão (Laravel Breeze).

**Base URL**: `/tasks`

**Autenticação**: Session-based (Laravel Sanctum)

**Content-Type**: `application/json`

**CSRF Protection**: Todos os requests POST/PUT/PATCH/DELETE requerem token CSRF.

## Autenticação

### Login

```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

**Response**
```json
{
  "success": true,
  "message": "Login successful"
}
```

### Logout

```http
POST /logout
```

### Verificar Autenticação

```http
GET /user
```

**Response**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "avatar": "avatars/user-1.png"
}
```

## Tarefas

### Listar Tarefas

Retorna uma lista paginada das tarefas do usuário autenticado.

```http
GET /tasks
Accept: application/json
```

**Query Parameters**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `status` | string | Filtrar por status: `completed`, `pending`, ou `all` |
| `priority` | string | Filtrar por prioridade: `high`, `medium`, `low` |
| `due_date` | date | Filtrar por data de vencimento (formato: Y-m-d) |
| `page` | integer | Número da página (padrão: 1) |

**Exemplo**
```http
GET /tasks?status=pending&priority=high&page=1
```

**Response (200 OK)**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Implementar testes",
      "description": "Criar testes unitários e de integração",
      "due_date": "2026-01-15",
      "priority": "high",
      "is_completed": false,
      "created_at": "2026-01-02T10:00:00.000000Z",
      "updated_at": "2026-01-02T10:00:00.000000Z"
    }
  ],
  "first_page_url": "http://example.com/tasks?page=1",
  "from": 1,
  "last_page": 1,
  "last_page_url": "http://example.com/tasks?page=1",
  "next_page_url": null,
  "path": "http://example.com/tasks",
  "per_page": 15,
  "prev_page_url": null,
  "to": 1,
  "total": 1
}
```

### Visualizar Tarefa

Retorna os detalhes de uma tarefa específica.

```http
GET /tasks/{id}
Accept: application/json
```

**Path Parameters**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | integer | ID da tarefa |

**Response (200 OK)**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Implementar testes",
  "description": "Criar testes unitários e de integração",
  "due_date": "2026-01-15",
  "priority": "high",
  "is_completed": false,
  "created_at": "2026-01-02T10:00:00.000000Z",
  "updated_at": "2026-01-02T10:00:00.000000Z"
}
```

**Errors**

- `403 Forbidden`: Usuário não tem permissão para visualizar a tarefa
- `404 Not Found`: Tarefa não encontrada

### Criar Tarefa

Cria uma nova tarefa para o usuário autenticado.

```http
POST /tasks
Content-Type: application/json
Accept: application/json
X-CSRF-TOKEN: {token}

{
  "title": "Nova tarefa",
  "description": "Descrição opcional",
  "due_date": "2026-01-20",
  "priority": "medium"
}
```

**Request Body**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `title` | string | Sim | Título da tarefa (máx: 255 caracteres) |
| `description` | string | Não | Descrição detalhada da tarefa |
| `due_date` | date | Não | Data de vencimento (formato: Y-m-d) |
| `priority` | enum | Sim | Prioridade: `high`, `medium`, ou `low` |

**Response (201 Created)**
```json
{
  "id": 2,
  "user_id": 1,
  "title": "Nova tarefa",
  "description": "Descrição opcional",
  "due_date": "2026-01-20",
  "priority": "medium",
  "is_completed": false,
  "created_at": "2026-01-02T11:00:00.000000Z",
  "updated_at": "2026-01-02T11:00:00.000000Z"
}
```

**Errors**

- `422 Unprocessable Entity`: Dados de validação inválidos

```json
{
  "message": "The title field is required.",
  "errors": {
    "title": [
      "The title field is required."
    ]
  }
}
```

### Atualizar Tarefa

Atualiza uma tarefa existente.

```http
PUT /tasks/{id}
Content-Type: application/json
Accept: application/json
X-CSRF-TOKEN: {token}

{
  "title": "Título atualizado",
  "description": "Nova descrição",
  "due_date": "2026-01-25",
  "priority": "low",
  "is_completed": true
}
```

**Path Parameters**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | integer | ID da tarefa |

**Request Body**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `title` | string | Não* | Título da tarefa (máx: 255 caracteres) |
| `description` | string | Não | Descrição detalhada da tarefa |
| `due_date` | date | Não | Data de vencimento (formato: Y-m-d) |
| `priority` | enum | Não* | Prioridade: `high`, `medium`, ou `low` |
| `is_completed` | boolean | Não | Status de conclusão |

\* Se fornecido, deve ser válido (validação com `sometimes|required`)

**Response (200 OK)**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Título atualizado",
  "description": "Nova descrição",
  "due_date": "2026-01-25",
  "priority": "low",
  "is_completed": true,
  "created_at": "2026-01-02T10:00:00.000000Z",
  "updated_at": "2026-01-02T12:00:00.000000Z"
}
```

**Errors**

- `403 Forbidden`: Usuário não tem permissão para atualizar a tarefa
- `404 Not Found`: Tarefa não encontrada
- `422 Unprocessable Entity`: Dados de validação inválidos

### Deletar Tarefa

Remove uma tarefa.

```http
DELETE /tasks/{id}
Accept: application/json
X-CSRF-TOKEN: {token}
```

**Path Parameters**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | integer | ID da tarefa |

**Response (200 OK)**
```json
{
  "message": "Task deleted successfully!"
}
```

**Errors**

- `403 Forbidden`: Usuário não tem permissão para deletar a tarefa
- `404 Not Found`: Tarefa não encontrada

### Alternar Conclusão

Alterna o status de conclusão de uma tarefa (completo ↔ pendente).

```http
PATCH /tasks/{id}/toggle
Accept: application/json
X-CSRF-TOKEN: {token}
```

**Path Parameters**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | integer | ID da tarefa |

**Response (200 OK)**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Implementar testes",
  "description": "Criar testes unitários e de integração",
  "due_date": "2026-01-15",
  "priority": "high",
  "is_completed": true,
  "created_at": "2026-01-02T10:00:00.000000Z",
  "updated_at": "2026-01-02T13:00:00.000000Z"
}
```

**Errors**

- `403 Forbidden`: Usuário não tem permissão para atualizar a tarefa
- `404 Not Found`: Tarefa não encontrada

## Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 401 | Unauthorized - Usuário não autenticado |
| 403 | Forbidden - Usuário autenticado mas sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 422 | Unprocessable Entity - Erro de validação |
| 500 | Internal Server Error - Erro no servidor |

## Validação

### Campos de Tarefa

**title**
- Obrigatório na criação
- Tipo: string
- Máximo: 255 caracteres
- Exemplo: `"Implementar autenticação"`

**description**
- Opcional
- Tipo: string
- Sem limite de tamanho
- Exemplo: `"Adicionar login com email e senha usando Laravel Breeze"`

**due_date**
- Opcional
- Tipo: date
- Formato: `Y-m-d` (ex: `2026-01-15`)
- Deve ser uma data válida

**priority**
- Obrigatório na criação
- Tipo: enum
- Valores aceitos: `high`, `medium`, `low`
- Exemplo: `"high"`

**is_completed**
- Opcional na criação (padrão: `false`)
- Tipo: boolean
- Valores aceitos: `true`, `false`, `0`, `1`

## Autorização

A aplicação usa Laravel Policies para controlar o acesso:

- **viewAny**: Qualquer usuário autenticado pode listar tarefas
- **view**: Usuário pode visualizar apenas suas próprias tarefas
- **create**: Qualquer usuário autenticado pode criar tarefas
- **update**: Usuário pode atualizar apenas suas próprias tarefas
- **delete**: Usuário pode deletar apenas suas próprias tarefas

### Exemplo de Erro de Autorização

```json
{
  "message": "This action is unauthorized."
}
```

## Rate Limiting

A API aplica rate limiting para prevenir abuso:

- **Limite**: 60 requisições por minuto por usuário autenticado
- **Header**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

### Exemplo de Headers

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
```

### Erro de Rate Limit

```json
{
  "message": "Too Many Requests"
}
```

## Exemplos de Uso

### JavaScript (Fetch API)

```javascript
// Listar tarefas
const getTasks = async () => {
  const response = await fetch('/tasks', {
    headers: {
      'Accept': 'application/json',
    },
  });
  return await response.json();
};

// Criar tarefa
const createTask = async (taskData) => {
  const csrf = document.querySelector('meta[name="csrf-token"]').content;

  const response = await fetch('/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-CSRF-TOKEN': csrf,
    },
    body: JSON.stringify(taskData),
  });

  return await response.json();
};

// Atualizar tarefa
const updateTask = async (id, taskData) => {
  const csrf = document.querySelector('meta[name="csrf-token"]').content;

  const response = await fetch(`/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-CSRF-TOKEN': csrf,
    },
    body: JSON.stringify(taskData),
  });

  return await response.json();
};

// Deletar tarefa
const deleteTask = async (id) => {
  const csrf = document.querySelector('meta[name="csrf-token"]').content;

  const response = await fetch(`/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'X-CSRF-TOKEN': csrf,
    },
  });

  return await response.json();
};

// Alternar conclusão
const toggleTask = async (id) => {
  const csrf = document.querySelector('meta[name="csrf-token"]').content;

  const response = await fetch(`/tasks/${id}/toggle`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'X-CSRF-TOKEN': csrf,
    },
  });

  return await response.json();
};
```

## Versionamento

**Versão Atual**: 1.0

Futuras versões da API serão versionadas na URL (ex: `/api/v2/tasks`).

## Suporte

Para reportar bugs ou solicitar funcionalidades, abra uma issue no repositório do GitHub.
