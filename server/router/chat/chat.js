// // chat.js
// const socketIo = require('socket.io');
// const db = require('../../config/database');

// let siteAdminSocket = null;
// const userSockets = new Map();
// const hotelAdminSockets = new Map();

// const chat = (server) => {
//   const io = socketIo(server, {
//     cors: {
//       credentials: true,
//       origin: "http://localhost:3000",
//       methods: ["GET", "POST"],
//     },
//   });
//   // console.log(`User ID from Redux Store: ${userSockets}}`);  // db에 아이디저장이안됌 확인 // -> ReduxStore 은 client에서만 사용가능하기떄문에 proxy 에러를 발생시키네
//   io.on("connection", (socket) => {
//     console.log(`New client connected: ${socket.id}`);

//     socket.on("register", ({ role, userId }) => {
//       console.log(`Registered user with ID!!!!!!!!!: ${userId}`);// userId 확인

//       if (role === "site_admin") {
//         siteAdminSocket = socket;
//         console.log("Site admin registered with socket ID:", socket.id);

//       } else if (role === "user") {
//         userSockets.set(userId, socket);
//       } else if (role === "hotel_admin") {
//         hotelAdminSockets.set(userId, socket);
//       }
//     });
    
//     socket.on("chat message", ({ userId, role, receiverId, message }) => {
//       console.log(`Message received from ${userId}: ${message}`);

//       // Generate a unique chat room ID by combining sender and receiver IDs
//       const chatRoomId = [userId, receiverId].sort().join('_');

//       // If the sender is a site admin
//       if (role === 'site_admin') {
//         const userSocket = userSockets.get(receiverId);
//         const hotelAdminSocket = hotelAdminSockets.get(receiverId);
      
//         if (userSocket) {
//           userSocket.emit('chat message', { userId: 'site_admin', role: 'site_admin', message });
//           console.log(`Sent chat message to user with ID ${receiverId}:`, { userId: 'site_admin', role: 'site_admin', message });
      
//         } else if (hotelAdminSocket) {
//           hotelAdminSocket.emit("chat message", { userId: 'site_admin', role: 'site_admin', message });
//           console.log(`Sent chat message to hotel admin with ID ${receiverId}:`, { userId: 'site_admin', role: 'site_admin', message });
      
//         } else {
//           console.log(`Receiver with ID ${receiverId} is not connected`);
//         }
//       } else {
//         // If the sender is a user or a hotel admin
//         if (role === "user") {
//           if (siteAdminSocket) {
//             siteAdminSocket.emit("chat message", { userId, role:"user", receiverUserId: 'site_admin', chatRoomID: chatRoomId ,message });
//           } else{
//             console.log("SITE ADMIN is NOT CONNECTED!!");
//           }
//         } else if (role === "hotel_admin") {
//           if (siteAdminSocket) {
//             siteAdminSocket.emit("chat message", { userId, role:"hotel_admin", receiverUserId:'site_admin', chatRoomID: chatRoomId ,message});
//             } else{
//               console.log("SITE ADMIN is NOT CONNECTED!!");
//             }
//         }
        
//       }
    
//       const sqlInsert = "INSERT INTO ChatMessages (sender_id, receiver_id, message, chatRoomId) VALUES (?, ?, ?, ?)";
    
//       db.query(sqlInsert,[userId,receiverId,message,chatRoomId],(err)=>{
//         if(err) {
//           console.error('Error while saving chat message:', err);
//         } else{
//           console.log("Chat message saved to the database!!");
//         }
//       })
//     });

//     socket.on("fetch messages", ({ chatRoomId }) => {  
//       const sqlSelect = "SELECT * FROM ChatMessages WHERE chatRoomId=?";
      
//       db.query(sqlSelect,[chatRoomId],(err,result)=>{
//         if(err){
//           console.error('Error while fetching messages:', err);
//         }else{
//           socket.emit("chat history", result); 
//           console.log('Sent chat history to client:', result);
//         }
//         socket.emit("chat history", result); // Send fetched messages to the client
//         console.log('chat messages fetched!');
//       });
//     });


//     socket.on("disconnect", () => {
//       console.log(`Client disconnected: ${socket.id}`);

//       if (userSockets.get(socket.id)) userSockets.delete(socket.id);
//       else if (hotelAdminSockets.get(socket.id)) hotelAdminSockets.delete(socket.id);
//       else if (siteAdminSocket && siteAdminSocket.id === socket.id) siteAdminSocket = null;
//     });
//   });
// };


