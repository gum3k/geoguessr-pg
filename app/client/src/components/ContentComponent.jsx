import React from 'react';

const ContentComponent = ({ children }) => {
  const styles = {
    content: {
        position: 'relative',
        textAlign: 'center',
        paddingTop: '300px', 
        color: 'white',
      },
  };

  return <div style={styles.content}>{children}</div>;
};

export default ContentComponent;