import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationComponent from '../components/theme/NavigationComponent';
import ContainerComponent from '../components/theme/ContainerComponent'; 
import MovingImageComponent from '../components/theme/MovingImageComponent'; 
import ContentComponent from '../components/theme/ContentComponent'; 
import BasicButtonComponent from '../components/theme/BasicButtonComponent';
import SliderComponent from '../components/pages/settings/SliderComponent';
import io from 'socket.io-client';
import { fetchLocations } from '../utils/fetchLocations';

const socket = io('http://localhost:5000');

const RoundSelectionScreen = () => {
  const [rounds, setRounds] = useState(5);
  const [selectedMode, setSelectedMode] = useState('Move');
  const [roundTime, setRoundTime] = useState(0);
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  const [mapName] = useState('equally_distributed_world_5mln');
  const [lobbyCreated, setLobbyCreated] = useState(false);
  const [lobbyId, setLobbyId] = useState(null); // Store lobby ID here
  const navigate = useNavigate();

  useEffect(() => {
    const handleLobbyCreated = (lobbyData) => {
      console.log('Lobby Created:', lobbyData);
      setLobbyCreated(true); // Mark that the lobby has been created
      setLobbyId(lobbyData.lobbyId); // Set the lobby ID for later
      navigate(`/lobby/${lobbyData.lobbyId}`, { state: { lobbyData } });
    };

    socket.on('lobbyCreated', handleLobbyCreated);

    return () => {
      socket.off('lobbyCreated', handleLobbyCreated);
    };
  }, [lobbyId]);

  const createLobby = () => {
    if (!lobbyCreated) {
      console.log("Creating a lobby...");
      socket.emit('createLobby', { rounds, roundTime, selectedMode, mapName });
    }
  };

  const startGame = async () => {
    if (lobbyId) {
      console.log("Starting the game...");
      socket.emit('startGame', lobbyId);
    }
    else {
      navigate('/game', {
        state: {
          rounds,
          roundTime,
          selectedMode,
          mapName
        },
      });
    }
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode); 
  };

  const formatTime = (seconds) => {
    if (Number(seconds) === 0) return 'Round time: Unlimited';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `Round time: ${minutes}m ${secs}s`;
  };

  return (
    <ContainerComponent>
      <NavigationComponent />
      <MovingImageComponent />
      <ContentComponent>
        <h2>Select settings of your lobby</h2>
        <SliderComponent
          min={1}
          max={9}
          value={rounds}
          onChange={(e) => setRounds(Number(e.target.value))}
          label={'Rounds: ' + rounds}
        />
        <SliderComponent
            min={0}
            max={600}
            step={10}
            value={roundTime}
            onChange={(e) => setRoundTime(Number(e.target.value))}
            label={formatTime(roundTime)}
          />

        <SliderComponent
            min={2}
            max={10}
            step={1}
            value={numberOfPlayers}
            onChange={(e) => setNumberOfPlayers(Number(e.target.value))}
            label={Number(numberOfPlayers) + ' Players'}
          />
        <h3>Select Game Mode</h3>
        <div style={styles.modeContainer}>
          <div
            style={{
              ...styles.modeTile,
              ...(selectedMode === 'Move' ? styles.modeTileActive : {}),
            }}
            onClick={() => handleModeSelect('Move')}
          >
            MOVE
          </div>
          <div
            style={{
              ...styles.modeTile,
              ...(selectedMode === 'No Move' ? styles.modeTileActive : {}),
            }}
            onClick={() => handleModeSelect('No Move')}
          >
            NO MOVE
          </div>
          <div
            style={{
              ...styles.modeTile,
              ...(selectedMode === 'NMPZ' ? styles.modeTileActive : {}),
            }}
            onClick={() => handleModeSelect('NMPZ')}
          >
            NMPZ
          </div>
        </div>
        <BasicButtonComponent 
          buttonText="Create Lobby" 
          onClick={createLobby} 
          disabled={lobbyCreated} // Disable button after lobby creation
        />

        <BasicButtonComponent 
            buttonText="Join Lobby" 
            //onClick={joinLobby} 
        />
      </ContentComponent>
    </ContainerComponent>
  );
};

const styles = {
  sliderContainer: {
    margin: '20px 0',
    textAlign: 'center',
  },
  slider: {
    width: '80%',
    height: '8px',
    background: 'linear-gradient(to right, violet, purple)',
    borderRadius: '5px',
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
  },
  sliderValue: {
    marginTop: '10px',
    fontSize: '18px',
    color: 'white',
    fontWeight: 'bold',
  },
  modeContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '20px',
  },
  modeTile: {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    border: '2px solid rgba(128, 0, 255, 0.5)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  modeTileActive: {
    color: 'yellow',
    backgroundColor: 'rgba(128, 0, 255, 0.8)',
    border: '2px solid yellow',
    boxShadow: '0 4px 16px rgba(128, 0, 255, 0.8)',
  },
};

export default RoundSelectionScreen;
