import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import StartingScreen from "./views/StartingScreen";
import GameView from "./views/GameView";
import RoundSelectionScreen from "./views/RoundSelectionScreen";
import RoundSelectionScreenMulti from "./views/RoundSelectionScreenMulti";
import MultiplayerLobby from "./views/MultiplayerLobby";
import RegisterView from "./views/RegisterView";
import LoginView from "./views/LoginView";
import ProfileView from "./views/ProfileView";
import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "./utils/getToken";

const isLoggedIn = () => {
  return getToken();
};

const RequireAuth = ({ children }) => {
  const location = useLocation();
  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};
const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<StartingScreen />} />
          <Route path="/game" element={<RequireAuth><GameView /></RequireAuth>} />
          <Route path="/game/multi/:lobbyId" element={<RequireAuth><GameView /></RequireAuth>} />
          <Route path="/game/single/:gameId" element={<RequireAuth><GameView /></RequireAuth>} />
          <Route path="/gamesettings" element={<RequireAuth><RoundSelectionScreen /></RequireAuth>} />
          <Route path="/gamesettings_multi" element={<RequireAuth><RoundSelectionScreenMulti /></RequireAuth>} />
          <Route path="/lobby/:lobbyId" element={<RequireAuth><MultiplayerLobby /></RequireAuth>} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/profile" element={<RequireAuth><ProfileView /></RequireAuth>} />
          {/* Catch-all route for unknown paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        draggable
      />
    </>
  );
};

export default App;