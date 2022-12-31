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
    socket.on('join', ({ roomId, nickname }) => {
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

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit('disconnected', {
                socketId: socket.id,
                nickname: userSocketMap[socket.id]
            });
        })
        delete userSocketMap[socket.id];
        socket.leave();
    });

    socket.on('code-change', ({ roomId, code }) => {
        // console.log('receiving code!', code);
        socket.in(roomId).emit('code-change', { code });
    })

    socket.on('sync-code', ({ socketId, code }) => {
        // console.log('syncing code!', code);
        io.to(socketId).emit('code-change', { code });
    })
});

server.listen(80, () => {
    console.log("Running at localhost:80");
});