import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartingScreen from './views/StartingScreen';
import GameView from './views/GameView';
import RoundSelectionScreen from './views/RoundSelectionScreen';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define the routes */}
        <Route path="/" element={<StartingScreen />} />
        <Route path="/game" element={<GameView />} />
        <Route path="/gamesettings" element={<RoundSelectionScreen/>}/>
      </Routes>
    </Router>
  );
};

export default App;
