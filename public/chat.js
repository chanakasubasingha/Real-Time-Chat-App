const socket = io();

socket.on('counterUpdated', (arg) => {
    console.log('the count has been changed!', arg);
});

document.querySelector('#increment').addEventListener('click', (event) => {
    event.preventDefault();
    console.log('Clicked');
    socket.emit('increment');
});