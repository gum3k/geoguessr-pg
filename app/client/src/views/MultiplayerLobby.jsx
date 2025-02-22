import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import NavigationComponent from '../components/theme/NavigationComponent';
import ContainerComponent from '../components/theme/ContainerComponent'; 
import MovingImageComponent from '../components/theme/MovingImageComponent'; 
import ContentComponent from '../components/theme/ContentComponent'; 
import BasicButtonComponent from '../components/theme/BasicButtonComponent';
import io from 'socket.io-client';

// Connect to the server
const socket = io('http://localhost:5000');

const LobbyPage = () => {
  const { lobbyId } = useParams();
  const [lobbyData, setLobbyData] = useState(null);
  const [players, setPlayers] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [isHost, setIsHost] = useState(false);

  const handleBeforeUnload = () => {
    if (isHost) {
      socket.emit('hostLeaving', lobbyId);
    }
    socket.emit('leaveLobby', lobbyId);
  };

  useEffect(() => {
    const gameStarting = () => {
      console.log('Game is starting!');
      navigate(`/game`, { state: { lobbyId } });
    };

    console.log(`Joining lobby with ID: ${lobbyId}`);
    socket.emit('joinLobby', lobbyId); // Join the existing lobby

    socket.on('lobbyData', (data) => {
      console.log('Received updated lobby data:', data);
      setLobbyData(data);
      setPlayers(data.players.length);
      setIsHost(data.players[0].id === socket.id);
    });

    socket.on('startGame', startGame);
    socket.on('gameStarting', gameStarting);

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      socket.off('lobbyData');
      socket.off('startGame');
      socket.off('gameStarting');
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [lobbyId, isHost]); // Adding lobbyId and isHost as dependencies to refresh when they change

  useEffect(() => {
    const handleRouteChange = () => {
      if (!location.pathname.includes(`/lobby/${lobbyId}`)) {
        handleBeforeUnload();
      }
    };

    handleRouteChange(); // Check on initial render
    return () => {
      handleRouteChange(); // Cleanup on unmount
    };
  }, [location, lobbyId]);

  const exitLobby = () => {
    if (isHost) {
      socket.emit('hostLeaving', lobbyId);
    }
    socket.emit('leaveLobby', lobbyId); // Leave the lobby
    navigate('/'); // Redirect to the home page
  };

  const startGame = () => {
    console.log('Starting the game...');
    socket.emit('startGame', lobbyId); // Notify the server to start the game
  };

  return (
    <ContainerComponent>
      <NavigationComponent />
      <MovingImageComponent />
      <ContentComponent>
        {lobbyData ? (
          <>
            <h1>Lobby: {lobbyData.lobbyId}</h1>
            <p>{players} / 4 players</p>
            <p>Waiting for other players...</p>

            <h2>Game Details</h2>
            <p><strong>Rounds:</strong> {lobbyData.rounds}</p>
            <p><strong>Map:</strong> {lobbyData.mapName}</p>
            <p><strong>Game Mode:</strong> {lobbyData.selectedMode}</p>

            {isHost && (
              <BasicButtonComponent 
                buttonText="Start Game" 
                onClick={startGame} 
              />
            )}

            <BasicButtonComponent buttonText="Exit Lobby" onClick={exitLobby} />
          </>
        ) : (
          <p>Loading lobby...</p>
        )}
      </ContentComponent>
    </ContainerComponent>
  );
};

export default LobbyPage;
