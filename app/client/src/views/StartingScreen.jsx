import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationComponent from '../components/NavigationComponent';
import ContainerComponent from '../components/ContainerComponent'; 
import MovingImageComponent from '../components/MovingImageComponent'; 
import ContentComponent from '../components/ContentComponent'; 
import BasicButtonComponent from '../components/BasicButtonComponent';

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
        <h2>Welcome to the Game!</h2>
        <p>Click below to start a new round</p>
        <BasicButtonComponent onClick={startRound}>
          Start Round
        </BasicButtonComponent>
      </ContentComponent>
    </ContainerComponent>
  );
};

export default StartingScreen;
