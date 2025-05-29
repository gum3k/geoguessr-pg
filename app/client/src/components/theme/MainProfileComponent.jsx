import React from 'react';
import ProfileInfoComponent from './ProfileInfoComponent';
import GameHistoryComponent from './GameHistoryComponent';
import StatsComponent from './StatsComponent';

const MainProfileComponent = ({ profileData, loading, error }) => {
    if (loading) return <p>Loading profile...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
    if (!profileData) return <p>No profile data</p>;

    const { profile, games, stats = [] } = profileData;

    return (
        <div style={styles.grid}>
            <div style={styles.gridLayout}>
                <ProfileInfoComponent profile={profile} />
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
