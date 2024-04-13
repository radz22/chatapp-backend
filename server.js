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

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/frontend/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1, "/frontend", "build", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }

const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

app.get("/", (req, res) => {
  res.send("sucessfull");
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://chatapp-frontend-t6ld.onrender.com/",

    // credentials: true,
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
