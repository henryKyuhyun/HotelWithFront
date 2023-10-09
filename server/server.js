const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require('http');
const app = express();

const join = require("./router/members/join");
const login = require("./router/members/login");
const uploadHotel = require("./router/hotel/uploadHotel");
const hotelList = require("./router/hotel/hotelList");
const hotelDetail = require("./router/hotel/hotelDetail");
const hotelComment = require("./router/hotel/hotelComment");
const like = require("./router/wish/like");
const myHotels = require("./router/hotel/myHotels");
const editHotel = require("./router/hotel/editHotel");
const hotelPayment = require('./router/hotel/hotelPayment');
const notification = require("./router/notification/notification");
const register = require("./router/notification/register");

const myProfile = require('./router/members/myProfile');

// CORS 미들웨어 추가
app.use(cors({
  credentials: true,
  origin: "http://localhost:3000", // React 앱에서의 요청 허용
  methods: ["GET", "POST"],
}));
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
app.use("/api", like);
app.use("/api", myHotels);
app.use("/api", editHotel);
app.use('/api', hotelPayment);
app.use("/api", notification);
app.use("/api", register);

// app.use("/api/editHotel", editHotel);
app.use('/api',myProfile);

const myProfilePath = path.join(__dirname, "myProfile");
app.use("/myProfile", express.static(myProfilePath));

//chat
const server = http.createServer(app);

const {chat,getConnectedUserIds } = require('./router/chat/chat')
chat(server);

app.get('/api/connectedUsers', (req, res) => {
  res.json(getConnectedUserIds());
});


process.on('uncaughtException', function (err) {
  console.error(err);
  console.error("Node NOT Exiting...");//receiverId 가 정의되지않았을때.
});


const port = 4000;

server.listen(4000, () => console.log(`Listening on port ${port}`));


module.exports = app; //모듈추가하자
