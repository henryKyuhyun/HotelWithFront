// server login test
const request = require('supertest');
const app = require('../../../server');
const db = require('../../../config/database');
const bcrypt = require('bcrypt');

jest.mock('../../../config/database');

describe('로그인 API test',()=>{
  beforeEach(()=>{
    db.query.mockClear();
  });
//mock db를 사용하기 때문에 실제 db에 없는걸 해도 Test 성공은 함
  it('유효한 로그인 정보',async()=>{
    const userCredentials = {
      id:'user42121321test',
      password:'use12312321rtest',
    };

    const hashedPassword = await bcrypt.hash(userCredentials.password, 10);

    const userFromDB={
      user_id:userCredentials.id,
      user_pw:hashedPassword,
      user_role:'user'
    };

    db.query.mockImplementationOnce((sql, values, callback) => callback(null, [userFromDB])); 

    const response = await request(app)
    .post('/api/login')
    .send(userCredentials);

    expect(response.status).toBe(200);

    // We can't predict the access token because it contains a timestamp and is signed,
    // so we can only check if it exists.
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.userRole).toBe(userFromDB.user_role);
    
    expect(db.query).toHaveBeenCalledTimes(1);
    const selectQuery = "SELECT * FROM users WHERE user_id = ?";
    expect(db.query).toHaveBeenCalledWith(selectQuery, [userCredentials.id], expect.any(Function));
  });

  it('비밀번호가 잘못된 경우', async () => {
  const wrongUserCredentials ={
      id:'231234',
      password:'wrongpassword'
  };

  db.query.mockImplementationOnce((sql, values,callback)=>callback(null,[{
    user_id:'231234',
    user_pw:'pass123234223word11232342311'
  }]));

  const response=await request(app)
        .post('/api/login')
        .send(wrongUserCredentials);

  expect(response.status).toBe(401);
  expect(response.body.message).toBe("잘못된 비밀번호입니다");
});
});