// sockets/collabSocket.js
export const collabSocket = (io) => {
    io.on("connection", (socket) => {
      console.log("🔌 New client connected:", socket.id);
  
      // Join a project room
      socket.on("joinProject", ({ projectId, userId }) => {
        socket.join(projectId);
        io.to(projectId).emit("userJoined", { userId });
      });
  
      // Code changes
      socket.on("codeChange", ({ projectId, code, filePath }) => {
        socket.to(projectId).emit("codeUpdate", { code, filePath });
      });
  
      // Chat messages
      socket.on("chatMessage", ({ projectId, userId, message }) => {
        io.to(projectId).emit("newMessage", { userId, message });
      });
  
      // Whiteboard updates
      socket.on("whiteboardUpdate", ({ projectId, data }) => {
        socket.to(projectId).emit("whiteboardUpdate", data);
      });
  
      // Admin removes a user
      socket.on("kickUser", ({ projectId, targetUserId }) => {
        io.to(projectId).emit("userKicked", { targetUserId });
      });
  
      // User leaves
      socket.on("leaveProject", ({ projectId, userId }) => {
        socket.leave(projectId);
        io.to(projectId).emit("userLeft", { userId });
      });
  
      socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
      });
    });
  };
  