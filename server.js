const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
dotenv.config();

/* deployment*/

app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
});

const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

app.get("/api/data", (req, res) => {
  res.json({ message: "API Route" });
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://chatapp-frontend-t6ld.onrender.com/",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join", (data) => {
    const { name, room, time } = data;
    socket.join(room);
    socket.broadcast.to(room).emit("join", {
      user: name,
      currentTime: time,
    });
    // io.emit("user", name);
    io.in(room).emit("user", name);
  });

  socket.on("sender", (data) => {
    const { name, room, message } = data;
    socket.join(room);

    io.to(room).emit("receiver", {
      user: name,
      message: message,
    });
  });
});
