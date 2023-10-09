const express = require("express");
const Router = express.Router();
const db = require("../../config/database");
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../../middlewares/auth-middleware"); 
const UploadMaxImages = 5;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "hotelImage");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

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
});

Router.put(
  "/editHotel/:hotelId",
  // upload.single("hotelImages"),
  authMiddleware,
  upload.any("hotelImages"),

  async (req, res) => {
    const { hotelId } = req.params;
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
    
    const imagePath = req.file ? "hotelImage/" + req.file.filename : "";
    // const query =
    //   "UPDATE hotels SET hotelName = ?, hotelInfo = ?, hotelType = ?, hotelAddress = ?, price = ?" +
    //   (imagePath ? ", hotelImages = ?" : "") +
    //   " WHERE hotel_id = ?";

    const query =
    "UPDATE hotels SET hotelName = ?, hotelInfo = ?, hotelSubInfo = ?, maxGuests = ?, hotelType = ?, hotelregion= ?, hotelAddress = ?, price = ?" +
    (imagePath.length > 0 ? ", hotelImages = ?" : "") +
    " WHERE hotel_id = ?";


    const values = [
      hotelName,
      hotelInfo,
      hotelSubInfo,
      maxGuests,
      hotelType,
      hotelregion,
      hotelAddress,
      price,
      ...(imagePaths ? [imagePaths] : []),
      hotelId,
    ];

    db.query(query, values, (error, result) => {
      if (error) {
        res.status(500).json({ message: "서버 오류 발생" });
        throw error;
      }
      res.status(200).json({ message: "호텔 정보가 수정되었습니다." });
    });
  }
);

module.exports = Router;
