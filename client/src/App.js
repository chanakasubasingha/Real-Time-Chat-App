import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chat from './components/Chat';
import Join from './components/Join';
import UserContext from "./UserContext";
import { io } from 'socket.io-client';
const socket = io("http://localhost:5000");

function App() {

  const [currentUser, setCurrentUser] = useState('');

  const appSettings = {
    currentUser,
    setCurrentUser,
    socket
  };

  return (
    <Router>
      <UserContext.Provider value={appSettings}>
        <Routes>
          <Route path="/chat" element={<Chat />} />
          <Route path="/" element={<Join />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
