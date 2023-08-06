const express = require("express");
const router = express.Router();
const db = require("../../config/database");

router.post("/like", async (req, res) => {
  try {
    const { hotel_id, user_id, addLike } = req.body;

    db.query(
      "SELECT * FROM likes WHERE hotel_id = ? AND user_id= ?",
      [hotel_id, user_id],
      async (error, results) => {
        if (results.length > 0) {
          //좋아요를 눌렀다면
          {
            //좋아요 취소
            console.log("값: ", addLike);
            await db.query(
              "DELETE FROM likes WHERE hotel_id= ? AND user_id = ?",
              [hotel_id, user_id]
            );
          }
        } else {
          // 처음 누르면 좋아요 처리
          console.log(" 값: ", addLike);
          await db.query("INSERT INTO likes (hotel_id, user_id) VALUES (?,?)", [
            hotel_id,
            user_id,
          ]);
        }
      }
    );
    res.status(200).json({ message: "좋아요 처리 완료", liked: addLike });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "좋아요 실패" });
  }
});

router.get("/like/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    await db.query(
      "SELECT hotel_id FROM likes WHERE user_id = ?",
      [user_id],
      async (error, results) => {
        if (error) throw error;

        //호텔 아이디 목록
        console.log(results); //[{ hotel_id: 3 }, { hotel_id: 1 },]
        const hotelIds = results.map((result) => result.hotel_id); //[3, 1]

        //호텔 검색
        if (hotelIds.length > 0) {
          // hotelIdQuery hotel_id = ? OR hotel_id = ?
          const hotelIdQuery = hotelIds
            .map((id) => "hotel_id = ?")
            .join(" OR ");
          //SELECT * FROM hotels WHERE hotel_id = 3 OR hotel_id = 1
          await db.query(
            `SELECT * FROM hotels WHERE ${hotelIdQuery}`,
            hotelIds,
            (error, hotels) => {
              if (error) throw error;
              res.status(200).json(hotels);
            }
          );
        } else {
          // 좋아요 없으면 빈배열
          res.status(200).json([]);
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "좋아요 리스트 가져오기 실패" });
  }
});
module.exports = router;
