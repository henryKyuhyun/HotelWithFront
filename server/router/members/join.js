const express = require("express");
const router = express.Router();
const db = require("../../config/database");

const bcrypt = require("bcrypt");
const saltRounds = 10;

router.post("/join", async (req, res) => {
  const {
    id: user_id,
    name: user_name,
    password: user_pw,
    role: user_role,
  } = req.body;

  if(!user_id || !user_name || !user_pw || !user_role){
    return res.status(400).json({isSuccess:"필수 정보가 누락되었습니다."});
  }
  const sendData = { isSuccess: "" };

  // DB 중복 user_id 체크
  db.query(
    "SELECT * FROM users WHERE user_id = ?",
  [user_id],
    async (error, results) => {
      if (error) throw error;

      if (results.length > 0) {
        sendData.isSuccess = "이미 존재하는 아이디 입니다";
        res.status(400).send(sendData); //
      } else {
        const hashedPassword = await bcrypt.hash(user_pw, saltRounds);
        const newUser = {
          user_id,
          user_name,
          user_pw: hashedPassword,
          user_role,
        };

        db.query("INSERT INTO users SET ?", newUser, (error) => {
          if (error) throw error;
          sendData.isSuccess = "성공적으로 등록되었습니다";
          res.status(200).send(sendData);
        });
      }
    }
  );
});

module.exports = router;
