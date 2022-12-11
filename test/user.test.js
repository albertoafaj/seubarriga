const request = require('supertest');

const app = require('../src/app');

test('should to list all users', async () => {
  const r = await request(app).get('/users');
  expect(r.status).toBe(200);
  expect(r.body).toHaveLength(1);
  expect(r.body[0]).toHaveProperty('name', 'John Doe');
});

test('should insert a user withj sucess', async () => {
  const r = await request(app)
    .post('/users')
    .send({ name: 'Alberto', email: 'email@email.com' });
  expect(r.status).toBe(201);
  expect(r.body.name).toBe('Alberto');
});