// function getConnectedUserIds() {
//   return Array.from(userSockets.keys());
// }

// module.exports = { chat, getConnectedUserIds };


// ------------------------------------------------------
// // ------------------------------------------------------

// // chat.js 서버   이게되는코드임
// const socketIo = require('socket.io');
// const db = require('../../config/database');
// let siteAdminSocket = null;
// const userSockets = new Map();
// const hotelAdminSockets = new Map();

// const chat = (server) => {
//   const io = socketIo(server, {
//     cors: {
//       credentials: true,
//       origin: "http://localhost:3000",
//       methods: ["GET", "POST"],
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log(`New client connected: ${socket.id}`);

//     socket.on("register", ({ role, userId }) => {
//       console.log(`Registered user with ID: ${userId}`);

//       if (role === "site_admin") {
//         siteAdminSocket = socket; // site_admin 소켓 설정
//         console.log("Site admin registered with socket ID:", socket.id);
//       } else if (role === "user") {
//         userSockets.set(userId, socket);
//       } else if (role === "hotel_admin") {
//         hotelAdminSockets.set(userId, socket);
//       }
//     });

//     socket.on('chat message', ({ userId, role, receiverUserId, message, chatRoomId }) => {
//       console.log(`Message received from ${userId}: ${message}`);
//       let receiverSocket;

    
//       if (role === 'site_admin') {
//         receiverSocket=siteAdminSocket;
//         console.log(`Received a new message from ${userId} to the Site Admin in the room ${chatRoomId}:`, { userId ,role ,message });

//         const hotelAdminSocket = hotelAdminSockets.get(receiverId);
    
//         if (userSocket) {
//           userSocket.emit('chat message', { userId: 'site_admin', role: 'site_admin', message });
//           console.log(`Sent chat message to user with ID ${receiverId}:`, { userId: 'site_admin', role: 'site_admin', message });
//         } else if (hotelAdminSocket) {
//           hotelAdminSocket.emit("chat message", { userId: 'site_admin', role: 'site_admin', message });
//           console.log(`Sent chat message to hotel admin with ID ${receiverId}:`, { userId: 'site_admin', role: 'site_admin', message });
//         } else {
//           console.log(`Receiver with ID ${receiverId} is not connected`);
//         }
//       // } else {
//       //   // Determine the unique chat room ID based on sender and receiver IDs
//       //   if (!chatRoomId) {
//       //     chatRoomId = [userId, receiverId].sort().join('_');
//       //   }
//         } else if (role === 'user' || role === 'hotel_admin') {
//         // Handle messages between "user" or "hotel_admin" and "site_admin"
//         if (siteAdminSocket) {
//           siteAdminSocket.emit("chat message", { userId, role, receiverUserId: 'site_admin', chatRoomId, message });
//         } else {
//           console.log("SITE ADMIN is NOT CONNECTED!!");
//         }
    
//         // Handle messages between "user" or "hotel_admin" and "site_admin"
//         if (role === "user" || role === "hotel_admin") {
//           if (siteAdminSocket) {
//             siteAdminSocket.emit("chat message", { userId, role, receiverUserId: 'site_admin', chatRoomId ,message });
//             console.log(`Sent a new message to the site admin from ${userId} in the room ${chatRoomId}:`, { userId ,role ,message });

//           } else {
//             console.log("SITE ADMIN is NOT CONNECTED!!");
//           }
//         } else {
//           // Handle messages between "site_admin" and other users
//           const receiverSocket = userSockets.get(receiverId) || hotelAdminSockets.get(receiverId);
//           if (receiverSocket) {
//             receiverSocket.emit('chat message', { userId, role, chatRoomId, message });
//             console.log(`Sent chat message to user/hotel admin with ID ${receiverId}:`, { userId, role, chatRoomId, message });
//           } else {
//             console.log(`Receiver with ID ${receiverId} is not connected`);
//           }
//         }
//       }
    
//       // Save the chat message to the database
//       const sqlInsert = "INSERT INTO ChatMessages (sender_id, receiver_id, message, chatRoomId) VALUES (?, ?, ?, ?)";
//       db.query(sqlInsert, [userId, receiverId, message, chatRoomId], (err) => {
//         if (err) {
//           console.error('Error while saving chat message:', err);
//         } else {
//           console.log("Chat message saved to the database!!");
//         }
//       });
//     });

