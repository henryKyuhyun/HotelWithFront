// chat.js
const socketIo = require('socket.io');
const db = require('../../config/database');

let siteAdminSocket = null;
const userSockets = new Map();
const hotelAdminSockets = new Map();

const chat = (server) => {
  const io = socketIo(server, {
    cors: {
      credentials: true,
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
  // console.log(`User ID from Redux Store: ${userSockets}}`);  // db에 아이디저장이안됌 확인 // -> ReduxStore 은 client에서만 사용가능하기떄문에 proxy 에러를 발생시키네
  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("register", ({ role, userId }) => {
      console.log(`Registered user with ID!!!!!!!!!: ${userId}`);// userId 확인

      if (role === "site_admin") {
        siteAdminSocket = socket;
        console.log("Site admin registered with socket ID:", socket.id);

      } else if (role === "user") {
        userSockets.set(userId, socket);
      } else if (role === "hotel_admin") {
        hotelAdminSockets.set(userId, socket);
      }
    });
    
    socket.on("chat message", ({ userId, role, receiverId, message }) => {
      console.log(`Message received from ${userId}: ${message}`);

      // Generate a unique chat room ID by combining sender and receiver IDs
      const chatRoomId = [userId, receiverId].sort().join('_');

      // If the sender is a site admin
      if (role === 'site_admin') {
        const userSocket = userSockets.get(receiverId);
        const hotelAdminSocket = hotelAdminSockets.get(receiverId);
      
        if (userSocket) {
          userSocket.emit('chat message', { userId: 'site_admin', role: 'site_admin', message });
          console.log(`Sent chat message to user with ID ${receiverId}:`, { userId: 'site_admin', role: 'site_admin', message });
      
        } else if (hotelAdminSocket) {
          hotelAdminSocket.emit("chat message", { userId: 'site_admin', role: 'site_admin', message });
          console.log(`Sent chat message to hotel admin with ID ${receiverId}:`, { userId: 'site_admin', role: 'site_admin', message });
      
        } else {
          console.log(`Receiver with ID ${receiverId} is not connected`);
        }
      } else {
        // If the sender is a user or a hotel admin
        if (role === "user") {
          if (siteAdminSocket) {
            siteAdminSocket.emit("chat message", { userId, role:"user", receiverUserId: 'site_admin', chatRoomID: chatRoomId ,message });
          } else{
            console.log("SITE ADMIN is NOT CONNECTED!!");
          }
        } else if (role === "hotel_admin") {
          if (siteAdminSocket) {
            siteAdminSocket.emit("chat message", { userId, role:"hotel_admin", receiverUserId:'site_admin', chatRoomID: chatRoomId ,message});
            } else{
              console.log("SITE ADMIN is NOT CONNECTED!!");
            }
        }
        
      }
    
      const sqlInsert = "INSERT INTO ChatMessages (sender_id, receiver_id, message, chatRoomId) VALUES (?, ?, ?, ?)";
    
      db.query(sqlInsert,[userId,receiverId,message,chatRoomId],(err)=>{
        if(err) {
          console.error('Error while saving chat message:', err);
        } else{
          console.log("Chat message saved to the database!!");
        }
      })
    });

    socket.on("fetch messages", ({ chatRoomId }) => {  
      const sqlSelect = "SELECT * FROM ChatMessages WHERE chatRoomId=?";
      
      db.query(sqlSelect,[chatRoomId],(err,result)=>{
        if(err){
          console.error('Error while fetching messages:', err);
        }else{
          socket.emit("chat history", result); 
          console.log('Sent chat history to client:', result);
        }
        socket.emit("chat history", result); // Send fetched messages to the client
        console.log('chat messages fetched!');
      });
    });


    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);

      if (userSockets.get(socket.id)) userSockets.delete(socket.id);
      else if (hotelAdminSockets.get(socket.id)) hotelAdminSockets.delete(socket.id);
      else if (siteAdminSocket && siteAdminSocket.id === socket.id) siteAdminSocket = null;
    });
  });
};


function getConnectedUserIds() {
  return Array.from(userSockets.keys());
}

module.exports = { chat, getConnectedUserIds };