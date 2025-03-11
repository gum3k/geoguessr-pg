import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationComponent from '../components/theme/NavigationComponent';
import ContainerComponent from '../components/theme/ContainerComponent'; 
import MovingImageComponent from '../components/theme/MovingImageComponent'; 
import ContentComponent from '../components/theme/ContentComponent'; 
import BasicButtonComponent from '../components/theme/BasicButtonComponent';

const StartingScreen = () => {
  const navigate = useNavigate();

  const goMultiSettings = () => {
    navigate('/gamesettings_multi');
  };

  const goSingleSettings = () => {
    navigate('/gamesettings');
  };

  return (
    <ContainerComponent>
      <NavigationComponent />
      <ContentComponent>
        <div style={{ fontSize: '24px', fontFamily: 'Accuratist, sans-serif', color: 'rgb(255, 255, 255)' }}>
          <h2>Welcome to the location guessing game!</h2>
          <p style={{ fontSize: '20px'}}>Choose a gamemode you want to play!</p>
        </div>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px',
          alignItems: 'center',
          marginTop: '20px'
        }}>
          <BasicButtonComponent buttonText="SINGLEPLAYER" onClick={goMultiSettings} />
          <BasicButtonComponent buttonText="MULTIPLAYER" onClick={goSingleSettings} />
        </div>
      </ContentComponent>
    </ContainerComponent>
  );
};

export default StartingScreen;
