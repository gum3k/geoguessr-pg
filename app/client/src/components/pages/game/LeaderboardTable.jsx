import React from 'react';


const LeaderboardTable = ({ guesses = [], allRounds = [], showRoundColumn = true }) => {
  const totalPointsMap = {};
  allRounds.forEach(round => {
    if (round.playerId && round.points != null) {
      totalPointsMap[round.playerId] = (totalPointsMap[round.playerId] || 0) + round.points;
    }
  });

  const currentRoundMap = {};
  guesses.forEach(guess => {
    if (guess.playerId && guess.points != null) {
      currentRoundMap[guess.playerId] = guess.points;
    }
  });

  const leaderboard = Object.entries(totalPointsMap)
    .map(([playerId, totalPoints]) => {
      const currentPoints = currentRoundMap[playerId] || 0;
      const playerName = guesses.find(g => g.playerId === playerId)?.playerName || playerId;
      return {
        playerId,
        playerName,
        totalPoints,
        currentPoints
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div style={{ position: 'absolute', top: 10, right: 10, backgroundImage: 'linear-gradient(to right, #00aaff,rgb(148, 176, 231))', borderRadius: '10px', padding: '10px', zIndex: 10, maxWidth: '100%', width: '400px' }}>
      <h3 style={{ marginTop: 0 }}>Leaderboard</h3>
      <table style={{ width: '100%', textAlign: 'left' }}>
        <thead>
        <tr>
            <th>Name</th>
            <th>Total</th>
            {showRoundColumn && <th>+Round</th>}
        </tr>
        </thead>
        <tbody>
        {leaderboard.map(player => (
            <tr key={player.playerId}>
            <td>{player.playerName}</td>
            <td>{player.totalPoints}</td>
            {showRoundColumn && (
                <td style={{ color: 'green' }}>+{player.currentPoints}</td>
            )}
            </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
