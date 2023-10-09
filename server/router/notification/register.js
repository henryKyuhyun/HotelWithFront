const express = require("express");
const router = express.Router();
const db = require("../../config/database");
const authMiddleware = require("../../middlewares/auth-middleware");

router.post('/register',authMiddleware, async (req, res) => {
    const { subscription, id } = req.body;
  
    db.query("SELECT user_id FROM subscriptions WHERE user_id = ?", [id], async (error, result) => {
      if (result.length === 0) {
        try {
          await db.query("INSERT INTO subscriptions (subscription, user_id) VALUES (?, ?)",
            [JSON.stringify(subscription), id]);
          res.status(200).json({ message: '알림 등록 성공' });
        } catch (error) {
          console.log('알림 등록 중 오류', error);
          res.status(500).json({ message: '알림 등록 오류 발생' });
        }
      } else {
        //등록 오류시 구독 정보 (subscription) 갱신
        try {
          await db.query("UPDATE subscriptions SET subscription=? WHERE user_id=?",
          [JSON.stringify(subscription), id]);
          console.log('알림 재등록 성공');
          res.status(200).json({ message: '알림 재등록 성공' });
        }catch (error) {
          console.log('알림 재등록 중 오류', error);
          res.status(500).json({ message: '알림 재등록 오류 발생' });
      }
    }
  });
});
  
  
module.exports = router;