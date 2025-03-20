import React from 'react';

const ContentComponent = ({ children }) => {
  return (
    <div style={styles.contentWrapper}>
      <div style={styles.text}>{children}</div>
      <div style={styles.content}></div>
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
    position: 'absolute',
    marginTop: '10%',
    background: 'rgba(0, 0, 0, 0.6)', 
    borderRadius: '15px', 
    color: 'white',
    padding: '40px 10px',
    backdropFilter: 'blur(5px)',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
    width: '600px',
    height: '60%',
    maxWidth: '600px',
    maxHeight: '700px',
    top: '50px',
  },
  text: {
    fontFamily: 'Accuratist',
    position: 'relative',
    zIndex: 2, 
    textAlign: 'center',
    marginTop: '13%',
    color: 'white'
  },
};

export default ContentComponent;
