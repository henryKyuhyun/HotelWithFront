// server/router/search/search.js

const express = require('express');
const db = require('../../config/database');
const router = express.Router();

router.get('/', (req,res) =>{
  const { searchTerm } = req.query;

  let query = 
    "SELECT hotel_id, hotelName, hotelType, hotelAddress, price, hotelImages FROM hotels WHERE "; //Whehre 뒤에 공백이있어야함
    query += `hotelName LIKE '%${searchTerm}%'`;

  db.query(query)
    .then((result) => res.status(200).json(result))
    .catch((error) => {
      console.error(`Error fetching hotels: ${error}`);
      res.status(500).send('Server Error');
    });
});

module.exports = router;