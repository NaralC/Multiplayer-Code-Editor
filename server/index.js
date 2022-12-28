const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io');
// const ACTIONS = require('../client/src/constants/actions')

app.use(cors);
app.use(express.json());

app.get("/", (req, res) => {
    res.send({ uptime: process.uptime() });
});

const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};
const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            nickname: userSocketMap[socketId],
        }
    })
}

io.on("connection", (socket) => {
    console.log(socket);
    socket.on('join',({ roomId, nickname }) => {
        userSocketMap[socket.id] = nickname;
        socket.join(roomId);

        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit('joined', {
                clients,
                nickname,
                socketId: socket.id
            });
        })
    })
});

server.listen(80, () => {
    console.log("Running at localhost:80");
});