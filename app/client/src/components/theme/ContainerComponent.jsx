import React from 'react';

const ContainerComponent = ({ children }) => {
  return (
    <div style={styles.container}>
      <div style={styles.background}></div>
      <div style={styles.content}>{children}</div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
  },
  background: {
    content: "''",
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url('/mapito.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'blur(4px)',
    zIndex: -1,
    transform: 'scale(1.05)'
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
};

export default ContainerComponent;
