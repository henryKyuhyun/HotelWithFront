const express = require("express");
const router = express.Router();
const db = require("../../config/database");
const webpush = require("web-push");
const config = require("../../../config/default.json");
const authMiddleware = require("../../middlewares/auth-middleware");


const VAPID_PUBLIC_KEY = config.vapid.public;
const VAPID_PRIVATE_KEY = config.vapid.private;
const SUBJECT = config.subject;

webpush.setVapidDetails(SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const sendAdminNotification = async (admin_id, title, body) => {
  console.log('sendAdminNotification 시작:', admin_id);

  await db.query("SELECT subscription FROM subscriptions WHERE user_id=?", [admin_id], async(error, Admin)=>{
    if (Admin.length > 0) {
      console.log('Adminnnnnn:',Admin);
      const subscriptionStr = Admin[0].subscription;

      if (subscriptionStr) {
        try {
          const subscriptionJSON = JSON.parse(subscriptionStr);
          console.log("올바른 subscriptionJSON 확인:", subscriptionJSON);
              
          const subscription = {
              endpoint: subscriptionJSON.endpoint,
              keys: {
                  p256dh: subscriptionJSON.keys.p256dh,
                  auth: subscriptionJSON.keys.auth,
              },
            };
            await webpush.sendNotification(subscription, JSON.stringify({
            title,
            body,
          }));
          console.log("알림 전송 성공", subscription);
        } catch (error) {
          console.error("알림 전송 실패:", error);
        }
      }
    }
  });

  
};

router.post('/notification',authMiddleware, async (req, res) => {
  const { admin_id, title, body } = req.body;
  console.log("notification 요청 처리 시작:", req.body);
   // 구독 정보가 있는지 확인 
  db.query("SELECT user_id FROM subscriptions WHERE user_id = ?", [admin_id], async (error, results) => {
    if (error) {
      console.log('오류 발생:', error);
      res.status(500).json({ message: '알림 전송 오류 발생' });
    } else {
      if (results.length > 0 ) {
        try {
          // console.log('sendAdminNotification 호출 전:', admin_id); 
          await sendAdminNotification(admin_id, title, body);
          // console.log('sendAdminNotification 호출 후:', admin_id);
          res.status(200).json({ message: '알림 성공 전송' });
        } catch (error) {
          console.log('알림 전송 중 오류', error);
          res.status(500).json({ message: '알림 전송 오류 발생'});
        }
        } else { 
           // 구독 정보가 없어도 에러 없이 통과 가능
          console.log('구독 정보 없음:', admin_id);
          res.status(200).json({ message: '구독 정보가 없습니다.' });
      }
      }
    }
  );
});

module.exports = router;