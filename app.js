// require("dotenv").config();

// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cluster = require("cluster");
// const os = require("os");
// const cors = require("cors");
// const helmet = require("helmet");

// const { connectDB } = require("./src/db/connection");
// const router = require("./src/api/route/routes");

// const Message = require("./src/model/message.model");

// const PORT = process.env.PORT || 3008;
// const cpuCount = os.cpus().length;

// if (cluster.isPrimary) {
//   console.log(`Primary ${process.pid} running`);
//   console.log(`Forking for ${cpuCount} CPUs`);

//   for (let i = 0; i < cpuCount; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker) => {
//     console.log(`Worker ${worker.process.pid} died. Restarting...`);
//     cluster.fork();
//   });

// } else {

//   const app = express();
//   app.use(express.json());

//   app.use(cors({
//     origin: "http://localhost:3000",
//     credentials: true
//   }));

//   app.use(helmet());
//   app.use("/api/v1", router);

//   const server = http.createServer(app);

//   const io = new Server(server, {
//     cors: {
//       origin: "http://localhost:3000",
//       methods: ["GET", "POST"]
//     }
//   });

//   io.on("connection", (socket) => {
//     console.log("User connected:", socket.id);

//     socket.on("joinConversation", (conversationId) => {
//       socket.join(conversationId);
//     });

//     socket.on("sendMessage", async (data) => {
//       try {
//         const { conversationId, senderId, text } = data;

//         const message = await Message.create({
//           conversationId,
//           sender: senderId,
//           text
//         });

//         const populatedMessage = await message.populate("sender", "name");

//         io.to(conversationId).emit("receiveMessage", populatedMessage);

//       } catch (err) {
//         console.error("Message error:", err);
//       }
//     });

//     socket.on("disconnect", () => {
//       console.log("User disconnected:", socket.id);
//     });
//   });

// app.get("/welcome", (req, res) => {
//     res.status(200).send({ message: "the server is running" });
//   });

//   app.get("/healthcheck", (req, res) => {
//     res.status(200).send({ message: "ok", status: 200 });
//   });

//   app.listen(PORT, console.log("server is running at ", PORT));

  
//   connectDB()
//     .then(() => {
//       server.listen(PORT, "0.0.0.0", () => {
//         console.log(`Worker ${process.pid} running on port ${PORT}`);
//       });
//     })
//     .catch((err) => {
//       console.error("DB connection failed:", err);
//     });
// }

require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");

const { connectDB } = require("./src/db/connection");
const router = require("./src/api/route/routes");
const Message = require("./src/model/message.model");

const PORT = process.env.PORT || 3008;

const app = express();

// ===========================
// MIDDLEWARE
// ===========================

app.use(express.json());

app.use(cors({
  origin: "*", // change later in production
  credentials: true
}));

app.use(helmet());

app.use("/api/v1", router);

// Health Routes
app.get("/welcome", (req, res) => {
  res.status(200).send({ message: "Server is running" });
});

app.get("/healthcheck", (req, res) => {
  res.status(200).send({ status: "OK" });
});

// ===========================
// HTTP + SOCKET SERVER
// ===========================

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // change later in production
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
    try {
      const { conversationId, senderId, text } = data;

      const message = await Message.create({
        conversationId,
        sender: senderId,
        text
      });

      const populatedMessage = await message.populate("sender", "name");

      io.to(conversationId).emit("receiveMessage", populatedMessage);

    } catch (err) {
      console.error("Message error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ===========================
// CONNECT DB + START SERVER
// ===========================

connectDB()
  .then(() => {
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });