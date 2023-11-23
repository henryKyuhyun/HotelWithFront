// server/router/hotel/hotelList.js
const express = require("express");
const router = express.Router();
const db = require("../../config/database");

router.get("/hotelList", (req, res) => {
  const { hotelType, searchTerm } = req.query;
  let query =
    "SELECT hotels.hotel_id, hotelName, hotelType, hotelAddress, price, hotelImages, average_score FROM hotels LEFT JOIN comments ON hotels.hotel_id = comments.hotel_id WHERE 1=1";
  if (hotelType !== "all") {
    query += ` WHERE hotelType = '${hotelType}'`;
  }

  if (searchTerm) {
    query += ` AND hotelName LIKE '%${searchTerm}%'`;
  }

  db.query(query, (error, result) => {
    if (error) throw error;
    const hotels = {};
    result.forEach(row => {
      if (!hotels[row.hotel_id]) {
          hotels[row.hotel_id] = {
              hotel_id: row.hotel_id,
              hotelName: row.hotelName,
              hotelType: row.hotelType,
              hotelAddress: row.hotelAddress,
              price: row.price,
              hotelImages: row.hotelImages,
              user_id: row.user_id,
              average_score: row.average_score,
              comments: []
          };
      }
      if (row.comment_content) {
          hotels[row.hotel_id].comments.push({
              content: row.comment_content,
              score: row.comment_score,
              created_at: row.comment_created_at
          });
      }
    // res.status(200).json(result);
  });
  const hotelList = Object.values(hotels);
  res.status(200).json(hotelList);

  })
});

// Compare
router.post('/compareHotels' , (req,res) =>{
  const { hotelIds } = req.body;
  const query = `SELECT hotel_id, hotelName, hotelType, hotelAddress, price, hotelImages FROM hotels WHERE hotel_id IN (${hotelIds.join(",")})`;
  db.query(query, (error, result) => {
    if (error) throw error;
    res.status(200).json(result);
  });
});

module.exports = router;