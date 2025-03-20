import React from 'react';

const MovingImageComponent = () => {
  const styleSheet = document.styleSheets[0];
  const keyframes = `
  @keyframes bounceEarth {
    0% {
      top: 0;
    }
    50% {
      top: calc(100vh - 200px); 
    }
    100% {
      top: 0; 
    }
  }
  `;
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

  return <div style={styles.movingImage}></div>;
};

const styles = {
  movingImage: {
      position: 'absolute',
      top: '-50%', 
      left: '50%',
      transform: 'translateX(-50%)',
      width: '300px', 
      height: '300px',
      backgroundImage: 'url(/earth.png)', 
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      borderRadius: '50%', 
      animation: 'bounceEarth 8s ease-in-out infinite',
      opacity: 0.5,
    },
};

export default MovingImageComponent;
