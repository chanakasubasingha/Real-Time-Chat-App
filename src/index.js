const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Filter = require('bad-words');
const path = require("path");
const { generateMessage, generateLocation } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
    },
});

const PORT = process.env.PORT || 3000;

app.use(express.json());

io.on('connection', (socket) => {
    console.log('New web socket connection');

    socket.on('join', (options, callback) => {

        const { error, user } = addUser({ id: socket.id, ...options });

        if (error) {
            return callback(error);
        }

        const { username, room } = user;

        socket.join(room);

        socket.emit('message', generateMessage('Welcome', 'Admin'));
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`, 'Admin'));
        io.to(room).emit('roomData', {
            room,
            users: getUsersInRoom(room)
        });
        callback();
    });

    socket.on("sendMessage", (msg, callback) => {
        const filter = new Filter();
        const { username, room } = getUser(socket.id);

        if (filter.isProfane(msg)) {
            return callback('Profanity is not allowed!');
        }

        io.to(room).emit('message', generateMessage(msg, username));
        callback();
    });

    socket.on("sendLocation", (loc, callback) => {
        const { username, room } = getUser(socket.id);
        io.to(room).emit('message', generateLocation(loc, username));
        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`, 'Admin'));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    });
});

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
