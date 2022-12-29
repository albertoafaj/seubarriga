const jwt = require('jwt-simple');
const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/accounts';
let user;
let user2;

beforeEach(async () => {
  const res = await app.services.user.save({
    name: 'User Account',
    email: `${Date.now()}@email.com`,
    passwd: '123456',
  });
  const res2 = await app.services.user.save({
    name: 'User Account 2',
    email: `${Date.now()}@email.com`,
    passwd: '123456',
  });
  user = { ...res[0] };
  user.token = jwt.encode(user, 'Segredo!');
  user2 = { ...res2[0] };
});

test('Should insert a account with sucess', async () => {
  const result = await request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'Acc #1' });
  expect(result.status).toBe(201);
  expect(result.body.name).toBe('Acc #1');
});

test('Should not insert a account without name', async () => {
  const result = await request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({});
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Nome é um atributo obrigatório');
});

test('Should not insert a account with duplicate name for the same user', async () => {
  await app.db('accounts').insert({ name: 'Acc Duplicada', user_id: user.id });
  const result = await request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'Acc Duplicada' });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Já existe uma conta com esse nome!');
});

test.skip('Should list all accounts', async () => {
  await app.db('accounts').insert({ name: 'Acc #1', user_id: user.id }, '*');
  const res = await request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(200);
  expect(res.body.length).toBeGreaterThan(0);
});

test('Should to list only the accounts of the user', async () => {
  await app.db('transactions').del();
  await app.db('transfers').del();
  await app.db('accounts').del();
  await app.db('accounts').insert([
    { name: 'Acc User #1', user_id: user.id },
    { name: 'Acc User #2', user_id: user2.id },
  ]);
  const res = await request(app)
    .get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(200);
  expect(res.body.length).toBe(1);
  expect(res.body[0].name).toBe('Acc User #1');
});

test('Should return a account by id', async () => {
  const accounts = await app.db('accounts').insert({ name: 'Acc by Id', user_id: user.id }, ['id']);
  const account = await request(app).get(`${MAIN_ROUTE}/${accounts[0].id}`)
    .set('authorization', `bearer ${user.token}`);
  expect(account.status).toBe(200);
  expect(account.body.name).toBe('Acc by Id');
  expect(account.body.user_id);
});

test("Should not return another user's account", async () => {
  const accounts = await app.db('accounts').insert({ name: 'Acc User #2', user_id: user2.id }, ['id']);
  const account = await request(app).get(`${MAIN_ROUTE}/${accounts[0].id}`)
    .set('authorization', `bearer ${user.token}`);
  expect(account.status).toBe(403);
  expect(account.body.error).toBe('Este recurso não pertence ao usuário');
});

test('Should update a account', async () => {
  const accounts = await app.db('accounts').insert({ name: 'Acc by Update', user_id: user.id }, ['id']);
  const account = await request(app).put(`${MAIN_ROUTE}/${accounts[0].id}`).send({ name: 'Acc Update' })
    .set('authorization', `bearer ${user.token}`);
  expect(account.status).toBe(200);
  expect(account.body.name).toBe('Acc Update');
});

test("Should not update another user's account", async () => {
  const accounts = await app.db('accounts').insert({ name: 'Acc User #2', user_id: user2.id }, ['id']);
  const account = await request(app).put(`${MAIN_ROUTE}/${accounts[0].id}`)
    .send({ name: 'Acc Updated' })
    .set('authorization', `bearer ${user.token}`);
  expect(account.status).toBe(403);
  expect(account.body.error).toBe('Este recurso não pertence ao usuário');
});

test('Should remove a account', async () => {
  const accounts = await app.db('accounts').insert({ name: 'Acc by Delete', user_id: user.id }, ['id']);
  const account = await request(app).delete(`${MAIN_ROUTE}/${accounts[0].id}`)
    .set('authorization', `bearer ${user.token}`);
  expect(account.status).toBe(204);
});

test("Should not remove another user's account", async () => {
  const accounts = await app.db('accounts').insert({ name: 'Acc User #2', user_id: user2.id }, ['id']);
  const account = await request(app).delete(`${MAIN_ROUTE}/${accounts[0].id}`)
    .set('authorization', `bearer ${user.token}`);
  expect(account.status).toBe(403);
  expect(account.body.error).toBe('Este recurso não pertence ao usuário');
});
