const request = require('supertest');
const app = require('../../../server');

// Mock the database module
jest.mock('../../../config/database', () => ({
  query: (sql, params, callback) => {
    if (sql.startsWith('SELECT')) {
      // Return a fake comment data
      callback(null, [{ id: '1', hotel_id: 'testHotelId', user_id: 'testUserId', content: 'Test comment', created_at: new Date() }]);
    } else if (sql.startsWith('INSERT')) {
      // Simulate successful INSERT query
      callback(null);
    }
  },
}));
// Mock the auth middleware to always call next()
jest.mock('../../../middlewares/auth-middleware', () => (req, res, next) => next());

describe('POST /api/hotelComment', () => {
  it('creates a new comment and responds with JSON message', async () => {
    const hotel_id = 'testHotelId'; 
    const user_id = 'testUserId'; 
    const content = 'Test comment content';

    await request(app)
      .post('/api/hotelComment')
      .send({ hotel_id, user_id, content })
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('message', '댓글이 성공적으로 생성되었습니다.');
      });
  });
});

describe('GET /api/hotelComments/:hotel_id', () => {
  it('responds with JSON containing comments for the specified hotel', async () => {
    const hotel_id = 'testHotelId'; 

    await request(app)
      .get(`/api/hotelComments/${hotel_id}`)
      .expect(200)
      .then((response) => {
        const comments = response.body;
        
        expect(Array.isArray(comments)).toBe(true);
        if (comments.length > 0) {
          expect(comments[0]).toHaveProperty('id');
          expect(comments[0]).toHaveProperty('user_id');
          expect(comments[0]).toHaveProperty('content');
          expect(comments[0]).toHaveProperty('created_at');
        }
    });
  });
});