//     socket.on("fetch messages", ({ chatRoomId }) => {
//       const sqlSelect = "SELECT * FROM ChatMessages WHERE chatRoomId=?";
//       db.query(sqlSelect, [chatRoomId], (err, result) => {
//         if (err) {
//           console.error('Error while fetching messages:', err);
//         } else {
//           socket.emit("chat history", result);
//           console.log('Sent chat history to client:', result);
//         }
//         socket.emit("chat history", result); // Send fetched messages to the client
//         console.log('chat messages fetched!');
//       });
//     });

//     socket.on("disconnect", () => {
//       console.log(`Client disconnected: ${socket.id}`);

//       if (userSockets.get(socket.id)) userSockets.delete(socket.id);
//       else if (hotelAdminSockets.get(socket.id)) hotelAdminSockets.delete(socket.id);
//       else if (siteAdminSocket && siteAdminSocket.id === socket.id) siteAdminSocket = null;
//     });
//   });
// };

// function getConnectedUserIds() {
//   return Array.from(userSockets.keys());
// }

// module.exports = { chat, getConnectedUserIds };




// // chat.js 서버
// const socketIo = require('socket.io');
// const db = require('../../config/database');
// let siteAdminSocket = null;
// const userSockets = new Map();
// const hotelAdminSockets = new Map();

// const chat = (server) => {
//   const io = socketIo(server, {
//     cors: {
//       credentials: true,
//       origin: "http://localhost:3000",
//       methods: ["GET", "POST"],
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log(`New client connected: ${socket.id}`);

//     socket.on("register", ({ role, userId }) => {
//       console.log(`Registered user with ID: ${userId}`);

//       if (role === "site_admin") {
//         siteAdminSocket = socket; // site_admin 소켓 설정
//         console.log("Site admin registered with socket ID:", socket.id);
//             // Send the list of all chat rooms to the site admin
//         const allChatRooms = Array.from(userSockets.keys()).map(userId => `${userId}_site_admin`);
//         siteAdminSocket.emit('all chat rooms', allChatRooms);
//       } else if (role === "user") {
//         userSockets.set(userId, socket);
//       } else if (role === "hotel_admin") {
//         hotelAdminSockets.set(userId, socket);
//       }
//     });

//     // Handle incoming messages and forward them to the appropriate receiver.
//     // Also save the message in the database.
//     socket.on('chat message', ({ userId, role, receiverUserId, message }) => {
      
//       let chatRoomId = `${userId}_site_admin`;
//       let receiverSocket;
    
//       // If the receiver is the site admin or a specific user/hotel admin
//       if(receiverUserId === 'site_admin') { 
//         chatRoomId = `${receiverUserId}_site_admin`;
//         receiverSocket = siteAdminSocket;
//       } else { 
//         chatRoomId = `${receiverUserId}_site_admin`;
//         receiverSocket = userSockets.get(receiverUserId) || hotelAdminSockets.get(receiverUserId);

//       }
    
//       if(receiverSocket){
//         const sqlInsertMessageToDb =
//           "INSERT INTO ChatMessages (sender_id ,receiver_id ,message ,chat_room_id ) VALUES (?, ?, ?, ?)";
        
//         db.query(sqlInsertMessageToDb ,[userId ,'siteAdmin' ,message ,chatRoomId ],(err )=>{
//           if(err){
//             console.error("Failed to save the new messsage into database:", err);
//           }else{
//             console.log("The new messsage has been saved successfully into database.");
//           }
//         });
        
//         // Emit the chat message event to the receiver
//         receiverSocket.emit('chat message', { userId, role: role, chatRoomId: chatRoomId,message });
        
//       } else{
//         console.error(`The Receiver User/Hotel Admin with ID ${receiverUserId} is not connected.`);
//       }
//   });
    
//     // Fetch chat history for a given chat room.
//     socket.on("fetch messages", ({ chat_room_id }) => {
//       db.query(
//         "SELECT * FROM ChatMessages WHERE chat_room_id=?",
//         [chat_room_id],
//         (err, result) => {
//           if (err) {
//             console.error("Error while fetching messages:", err);
//           } else {
//             // Emit the chat history to the client
//             socket.emit("chat history", result);
//             console.log("Sent chat history to client:", result);
//           }
//         }
//       );
//     });
    
