const express = require("express");
const Router = express.Router();
const db = require("../../config/database");

// 호텔보기
Router.get("/myHotels", async (req, res) => {
  const { userId } = req.query; // Query parameter로 사용자 ID를 받아옴

  // 사용자 ID에 따라 등록된 호텔을 검색하는 쿼리
  const query = "SELECT * FROM hotels WHERE user_id = ?";

  db.query(query, [userId], (error, result) => {
    if (error) {
      res.status(500).json({ message: "서버 오류가 발생했습니다." });
      throw error;
    }

    if (result.length > 0) {
      res.status(200).json({ hotels: result });
    } else {
      // TODO 등록된 호텔이없을때 적절한 조치 필요 
      // res.status(404).json({ message: "등록된 호텔이 없습니다." });
      console.log('등록된 호텔이 없습니다. ')
    }
  });
});
module.exports = Router;
