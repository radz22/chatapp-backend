import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // You might want to restrict this to your frontend's URL
    methods: ["GET", "POST"],
  },
});

let users: any = [];

io.on("connection", (socket) => {
  socket.on("join", (data) => {
    const { name, room, time } = data;
    socket.join(room);
    users.push({ name, room });

    const result = users.filter((user: any) => user.room === room);
    socket.broadcast.to(room).emit("join", {
      user: name,
      currentTime: time,
    });
    io.to(room).emit("user", result);
  });

  socket.on("sender", (data) => {
    const { name, room, message } = data;
    socket.join(room);
    socket.to(room).emit("notification", {
      name: name,
    });
    io.to(room).emit("receiver", {
      user: name,
      message: message,
    });
  });
});

server.listen(5000, () => {
  console.log("Server has started on port 3001!");
});
