const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const test = require("./router/members/test");
const join = require("./router/members/join");
const login = require("./router/members/login");
const uploadHotel = require("./router/hotel/uploadHotel");
const hotelList = require("./router/hotel/hotelList");
const hotelDetail = require("./router/hotel/hotelDetail");
const hotelComment = require("./router/hotel/hotelComment");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const path = require("path");
const hotelImagePath = path.join(__dirname, "hotelImage");
app.use("/hotelImage", express.static(hotelImagePath));
// 게시판용  이미지 업로드후 public folder 에서 봐야하기 때문에

// app.use("/api", test);
app.use("/api", join);
app.use("/api", login);
app.use("/api", uploadHotel);
app.use("/api", hotelList);
app.use("/api", hotelDetail);
app.use("/api", hotelComment);

const port = 4000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
