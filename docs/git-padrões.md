# Padrões de Commits, Branches e Pull Requests

## Commits

Utilize mensagens de commit claras e concisas, com um prefixo para indicar o tipo de mudança.

**Os commits devem ser sempre em inglês, assim como o código.**

Segue o padrão a ser utilizado:

### Tipos de Commit

- **feat**: Quando estiver adicionando uma nova funcionalidade.
- **fix**: Para correção de bugs.
- **upd**: Para atualizações que não adicionam funcionalidades novas nem correções de bugs (ex.: refatorações, melhorias).
- **style**: Alterações relacionadas a formatação ou estilo (sem alterações de lógica).
- **docs**: Alterações na documentação.
- **test**: Adição ou alteração de testes.
- **chore**: Alterações em tarefas auxiliares (ex.: atualizações de dependências).

### Exemplos de Commits

- `feat: add user redirect to home after sign up`
- `fix: update POST /users route to remove restriction and fix undefined status code`
- `upd: connect frontend login with backend`
- `fix: add <main> tag in AppRouter for layout semantics`

## Branches

Use o seguinte formato para a criação de branches:

`<tipo>/<descricao-curta>`

### Tipos de Branch

- **feat**: Para funcionalidades novas.
- **fix**: Para correções de bugs.
- **upd**: Para atualizações que não são novas funcionalidades nem correções de bugs.

### Exemplos de Branches

- `feat/user-signup-redirect`
- `fix/post-users-route`
- `upd/frontend-backend-login-connection`

## Pull Requests

Ao abrir um Pull Request (PR), siga o formato abaixo:

### Título

- O título deve seguir o padrão dos commits.

### Descrição

- Descreva brevemente a alteração feita.
- Se possível, faça referência a issues relacionadas.

### Exemplo de PR

- **Título**: `fix: update POST /users route and fix status code`
- **Descrição**: Corrigida a rota POST /users para remover restrições indevidas e corrigido o erro de status code indefinido.
