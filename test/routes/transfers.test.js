const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/V1/transfers';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTk5OTgsIm5hbWUiOiJVc2VyICMxIiwiZW1haWwiOiJ1c2VyMUBlbWFpbC5jb20ifQ.gayFBiQKOLFKsgabvHacALf0oUGYH-FgpFZEPsO2sNA';

beforeAll(async () => {
  await app.db.migrate.rollback();
  await app.db.migrate.latest();
  await app.db.seed.run();
});

test('Should list only users transfers', async () => {
  const result = await request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${TOKEN}`);
  expect(result.status).toBe(200);
  expect(result.body).toHaveLength(1);
  expect(result.body[0].description).toBe('transfer #1');
});

describe('When saving a valid transfer', () => {
  let transferId;
  let income;
  let outcome;
  test('Should returns 201 status and transfers date', async () => {
    const result = await request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .send({ description: 'Regular transfer', user_id: 99998, acc_ori_id: 99996, acc_des_id: 99997, ammount: 100, date: new Date() });
    expect(result.status).toBe(201);
    expect(result.body[0].description).toBe('Regular transfer');
    transferId = await result.body[0].id;
  });
  test('the equivalent transactions must be generated', async () => {
    const transactions = await app.db('transactions').where({ transfer_id: transferId }).orderBy('ammount');
    expect(transactions).toHaveLength(2);
    [outcome, income] = transactions;
  });
  test('the outcome transaction must be negative', async () => {
    expect(outcome.description).toBe('transfer to acc #99997');
    expect(outcome.ammount).toBe('-100.00');
    expect(outcome.acc_id).toBe(99997);
    expect(outcome.type).toBe('O');
  });
  test('the intcome transaction must be positive', async () => {
    expect(income.description).toBe('transfer from acc #99996');
    expect(income.ammount).toBe('100.00');
    expect(income.acc_id).toBe(99996);
    expect(income.type).toBe('I');
  });
  test('Both must reference the transfer that originated them.', async () => {
    expect(income.transfer_id).toBe(transferId);
    expect(outcome.transfer_id).toBe(transferId);
  });
});

describe('When trying to save an invalid transfer', () => {
  let transfer;

  beforeAll(() => {
    transfer = { description: 'transfer without data', user_id: 99998, acc_ori_id: 99996, acc_des_id: 99997, ammount: 100, date: new Date() };
  });

  const testTemplate = async (newData, errorMsg, status) => {
    const result = await request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .send({ ...transfer, ...newData });
    expect(result.status).toBe(status);
    expect(result.body.error).toBe(errorMsg);
  };

  test('Should not insert without description', () => testTemplate({ description: null }, 'Descrição é um atributo obrigatório', 400));
  test('Should not insert without ammount', () => testTemplate({ ammount: null }, 'Valor é um atributo obrigatório', 400));
  test('Should not insert without date', () => testTemplate({ date: null }, 'Data é um atributo obrigatório', 400));
  test('Should not insert without origin account', () => testTemplate({ acc_ori_id: null }, 'Conta de origem é um atributo obrigatório', 400));
  test('Should not insert without destination account', () => testTemplate({ acc_des_id: null }, 'Conta de destino é um atributo obrigatório', 400));
  test('Should not insert if origem and destination account are the same', () => testTemplate({ acc_des_id: 99996 }, 'Conta de origem e destino não podem ser iguais', 400));
  test('Should not insert if the account belongs to another user#2', () => testTemplate({ acc_ori_id: 99999 }, 'A conta de numero #99999 não pertence a este usuário', 400));
});

test('Should return a transfer by id', async () => {
  const result = await request(app).get(`${MAIN_ROUTE}/99996`)
    .set('authorization', `bearer ${TOKEN}`);
  expect(result.status).toBe(200);
  expect(result.body.description).toBe('transfer #1');
});

describe('When updating a valid transfer', () => {
  let transferId;
  let income;
  let outcome;
  test('Should returns 200 status and transfers date', async () => {
    const result = await request(app).put(`${MAIN_ROUTE}/99996`)
      .set('authorization', `bearer ${TOKEN}`)
      .send({ description: 'Transfer Updated', user_id: 99998, acc_ori_id: 99996, acc_des_id: 99997, ammount: 500, date: new Date() });
    expect(result.status).toBe(200);
    expect(result.body[0].description).toBe('Transfer Updated');
    expect(result.body[0].ammount).toBe('500.00');
    transferId = await result.body[0].id;
  });
  test('the equivalent transactions must be generated', async () => {
    const transactions = await app.db('transactions').where({ transfer_id: transferId }).orderBy('ammount');
    expect(transactions).toHaveLength(2);
    [outcome, income] = transactions;
  });
  test('the outcome transaction must be negative', async () => {
    expect(outcome.description).toBe('transfer to acc #99997');
    expect(outcome.ammount).toBe('-500.00');
    expect(outcome.acc_id).toBe(99997);
    expect(outcome.type).toBe('O');
  });
  test('the intcome transaction must be positive', async () => {
    expect(income.description).toBe('transfer from acc #99996');
    expect(income.ammount).toBe('500.00');
    expect(income.acc_id).toBe(99996);
    expect(income.type).toBe('I');
  });
  test('Both must reference the transfer that originated them.', async () => {
    expect(income.transfer_id).toBe(transferId);
    expect(outcome.transfer_id).toBe(transferId);
  });
});

describe('When trying to update an invalid transfer', () => {
  let transfer;

  beforeAll(() => {
    transfer = { description: 'transfer invalid', user_id: 99998, acc_ori_id: 99996, acc_des_id: 99997, ammount: 100, date: new Date() };
  });

  const testTemplate = async (newData, errorMsg, status) => {
    const result = await request(app).put(`${MAIN_ROUTE}/99996`)
      .set('authorization', `bearer ${TOKEN}`)
      .send({ ...transfer, ...newData });
    expect(result.status).toBe(status);
    expect(result.body.error).toBe(errorMsg);
  };

  test('Should not insert without description', () => testTemplate({ description: null }, 'Descrição é um atributo obrigatório', 400));
  test('Should not insert without ammount', () => testTemplate({ ammount: null }, 'Valor é um atributo obrigatório', 400));
  test('Should not insert without date', () => testTemplate({ date: null }, 'Data é um atributo obrigatório', 400));
  test('Should not insert without origin account', () => testTemplate({ acc_ori_id: null }, 'Conta de origem é um atributo obrigatório', 400));
  test('Should not insert without destination account', () => testTemplate({ acc_des_id: null }, 'Conta de destino é um atributo obrigatório', 400));
  test('Should not insert if origem and destination account are the same', () => testTemplate({ acc_des_id: 99996 }, 'Conta de origem e destino não podem ser iguais', 400));
  test('Should not insert if the account belongs to another user#2', () => testTemplate({ acc_ori_id: 99999 }, 'A conta de numero #99999 não pertence a este usuário', 400));
});

describe('When trying to delete a transfer', () => {
  test('should returns 204 status', async () => {
    const result = await request(app).delete(`${MAIN_ROUTE}/99996`)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(204);
  });
  test('should to remove the register from database', async () => {
    const result = await app.db('transfers')
      .where({ id: 99996 });
    expect(result).toHaveLength(0);
  });
  test('should to remove the related transactions', async () => {
    const result = await app.db('transactions')
      .where({ transfer_id: 99996 });
    expect(result).toHaveLength(0);
  });
});
test('Should not return a anothewr user transfer', async () => {
  const result = await request(app).get(`${MAIN_ROUTE}/99997`)
    .set('authorization', `bearer ${TOKEN}`);
  expect(result.status).toBe(403);
  expect(result.body.error).toBe('Este recurso não pertence ao usuário');
});
