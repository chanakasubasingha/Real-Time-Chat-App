const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocation } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
    },
});

const PORT = process.env.PORT || 5000;

app.use(express.json());

io.on('connection', (socket) => {
    console.log('New web socket connection');

    socket.emit('message', generateMessage('Welcome'));
    socket.broadcast.emit('message', generateMessage('A new user has joined!'));

    socket.on("sendMessage", (msg, callback) => {
        const filter = new Filter();

        if (filter.isProfane(msg)) {
            return callback('Profanity is not allowed!');
        }

        io.emit('message', generateMessage(msg));
        callback();
    });

    socket.on("sendLocation", (loc, callback) => {
        io.emit('message', generateLocation(loc));
        callback();
    });

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left!'));
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});