const request = require('supertest');
const moment = require('moment');
const app = require('../../src/app');

const MAIN_ROUTE = '/V1/balance';
const ROTE_TRANSACTION = '/v1/transactions';
const ROUTE_TRANSFER = '/v1/transfers';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxMDAsIm5hbWUiOiJVc2VyICMzIiwiZW1haWwiOiJ1c2VyM0BlbWFpbC5jb20ifQ.M6ZjA2mLu719gq1gsBncMHzTMuobqPMaz9jaS-xHxeM';
const TOKEN_GERAL = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxMDIsIm5hbWUiOiJVc2VyICM1IiwiZW1haWwiOiJ1c2VyNUBlbWFpbC5jb20ifQ.25-oV-foYfBZfPOPQ3YtFzfi20-R4rF6t-_yYCj4v0o';

beforeAll(async () => {
  await app.db.migrate.rollback();
  await app.db.migrate.latest();
  await app.db.seed.run();
});

describe('When user balance', () => {
  test('Should return just accounts with transactions', async () => {
    const result = await request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(200);
    expect(result.body).toHaveLength(0);
  });
  test('Should add cash inflow', async () => {
    await request(app).post(ROTE_TRANSACTION)
      .set('authorization', `bearer ${TOKEN}`)
      .send({ description: '1', date: new Date(), ammount: 100, type: 'I', acc_id: 10100, status: true });
    const result = await request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(200);
    expect(result.body).toHaveLength(1);
    expect(result.body[0].id).toBe(10100);
    expect(result.body[0].sum).toBe('100.00');
  });
  test('Should subtract cash outflow', async () => {
    await request(app).post(ROTE_TRANSACTION)
      .set('authorization', `bearer ${TOKEN}`)
      .send({ description: '1', date: new Date(), ammount: 200, type: 'O', acc_id: 10100, status: true });
    const result = await request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(200);
    expect(result.body).toHaveLength(1);
    expect(result.body[0].id).toBe(10100);
    expect(result.body[0].sum).toBe('-100.00');
  });
  test('should not consider pending transactions', async () => {
    await request(app).post(ROTE_TRANSACTION)
      .set('authorization', `bearer ${TOKEN}`)
      .send({ description: '1', date: new Date(), ammount: 200, type: 'O', acc_id: 10100, status: false });
    const result = await request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(200);
    expect(result.body).toHaveLength(1);
    expect(result.body[0].id).toBe(10100);
    expect(result.body[0].sum).toBe('-100.00');
  });
  test('Should to caculate just account values', async () => {
    await request(app).post(ROTE_TRANSACTION)
      .set('authorization', `bearer ${TOKEN}`)
      .send({ description: '1', date: new Date(), ammount: 50, type: 'I', acc_id: 10101, status: true });
    const result = await request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(200);
    expect(result.body).toHaveLength(2);
    expect(result.body[0].id).toBe(10100);
    expect(result.body[0].sum).toBe('-100.00');
    expect(result.body[1].id).toBe(10101);
    expect(result.body[1].sum).toBe('50.00');
  });
  test('Should not consider the accounts of another users', async () => {
    await request(app).post(ROTE_TRANSACTION)
      .set('authorization', `bearer ${TOKEN}`)
      .send({ description: '1', date: new Date(), ammount: 200, type: 'O', acc_id: 10102, status: true });
    const result = await request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(200);
    expect(result.body).toHaveLength(2);
    expect(result.body[0].id).toBe(10100);
    expect(result.body[0].sum).toBe('-100.00');
    expect(result.body[1].id).toBe(10101);
    expect(result.body[1].sum).toBe('50.00');
  });
  test('Should consider past transaction', async () => {
    await request(app).post(ROTE_TRANSACTION)
      .set('authorization', `bearer ${TOKEN}`)
      .send({ description: '1', date: moment().subtract({ days: 5 }), ammount: 250, type: 'I', acc_id: 10100, status: true });
    const result = await request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(200);
    expect(result.body).toHaveLength(2);
    expect(result.body[0].id).toBe(10100);
    expect(result.body[0].sum).toBe('150.00');
    expect(result.body[1].id).toBe(10101);
    expect(result.body[1].sum).toBe('50.00');
  });
  test('Should not consider future transaction', async () => {
    await request(app).post(ROTE_TRANSACTION)
      .set('authorization', `bearer ${TOKEN}`)
      .send({ description: '1', date: moment().add({ days: 5 }), ammount: 250, type: 'I', acc_id: 10100, status: true });
    const result = await request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(200);
    expect(result.body).toHaveLength(2);
    expect(result.body[0].id).toBe(10100);
    expect(result.body[0].sum).toBe('150.00');
    expect(result.body[1].id).toBe(10101);
    expect(result.body[1].sum).toBe('50.00');
  });
  test('Should consider transfers', async () => {
    await request(app).post(ROUTE_TRANSFER)
      .send({ description: 'Transf', acc_ori_id: 10101, acc_des_id: 10100, ammount: 250, date: new Date() })
      .set('authorization', `bearer ${TOKEN}`);
    const result = await request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(200);
    expect(result.body).toHaveLength(2);
    expect(result.body[0].id).toBe(10100);
    expect(result.body[0].sum).toBe('-100.00');
    expect(result.body[1].id).toBe(10101);
    expect(result.body[1].sum).toBe('300.00');
  });
});

test('Should calculate user accounts balance', async () => {
  const result = await request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${TOKEN_GERAL}`);
  expect(result.status).toBe(200);
  expect(result.body).toHaveLength(2);
  expect(result.body[0].id).toBe(10104);
  expect(result.body[0].sum).toBe('162.00');
  expect(result.body[1].id).toBe(10105);
  expect(result.body[1].sum).toBe('-248.00');
});
