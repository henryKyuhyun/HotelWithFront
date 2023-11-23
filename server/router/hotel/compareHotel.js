// server/router/hotel/compareHotel.js
const express = require('express');
const router = express.Router();
const db = require('../../config/database');

// 호텔 비교
router.post('/api/compareHotels', (req, res) => {
  const { hotelIds } = req.body;

  // if (!Array.isArray(hotelIds) || hotelIds.length === 0 || hotelIds.length > 3) {
  //   return res.status(400).json({ error: 'd.' });
  // }

  const query = `SELECT hotel_id, hotelName, hotelType, hotelAddress, price, hotelImages FROM hotels WHERE hotel_id IN (${hotelIds.join(',')})`;

  db.query(query, (error, result) => {
    if (error) throw error;
    res.status(200).json(result);
  });
});

module.exports = router;
