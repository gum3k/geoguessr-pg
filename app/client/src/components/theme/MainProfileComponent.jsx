import React from 'react';
import ProfileInfoComponent from './ProfileInfoComponent';
import GameHistoryComponent from './GameHistoryComponent';
import StatsComponent from './StatsComponent';

const MainProfileComponent = () => {
    return (
        <div style={styles.grid}>
            <div style={styles.gridLayout}>
                <ProfileInfoComponent/>
                <StatsComponent/>
            </div>
            <div>
                <GameHistoryComponent/>
            </div>
        </div>
    );
  };

  const styles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '20px',
    },
    gridLayout: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
    },
  }

export default MainProfileComponent;