import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/UserPages/Login";
import Register from "./components/UserPages/Register";
import ChatPage from "./components/Chats/ChatPage";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/register" element={<Register />}></Route>
        <Route exact path="/connect" element={<ChatPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;