import React from 'react';
import { Link } from 'react-router-dom';

const NerdzikComponent = ({height = '70px'}) => {
  const styles = {
    logo: {
        height: height,
        cursor: 'pointer',
        padding: '10px'
      },
  };

  return (
    <Link to="/">
        <img src="/geo_nerdface_2.png" alt="Game Logo" style={styles.logo} />
    </Link>
  );
};

export default NerdzikComponent;
