const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));
app.use(express.json());

let count = 0;

io.on('connection', (socket) => {
    console.log('New web socket connection');

    socket.emit('counterUpdated', count);

    socket.on('increment', () => {
        count += 1;
        // socket.emit('counterUpdated', count);
        io.emit('counterUpdated', count);
    });

});

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});