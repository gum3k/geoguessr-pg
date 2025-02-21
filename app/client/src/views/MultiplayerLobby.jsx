import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavigationComponent from '../components/theme/NavigationComponent';
import ContainerComponent from '../components/theme/ContainerComponent'; 
import MovingImageComponent from '../components/theme/MovingImageComponent'; 
import ContentComponent from '../components/theme/ContentComponent'; 
import BasicButtonComponent from '../components/theme/BasicButtonComponent';
import io from 'socket.io-client';

// Connect to the server
const socket = io('http://localhost:5000');

const LobbyPage = () => {
  const { lobbyId } = useParams();  // Extract lobbyId from the URL
  const [lobbyData, setLobbyData] = useState(null);
  const [players, setPlayers] = useState(0);  // Track number of players
  const navigate = useNavigate();
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    // Handle game start notification
    const gameStarting = () => {
      console.log('Game is starting!');
      // Navigate to the game screen when the game starts
      navigate(`/game`, { state: { lobbyId } });
    };

    console.log('LobbyPage mounted');
    console.log(`Joining lobby with ID: ${lobbyId}`);
    
    socket.emit('joinLobby', lobbyId); // Join the existing lobby

    // Listen for updated lobby data from the server
    socket.on('lobbyData', (data) => {
      console.log('Received updated lobby data:', data);
      setLobbyData(data);
      setPlayers(data.players.length);  // Update the player count

      // Check if the current user is the host (assuming the host is the first player)
      setIsHost(data.players[0].id === socket.id);
    });

    socket.on('startGame', startGame);
    socket.on('gameStarting', gameStarting);

    // Cleanup event listener on component unmount
    return () => {
      socket.off('lobbyData');
      socket.off('startGame');
      socket.off('gameStarting');
    };
  }, [lobbyId]); // Adding lobbyId as a dependency to refresh when lobbyId changes

  const exitLobby = () => {
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
