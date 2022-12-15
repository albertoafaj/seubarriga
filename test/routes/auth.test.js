const request = require('supertest');
const app = require('../../src/app');

test('Should create user through sign up', async () => {
  const response = await request(app).post('/auth/signup')
    .send({ name: 'User Login', email: `${Date.now()}@email.com`, passwd: '123456' });
  expect(response.status).toBe(201);
  expect(response.body.name).toBe('User Login');
  expect(response.body).toHaveProperty('email');
  expect(response.body).not.toHaveProperty('passwd');
});

test('should received token on login', async () => {
  const email = `${Date.now()}@email.com`;
  await app.services.user.save({ name: 'User Login', email, passwd: '123456' });
  const login = await request(app).post('/auth/signin')
    .send({ email, passwd: '123456' });
  expect(login.status).toBe(200);
  expect(login.body).toHaveProperty('token');
});

test('should not login user with wrong password', async () => {
  const email = `${Date.now()}@email.com`;
  await app.services.user.save({ name: 'User Login', email, passwd: '123456' });
  const login = await request(app).post('/auth/signin')
    .send({ email, passwd: '654321' });
  expect(login.status).toBe(400);
  expect(login.body.error).toBe('Usuário ou senha inválido');
});

test('should not login non-existent user', async () => {
  const login = await request(app).post('/auth/signin')
    .send({ email: 'naoexiste@email.com', passwd: '654321' });
  expect(login.status).toBe(400);
  expect(login.body.error).toBe('Usuário ou senha inválido');
});

test('should not access protected route without token', async () => {
  const users = await request(app).get('/users');
  expect(users.status).toBe(401);
});
