// server/router/hotel/uploadHotel.js
const express = require("express");
const router = express.Router();
const db = require("../../config/database");
const multer = require("multer");
const { v4: uuid4 } = require("uuid");
const path = require("path");
const authMiddleware = require("../../middlewares/auth-middleware"); 
const UploadMaxImages = 5;

// 이미지 저장
const storage = multer.diskStorage({
  //저장장소 HotelImage
  destination: (req, file, cb) => {
    cb(null, "hotelImage");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

//업로드된 파일의 MIME 타입을 체크하는 함수  "image/jpeg"
const fileFilter = (req, file, cb) => {
  const typeArray = file.mimetype.split("/");
  const fileType = typeArray[1];

  if (fileType == "jpg" || fileType == "png" || fileType == "jpeg") {
    req.fileValidationError = null;
    cb(null, true);
  } else {
    req.fileValidationError = "jpg,jpeg,png 파일만 업로드 가능합니다.";
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    // fileSize: 10 * 1024 * 1024 //크기 제한 : 10MB
  },
});
  router.post('/uploadHotel', authMiddleware, upload.any("hotelImages"), (req, res) => {

  console.log("Request body", req.body);
  if (req.files.length > UploadMaxImages) {
    return res.status(400).json({ error: `최대 ${UploadMaxImages}개의 이미지 파일만 업로드 가능합니다.` });
  } 
  const { 
    hotelName, 
    hotelInfo,
    hotelSubInfo,
    maxGuests, 
    hotelType,
    hotelregion, 
    hotelAddress, 
    price, 
    user_id 
  } = req.body;
  console.log("Request files", req.files);

  // user_role Db에서 가져오기
  db.query(
    "SELECT * FROM users WHERE user_id = ?",
    [user_id],
    (error, result) => {
      if (error) throw error;
      if (result.length > 0 && result[0].user_role === "hotel_admin") {
        // 권한 확인 변경
        // const hotelImages = JSON.stringify(req.files.map((file) => file.path));
        const hotelImages = JSON.stringify(
          req.files.map((file) => "hotelImage/" + file.filename)
        );

        const newHotel = {
          hotelName,
          hotelInfo,
          hotelSubInfo,
          maxGuests,
          hotelType,
          hotelregion,
          hotelAddress,
          price,
          hotelImages,
          user_id,
        };

        db.query("INSERT INTO hotels SET ?", newHotel, (error) => {
          if (error) throw error;

          res.status(200).send({ isSuccess: "호텔 정상 등록되었습니다." });
        });
      } else {
        console.error(error);
        res
          .status(403)
          .send({ isSuccess: "hotel_admin 만 hotel 등록 가능합니다" });
      }
    }
  );
});
module.exports = router;
