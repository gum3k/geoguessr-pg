import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StartingScreen from "./views/StartingScreen";
import GameView from "./views/GameView";
import RoundSelectionScreen from "./views/RoundSelectionScreen";
import MultiplayerLobby from "./views/MultiplayerLobby";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartingScreen />} />
        <Route path="/game" element={<GameView />} />
        <Route path="/gamesettings" element={<RoundSelectionScreen />} />
        <Route path="/lobby" element={<MultiplayerLobby />} />
      </Routes>
    </Router>
  );
};

export default App;
