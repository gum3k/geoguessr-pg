import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationComponent from '../components/NavigationComponent';
import ContainerComponent from '../components/ContainerComponent'; 
import MovingImageComponent from '../components/MovingImageComponent'; 
import ContentComponent from '../components/ContentComponent'; 
import BasicButtonComponent from '../components/BasicButtonComponent';

const RoundSelectionScreen = () => {
  const [rounds, setRounds] = useState(5);
  const navigate = useNavigate();

  const startGame = () => {
    console.log(`Selected rounds: ${rounds}`);
    navigate('/game');
  };

  const handleSliderChange = (e) => {
    setRounds(e.target.value);
  };

  return (
    <ContainerComponent>
      <NavigationComponent />
      <MovingImageComponent/>
      <ContentComponent>
        <h2>Select Number of Rounds</h2>
        <div style={styles.sliderContainer}>
          <input
            type="range"
            min="1"
            max="9"
            value={rounds}
            onChange={handleSliderChange}
            style={styles.slider}
          />
          <div style={styles.sliderValue}>Rounds: {rounds}</div>
        </div>
        <BasicButtonComponent onClick={startGame}>
          Start Game
        </BasicButtonComponent>
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
};



export default RoundSelectionScreen;
