const jwt = require('jwt-simple');
const request = require('supertest');
const app = require('../../src/app');

const email = `${Date.now()}@mail.com`;
const MAIN_ROUTE = '/v1/users';
let user;

beforeAll(async () => {
  const res = await app.services.user.save({
    name: 'User Account',
    email: `${Date.now()}@email.com`,
    passwd: '123456',
  });
  user = { ...res[0] };
  user.token = jwt.encode(user, 'Segredo!');
});

test('should to list all users', async () => {
  const r = await request(app)
    .get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`);
  expect(r.status).toBe(200);
  expect(r.body.length).toBeGreaterThan(0);
});

test('should insert a user with sucess', async () => {
  const r = await request(app)
    .post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'Alberto', email, passwd: '123456' });
  expect(r.status).toBe(201);
  expect(r.body.name).toBe('Alberto');
  expect(r.body).not.toHaveProperty('passwd');
});
test('should store a crypt password', async () => {
  const res = await request(app)
    .post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'Alberto', email: `${Date.now()}@mail.com`, passwd: '123456' });
  expect(res.status).toBe(201);
  const { id } = res.body;
  const userDB = await app.services.user.findOne({ id });
  expect(userDB.passwd).not.toBeUndefined();
  expect(userDB.passwd).not.toBe('123456');
});

test('should not insert user without name', () => {
  request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ email, passwd: '123456' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um atributo obrigatório');
    });
});
test('should not user without email', async () => {
  const result = await request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'Alberto', passwd: '123456' });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Email é um atributo obrigatório');
});
test('should not insert user without password', (done) => {
  request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'Alberto', email })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Senha é um atributo obrigatório');
      done();
    });
});
test('should not insert user with registered email', async () => {
  const r = await request(app)
    .post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'Alberto', email, passwd: '123456' });
  expect(r.status).toBe(400);
  expect(r.body.error).toBe('Ja existe um usuário com esse email');
});
