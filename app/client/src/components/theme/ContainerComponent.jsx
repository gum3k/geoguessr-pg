import React from 'react';

const ContainerComponent = ({ children }) => {
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
      filter: 'blur(2px)', // Zastosowanie efektu blur tylko na obrazek
      zIndex: -1, // Przesunięcie tła do tyłu
    },
    content: {
      position: 'relative',
      zIndex: 1, // Upewnienie się, że dzieci kontenera są nad obrazem
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.background}></div>
      <div style={styles.content}>{children}</div>
    </div>
  );
};

export default ContainerComponent;