//     // Handle disconnection.
//     socket.on("disconnect", () => {
//       console.log(`Client disconnected: ${socket.id}`);

//       if (userSockets.get(socket.id)) userSockets.delete(socket.id);
//       else if (hotelAdminSockets.get(socket.id)) hotelAdminSockets.delete(socket.id);
//       else if (siteAdminSocket && siteAdminSocket.id === socket.id) siteAdminSocket = null;
//     });
//   });
// };

// function getConnectedUserIds() {
//   return Array.from(userSockets.keys());
// }

// module.exports = { chat, getConnectedUserIds };


// // chat.js 서버 성공본
// const socketIo = require('socket.io');
// const db = require('../../config/database');
// let siteAdminSocket = null;
// const userSockets = new Map();
// const hotelAdminSockets = new Map();

// const chat = (server) => {
//   const io = socketIo(server, {
//     cors: {
//       credentials: true,
//       origin: "http://localhost:3000",
//       methods: ["GET", "POST"],
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log(`New client connected: ${socket.id}`);

//     socket.on("register", ({ role, userId }) => {
//       console.log(`Registered user with ID: ${userId}`);

//       if (role === "site_admin") {
//         siteAdminSocket = socket; // site_admin 소켓 설정
//         console.log("Site admin registered with socket ID:", socket.id);
//             // Send the list of all chat rooms to the site admin
//         const allChatRooms = Array.from(userSockets.keys()).map(userId => `${userId}_site_admin`);
//         siteAdminSocket.emit('all chat rooms', allChatRooms);
//       } else if (role === "user") {
//         userSockets.set(userId, socket);
//       } else if (role === "hotel_admin") {
//         hotelAdminSockets.set(userId, socket);
//       }
//     });

//     // Handle incoming messages and forward them to the appropriate receiver.
//     // Also save the message in the database.
//     socket.on('chat message', ({ userId, role, receiverUserId, message }) => {
      
//       let chatRoomId;
//       let receiverSocket;
    
//       // If the receiver is the site admin or a specific user/hotel admin
//       if(role === 'site_admin') { 
//         chatRoomId = `${receiverUserId}_site_admin`;
//         receiverSocket = userSockets.get(receiverUserId) || hotelAdminSockets.get(receiverUserId);
//       } else { 
//         chatRoomId = `${userId}_site_admin`;
//         receiverSocket = siteAdminSocket;
//       }
//       if(role === 'site_admin' && !receiverSocket) {
//         console.log("채팅방을 선택하세요");
//         return;
//       }
    
//       if(receiverSocket){
//         const sqlInsertMessageToDb =
//           "INSERT INTO ChatMessages (sender_id ,receiver_id ,message ,chat_room_id ) VALUES (?, ?, ?, ?)";
        
//         db.query(sqlInsertMessageToDb ,[userId ,'site_Admin' ,message ,chatRoomId ],(err )=>{
//           if(err){
//             console.error("Failed to save the new messsage into database:", err);
//           }else{
//             console.log("The new messsage has been saved successfully into database.");
//           }
//         });
        
//         // Emit the chat message event to the receiver
//         receiverSocket.emit('chat message', { userId, role: role, chatRoomId: chatRoomId,message });
        
//       } else{
//         console.error(`The Receiver User/Hotel Admin with ID ${receiverUserId} is not connected.`);
//       }
//   });
    
//     // Fetch chat history for a given chat room.
//     socket.on("fetch messages", ({ chat_room_id }) => {
//       db.query(
//         "SELECT * FROM ChatMessages WHERE chat_room_id=?",
//         [chat_room_id],
//         (err, result) => {
//           if (err) {
//             console.error("Error while fetching messages:", err);
//           } else {
//             // Emit the chat history to the client
//             socket.emit("chat history", result);
//             console.log("Sent chat history to client:", result);
//           }
//         }
//       );
//     });
    
//     // Handle disconnection.
//     socket.on("disconnect", () => {
//       console.log(`Client disconnected: ${socket.id}`);

//       if (userSockets.get(socket.id)) userSockets.delete(socket.id);
//       else if (hotelAdminSockets.get(socket.id)) hotelAdminSockets.delete(socket.id);
//       else if (siteAdminSocket && siteAdminSocket.id === socket.id) siteAdminSocket = null;
//     });
//   });
// };

