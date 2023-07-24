const express = require("express");
const router = express.Router();
const db = require("../../config/database");

router.get("/hotelList", (req, res) => {
  db.query(
    // "SELECT hotelName, hotelAddress, price, hotelImages, user_id FROM hotels",
    "SELECT hotel_id, hotelName, hotelAddress, price, hotelImages, user_id FROM hotels",

    (error, result) => {
      if (error) throw error;

      res.status(200).json(result);
    }
  );
});
module.exports = router;
