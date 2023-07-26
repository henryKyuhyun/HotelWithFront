const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const secretText = "superSecret";
const refreshSecretText = "supersuperSecret";

const db = require("../../config/database");
const bcrypt = require("bcrypt");

const refreshTokens = [];

// 미들웨어등록 (미들웨어 등록할 땐 항상 app.use 를 사용한다)
router.use(express.json());
router.use(cookieParser());

router.post("/login", (req, res) => {
  const user_id = req.body.id;
  const user_pw = req.body.password;

  // DB에서 사용자 조회
  db.query(
    "SELECT*FROM users WHERE user_id =?",
    [user_id],
    async (error, results) => {
      if (error) throw error;

      console.log("Results:", results);

      if (results.length === 0) {
        return res.status(401).send({ message: "존재하지 않는 아이디입니다" });
      }

      const user = results[0];

      // 비밀번호 확인
      const passwordMatch = await bcrypt.compare(user_pw, results[0].user_pw);

      if (!passwordMatch) {
        return res.status(401).send({ message: "잘못된 비밀번호입니다" });
      }

      // Create Token by JWT payload + secretText
      // 유효기간 추가
      const accessToken = jwt.sign({ id: user.user_id }, secretText, {
        expiresIn: "20s",
      });

      // JWT 를 이용해 refreshToken 도 생성
      const refreshToken = jwt.sign({ id: user.user_id }, refreshSecretText, {
        expiresIn: "1d",
      });
      refreshTokens.push(refreshToken);

      // refreshtoken 을 쿠키에 넣어주기
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken: accessToken });
    }
  );
});
// authmiddleware 를 넣어줌으로써 token 확인을 한 경우에만 posts를 받을 수 있음.
router.get("/posts", authMiddleware, (req, res) => {
  res.json(posts);
});

function authMiddleware(req, res, next) {
  // Token 을 Request header 에서 가져온다
  const authHeader = req.headers["authorization"];
  // Bearer kjdsanfkwnefkq.dsfnioawenfjl.adsfnklwnkf
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401); // client error 발생시켜주기

  // Token 이 있으니 유효한지 확인하기
  jwt.verify(token, secretText, (err, user) => {
    if (err) return res.sendStatus(403); //client error

    req.user = user;
    next();
  });
}

// refresh Token 요청 cookie
router.get("/refresh", (req, res) => {
  // body => parsing => req.body
  // cookies => parsing => req.cookies
  // cookies 가져오기 cookie-parser
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(403);

  const refreshToken = cookies.jwt;
  // refreshToken 이 Db에 있는 토큰인지 확인
  if (!refreshToken.includes(refreshToken)) {
    return res.sendStatus(403);
  }

  // token 이 유효한 토큰인지 확인
  jwt.verify(refreshToken, refreshSecretText, (err, user) => {
    if (err) return res.sendStatus(403);
    // accessToken 을 생성하기
    const accessToken = jwt.sign(
      { id: user.id, password: user.password },
      secretText,
      {
        expiresIn: "20s",
      }
    );
    res.json({ accessToken: accessToken });
  });
});

module.exports = router;
