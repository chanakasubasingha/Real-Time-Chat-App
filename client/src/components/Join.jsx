import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';

function Join() {
    const navigate = useNavigate();

    const { setSession } = useContext(UserContext);

    const [userData, setUserData] = useState({
        username: '',
        room: ''
    });

    const handleChange = ({ target: { name, value } }) => {
        setUserData({ ...userData, [name]: value });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        navigate('/');
        setSession({
            username: userData.username,
            room: userData.room
        });
    };

    return (

        <div className='centered-form'>
            <div className='centered-form__box'>
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