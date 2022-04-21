const socket = io();

document.querySelector('#message-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const message = event.target.elements.message.value;
    socket.emit('message', message);
});

socket.on('broadcastMessage', msg => console.log(msg));