const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.static("public"));   // 

io.on("connection", (socket) => {
    console.log("🟢 A user connected");

    socket.on("mouse", (data) => {
        socket.broadcast.emit("mouse", data);
    });
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
