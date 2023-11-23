
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

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("register", ({ role, userId }) => {
      console.log(`Registered user with ID: ${userId}`);

      if (role === "site_admin") {
        siteAdminSocket = socket; // site_admin 소켓 설정
        console.log("Site admin registered with socket ID:", socket.id);
            // Send the list of all chat rooms to the site admin
        const allChatRooms = Array.from(userSockets.keys()).map(userId => `${userId}_site_admin`);
        siteAdminSocket.emit('all chat rooms', allChatRooms);
      } else if (role === "user") {
        userSockets.set(userId, socket);
      } else if (role === "hotel_admin") {
        hotelAdminSockets.set(userId, socket);
      }
    });

    // Handle incoming messages and forward them to the appropriate receiver.
    // Also save the message in the database.
    socket.on('chat message', ({ userId, role, receiverUserId, message }) => {
      
      let chatRoomId;
      let receiverSocket;
    
      // If the receiver is the site admin or a specific user/hotel admin
      if(role === 'site_admin') { 
        chatRoomId = `${receiverUserId}_site_admin`;
        receiverSocket = userSockets.get(receiverUserId) || hotelAdminSockets.get(receiverUserId);
      } else { 
        chatRoomId = `${userId}_site_admin`;
        receiverSocket = siteAdminSocket;
        if (role === "hotel_admin") {
          chatRoomId = `${userId}_site_admin`;
          receiverSocket = siteAdminSocket;
        }

      }
      if(role === 'site_admin' && !receiverSocket) {
        console.log("채팅방을 선택하세요");
        return;
      }
    
      if(receiverSocket){
        const sqlInsertMessageToDb =
          "INSERT INTO ChatMessages (sender_id ,receiver_id ,message ,chat_room_id ) VALUES (?, ?, ?, ?)";
        
        db.query(sqlInsertMessageToDb ,[userId ,'site_Admin' ,message ,chatRoomId ],(err )=>{
          if(err){
            console.error("Failed to save the new messsage into database:", err);
          }else{
            console.log("The new messsage has been saved successfully into database.");
          }
        });
        
        // Emit the chat message event to the receiver
        receiverSocket.emit('chat message', { userId, role: role, chatRoomId: chatRoomId,message });
        // Also emit the same event back to sender
        socket.emit('chat message', { userId, role: role, chatRoomId: chatRoomId,message });
      } else{
        console.error(`The Receiver User/Hotel Admin with ID ${receiverUserId} is not connected.`);
      }
  });
    
    // Fetch chat history for a given chat room.
    socket.on("fetch messages", ({ chat_room_id }) => {
      db.query(
        "SELECT * FROM ChatMessages WHERE chat_room_id=?",
        [chat_room_id],
        (err, result) => {
          if (err) {
            console.error("Error while fetching messages:", err);
          } else {
            // Emit the chat history to the client
            socket.emit("chat history", result);
            console.log("Sent chat history to client:", result);
          }
        }
      );
    });
    
    // Handle disconnection.
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
