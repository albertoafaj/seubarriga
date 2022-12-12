const request = require('supertest');

const app = require('../../src/app');

test('should to list all users', async () => {
  const r = await request(app).get('/users');
  expect(r.status).toBe(200);
  expect(r.body.length).toBeGreaterThan(0);
});

test('should insert a user with sucess', async () => {
  const email = `${Date.now()}@mail.com`;
  const r = await request(app)
    .post('/users')
    .send({ name: 'Alberto', email, passwd: '123456' });
  expect(r.status).toBe(201);
  expect(r.body.name).toBe('Alberto');
});
