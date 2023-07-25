const express = require("express");
const router = express.Router();
const db = require("../../config/database");

router.get("/hotelList", (req, res) => {
  const { hotelType } = req.query; ///api/hotelList?hotelType=motel

  let query =
    "SELECT hotel_id, hotelName, hotelType, hotelAddress, price, hotelImages, user_id FROM hotels";

  if (hotelType !== "all") {
    query += ` WHERE hotelType = '${hotelType}'`;
  }

  db.query(query, (error, result) => {
    if (error) throw error;
    res.status(200).json(result);
  });
});

module.exports = router;
