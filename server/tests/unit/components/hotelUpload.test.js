const request = require('supertest');
const app = require('../../../server');
const db = require('../../../config/database');
const fs = require('fs');
const path = require('path');

jest.mock('../../../config/database');

describe('호텔 업로드 API test',()=>{
  beforeEach(()=>{
    db.query.mockClear();
  });

  it('유효한 호텔 정보와 이미지 (성공)',async()=>{
    const uploadHotelTest = {
      hotelName : 'testHotel1',
      hotelInfo : 'testHotelInfo2',
      hotelSubInfo:'TestHotelSubInfo2',
      maxGuests:'3',
      hotelType:'Hotel',
      hotelregion:'Seoul',
      hotelAddress:'testAddress',
      price:'10',
      user_id: 'usertest'
    }

    const userFromDB={
      user_id:'usertest',
      user_role:'hotel_admin'
    };

    db.query.mockImplementationOnce((sql, values, callback) => callback(null, [userFromDB])); 

    const response = await request(app)
      .post('/api/uploadHotel')
      .field(uploadHotelTest)
      .attach('hotelImages', fs.readFileSync(path.resolve(__dirname, './hotelImages/testcodeImage.jpg')), { contentType : "image/jpg" }) // 절대 경로로 변경
      .set('Content-Type','multipart/form-data');

      expect(response.status).toBe(200);

      expect(db.query).toHaveBeenCalledTimes(2);
      const selectQuery = "SELECT * FROM users WHERE user_id = ?";
      expect(db.query).toHaveBeenCalledWith(selectQuery, [hotelInfo.user_id], expect.any(Function));
      const insertQuery = "INSERT INTO hotels SET ?";
      expect(db.query).toHaveBeenCalledWith(insertQuery, [expect.objectContaining(hotelInfo)], expect.any(Function));


  })
})