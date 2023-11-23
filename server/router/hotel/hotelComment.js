const express = require("express");
const router = express.Router();
const db = require("../../config/database");
const authMiddleware = require("../../middlewares/auth-middleware"); 

async function HotelAverageScore(hotel_id) {
  db.query("SELECT ROUND(AVG(score),1) AS average_score FROM comments WHERE hotel_id = ?", [hotel_id], (error, rows) => {
    if (error) throw error;

    const average_score = rows[0].average_score;
    
    db.query("UPDATE hotels SET average_score = ? WHERE hotel_id = ?", [average_score, hotel_id], (error, result) => {
      if (error) throw error;
    });
  });
}
router.post("/hotelComment", authMiddleware, (req, res) => { 
  const { hotel_id, user_id, content, score } = req.body;

  db.query(
    "INSERT INTO comments (hotel_id, user_id, content, score, created_at) VALUES (?, ?, ?, ?, NOW())",
    [hotel_id, user_id, content, score],
    async(error, result) => {
      if (error) throw error;

      await HotelAverageScore(hotel_id);

      res.status(201).json({ message: "댓글이 성공적으로 생성되었습니다." });
    }
  );
});


//호텔 전체 후기
router.get("/hotelComments/:hotel_id", (req, res) => {
  const { hotel_id } = req.params;

  db.query(
    "SELECT id, hotel_id, user_id, content, score, created_at FROM comments WHERE hotel_id = ?",
    [hotel_id],
    (error, result) => {
      if (error) throw error;

      res.status(200).json(result);
    }
  );
});

//사용자가 쓴 후기
router.get("/userComments/:user_id", (req, res) => {
  const { user_id } = req.params;

  db.query(
    "SELECT id, hotel_id, user_id, content, score, created_at FROM comments WHERE user_id = ?",
    [user_id],
    (error, result) => {
      if (error) throw error;

      res.status(200).json(result);
    }
  );
});


router.put("/hotelComments/:comment_id", authMiddleware, async (req, res) => {
  const {comment_id} = req.params;
  const { content, score } = req.body;

  await db.query(
    "UPDATE comments SET content=?, score=? WHERE id =?",
    [content, score, comment_id],
    async(error, result) => {
      if (error) throw error;

      if(result.affectedRows === 0){
        res.status(404).json({ message: "해당 ID의 댓글이 없습니다." });
      } else {

        db.query("SELECT hotel_id FROM comments WHERE id = ?", [comment_id], async(error, result)=> {
          if (error) throw error;
          const [comment] = result;
          await HotelAverageScore(comment.hotel_id);
        });

        res.status(200).json({ comment_id: Number(comment_id), content, score })
      }
    }
  );
});

router.delete("/hotelComments/:comment_id", authMiddleware, (req, res) => {
  const {comment_id } = req.params;

  db.query(
    "DELETE FROM comments WHERE id = ?",
    [comment_id],
    (error, result) => {
      if (error) throw error;

      res.status(200).json({ comment_id: Number(comment_id) });
    }
  );
});


module.exports = router;