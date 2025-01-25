import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GameView from './views/GameView';
import RoundStartView from './views/RoundStartView';
import SettingsView from './views/SettingsView';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define the routes */}
        <Route path="/" element={<RoundStartView />} />
        <Route path="/game" element={<GameView />} />
        <Route path="/gamesettings" element={<SettingsView/>}/>
      </Routes>
    </Router>
  );
};

export default App;
