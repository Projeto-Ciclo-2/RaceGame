# Subindo backend isoladamente
Caso seja necessário subir o backend de forma independente (para fins de teste), use esse guia.

## Requisitos
- Cliente PostgreSQL instalado localmente.
- Cliente Redis
- NodeJS & NPM

## iniciando container Redis de testes (Sugestão)
Para rodar o backend é necessário um cliente redis, uma sugestão para caso você tenha docker é subir esse container de testes:
`docker run -d --name redis-test -p 6379:6379 redis`

## Passo a passo
1. Dentro do diretório, acesse a pasta backend.
Crie um arquivo `.env` seguindo o padrão do arquivo `.env.example`, dentro do .env insira suas credencias. Verifique sempre se as credencias estão de acordo com as credencias do banco de dados que está rodando na sua máquina.
**Atenção para a configuração**
- `CLIENT_URL="http://localhost:3000"`
Essa opção indica para o backend qual será o cliente front que acessará o backend. Se essa opção estiver incorreta, o backend não irá aceitar conexões websocket com o navegador.

2. abra o terminal ainda no diretório /backend e execute `npm install`.

3. confira se seu banco de dados postgres está em execução e então rode `npm run migrate`.

4. após isso finalmente rode `npm run dev` e um servidor node express irá começar a rodar em http://localhost:5000 ou nas configurações que você colocar.
