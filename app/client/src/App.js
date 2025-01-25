import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartingScreen from './components/StartingScreen';
import LocationView from './components/LocationView';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define the routes */}
        <Route path="/" element={<StartingScreen />} />
        <Route path="/location" element={<LocationView />} />
      </Routes>
    </Router>
  );
};

export default App;
