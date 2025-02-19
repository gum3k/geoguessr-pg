import React from 'react';
import { Link } from 'react-router-dom';

const NerdzikComponent = ({ height = '70px' }) => {
  const styles = {
    logo: {
      height: height,
      cursor: 'pointer',
      padding: '10px',
      opacity: 0.5,
      transition: 'opacity 0.13s ease-in-out',
    }
  };

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

export default NerdzikComponent;
