const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/accounts';
let user;

beforeAll(async () => {
  const res = await app.services.user.save({
    name: 'User Account',
    email: `${Date.now()}@email.com`,
    passwd: '123456',
  });
  user = { ...res[0] };
});

test('Should insert a account with sucess', async () => {
  const result = await request(app).post(MAIN_ROUTE)
    .send({ name: 'Acc #1', user_id: user.id });
  expect(result.status).toBe(201);
  expect(result.body.name).toBe('Acc #1');
});

test('Should not insert a account without name', async () => {
  const result = await request(app).post(MAIN_ROUTE)
    .send({ user_id: user.id });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Nome é um atributo obrigatório');
});

test.skip('Should not insert a account with duplicate name for the same user', () => {
});

test('sdhould list all accounts', async () => {
  await app.db('accounts').insert({ name: 'Acc #1', user_id: user.id }, '*');
  const res = await request(app).get(MAIN_ROUTE);
  expect(res.status).toBe(200);
  expect(res.body.length).toBeGreaterThan(0);
});

test.skip('Should to list only the accounts of the user', () => {
});

test('Should return a account by id', async () => {
  const accounts = await app.db('accounts').insert({ name: 'Acc by Id', user_id: user.id }, ['id']);
  const account = await request(app).get(`${MAIN_ROUTE}/${accounts[0].id}`);
  expect(account.status).toBe(200);
  expect(account.body.name).toBe('Acc by Id');
  expect(account.body.user_id);
});

test.skip("Should not return another user's account", () => {
});

test('Should update a account', async () => {
  const accounts = await app.db('accounts').insert({ name: 'Acc by Update', user_id: user.id }, ['id']);
  const account = await request(app).put(`${MAIN_ROUTE}/${accounts[0].id}`).send({ name: 'Acc Update' });
  expect(account.status).toBe(200);
  expect(account.body.name).toBe('Acc Update');
});

test.skip("Should not update another user's account", () => {
});

test('Should remove a account', async () => {
  const accounts = await app.db('accounts').insert({ name: 'Acc by Delete', user_id: user.id }, ['id']);
  const account = await request(app).delete(`${MAIN_ROUTE}/${accounts[0].id}`);
  expect(account.status).toBe(204);
});

test.skip("Should not remove another user's account", () => {
});
