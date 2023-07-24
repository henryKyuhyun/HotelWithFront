const express = require("express");
const router = express.Router();
const db = require("../../config/database");

router.get("/hotel/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM hotels WHERE hotel_id = ?", [id], (error, result) => {
    if (error) throw error;

    if (result && result.length > 0) {
      // if (result && result.lenght > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).send({ message: "호텔이 존재하지 않습니다." });
    }
  });
});

module.exports = router;
