import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StartingScreen from "./views/StartingScreen";
import GameView from "./views/GameView";
import RoundSelectionScreen from "./views/RoundSelectionScreen";
import RoundSelectionScreenMulti from "./views/RoundSelectionScreenMulti";
import MultiplayerLobby from "./views/MultiplayerLobby";
import RegisterView from "./views/RegisterView";
import LoginView from "./views/LoginView";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartingScreen />} />
        <Route path="/game" element={<GameView />} />
        <Route path="/game/:lobbyId" element={<GameView />} />
        <Route path="/gamesettings" element={<RoundSelectionScreen />} />
        <Route path="/gamesettings_multi" element={<RoundSelectionScreenMulti />} />
        <Route path="/lobby/:lobbyId" element={<MultiplayerLobby />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/login" element={<LoginView />} />
      </Routes>
    </Router>
  );
};

export default App;