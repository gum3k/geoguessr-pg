import React from 'react';
import { useNavigate } from 'react-router-dom';

const StartingScreen = () => {
  const navigate = useNavigate(); // This hook allows navigation programmatically

  const startRound = () => {
    navigate('/game'); // Navigate to the location view
  };

  return (
    <div style={styles.container}>
      <h2>Welcome to the Game!</h2>
      <p>Click below to start a new round</p>
      <button onClick={startRound} style={styles.button}>
        Start Round
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100vh',
    textAlign: 'center',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default StartingScreen;
