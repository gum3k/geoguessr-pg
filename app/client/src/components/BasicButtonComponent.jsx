import React from 'react';

const BasicButtonComponent = ({ onClick, children, style = {} }) => {
  const styles = {
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      backgroundColor: 'white',
      border: 'none',
      borderRadius: '5px',
      ...style, 
    },
  };

  return (
    <button onClick={onClick} style={styles.button}>
      {children}
    </button>
  );
};

export default BasicButtonComponent;
