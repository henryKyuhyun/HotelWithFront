// const express = require("express");
// const router = express.Router();
// const db = require("../../config/database");
// const authMiddleware = require("../../middlewares/auth-middleware"); 

// router.post("/hotelComment",authMiddleware, (req, res) => {
//   const { hotel_id, user_id, content } = req.body;

//   db.query(
//     "INSERT INTO comments (hotel_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())",
//     [hotel_id, user_id, content],
//     (error, result) => {
//       if (error) throw error;
//       res.status(201).json({ message: "댓글이 성공적으로 생성되었습니다." });
//     }
//   );
// });

// router.get("/hotelComments/:hotel_id", (req, res) => {
//   const { hotel_id } = req.params;

//   db.query(
//     "SELECT id, hotel_id, user_id, content, created_at FROM comments WHERE hotel_id = ?",
//     [hotel_id],
//     (error, result) => {
//       if (error) throw error;

//       res.status(200).json(result);
//     }
//   );
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const db = require("../../config/database");
const authMiddleware = require("../../middlewares/auth-middleware"); 

router.post("/hotelComment", authMiddleware, (req, res) => { 
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

//호텔 전체 후기
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

//사용자가 쓴 후기
router.get("/userComments/:user_id", (req, res) => {
  const { user_id } = req.params;

  db.query(
    "SELECT id, hotel_id, user_id, content, created_at FROM comments WHERE user_id = ?",
    [user_id],
    (error, result) => {
      if (error) throw error;

      res.status(200).json(result);
    }
  );
});


router.put("/hotelComments/:comment_id", authMiddleware, async (req, res) => {
  const {comment_id} = req.params;
  const { content } = req.body;

  await db.query(
    "UPDATE comments SET content=? WHERE id =?",
    [content, comment_id],
    (error, result) => {
      if (error) throw error;

      if(result.affectedRows === 0){
        res.status(404).json({ message: "해당 ID의 댓글이 없습니다." });
      } else {
        res.status(200).json({ comment_id: Number(comment_id), content })
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