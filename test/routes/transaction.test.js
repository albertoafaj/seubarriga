const jwt = require('jwt-simple');
const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/V1/transactions';
let user;
let user2;
let accUser;
let accUser2;

beforeAll(async () => {
  await app.db('transactions').del();
  await app.db('accounts').del();
  await app.db('users').del();
  const users = await app.db('users').insert([
    { name: 'User #1', email: 'user@email.com', passwd: '$2a$10$GgYg.0xckhf9sLMSTgqbR.0bfZ.LactTl6Sl1ZXaSGYtPaLU57wqG' },
    { name: 'User #2', email: 'user2@email.com', passwd: '$2a$10$GgYg.0xckhf9sLMSTgqbR.0bfZ.LactTl6Sl1ZXaSGYtPaLU57wqG' },
  ], '*');
  [user, user2] = users;
  delete user.passwd;
  user.token = jwt.encode(user, 'Segredo!');
  const accounts = await app.db('accounts').insert([
    { name: 'Acc #1', user_id: user.id },
    { name: 'Acc #2', user_id: user2.id },
  ], '*');
  [accUser, accUser2] = accounts;
});

test('Should list just user transactions', async () => {
  await app.db('transactions').insert([
    { description: 'T1', date: new Date(), ammount: 100, type: 'I', acc_id: accUser.id },
    { description: 'T2', date: new Date(), ammount: 300, type: 'O', acc_id: accUser2.id },
  ]);

  const result = await request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`);

  expect(result.status).toBe(200);
  expect(result.body).toHaveLength(1);
  expect(result.body[0].description).toBe('T1');
});
