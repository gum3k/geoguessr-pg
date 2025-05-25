import React, { useState } from 'react';

const GameHistoryComponent = ({ games }) => {
    const increment = 10;
    const [visibleCount, setVisibleCount] = useState(increment);

    const handleShowMore = () => {
        setVisibleCount(prev => Math.min(prev + increment, games.length));
    };

    const visibleGames = games.slice(0, visibleCount);

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                <h1 style={styles.heading}>Game History</h1>
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.theadRow}>
                                <th>Date</th>
                                <th>Map</th>
                                <th>Rounds</th>
                                <th>Round length (s)</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleGames.map((game, index) => (
                                <tr key={game.gameid || index} style={styles.tbodyRow}>
                                    <td>{new Date(game.gameDate).toLocaleString('pl-PL')}</td>
                                    <td>{game.mapName}</td>
                                    <td>{game.roundAmount}</td>
                                    <td>{game.timePerRound}</td>
                                    <td style={styles.pointsCell}>{game.gamePoints}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button style={styles.loadMoreButton} onClick={handleShowMore}>
                    Load previous {increment} games
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        padding: '10px',
        borderRadius: '20px',
        backgroundColor: 'rgb(90, 22, 134)',
        color: 'rgb(255,255,255)',
    },
    wrapper: {
        width: '100%',
        maxWidth: '900px',
        textAlign: 'center',
    },
    heading: {
        fontFamily: 'Accuratist',
        marginBottom: '20px',
        fontSize: '36px',
        color: 'rgb(255,255,255)',
    },
    tableWrapper: {
        overflowX: 'auto',
        backgroundColor: 'rgb(8, 116, 32)',
        borderRadius: '10px',
        padding: '8px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        color: '#fff',
    },
    theadRow: {
        backgroundColor: 'rgb(32, 41, 167)',
        fontSize: '28px',
    },
    tbodyRow: {
        backgroundColor: 'rgb(8, 13, 80)',
        borderBottom: '1px solid rgb(8, 116, 32)',
        fontSize: '24px',
    },
    pointsCell: {
        color: 'rgb(126, 196, 117)',
        fontWeight: 'bold',
    },
    pagination: {
        marginTop: '15px',
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
    },
    loadMoreButton: {
        marginTop: '20px',
        padding: '12px 20px',
        fontSize: '20px',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: 'rgb(32, 41, 167)',
        color: '#fff',
        cursor: 'pointer',
        fontFamily: 'Accuratist',
        transition: 'background 0.2s ease-in-out',
    },
};

export default GameHistoryComponent;
