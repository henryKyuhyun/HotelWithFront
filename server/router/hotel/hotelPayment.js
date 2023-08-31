const express = require("express");
const router = express.Router();
const db = require("../../config/database");

router.post("/hotelPayment", (req, res) => {
  const { hotel_id, user_id, price, payment_type, check_in, check_out } = req.body;

  // admin_id 가져오기
  db.query("SELECT user_id FROM hotels WHERE hotel_id = ?", [hotel_id], async (error, result) => {
    try {
      if (error) throw error;

      const admin_id = result[0].user_id;

      // 결제 날짜
      const payment_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      // 데이터베이스에 결제 정보 저장
      await db.query(
        "INSERT INTO payments(admin_id, hotel_id, user_id, payment_date, price, payment_type, check_in, check_out ) VALUES (?,?,?,?,?,?,?,?)",
        [admin_id, hotel_id, user_id, payment_date, price, payment_type, check_in, check_out ]
      );

      
      await db.query(
        `SELECT p.*, h.*, u.* 
        FROM payments p
        INNER JOIN hotels h ON h.hotel_id = p.hotel_id
        INNER JOIN users u ON h.user_id = u.user_id
        WHERE p.hotel_id = ? AND p.user_id = ?`,
        [hotel_id, user_id],
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: "데이터 조회에 문제가 발생했습니다." });
          } else {
            res.status(200).json({ data: result, message: "결제가 완료되었습니다." });
          }
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "결제에 문제가 발생했습니다." });
    }
  });
});

module.exports = router;