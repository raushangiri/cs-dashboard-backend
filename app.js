require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cluster = require("cluster");
const os = require("os");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");

const { connectDB } = require("./src/db/connection");
const router = require("./src/api/route/routes");

const Message = require("./src/model/message.model");
const Conversation = require("./src/model/conversation.model");
const User = require("./src/model/user.model");

const PORT = 3008;
const cpuCount = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} running`);
  console.log(`Forking for ${cpuCount} CPUs`);

  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

} else {

  // ===========================
  // WORKER CODE
  // ===========================

  const app = express();

  app.use(express.json());
  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
  }));
  app.use(helmet());

  app.use("/", router);

  // ===========================
  // HTTP + SOCKET SERVER
  // ===========================

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // ===========================
  // SOCKET LOGIC
  // ===========================

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
  });

 socket.on("sendMessage", async (data) => {
  console.log("Incoming socket data:", data); // 👈 ADD THIS

  const { conversationId, senderId, text } = data;

  console.log("Text value:", text); // 👈 ADD THIS

  const message = await Message.create({
    conversationId,
    sender: senderId,
    text: text 
  });

  console.log("Saved message:", message); // 👈 ADD THIS
});

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

  // ===========================
  // DB CONNECT + START SERVER
  // ===========================

  connectDB()
    .then(() => {
      server.listen(PORT, () => {
        console.log(`Worker ${process.pid} running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("DB connection failed:", err);
    });
}

// const createDefaultGroup = async () => {
//   const existing = await Conversation.findOne({ type: "group" });

//   if (!existing) {
//     const users = await User.find({ status: "active" });

//     await Conversation.create({
//       type: "group",
//       name: "Team Group",
//       participants: users.map((u) => u._id),
//     });

//     console.log("✅ Default group created");
//   } else {
//     console.log("✅ Group already exists");
//   }
// };

// createDefaultGroup();

// connectDB().then(async () => {
//   await createDefaultGroup();

//   server.listen(3008, () => {
//     console.log("Server running on 3008");
//   });
// });