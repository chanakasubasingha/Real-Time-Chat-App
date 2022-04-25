import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';

function Join() {
    const navigate = useNavigate();

    const { setCurrentUser, socket } = useContext(UserContext);

    const [userData, setUserData] = useState({
        username: '',
        room: ''
    });

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {

    }, [errorMessage]);

    const handleChange = ({ target: { name, value } }) => {
        setUserData({ ...userData, [name]: value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const { username, room } = userData;

        setCurrentUser(username);

        if (room.length > 10) {
            return setErrorMessage('room must be 10 characters or less!');
        }

        if (username.length > 10) {
            return setErrorMessage('username must be 10 characters or less!');
        }

        socket.emit('join', { username, room }, (error) => {
            if (error) {

                return setErrorMessage(error);
            }
        });

        (username && room) && navigate('/chat');
    };

    return (
        <div className='centered-form'>
            <div className='centered-form__box'>
                <p style={{ color: 'red', fontSize: 13 }}>{errorMessage}</p>
                <h1>Join</h1>
                <form>
                    <label>Display Name</label>
                    <input type='text' name='username' value={userData.username} onChange={handleChange} placeholder='Display name' required />
                    <label>Room</label>
                    <input type='text' name='room' value={userData.room} onChange={handleChange} placeholder='Room' required />
                    <button onClick={onSubmit}>Join</button>
                </form>
            </div>
        </div>
    );
}

export default Join;