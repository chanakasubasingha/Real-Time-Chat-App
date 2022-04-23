import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/Home';
import Join from './components/Join';
import UserContext from "./UserContext";

function App() {
  const [session, setSession] = useState({
    username: '',
    room: ''
  });

  const appSettings = {
    session,
    setSession
  };

  return (
    <Router>
      <UserContext.Provider value={appSettings} children={setSession}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join" element={<Join />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
