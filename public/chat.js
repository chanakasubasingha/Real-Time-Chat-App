const socket = io();
socket.on('message', (msg) => {
    console.log(msg);
});

document.querySelector('#message-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const message = event.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {
        if (error) {
            return console.log(error);
        }

        console.log('Message Delivered!');
    });
});

document.querySelector('#send-location').addEventListener('click', () => {

    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('sendLocation', {
            latitude,
            longitude
        }, () => {
            console.log('Location shared!');
        });
    });
});
