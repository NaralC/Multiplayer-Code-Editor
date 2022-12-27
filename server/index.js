const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server);

// app.use(cors());
// app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Listening on port ${port}`)
// })

io.on('connection', (socket) => {
    console.log(socket.id);
})

server.listen(80, () => {
    console.log(`Listening on port 80`)
})