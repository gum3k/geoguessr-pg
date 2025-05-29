import React from 'react';

const ContentComponent = ({ children }) => {
  return (
    <div style={styles.contentWrapper}>
      <div style={styles.content}>
        <div style={styles.text}>{children}</div>
      </div>
    </div>
  );
};

const styles = {
  contentWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    position: 'relative',
    display: 'inline-block',
    marginTop: '5%',
    background: 'rgba(0, 0, 0, 0.6)', 
    borderRadius: '15px', 
    color: 'white',
    padding: '2em 4em',
    backdropFilter: 'blur(5px)',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)'
  },
  text: {
    fontFamily: 'Accuratist',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2, 
    textAlign: 'center',
    color: 'white'
  },
};

export default ContentComponent;
