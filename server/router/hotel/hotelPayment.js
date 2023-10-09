const express = require("express");
const router = express.Router();
const db = require("../../config/database");
const authMiddleware = require("../../middlewares/auth-middleware");

router.post("/hotelPayment", authMiddleware, (req, res) => {
  const { hotel_id, user_id, price, payment_type, check_in, check_out, guests} = req.body;

  // admin_id 가져오기
  db.query("SELECT user_id FROM hotels WHERE hotel_id = ?", [hotel_id], async (error, result) => {
    try {
      if (error) throw error;

      console.error(error,"어디가문제1");
      const admin_id = result[0].user_id;
      // 결제 날짜
      const payment_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
      // 데이터베이스에 결제 정보 저장
      await db.query(
        "INSERT INTO payments(admin_id, hotel_id, user_id, payment_date, price, payment_type, check_in, check_out, guests ) VALUES (?,?,?,?,?,?,?,?,?)",
        [admin_id, hotel_id, user_id, payment_date, price, payment_type, check_in, check_out, guests ]
      );
        if(error)
        throw error;
        console.log(error,"어디가문제2");


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


router.get("/adminPayment/:adminId", authMiddleware, (req, res) => {
  const { adminId } = req.params;

  db.query(
    `SELECT 
    p.id as payment_id, p.admin_id as payment_admin_id, p.user_id as payment_user_id,
    p.payment_date, p.price, p.payment_type, p.check_in, p.check_out, p.status,
    h.hotelName as hotel_name,h.hotelInfo,h.hotelSubInfo,h.maxGuests,
    h.hotelType,h.hotelregion,h.hotelAddress,h.price as hotel_price,
    h.user_id as hotel_owner_id,
    u.user_name
    FROM payments AS p
    INNER JOIN hotels AS h ON h.hotel_id = p.hotel_id
    INNER JOIN users AS u ON u.user_id = h.user_id
    WHERE p.admin_id = ?`,
    [adminId],
    (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "데이터 조회에 문제가 발생했습니다." });
      } else {
        res.status(200).json({ result });
      }
    }
  )
})


router.get("/userPayment/:userId", authMiddleware, (req, res) => {
  const { userId } = req.params;

  db.query(
    `SELECT 
    p.id as payment_id, p.admin_id as payment_admin_id, p.user_id as payment_user_id,
    p.payment_date, p.price, p.payment_type, p.check_in, p.check_out, p.status,
    h.hotelName as hotel_name,h.hotelInfo,h.hotelSubInfo,h.maxGuests,
    h.hotelType,h.hotelregion,h.hotelAddress,h.price as hotel_price,
    h.user_id as hotel_owner_id,
    u.user_name
    FROM payments AS p
    INNER JOIN hotels AS h ON h.hotel_id = p.hotel_id
    INNER JOIN users AS u ON u.user_id = h.user_id
    WHERE p.user_Id = ?`,
    [userId],
    (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "데이터 조회에 문제가 발생했습니다." });
      } else {
        res.status(200).json({ result });
      }
    }
  )
})

router.patch("/hotelPayments/:reservationId", authMiddleware, (req,res) =>{
  const {reservationId} = req.params;
  const { status } = req.body;

  db.query (
    "UPDATE payments SET status=? WHERE id=?",
    [status, reservationId],
    (error) =>{
      if(error) {
        console.log(error);
        res.status(500).json({message:"결제확인 update실패"});
      } else {
        res.status(200).json({ status: status })

      }
    }
  )
})

module.exports = router;

