# Seu Barriga

API REST para aplicações de gerenciamento financeiro

## Descrição do projeto: 

Desenvolvido como parte do curso de "API REST em Node.JS aplicando testes (TDD) desde o princípio " do prefessor Wagner Aquino https://wcaquino.me/, para desenvolvimento de uma API Rest utilizando NodeJS, aplicando o Jest para dar para a aplicação a segurança dos testes.

## Funcionalidades do projeto

* `Funcionalidade 1`: Cadastrar e buscar usuários;
* `Funcionalidade 2`: Autenticação e geração de Token JWT para controle de acesso;
* `Funcionalidade 3`: Cadastrar, buscar, atualizar e deletar as contas dos usuários;
* `Funcionalidade 4`: Cadastrar, buscar, atualizar e deletar as transações nas contas dos usuários;
* `Funcionalidade 5`: Cadastrar, buscar, atualizar e deletar as transferências entre as contas dos usuários;
* `Funcionalidade 6`: Retornar o saldo das contas dos usuários;

## Instação:

### Clonar o repositório:
```
$ git clone https://github.com/albertoafaj/seubarriga.git
```
### Instalar as dependências:
```
$ npm install
```
### Instalar Postgresql / PGADIM

https://www.postgresql.org/download/

https://www.pgadmin.org/download/

#### Casdastrar Bancos de dados no Postgres

* seubarriga 
* barriga

### Cadastre as variáveis de ambiente

```
SB_HOST="Host cadastrado no postgres"
SB_USER="Usuário cadastrado no postgres"
SB_PASS="Senha cadastrado no postgres"
SB_DB_PROD="seubarriga"
SB_DB_TEST="barriga"
```

### Rodando a aplicação:
```
$ npm start
```

### Testando a aplicação:
```
$ npm run test
```

#### Utilizando a API (Alguns exmplos de como testar as fguncionalidades de 1 a 3)

1) Cadastro do usuário
   Rota: http://localhost:3001/auth/signup
   Método: POST
   Content-Type: application/json
   Body: { "name": "User #1", "email": "user1@email.com", "passwd": "123456" }
   Resposta: { "id", "name", "email" }

2) Autentincando o usuário
   Rota: http://localhost:3001/auth/signin
   Método: POST
   Content-Type: application/json
   Body: { "name": "User #1", "passwd": "123456" }
   Resposta: { "token" }

3) consulta lista de usuários
   Rota: http://localhost:3001/v1/users
   Método: GET
   Auth: Bearer + Token
   Resposta: { "Lista de usuários" }

4) Cadastro das contas do usuário
   Rota: http://localhost:3001/v1/accounts
   Método: POST
   Content-Type: application/json
   Auth: Bearer + Token
   Body: { "name": "Account #1" }
   Resposta: { "id", "name", "user_id" }

5) Consulta as contas do usuário
   Rota: http://localhost:3001/v1/accounts
   Método: GET
   Content-Type: application/json
   Auth: Bearer + Token
   Resposta: { "id", "name", "user_id" }

6) Consulta as contas do usuário por id
   Rota: http://localhost:3001/v1/accounts/id
   Método: GET
   Content-Type: application/json
   Auth: Bearer + Token
   Resposta: { "id", "name", "user_id" }

7) Atualiza o nome conta do usuário por id
   Método: PUT
   Rota: http://localhost:3001/v1/accounts/id
   Content-Type: application/json
   Auth: Bearer + Token
   Body: { "name": "Account #updated" }
   Resposta: { "id", "name", "user_id" }

8) Excluí conta do usuário por id
   Rota: http://localhost:3001/v1/accounts/id
   Método: DELETE
   Content-Type: application/json
   Auth: Bearer + Token

9) Cadastro de transações nas contas dos usuários
   Rota: http://localhost:3001/v1/accounts
   Método: POST
   Content-Type: application/json
   Auth: Bearer + Token
   Body: { "name": "Account #1" }
   Resposta: { "id", "name", "user_id" }

10) Consulta as contas do usuário
   Rota: http://localhost:3001/v1/accounts
   Método: GET
   Content-Type: application/json
   Auth: Bearer + Token
   Resposta: { "id", "name", "user_id" }

11) Consulta as contas do usuário por id
   Rota: http://localhost:3001/v1/accounts/id
   Método: GET
   Content-Type: application/json
   Auth: Bearer + Token
   Resposta: { "id", "name", "user_id" }

12) Atualiza o nome conta do usuário por id
   Método: PUT
   Rota: http://localhost:3001/v1/accounts/id
   Content-Type: application/json
   Auth: Bearer + Token
   Body: { "name": "Account #updated" }
   Resposta: { "id", "name", "user_id" }

13) Excluí conta do usuário por id
   Rota: http://localhost:3001/v1/accounts/id
   Método: DELETE
   Content-Type: application/json
   Auth: Bearer + Token

## Tecnologias utilizadas

* NODE
* Express
* Jest
* Supertest
* Passport
* JWT
* Knex
* Postgres
* Cors