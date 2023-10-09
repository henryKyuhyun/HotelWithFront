// const request = require('supertest');
// const app = require('../../../server');
// const db = require('../../../config/database');

// describe('회원가입 API test', () => {
//   // 데이터베이스 연결 상태를 나타내는 변수
//   let connected = false;

//   // 데이터베이스 연결
//   beforeAll((done) => {
//     // 이미 연결된 경우
//     if (connected) return;

//     db.connect((err) => {
//       if (connected) return;

//       console.log('Test MySQL Connected!');
//       connected = true;
//       done();
//     });
//   },10000);

//   // 데이터베이스 연결 해제
//   afterAll((done) => {
//     if (connected) {
//       db.end((err) => {
//         if (err) {
//           throw err;
//         }
//         console.log('Test MySQL Connection Closed!');
//         connected = false;
//         done();
//       });
//     } else {
//       done();
//     }
//   });

//   // 유효한 회원가입 테스트
//   it('유효한 회원가입 테스트', async () => {
//     const response = await request(app)
//       .post('/api/join') // 회원가입 엔드포인트의 경로에 따라 수정
//       .send({
//         id: 'testuser33311', // 테스트 데이터베이스에 중복되지 않는 ID로 테스트
//         name: 'testusernamemme11',
//         password: 'password12311',
//         role: 'user',
//       });

//     expect(response.status).toBe(200);
//     expect(response.body.isSuccess).toBe('성공적으로 등록되었습니다');
//   });

//   // 필수 항목 누락 테스트
// it('필수 항목 누락 테스트', async () => {
//   const response = await request(app)
//     .post('/api/join')
//     .send({
//       id: 'testuser444',
//       // name 항목을 빼고 요청을 보냅니다.
//       password: 'password123',
//       role: 'user',
//     });

//   expect(response.status).toBe(400);
//   expect(response.body.error).toBe('필수 정보가 누락되었습니다.');
// });

// // 사용자 ID 중복 테스트
// it('사용자 ID 중복 테스트', async () => {
//   const response = await request(app)
//     .post('/api/join')
//     .send({
//       id: 'site_admin', // 이미 등록된 ID를 사용합니다.
//       name: 'site_admin',
//       password: 'site_admin',
//       role: 'site_admin',
//     });

//   expect(response.status).toBe(400);
//   expect(response.body.error).toBe('이미 존재하는 아이디 입니다');
// });


// });


const request = require('supertest');
const app = require('../../../server');
// const db = require('../../../config/database');
const mysql = require('mysql');


describe('회원가입 API test', () => {
  // 데이터베이스 연결 상태를 나타내는 변수
  let db;
  let connected = false;

  // 데이터베이스 연결
  beforeEach((done) => {
    // 데이터베이스 연결 초기화
    db = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "zhtanf5246150!",
      database: "hotelmembers",
    });
  
    db.connect((err) => {
      if (err) throw err;
      console.log('Test MySQL Connected!');
      done();
    });
  });
  
  afterEach((done) => {
    // 데이터베이스 연결 해제
    db.end((err) => {
      if (err) throw err;
      console.log('Test MySQL Connection Closed!');
      done();
    });
  });
  

  // 유효한 회원가입 테스트
  it('유효한 회원가입 테스트', async () => {
    const response = await request(app)
      .post('/api/join') 
      .send({
        id: '3434234323423424',
        name: '234223423423434234',
        password: 'pass23423word11232342311',
        role: 'user',
      });

    expect(response.status).toBe(200);
    expect(response.body.isSuccess).toBe('성공적으로 등록되었습니다');
  });

   // 필수 항목 누락 테스트
it('필수 항목 누락 테스트', async () => {
  const response = await request(app)
    .post('/api/join')
    .send({
      id: 'testuser444',
      role: 'user',
    });

  expect(response.status).toBe(400);
  expect(response.body.error).toBe('필수 정보가 누락되었습니다.');
});



});