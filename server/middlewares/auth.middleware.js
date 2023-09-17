const jwt = require("jsonwebtoken");
const secretText = "superSecret";

module.exports = (req, res, next) => {
  
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능합니다.",
    });
    return;
  }
  try {
    jwt.verify(token, secretText, (err, user) => {
      if (err) {
        res.status(403).send({
          errorMessage: "인증실패",
          errorDetails: err.message
        });
        return;
      }
      req.user = user;
      next();
    });
    } catch (error) {
      res.status(500).send({
        errorMessage: "인증 과정에서 문제 발생.",
        error: error.message,
      });
    }
  };