// function getConnectedUserIds() {
//   return Array.from(userSockets.keys());
// }

// module.exports = { chat, getConnectedUserIds };


// // 성공 인지아닌지햇갈려
// const socketIo = require('socket.io');
// const db = require('../../config/database');
// let siteAdminSocket = null;
// const userSockets = new Map();
// const hotelAdminSockets = new Map();

// const chat = (server) => {
//   const io = socketIo(server, {
//     cors: {
//       credentials: true,
//       origin: "http://localhost:3000",
//       methods: ["GET", "POST"],
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log(`New client connected: ${socket.id}`);

//     socket.on("register", ({ role, userId }) => {
//       console.log(`Registered user with ID: ${userId}`);

//       if (role === "site_admin") {
//         siteAdminSocket = socket; // site_admin 소켓 설정
//         console.log("Site admin registered with socket ID:", socket.id);
//             // Send the list of all chat rooms to the site admin
//         const allChatRooms = Array.from(userSockets.keys()).map(userId => `${userId}_site_admin`);
//         siteAdminSocket.emit('all chat rooms', allChatRooms);
//       } else if (role === "user") {
//         userSockets.set(userId, socket);
//       } else if (role === "hotel_admin") {
//         hotelAdminSockets.set(userId, socket);
//       }
//     });

//     // Handle incoming messages and forward them to the appropriate receiver.
//     // Also save the message in the database.
//     socket.on('chat message', ({ userId, role, receiverUserId, message }) => {
      
//       let chatRoomId;
//       let receiverSocket;
    
//       // If the receiver is the site admin or a specific user/hotel admin
//       if(role === 'site_admin') { 
//         chatRoomId = `${receiverUserId}_site_admin`;
//         receiverSocket = userSockets.get(receiverUserId) || hotelAdminSockets.get(receiverUserId);
//       } else { 
//         chatRoomId = `${userId}_site_admin`;
//         receiverSocket = siteAdminSocket;
//         if (role === "hotel_admin") {
//           chatRoomId = `${userId}_site_admin`;
//           receiverSocket = siteAdminSocket;
//         }

//       }
//       if(role === 'site_admin' && !receiverSocket) {
//         console.log("채팅방을 선택하세요");
//         return;
//       }
    
//       if(receiverSocket){
//         const sqlInsertMessageToDb =
//           "INSERT INTO ChatMessages (sender_id ,receiver_id ,message ,chat_room_id ) VALUES (?, ?, ?, ?)";
        
//         db.query(sqlInsertMessageToDb ,[userId ,'site_Admin' ,message ,chatRoomId ],(err )=>{
//           if(err){
//             console.error("Failed to save the new messsage into database:", err);
//           }else{
//             console.log("The new messsage has been saved successfully into database.");
//           }
//         });
        
//         // Emit the chat message event to the receiver
//         receiverSocket.emit('chat message', { userId, role: role, chatRoomId: chatRoomId,message });
//         // Also emit the same event back to sender
//         socket.emit('chat message', { userId, role: role, chatRoomId: chatRoomId,message });
//       } else{
//         console.error(`The Receiver User/Hotel Admin with ID ${receiverUserId} is not connected.`);
//       }
//   });
    
//     // Fetch chat history for a given chat room.
//     socket.on("fetch messages", ({ chat_room_id }) => {
//       db.query(
//         "SELECT * FROM ChatMessages WHERE chat_room_id=?",
//         [chat_room_id],
//         (err, result) => {
//           if (err) {
//             console.error("Error while fetching messages:", err);
//           } else {
//             // Emit the chat history to the client
//             socket.emit("chat history", result);
//             console.log("Sent chat history to client:", result);
//           }
//         }
//       );
//     });
    
//     // Handle disconnection.
//     socket.on("disconnect", () => {
//       console.log(`Client disconnected: ${socket.id}`);

//       if (userSockets.get(socket.id)) userSockets.delete(socket.id);
//       else if (hotelAdminSockets.get(socket.id)) hotelAdminSockets.delete(socket.id);
//       else if (siteAdminSocket && siteAdminSocket.id === socket.id) siteAdminSocket = null;
//     });
//   });
// };

// function getConnectedUserIds() {
//   return Array.from(userSockets.keys());
// }

// module.exports = { chat, getConnectedUserIds };



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
