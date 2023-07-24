const express = require("express");
const router = express.Router();
const db = require("../../config/database");

router.post("/hotelComment", (req, res) => {
  const { hotel_id, user_id, content } = req.body;

  db.query(
    "INSERT INTO comments (hotel_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())",
    [hotel_id, user_id, content],
    (error, result) => {
      if (error) throw error;
      res.status(201).json({ message: "댓글이 성공적으로 생성되었습니다." });
    }
  );
});

// router.get("/hotelComment/:hotel_id", (req, res) => {
router.get("/hotelComments/:hotel_id", (req, res) => {
  const { hotel_id } = req.params;

  db.query(
    "SELECT id, hotel_id, user_id, content, created_at FROM comments WHERE hotel_id = ?",
    [hotel_id],
    (error, result) => {
      if (error) throw error;

      res.status(200).json(result);
    }
  );
});

module.exports = router;
