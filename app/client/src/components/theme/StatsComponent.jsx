import React from 'react';

const StatsComponent = ({ }) => {
    const username = "Guest";
    const email = "eloelo@elo.elo";

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                <h1>Statistics</h1>
                <h2>Average points per guess</h2>
                <h2>Games played</h2>
                <h2>Games played</h2>
            </div>
        </div>
    )
};

const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      padding: '10px',
      borderRadius: '20px',
      backgroundColor: 'rgb(90, 22, 134)',

    },
    wrapper: {
        display: 'grid',
        flexDirection: 'column',
        alignItems: 'center',
        gridTemplateColumns: '1fr 1fr',
        gap: '0px'
    },

}

export default StatsComponent;
