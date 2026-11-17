# Blog — Mobile

Aplicação mobile do blog, responsável pela listagem, leitura, criação e administração de posts. Consome a API do backend via HTTP.

## Tecnologias utilizadas

- **Expo SDK 58** — framework para desenvolvimento de apps React Native com file-based routing via Expo Router.
- **React Native 0.88** — biblioteca de componentes para interfaces nativas.
- **Expo Router 58** — roteamento baseado em arquivos (`src/app/`), com navegador tipo Stack.
- **React 19** — biblioteca de componentes, com o **React Compiler** habilitado para otimizar re-renderizações automaticamente.
- **TypeScript** — tipagem estática para os dados da aplicação (posts, usuários, comentários).
- **Expo Secure Store** — armazenamento seguro do token de autenticação no dispositivo.
- **Expo Image** — exibição otimizada de imagens.
- **lucide-react-native** — ícones da interface.

## Comunicação do mobile com o backend

Todas as chamadas HTTP ficam centralizadas em `src/lib/api.ts`. A URL do backend é `http://localhost:3001`. A autenticação é feita via token salvo no `expo-secure-store` (chave `blog_auth`), enviado como header `Authorization: Basic <token>` em cada requisição.

## Modo com dados mockados

O app pode rodar sem backend, utilizando dados mockados locais em `src/lib/mockData.ts` e `src/lib/mock-api.ts`. Útil para desenvolvimento offline ou demonstrações.

### Como ativar o modo mock

| Comando                                     | Descrição                                |
| ------------------------------------------- | ---------------------------------------- |
| `npx expo start`                            | Roda com a API real (backend necessário) |
| `EXPO_PUBLIC_MOCK_DATA=true npx expo start` | Roda com dados mockados locais           |
| `npm run start:mock`                        | Atalho para rodar com dados mockados     |
| `npm run android:mock`                      | Roda no Android com dados mockados       |
| `npm run ios:mock`                          | Roda no iOS com dados mockados           |
| `npm run web:mock`                          | Roda na web com dados mockados           |

Quando o modo mock está ativo, as operações de criar, editar, excluir e publicar posts e usuários são refletidas em memória durante a sessão do app.

## Pré-requisitos

- [Node.js](https://nodejs.org/) ou [Bun](https://bun.sh) instalado
- Backend do blog rodando (local na porta `3001` ou publicado em uma URL acessível) se não usar o modo mock

## Como rodar o projeto

1. Instale as dependências:

   ```bash
   npm install
   # ou
   bun install
   ```

2. Garanta que o backend está disponível (se não usar modo mock):
   - **Local**: suba o backend na porta `3001` (em outro terminal, no repositório do backend).
   - **Publicado**: ajuste `API_BASE_URL` em `src/lib/api.ts`.

3. Rode o app em modo desenvolvimento:

   ```bash
   npm start
   # ou
   bun start
   ```

4. Para usar dados mockados:

   ```bash
   npm run start:mock
   ```

5. Abra o app no simulador, emulador, dispositivo físico ou navegador (Expo Go / desenvolvimento web).

## Scripts disponíveis

| Comando                | Descrição                                    |
| ---------------------- | -------------------------------------------- |
| `npm start`            | Inicia o servidor de desenvolvimento do Expo |
| `npm run start:mock`   | Inicia o Expo com dados mockados locais      |
| `npm run android`      | Inicia o servidor para Android               |
| `npm run android:mock` | Inicia para Android com dados mockados       |
| `npm run ios`          | Inicia o servidor para iOS                   |
| `npm run ios:mock`     | Inicia para iOS com dados mockados           |
| `npm run web`          | Inicia o servidor para web                   |
| `npm run web:mock`     | Inicia para web com dados mockados           |
| `npm run lint`         | Verifica o código com ESLint                 |
| `npx tsc --noEmit`     | Verifica tipagem com TypeScript              |

## Estrutura básica de páginas

- `/` (index) — lista de posts publicados (grid), busca por palavra-chave, atalhos rápidos por papel
- `/login` — autenticação (email + senha)
- `/posts/[id]` — detalhe de um post (conteúdo completo + comentários)
- `/posts/[id]/edit` — edição de post (docente + admin)
- `/posts/new` — criação de post (docente + admin)
- `/admin/posts` — administração de posts (docente + admin): editar, publicar/mover para rascunho, excluir, recuperar
- `/teachers` — lista de professores (admin apenas)
- `/teachers/new` — criar professor (admin apenas)
- `/teachers/[id]/edit` — editar professor (admin apenas)
- `/students` — lista de alunos (docente + admin)
- `/students/new` — criar aluno (docente + admin)
- `/students/[id]/edit` — editar aluno (docente + admin)

## Fluxo de autenticação e autorização

Apenas usuários logados têm acesso ao aplicativo. Cada papel (role) visualiza e acessa conforme suas permissões:

- **Discente (aluno)**: visualiza posts publicados, comenta posts que aceitem comentários.
- **Docente (professor)**: tudo do discente + cria/edita posts, gerencia alunos (CRUD completo).
- **Admin**: tudo do docente + gerencia professores (CRUD completo).

Contas de teste (modo real ou mock):

```text
ana@docente.com / prof1        (docente)
joao@docente.com / prof2       (docente)
maria@discente.com / discente1 (discente)
pedro@discente.com / discente2 (discente)
admin@admin.com / admin123     (admin)
```

## Notas e Ressalvas

- A Context API foi utilizada para prover informações do usuário logado (email, nome, role) em toda a aplicação.
- Existe suporte a **swipe para voltar** (gesture de deslizar da esquerda para a direita) em todas as telas com histórico de navegação.
- Os menus suspensos (dropdown) mostram: nome, email e logout (botão do usuário, canto superior esquerdo) e rotas disponíveis conforme o papel (hamburguer, canto superior direito).
- A autenticação é simplificada (token Base64 com email:senha), apenas para exemplo de funcionalidade. Em ambiente produtivo usaria JWT, sessão segura e provedor externo de autenticação.
- Os fluxos mapeados incluíram:
  - Home (`/`): grid de posts publicados, busca por palavra-chave, atalhos condicionais por papel.
  - Login (`/login`): fluxo de login com validação simples e redirecionamento automático para a home após autenticar.
  - Detalhe do Post (`/posts/[id]`): conteúdo completo, opção de comentar (se o post aceitar comentários), edição para docentes/admins.
  - Criação/Edição de Post (`/posts/new`, `/posts/[id]/edit`): título, conteúdo, autor (pré-preenchido com usuário logado), checkbox de permitir comentários, botão salvar e botão publicar.
  - Gestão de Posts (`/admin/posts`): tabela com ações de editar, publicar/mover para rascunho, excluir e recuperar.
  - Gestão de Professores (`/teachers/`): apenas admin. CRUD completo (nome, email, senha, tag).
  - Gestão de Alunos (`/students/`): docente e admin. CRUD completo (nome, email, senha, tag/apelido).
  - Tag (apelido): utilizado para exibição do autor em comentários.
