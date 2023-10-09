const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require("../../config/database");
const secretText = "superSecret";
const jwt = require('jsonwebtoken');
const router = express.Router();

// Multer 설정: 업로드된 파일을 저장할 디렉토리 및 파일명 설정
// 이미지 저장
const storage = multer.diskStorage({
  //저장장소 HotelImage
  destination: (req, file, cb) => {
    cb(null, "myProfile");
  },
  filename: (req, file, cb) => {
    console.log(file);
    console.log('Original filename:', file.originalname);

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


const myprofileUploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    // fileSize: 10 * 1024 * 1024 //크기 제한 : 10MB
  },
});

//hotel_admin 역할 확인 Middleware
function verifyHotelAdmin(req,res,next){
  const user_role=req.user.role; 
  if(user_role !== 'hotel_admin'){
    console.log("User role is not hotel_admin!!:", user_role);
    return res.status(400).json({error:"호텔 관리자만 자기소개 페이지를 만들 수 있습니다!!."});
  }
  next();
}

function authenticateToken(req,res,next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log("Received token:", token);

  if(token ==null){
    console.log("Token is null!!!@");
    return res.sendStatus(401);
  }

  jwt.verify(token,secretText,(err,user)=>{
    if(err){
      console.log("Error verifying token!@#", err);
      return res.sendStatus(403);
    }
    req.user=user;
    next();
  });
}

//자기소개 페이지 업로드 처리Handler
router.post("/myprofile",authenticateToken,myprofileUploadMiddleware.single('photo'),verifyHotelAdmin,(req,res)=>{
  const userId = req.user.id;
  const photoPath = '/myProfile/' + req.file.filename;
  const { introText } = req.body;

  // DB에 profile 정보 저장
  const query = "INSERT INTO hotelAdminProfiles (user_id, introText, photoPath) VALUES (?, ?, ?)";

  db.query(query,[userId, introText,photoPath], (error)=>{
    if(error){
      console.error(error);
      return res.status(500).json({message:"서버오류다이자식아"});
    }
  res.status(200).json({message:"자기소개 페이지가 성공적으로 업로드되었습니다."})
  })
});


// 호텔 관리자 프로필 가져오는 router
router.get("/myprofile/:userId", async(req,res) =>{
  const userId = req.params.userId;
  
  // hotelAdminProfiles 테이블에서 해당 user_id의 프로필 정보 조회하기
  const query = "SELECT * FROM hotelAdminProfiles WHERE user_id = ?";
  
  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({message:"서버 오류"});
    }

    if (results.length === 0) {
      return res.status(404).json({message:"프로필 정보가 없습니다ㅏ."});
    }

    const profileInfo = results[0];
    
    res.status(200).json(profileInfo);
  });
});

module.exports = router;
