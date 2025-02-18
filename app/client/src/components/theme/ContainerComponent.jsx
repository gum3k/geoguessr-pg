import React from 'react';

const ContainerComponent = ({ children }) => {
  const styles = {
    container: {
      position: 'relative',
      height: '100vh',
      width: '100%',
      background: 'linear-gradient(to bottom, green, blue)', 
      overflow: 'hidden',
    },
  };

  return <div style={styles.container}>{children}</div>;
};

export default ContainerComponent;
