import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationComponent from '../theme/NavigationComponent';
import ContainerComponent from '../theme/ContainerComponent'; 
import MovingImageComponent from '../theme/MovingImageComponent'; 
import ContentComponent from '../theme/ContentComponent'; 
import BasicButtonComponent from '../theme/BasicButtonComponent';

const StartView = () => {
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

export default StartView;
