import React from 'react';
import ProfileInfoComponent from './ProfileInfoComponent';
import GameHistoryComponent from './GameHistoryComponent';
import StatsComponent from './StatsComponent';

const MainProfileComponent = ({ profileData, loading, error }) => {
    if (loading) return <p>Loading profile...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
    if (!profileData) return <p>No profile data</p>;

    const { profile, games = [] } = profileData;

    const totalGames = games.length;
    const totalPoints = games.reduce((acc, game) => acc + (game.gamePoints || 0), 0);
    const averagePoints = totalGames > 0 ? Math.round(totalPoints / totalGames) : 0;

    const stats = {
        totalGames,
        totalPoints,
        averagePoints,
    };

    console.log(profileData);

    return (
        <div style={styles.grid}>
            <div style={styles.gridLayout}>
                <ProfileInfoComponent profile={profile[0]} />
                <StatsComponent stats={stats} />
            </div>
            <div>
                <GameHistoryComponent games={games} />
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
};

export default MainProfileComponent;
