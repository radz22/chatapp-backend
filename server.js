const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
const port = 3000;
const io = require("socket.io")(8080 || port, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chatapp-frontend-t6ld.onrender.com/",
    ],
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
