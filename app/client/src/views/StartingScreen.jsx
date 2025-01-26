import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationComponent from '../components/theme/NavigationComponent';
import ContainerComponent from '../components/theme/ContainerComponent'; 
import MovingImageComponent from '../components/theme/MovingImageComponent'; 
import ContentComponent from '../components/theme/ContentComponent'; 
import BasicButtonComponent from '../components/theme/BasicButtonComponent';

const StartingScreen = () => {
  const navigate = useNavigate();

  const startRound = () => {
    navigate('/gamesettings');
  };

  return (
    <ContainerComponent>
      <NavigationComponent />
      <MovingImageComponent></MovingImageComponent>
      <ContentComponent>
        <h2>Welcome to the location guessing game!</h2>
        <p>Click below to start a new game</p>
        <BasicButtonComponent buttonText="Start game" onClick={startRound}></BasicButtonComponent>
      </ContentComponent>
    </ContainerComponent>
  );
};

export default StartingScreen;
