const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const { measureMemory } = require('vm');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));
app.use(express.json());

io.on('connection', (socket) => {
    console.log('New web socket connection');

    // send to a specific client - socket.emit('blah', var);
    // send to all clients - io.emit('blah', var);

    socket.on("message", (msg) => {
        io.emit('broadcastMessage', msg);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});