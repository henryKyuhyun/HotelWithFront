// server/tests/unit/components/join.test.js
const request = require('supertest');
const app = require('../../../server');


describe('POST /api/login', ()=>{
  test('responds with json', async()=>{
    const response = await request(app)
      .post('/api/login')
      .send({id:'testuser',password:'testpassword'})
      .set("Accept", 'application/json');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
  });

  test('responds with status 401 for invalid login', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ id: 'invaliduser', password: 'invalidpassword' })
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(401);
  });
})