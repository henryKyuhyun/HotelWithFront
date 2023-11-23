const request = require('supertest');
const app = require('../../../server');
const db = require('../../../config/database'); // Replace with actual path to your database module

jest.mock('../../../config/database'); // Mock the database module

describe('회원가입 API test', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    db.query.mockClear();
  });

  // 유효한 회원가입 테스트
  it('유효한 회원가입 테스트', async () => {
    const newUser = {
      id: '231234',
      name: '234212323423423234434234',
      password: 'pass123234223word11232342311',
      role: 'user',
    };

    db.query.mockImplementationOnce((sql, values, callback) => callback(null, [])) // No user found
            .mockImplementationOnce((sql, newUser, callback) => callback(null));   // User inserted successfully

    const response = await request(app)
      .post('/api/join')
      .send(newUser);

    expect(response.status).toBe(200);
    expect(response.body.isSuccess).toBe('성공적으로 등록되었습니다');

    expect(db.query).toHaveBeenCalledTimes(2);
    
    const selectQuery = "SELECT * FROM users WHERE user_id = ?";
    const insertQuery = "INSERT INTO users SET ?";
    
    expect(db.query).toHaveBeenCalledWith(selectQuery, [newUser.id], expect.any(Function));

    // As we cannot predict the hashed password in this test case
    expect(db.query.mock.calls[1][1]).toMatchObject({
      user_id: newUser.id,
      user_name: newUser.name,
      user_role: newUser.role,
    });
  });

  it('필수 항목 누락 테스트', async()=>{
    const WrongTypingUser={
      id: '5555',
      // name: '234212323423423234434234' 이름을 누락해보자
      password: 'pass123234223word11232342311',
      role: 'user',
    }

    const response=await request(app)
      .post('/api/join')
      .send(WrongTypingUser);
      
        expect(response.status).toBe(400);
        expect(response.body.isSuccess).toBe("필수 정보가 누락되었습니다.");
  })
});
