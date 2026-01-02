# InovToDo

Uma aplicação moderna de gerenciamento de tarefas (To-Do List) construída com Laravel 12 e Vue.js 3.

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel)
![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat-square&logo=vue.js)
![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat-square&logo=php)
![Tests](https://img.shields.io/badge/Tests-Passing-success?style=flat-square)

## Características

- ✅ **CRUD Completo de Tarefas** - Criar, visualizar, editar e deletar tarefas
- 🔐 **Autenticação Segura** - Sistema de login/registro com Laravel Breeze
- 🎨 **Interface Moderna** - UI responsiva com Tailwind CSS
- ⚡ **Performance Otimizada** - Lazy loading de componentes e cache de API
- 🔔 **Sistema de Notificações** - Feedback visual para todas as ações
- 🎯 **Filtros e Busca** - Filtrar por status, prioridade e data de vencimento
- ⌨️ **Atalhos de Teclado** - Ctrl+R para recarregar, Ctrl+F para focar no formulário
- 🧪 **Testes Automatizados** - Cobertura de testes unitários e de integração
- 📱 **Responsivo** - Funciona perfeitamente em desktop e mobile
- ♿ **Acessível** - Seguindo práticas de acessibilidade (ARIA)

## Tecnologias

### Backend
- **Laravel 12** - Framework PHP moderno
- **PHP 8.2+** - Linguagem de programação
- **MySQL/PostgreSQL/SQLite** - Banco de dados
- **Laravel Breeze** - Autenticação
- **PHPUnit** - Testes

### Frontend
- **Vue.js 3.5** - Framework JavaScript progressivo
- **Vite 7** - Build tool moderna e rápida
- **Tailwind CSS 4** - Framework CSS utility-first
- **Alpine.js** - JavaScript reativo
- **Vitest** - Framework de testes para Vue

## Requisitos

- PHP >= 8.2
- Composer
- Node.js >= 18
- NPM ou Yarn
- MySQL, PostgreSQL ou SQLite

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/InovToDo.git
cd InovToDo
```

### 2. Instale as dependências do PHP

```bash
composer install
```

### 3. Instale as dependências do Node.js

```bash
npm install
```

### 4. Configure o ambiente

```bash
cp .env.example .env
php artisan key:generate
```

Edite o arquivo `.env` e configure sua conexão com o banco de dados:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=inovtodo
DB_USERNAME=root
DB_PASSWORD=
```

### 5. Execute as migrations

```bash
php artisan migrate
```

### 6. (Opcional) Popule o banco com dados de teste

```bash
php artisan db:seed
```

### 7. Compile os assets

**Desenvolvimento:**
```bash
npm run dev
```

**Produção:**
```bash
npm run build
```

### 8. Inicie o servidor

```bash
php artisan serve
```

A aplicação estará disponível em `http://localhost:8000`

## Uso

### Criar uma Conta

1. Acesse `http://localhost:8000/register`
2. Preencha o formulário de registro
3. Faça login com suas credenciais

### Gerenciar Tarefas

**Criar Tarefa:**
- Preencha o formulário "Nova Tarefa"
- Campos obrigatórios: Título e Prioridade
- Campos opcionais: Descrição e Data de Vencimento

**Filtrar Tarefas:**
- Use os filtros na parte superior para filtrar por:
  - Status (Todas, Pendentes, Concluídas)
  - Prioridade (Alta, Média, Baixa)
  - Data de Vencimento

**Editar Tarefa:**
- Clique no ícone de edição (lápis)
- Modifique os campos desejados
- Clique em "Salvar"

**Concluir/Desmarcar Tarefa:**
- Clique no checkbox à esquerda da tarefa

**Deletar Tarefa:**
- Clique no ícone de lixeira
- Confirme a exclusão no modal

### Atalhos de Teclado

- `Ctrl + R` - Recarregar lista de tarefas
- `Ctrl + F` - Focar no campo de título do formulário

## Testes

### Testes Backend (PHPUnit)

Execute todos os testes:
```bash
php artisan test
```

Execute testes específicos:
```bash
php artisan test --filter TaskControllerTest
```

Gerar relatório de cobertura:
```bash
php artisan test --coverage
```

### Testes Frontend (Vitest)

Execute todos os testes:
```bash
npm run test
```

Execute testes em modo watch:
```bash
npm run test -- --watch
```

Execute testes com interface visual:
```bash
npm run test:ui
```

Gerar relatório de cobertura:
```bash
npm run test:coverage
```

### Estrutura de Testes

```
tests/
├── Feature/
│   ├── TaskControllerTest.php      # Testes de integração do controller
│   └── Auth/                       # Testes de autenticação
├── Unit/
│   ├── TaskModelTest.php           # Testes do model Task
│   └── TaskPolicyTest.php          # Testes da policy
└── JavaScript/
    ├── components/                 # Testes de componentes Vue
    │   ├── TaskForm.test.js
    │   ├── TaskItem.test.js
    │   └── NotificationToast.test.js
    └── composables/                # Testes de composables
        ├── useNotification.test.js
        └── useApiCache.test.js
```

## Documentação

- [Arquitetura](docs/ARCHITECTURE.md) - Visão detalhada da arquitetura da aplicação
- [API](docs/API.md) - Documentação completa da API REST

## Funcionalidades Principais

### Sistema de Tarefas

**Model Task:**
- Campos: `title`, `description`, `due_date`, `priority`, `is_completed`
- Scopes úteis: `completed()`, `pending()`, `byPriority()`, `overdue()`
- Relacionamento com User

**Prioridades:**
- Alta (high) - Badge vermelho
- Média (medium) - Badge amarelo
- Baixa (low) - Badge verde

**Indicadores:**
- Tarefas atrasadas são marcadas com "Atrasada" em vermelho
- Tarefas concluídas aparecem riscadas e com fundo cinza

### Sistema de Notificações

**Tipos de Notificações:**
- Success (verde) - Ações bem-sucedidas
- Error (vermelho) - Erros e falhas
- Warning (amarelo) - Avisos
- Info (azul) - Informações gerais

**Características:**
- Auto-dismiss após 5 segundos (configurável)
- Suporte a múltiplas notificações simultâneas
- Botão de fechar manual
- Animações suaves

### Cache de API

**Características:**
- Cache em localStorage com TTL de 5 minutos
- Invalidação automática após operações de escrita
- Reduz requisições ao servidor
- Melhora experiência offline

### Segurança

**Medidas Implementadas:**
- CSRF Protection em todos os formulários
- Authorization via Laravel Policies
- Security Headers (CSP, X-Frame-Options, etc.)
- Validação server-side obrigatória
- Sanitização de inputs
- Autenticação baseada em sessão

## Desenvolvimento

### Estrutura de Diretórios

```
app/
├── Http/
│   ├── Controllers/
│   │   └── TaskController.php
│   ├── Middleware/
│   └── Requests/
├── Models/
│   ├── Task.php
│   └── User.php
└── Policies/
    └── TaskPolicy.php

resources/
├── js/
│   ├── components/
│   │   ├── TodoApp.vue
│   │   ├── TaskForm.vue
│   │   ├── TaskList.vue
│   │   └── TaskItem.vue
│   └── composables/
│       ├── useNotification.js
│       ├── useApiCache.js
│       └── useKeyboardShortcuts.js
└── views/
    └── tasks/
        └── index.blade.php
```

### Padrões de Código

**Backend (PHP):**
- PSR-12 para style guide
- Laravel Pint para formatação automática
- DocBlocks para métodos públicos

```bash
# Formatar código PHP
./vendor/bin/pint
```

**Frontend (JavaScript/Vue):**
- ESLint com configuração Vue recomendada
- Prettier para formatação
- Composition API do Vue 3

### Comandos Úteis

**Laravel:**
```bash
# Limpar cache
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Executar migrations
php artisan migrate

# Reverter última migration
php artisan migrate:rollback

# Gerar model com migration e factory
php artisan make:model Task -mf

# Gerar controller
php artisan make:controller TaskController --resource
```

**NPM:**
```bash
# Instalar dependências
npm install

# Build para produção
npm run build

# Modo de desenvolvimento com hot reload
npm run dev

# Rodar testes
npm run test
```

## Deploy

### Preparação

1. Configure variáveis de ambiente em `.env`
2. Compile assets para produção: `npm run build`
3. Otimize autoloader: `composer install --optimize-autoloader --no-dev`
4. Cache de configuração: `php artisan config:cache`
5. Cache de rotas: `php artisan route:cache`
6. Cache de views: `php artisan view:cache`

### Servidor Web

Configure seu servidor web (Apache/Nginx) para apontar para a pasta `public/`.

**Nginx (exemplo):**
```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/InovToDo/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

## Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Guidelines

- Escreva testes para novas funcionalidades
- Siga os padrões de código do projeto
- Atualize a documentação conforme necessário
- Mantenha mensagens de commit claras e descritivas

## Roadmap

- [ ] Suporte a tags/categorias
- [ ] Anexos de arquivos em tarefas
- [ ] Compartilhamento de tarefas entre usuários
- [ ] Notificações por email
- [ ] API REST pública com versionamento
- [ ] Aplicativo mobile (React Native)
- [ ] Integração com calendários (Google Calendar, Outlook)
- [ ] Temas customizáveis
- [ ] Exportar tarefas (PDF, CSV)
- [ ] Subtarefas e dependências

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Autor

Desenvolvido com ❤️ por [Seu Nome]

## Suporte

Para reportar bugs ou solicitar funcionalidades, abra uma [issue](https://github.com/seu-usuario/InovToDo/issues) no GitHub.

---

**InovToDo** - Organize suas tarefas de forma simples e eficiente.
