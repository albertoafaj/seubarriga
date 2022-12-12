const request = require('supertest');

const app = require('../../src/app');

const email = `${Date.now()}@mail.com`;

test('should to list all users', async () => {
  const r = await request(app).get('/users');
  expect(r.status).toBe(200);
  expect(r.body.length).toBeGreaterThan(0);
});

test('should insert a user with sucess', async () => {
  const r = await request(app)
    .post('/users')
    .send({ name: 'Alberto', email, passwd: '123456' });
  expect(r.status).toBe(201);
  expect(r.body.name).toBe('Alberto');
});

test('should not insert user without name', () => {
  request(app).post('/users')
    .send({ email, passwd: '123456' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um atributo obrigatório');
    });
});
test('should not user without email', async () => {
  const result = await request(app).post('/users')
    .send({ name: 'Alberto', passwd: '123456' });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Email é um atributo obrigatório');
});
test('should not insert user without password', (done) => {
  request(app).post('/users')
    .send({ name: 'Alberto', email })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Senha é um atributo obrigatório');
      done();
    });
});
test('should not insert user with registered email', async () => {
  const r = await request(app)
    .post('/users')
    .send({ name: 'Alberto', email, passwd: '123456' });
  expect(r.status).toBe(400);
  expect(r.body.error).toBe('Ja existe um usuário com esse email');
});
