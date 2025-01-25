import React from 'react';
import { Link } from 'react-router-dom';
import NerdzikComponent from './NerdzikComponent';

const NavigationComponent = () => {
    return (
        <div style={styles.navbar}>
          <NerdzikComponent/>
          <Link
            to="/gamesettings"
            style={styles.button}
            onMouseEnter={(e) =>
              Object.assign(e.target.style, styles.buttonHover)
            }
            onMouseLeave={(e) => {
              e.target.style.textShadow = 'none';
            }}
          >
            SINGLEPLAYER
          </Link>
        </div>
      );
    };

const styles = {
    navbar: {
      display: 'flex',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '80px',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      padding: '0 20px',
      boxSizing: 'border-box',
      zIndex: 1000, 
    },
    logo: {
      height: '70px',
      cursor: 'pointer',
      padding: '10px'
    },
    button: {
      fontSize: '18px',
      fontWeight: 'bold',
      textDecoration: 'none',
      color: 'white',
      cursor: 'pointer',
      padding: '10px 20px',
      border: 'none',
      background: 'none',
      transition: 'all 0.3s',
      textAlign: 'center',

    },
    buttonHover: {
        textShadow: `
        0 0 10px rgba(128, 0, 255, 1),   
        0 0 20px rgba(128, 0, 255, 1), 
        0 0 30px rgba(128, 0, 255, 1), 
        0 0 40px rgba(128, 0, 255, 1), 
        0 0 50px rgba(128, 0, 255, 0.9), 
        0 0 60px rgba(128, 0, 255, 0.8), 
        0 0 70px rgba(128, 0, 255, 0.7)  
      `,
      }
  };

export default NavigationComponent;




