import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import ACTIONS from "../client/src/constants/actions";
import { on } from "events";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

const app = express();
app.use(cors());
const PORT = 8000;

app.get("/", (req, res) => {
  res.send({ uptime: process.uptime() });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5173/",
    methods: ["GET", "POST"],
  }
});

const userSocketMap: {
  [key: string]: string | undefined;
} = {};
const getAllConnectedClients = (roomId: string) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        nickname: userSocketMap[socketId],
      };
    }
  );
};

io.on("connection", (socket) => {
  socket.on(ACTIONS.JOIN, ({ roomId, nickname }) => {
    userSocketMap[socket.id] = nickname;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        nickname,
        socketId: socket.id,
      });
    });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        nickname: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave(socket.id);
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.JOIN_SYNC, ({ socketId, code, newTheme, newLanguage, newOutput }) => {
    console.log('join sync', newOutput);
    
    socket.in(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    socket.in(socketId).emit(ACTIONS.THEME_CHANGE, { newTheme });
    socket.in(socketId).emit(ACTIONS.LANGUAGE_CHANGE, { newLanguage });
    socket.in(socketId).emit(ACTIONS.OUTPUT_CHANGE, { newOutput });
  });

  socket.on(ACTIONS.COMPILATION_STATUS_CHANGE, ({ roomId, compilationStatus }) => {
    io.to(roomId).emit(ACTIONS.COMPILATION_STATUS_CHANGE, { compilationStatus })
  })

  socket.on(ACTIONS.THEME_CHANGE, ({ roomId, newTheme }) => {
    io.to(roomId).emit(ACTIONS.THEME_CHANGE, { newTheme })
  })

  socket.on(ACTIONS.LANGUAGE_CHANGE, ({ roomId, newLanguage }) => {
    io.to(roomId).emit(ACTIONS.LANGUAGE_CHANGE, { newLanguage })
  })

  socket.on(ACTIONS.OUTPUT_CHANGE, ({ roomId, newOutput }) => {
    io.to(roomId).emit(ACTIONS.OUTPUT_CHANGE, { newOutput })
  })
});

server.listen(PORT, () => {
  console.log(`Running at localhost:${PORT}`);
});
