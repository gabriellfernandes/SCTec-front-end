# SCTEC Front-end

Interface web do projeto SCTEC para gerenciamento de empreendimentos catarinenses.

Aplicação construída com React + Vite para consumir a API do desafio e executar o fluxo completo de cadastro, listagem, edição e remoção de dados.

## Repositórios relacionados

- Front-end (este projeto): `https://github.com/gabriellfernandes/SCTec-front-end`
- Back-end: `https://github.com/gabriellfernandes/SCTec`

## Objetivo da solução

O front-end fornece uma área administrativa com foco em produtividade para operação do CRUD.

Fluxos principais:

- autenticação com perfis (`admin`, `editor`, `viewer`)
- gestão de empresas
- gestão de municípios
- gestão de segmentos
- edição de contatos por empresa

## Stack utilizada

- React 19
- TypeScript
- Vite
- React Router
- styled-components

## Estrutura do projeto

```text
src/
  app/
    router.tsx
    auth-guard.tsx
  components/
    auth/
    form/
    layout/
  hooks/
  pages/
    login/
    dashboard/
    enterprise/
  services/
    api/
    auth-session.ts
  styles/
  types/
```

## Funcionalidades implementadas

### Autenticação e sessão

- login via `POST /auth/login`
- validação de sessão via `GET /auth/me`
- persistência de token em storage local
- proteção de rotas privadas com guard

### Dashboard administrativo

Módulos disponíveis no menu lateral:

- Empresas
- Municípios
- Segmentos

Recursos de listagem:

- paginação
- ordenação por coluna
- filtros por contexto

### Empresas

- criação de empresa
- edição de empresa
- exclusão de empresa
- alternância de status ativo/inativo direto na listagem
- coluna de contatos com modal de visualização rápida

### Contatos da empresa

- fluxo orientado por edição da empresa
- cadastro/edição/remoção de contato
- suporte a múltiplos emails e telefones por contato
- validação de campos obrigatórios (`name`, `department`)

Regra de UX aplicada:

- no modo de criação da empresa, o bloco de contatos fica desabilitado
- após criar a empresa, o usuário é redirecionado para a tela de edição para cadastrar contatos

### Municípios e segmentos

- CRUD completo com feedback visual
- modais de confirmação para ações de risco

## Integração com API

Variável de ambiente:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Arquivo base:

- `.env.example`

Endpoints consumidos no front:

- `auth`
- `users` (quando necessário por perfil)
- `cities`
- `segments`
- `enterprises`
- `contacts`
- `contact-emails`
- `contact-phones`

## Como executar

No diretório `project/front-end`:

1. Instale dependências:

```bash
npm install
```

2. Configure ambiente:

```bash
cp .env.example .env
```

3. Inicie em desenvolvimento:

```bash
npm run dev
```

4. Build de produção:

```bash
npm run build
```

5. Preview local da build:

```bash
npm run preview
```

## Credenciais de acesso (seed do back-end)

- admin: `admin@sctec.local` / `admin1234`
- editor: `editor@sctec.local` / `edit1234`
- viewer: `viewer@sctec.local` / `view1234`

## Observações de documentação

- este repositório foca na experiência web e no consumo da API
- exemplos detalhados de request/response da API estão no repositório back-end

## Link do vídeo pitch

Adicionar o link público do vídeo (até 3 minutos):

- `https://...`
