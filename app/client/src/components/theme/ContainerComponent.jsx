import React from 'react';

const ContainerComponent = ({ children }) => {
  return (
    <div>
      <div >
        <div className='main-background'></div>
      </div>
      <div style={styles.container}>    
        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    overflowY: 'auto',
    position: 'relative',
    height: '100vh',
    width: '100%',
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
};

export default ContainerComponent;
