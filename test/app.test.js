const request = require('supertest');

const app = require('../src/app');

test('should respond in root', async () => {
  const r = await request(app).get('/');
  return expect(r.status).toBe(200);
});
