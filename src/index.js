const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));
app.use(express.json());

io.on('connection', (socket) => {
    console.log('New web socket connection');

    socket.emit('message', 'Welcome');
    socket.broadcast.emit('message', 'A new user has joined!');

    socket.on("sendMessage", (msg, callback) => {
        const filter = new Filter();

        if (filter.isProfane(msg)) {
            return callback('Profanity is not allowed!');
        }

        io.emit('message', msg);
        callback();
    });

    socket.on("sendLocation", (loc, callback) => {
        io.emit('message', `https://google.com/maps?q=${loc.latitude},${loc.longitude}`);

        callback();
    });

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});