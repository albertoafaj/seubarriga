const supertest = require('supertest');

const request = supertest('http://localhost:3001');

test('should respond on port 3001', async () => {
  // eslint-disable-next-line linebreak-style
  const r = await request.get('/');
  return expect(r.status).toBe(200);
  // Vcheck if the response was 200

})