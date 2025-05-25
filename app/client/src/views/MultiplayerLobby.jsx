import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import NavigationComponent from '../components/theme/NavigationComponent';
import ContainerComponent from '../components/theme/ContainerComponent';
import ContentComponent from '../components/theme/ContentComponent'; 
import BasicButtonComponent from '../components/theme/BasicButtonComponent';
import socket from "../socket";
import { fetchLocations } from '../utils/fetchLocations';
import { getUserIdFromToken } from '../utils/getToken';

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

  const startGame = useCallback(async () => {
    const locations = await fetchLocations(lobbyData.rounds, lobbyData.map.directory);
    socket.emit('setLocations', { lobbyId, locations });
    socket.emit('startGame', lobbyId);
  }, [lobbyData, lobbyId]);

  useEffect(() => {
    const gameStarting = (data) => {
      navigate(`/game/multi/${lobbyId}`, {
        state: {
          lobbyId,
          roundTime: data.roundTime,
          selectedMode: data.selectedMode,
          map: data.map,
          gameId: data.gameId 
        },
      });
    };

    socket.on('lobbyData', async (data) => {
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
    socket.emit('joinLobby', {
      lobbyId,
      accountId: getUserIdFromToken(),
    });
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
            <p>{players} / {lobbyData.maxPlayers} players</p>
            <p>Waiting for other players...</p>

            <h2>Game Details</h2>
            <p><strong>Rounds:</strong> {lobbyData.rounds}</p>
            <p><strong>Map:</strong> {lobbyData.map.name}</p>
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
