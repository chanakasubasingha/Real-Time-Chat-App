import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';

function Chat() {
    const navigate = useNavigate();

    const { socket } = useContext(UserContext);

    const [data, setData] = useState([]);
    const [roomData, setRoomData] = useState({
        roomName: '',
        users: []
    });

    useEffect(() => {
        socket.on('message', (response) => {
            setData([...data, response]);
        });

        socket.on('roomData', ({ room, users }) => {
            setRoomData({ roomName: room, users });
        });

    }, [data, navigate, socket]);

    const [disabled, setDisabled] = useState({
        messageButton: false,
        locationButton: false
    });

    const [userInput, setUserInput] = useState('');

    const handleChange = ({ target: { value } }) => {
        setUserInput(value);
    };

    const onSendMessage = (e) => {
        e.preventDefault();
        if (!userInput) {
            return;
        }
        setDisabled({ messageButton: true });

        socket.emit('sendMessage', userInput, (error) => {
            if (error) {
                return console.log(error);
            }

            console.log('Message Delivered!');
        });

        setDisabled({ messageButton: false });
        setUserInput('');
    };

    const onSendLocation = (e) => {
        e.preventDefault();
        setDisabled({ locationButton: true });

        if (!navigator.geolocation) {
            return console.log('Browser does not support for geolocation service!');
        }

        socket.emit('sendLocation', { latitude: 10, longitude: 20 }, () => console.log('Location shared!'));

        setDisabled({ locationButton: false });
    };

    return (
        <>
            <div className="chat">
                <div className="chat__sidebar">
                    <h2 className='room-title'>Room: {roomData.roomName}</h2>
                    <h3 className='list-title'>Users</h3>
                    <ul className='users'>
                        {roomData.users.map((user) => {
                            return <li key={user.id}>{user.username}</li>;
                        })}
                    </ul>
                </div>
                <div className="chat__main">
                    <div className="chat__messages" >
                        {data.map(({ createdAt, res, type, username }, index) => {
                            return (
                                <div>
                                    <div key={index} className='message' >
                                        <p>
                                            <span className='message__name' style={username === 'Admin' ? { color: 'tomato' } : { color: '#000f1e' }}>{username}</span>
                                            <span className='message__meta'>{createdAt}</span>
                                        </p>
                                        <p>{type === 'loc' ? <Link to={res}>My Current Location</Link> : res}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="compose">
                        <form id="message-form">
                            <input name="message" placeholder="hello there!" value={userInput} onChange={handleChange} required />
                            <button onClick={onSendMessage} disabled={disabled.messageButton || !userInput} >Send</button>
                        </form>
                        <button id="send-location" onClick={onSendLocation}>Send Location</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Chat;