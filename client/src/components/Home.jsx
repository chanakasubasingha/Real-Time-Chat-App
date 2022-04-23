import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import UserContext from '../UserContext';
const socket = io("http://localhost:5000/");

function Home() {
    const { session: { username } } = useContext(UserContext);

    const [data, setData] = useState([]);

    useEffect(() => {
        socket.on('message', (response) => {
            setData([...data, response]);
        });
    }, [data]);

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
        <div>
            <div className="chat">
                <div className="chat__sidebar">

                </div>
                <div>{username}</div>
                <div className="chat__main">
                    <div className="chat__messages">
                        {data.map(({ createdAt, res, type }, index) => {
                            return (
                                <div key={index} className='message'>
                                    <p>
                                        <span className='message__name'>Some User Name</span>
                                        <span className='message__meta'>{createdAt}</span>
                                    </p>
                                    <p>{type === 'loc' ? <Link to={res}>My Current Location</Link> : res}</p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="compose">
                        <form id="message-form">
                            <input name="message" placeholder="hello there!" value={userInput} onChange={handleChange} />
                            <button onClick={onSendMessage} disabled={disabled.messageButton}>Send</button>
                        </form>
                        <button id="send-location" onClick={onSendLocation}>Send Location</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;