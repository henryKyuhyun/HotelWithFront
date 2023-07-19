const express = require("express");
const router = express.Router();
const db = require("../../config/database");
const multer = require("multer");
const { v4: uuid4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "hotelImage");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/uploadHotel", upload.single("hotelImages"), (req, res) => {
  console.log("Request body", req.body);
  const { hotelName, hotelInfo, hotelType, hotelAddress, price, user_id } =
    req.body;
  console.log("Request file", req.file);
  console.log("File path", req.file.path);

  // user_role Db에서 가져오기
  db.query(
    // "SELECT * FROM users WHERE user_role = ?",
    "SELECT * FROM users WHERE user_id = ?",
    [user_id],
    (error, result) => {
      if (error) throw error;

      if (result.length > 0 && result[0].user_role === "hotel_admin") {
        // 권한 확인 변경
        const hotelImages = JSON.stringify([req.file.path]);

        const newHotel = {
          hotelName,
          hotelInfo,
          hotelType,
          hotelAddress,
          price,
          hotelImages, // 추가
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
