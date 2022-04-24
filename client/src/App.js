import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chat from './components/Chat';
import Join from './components/Join';
import UserContext from "./UserContext";
import { io } from 'socket.io-client';
const socket = io("http://localhost:5000");

function App() {

  const [session, setSession] = useState({
    username: '',
    room: ''
  });

  const appSettings = {
    session,
    setSession,
    socket
  };

  return (
    <Router>
      <UserContext.Provider value={appSettings} children={setSession}>
        <Routes>
          <Route path="/chat" element={<Chat />} />
          <Route path="/" element={<Join />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
