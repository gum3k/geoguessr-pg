import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GameView from './views/GameView';
import StartView from './views/StartView';
import SettingsView from './views/SettingsView';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define the routes */}
        <Route path="/" element={<StartView />} />
        <Route path="/game" element={<GameView />} />
        <Route path="/gamesettings" element={<SettingsView/>}/>
      </Routes>
    </Router>
  );
};

export default App;
