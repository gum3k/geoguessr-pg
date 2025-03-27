import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import NavigationComponent from '../components/theme/NavigationComponent';
import ContainerComponent from '../components/theme/ContainerComponent';
import ContentComponent from '../components/theme/ContentComponent'; 
import BasicButtonComponent from '../components/theme/BasicButtonComponent';
import io from 'socket.io-client';
import { fetchLocations } from '../utils/fetchLocations';

// Connect to the server
const socket = io('http://localhost:5000');

const LobbyPage = () => {
  const { lobbyId } = useParams();
  const [lobbyData, setLobbyData] = useState(null);
  const [players, setPlayers] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [isHost, setIsHost] = useState(false);

  const handleBeforeUnload = useCallback(() => {
    if (isHost) {
      socket.emit('hostLeaving', lobbyId);
    }
    socket.emit('leaveLobby', lobbyId);
  }, [isHost, lobbyId]);

  // Move startGame above the useEffect where it is used
  const startGame = useCallback(async () => {
    const locations = await fetchLocations(lobbyData.rounds);
    socket.emit('setLocations', { lobbyId, locations });
    console.log('Starting the game...');
    socket.emit('startGame', lobbyId); // Notify the server to start the game
  }, [lobbyData, lobbyId]);

  useEffect(() => {
    const gameStarting = () => {
      console.log('Game is starting!');
      navigate(`/game/${lobbyId}`, { state: { lobbyId } });
    };

    socket.on('lobbyData', async (data) => {
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
  }, [lobbyId, isHost, navigate, startGame, handleBeforeUnload]);

  useEffect(() => {
    console.log(`Joining lobby with ID: ${lobbyId}`);
    socket.emit('joinLobby', lobbyId); // Join the existing lobby
  }, [lobbyId]);

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
  }, [location, lobbyId, handleBeforeUnload]);

  const exitLobby = () => {
    if (isHost) {
      socket.emit('hostLeaving', lobbyId);
    }
    socket.emit('leaveLobby', lobbyId); // Leave the lobby
    navigate('/'); // Redirect to the home page
  };

  return (
    <ContainerComponent>
      <NavigationComponent />
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
