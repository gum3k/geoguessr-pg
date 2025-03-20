import React from 'react';
import { Link } from 'react-router-dom';

const NerdzikComponent = () => {
  return (
    <Link to="/">
      <img
        title='Egguesr'
        src="/geo_nerdface_2.png"
        alt="Game Logo"
        style={styles.logo}
        onMouseOver={(e) => (e.target.style.opacity = 1)}
        onMouseOut={(e) => (e.target.style.opacity = 0.5)}
      />
    </Link>
  );
};

const styles = {
  logo: {
    height: '70px',
    cursor: 'pointer',
    padding: '10px',
    opacity: 0.5,
    transition: 'opacity 0.13s ease-in-out',
  }
};

export default NerdzikComponent;
