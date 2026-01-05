# 🚀 Guia de Deploy - InovToDo

## Deploy Gratuito no Railway

### Pré-requisitos
- Conta no GitHub
- Conta no Railway (https://railway.app)

### Passos para Deploy

#### 1️⃣ Preparar o Repositório

Certifique-se de que todas as alterações estão commitadas e pushadas para o GitHub:

```bash
git add .
git commit -m "Preparar para deploy"
git push origin main
```

#### 2️⃣ Configurar no Railway

1. Acesse https://railway.app e faça login com GitHub
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Escolha o repositório **InovToDo**
5. O Railway detectará automaticamente o Dockerfile

#### 3️⃣ Configurar Variáveis de Ambiente

No painel do Railway, vá em **Variables** e adicione:

```bash
APP_NAME=InovToDo
APP_ENV=production
APP_DEBUG=false
APP_URL=https://seu-app.railway.app  # Será fornecido pelo Railway

DB_CONNECTION=sqlite

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

LOG_CHANNEL=stack
LOG_LEVEL=error
```

**IMPORTANTE:** Clique em **"Generate"** ao lado de `APP_KEY` para gerar uma chave aleatória.

#### 4️⃣ Deploy Automático

- O Railway fará o build e deploy automaticamente
- Aguarde alguns minutos (primeira vez pode demorar 5-10 min)
- Você verá os logs em tempo real

#### 5️⃣ Acessar a Aplicação

1. No painel do Railway, vá em **Settings**
2. Em **Networking**, clique em **Generate Domain**
3. Seu app estará disponível em `https://[seu-projeto].railway.app`

### 🔄 Atualizações Futuras

Qualquer push para o branch `main` fará deploy automático:

```bash
git add .
git commit -m "Sua mensagem"
git push origin main
```

### 📊 Monitoramento

- **Logs**: Veja logs em tempo real no painel do Railway
- **Métricas**: CPU, RAM e Network usage disponíveis no dashboard
- **Alertas**: Configure notificações para erros

### 🆓 Limites do Plano Gratuito

- **$5 USD/mês** de crédito gratuito
- Suficiente para ~500 horas/mês
- App hiberna após inatividade (acorda automaticamente no primeiro acesso)

### 🐛 Troubleshooting

**App não inicia:**
- Verifique os logs no Railway
- Certifique-se de que APP_KEY está definida
- Confirme que todas as variáveis de ambiente estão corretas

**Erro 500:**
- Ative `APP_DEBUG=true` temporariamente para ver detalhes
- Verifique se as migrations rodaram (`php artisan migrate --force`)

**Assets não carregam:**
- Confirme que `npm run build` foi executado
- Verifique se a pasta `public/build` existe

### 🎯 Alternativas Gratuitas

Se quiser explorar outras opções:

1. **Render** (https://render.com)
   - 750 horas/mês grátis
   - PostgreSQL grátis

2. **Fly.io** (https://fly.io)
   - 3 VMs grátis
   - Ótimo para Laravel

3. **Heroku** (pago)
   - $5/mês mínimo
   - Mais estável, mas não tem tier gratuito

## 📝 Notas

- O SQLite é perfeito para projetos pequenos/médios
- Para produção com muito tráfego, considere PostgreSQL ou MySQL
- Os dados persistem enquanto o container estiver rodando
- Para persistência garantida, configure um volume no Railway

## ✅ Checklist de Deploy

- [ ] Código commitado e pushado para GitHub
- [ ] Conta criada no Railway
- [ ] Projeto criado no Railway
- [ ] Variáveis de ambiente configuradas
- [ ] APP_KEY gerada
- [ ] Build completado com sucesso
- [ ] Domínio gerado
- [ ] App acessível no navegador
- [ ] Tarefas criando e deletando corretamente

---

**Criado com ❤️ usando Laravel 12 + Vue 3 + Tailwind CSS**
