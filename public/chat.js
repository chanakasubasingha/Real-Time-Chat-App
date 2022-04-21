const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');

socket.on('message', (msg) => {
    console.log(msg);
});

document.querySelector('#message-form').addEventListener('submit', (event) => {
    event.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled');

    // disable
    const message = event.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {

        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if (error) {
            return console.log(error);
        }

        console.log('Message Delivered!');
    });
});

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by the browser!');
    }

    $sendLocationButton.setAttribute('disabled', 'disabled');

    socket.emit('sendLocation', {
        latitude: 10,
        longitude: 12
    }, () => {
        $sendLocationButton.removeAttribute('disabled');
        console.log('Location shared!');
    });
});
