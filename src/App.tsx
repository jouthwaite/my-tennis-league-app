import React, { useState } from 'react';

interface Player {
  id: number;
  name: string;
  points: number;
  wins: number;
  losses: number;
}

interface Match {
  id: number;
  team1: [string, string];
  team2: [string, string];
  team1Score: number;
  team2Score: number;
  winner: 'team1' | 'team2';
}

interface NewMatch {
  team1Player1: string;
  team1Player2: string;
  team2Player1: string;
  team2Player2: string;
  team1Score: string;
  team2Score: string;
}

interface ExportData {
  players: Player[];
  matches: Match[];
  exportDate: string;
}

function App() {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'Leena Anis', points: 0, wins: 0, losses: 0 },
    { id: 2, name: 'James Outhwaite', points: 0, wins: 0, losses: 0 },
    { id: 3, name: 'Ruby Frank', points: 0, wins: 0, losses: 0 },
    { id: 4, name: 'Henri Tiensuu', points: 0, wins: 0, losses: 0 },
    { id: 5, name: 'Jonathan Froggatt', points: 0, wins: 0, losses: 0 },
    { id: 6, name: 'Rob Dougall', points: 0, wins: 0, losses: 0 },
    { id: 7, name: 'Danae Alogoskoufi', points: 0, wins: 0, losses: 0 },
    { id: 8, name: 'Erin Campbell', points: 0, wins: 0, losses: 0 },
    { id: 9, name: 'Nikesh Mistry', points: 0, wins: 0, losses: 0 },
    { id: 10, name: 'Corinna Lamberti', points: 0, wins: 0, losses: 0 },
    { id: 11, name: 'Joe Scott', points: 0, wins: 0, losses: 0 },
    { id: 12, name: 'Paul Delaney', points: 0, wins: 0, losses: 0 },
    { id: 13, name: 'Stephen Sillars', points: 0, wins: 0, losses: 0 }
  ]);
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [newMatch, setNewMatch] = useState<NewMatch>({
    team1Player1: '',
    team1Player2: '',
    team2Player1: '',
    team2Player2: '',
    team1Score: '',
    team2Score: ''
  });

  const addPlayer = () => {
    const newId = Math.max(...players.map(p => p.id), 0) + 1;
    setPlayers([...players, { 
      id: newId, 
      name: `Player ${newId}`, 
      points: 0, 
      wins: 0, 
      losses: 0 
    }]);
  };

  const removePlayer = (id: number) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const updatePlayerName = (id: number, name: string) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name } : p));
  };

  const addMatch = () => {
    if (!newMatch.team1Player1 || !newMatch.team1Player2 || 
        !newMatch.team2Player1 || !newMatch.team2Player2 ||
        newMatch.team1Score === '' || newMatch.team2Score === '') {
      alert('Please fill in all match details');
      return;
    }

    const team1Score = parseInt(newMatch.team1Score);
    const team2Score = parseInt(newMatch.team2Score);
    
    const match: Match = {
      id: Date.now(),
      team1: [newMatch.team1Player1, newMatch.team1Player2],
      team2: [newMatch.team2Player1, newMatch.team2Player2],
      team1Score,
      team2Score,
      winner: team1Score > team2Score ? 'team1' : 'team2'
    };

    // Update player stats
    const updatedPlayers = [...players];
    const pointsForWin = 3;
    const pointsForLoss = 1;

    if (team1Score > team2Score) {
      // Team 1 wins
      [newMatch.team1Player1, newMatch.team1Player2].forEach(playerId => {
        const player = updatedPlayers.find(p => p.id === parseInt(playerId));
        if (player) {
          player.points += pointsForWin;
          player.wins += 1;
        }
      });
      [newMatch.team2Player1, newMatch.team2Player2].forEach(playerId => {
        const player = updatedPlayers.find(p => p.id === parseInt(playerId));
        if (player) {
          player.points += pointsForLoss;
          player.losses += 1;
        }
      });
    } else {
      // Team 2 wins
      [newMatch.team2Player1, newMatch.team2Player2].forEach(playerId => {
        const player = updatedPlayers.find(p => p.id === parseInt(playerId));
        if (player) {
          player.points += pointsForWin;
          player.wins += 1;
        }
      });
      [newMatch.team1Player1, newMatch.team1Player2].forEach(playerId => {
        const player = updatedPlayers.find(p => p.id === parseInt(playerId));
        if (player) {
          player.points += pointsForLoss;
          player.losses += 1;
        }
      });
    }

    setPlayers(updatedPlayers);
    setMatches([...matches, match]);
    setNewMatch({
      team1Player1: '',
      team1Player2: '',
      team2Player1: '',
      team2Player2: '',
      team1Score: '',
      team2Score: ''
    });
  };

  const deleteMatch = (matchId: number) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    // Reverse the points
    const updatedPlayers = [...players];
    const pointsForWin = 3;
    const pointsForLoss = 1;

    if (match.winner === 'team1') {
      match.team1.forEach(playerId => {
        const player = updatedPlayers.find(p => p.id === parseInt(playerId));
        if (player) {
          player.points -= pointsForWin;
          player.wins -= 1;
        }
      });
      match.team2.forEach(playerId => {
        const player = updatedPlayers.find(p => p.id === parseInt(playerId));
        if (player) {
          player.points -= pointsForLoss;
          player.losses -= 1;
        }
      });
    } else {
      match.team2.forEach(playerId => {
        const player = updatedPlayers.find(p => p.id === parseInt(playerId));
        if (player) {
          player.points -= pointsForWin;
          player.wins -= 1;
        }
      });
      match.team1.forEach(playerId => {
        const player = updatedPlayers.find(p => p.id === parseInt(playerId));
        if (player) {
          player.points -= pointsForLoss;
          player.losses -= 1;
        }
      });
    }

    setPlayers(updatedPlayers);
    setMatches(matches.filter(m => m.id !== matchId));
  };

  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

  const exportToJSON = () => {
    const data: ExportData = {
      players: players,
      matches: matches,
      exportDate: new Date().toISOString()
    };

    const jsonStr = JSON.stringify(data, null, 2);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonStr);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `chip-tennis-league-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const data = JSON.parse(result) as ExportData;
          setPlayers(data.players);
          setMatches(data.matches);
          alert('Data imported successfully!');
        }
      } catch (error) {
        alert('Error importing file. Please check the file format.');
        console.error(error);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Chip Branded Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
            CHIP FINANCIAL
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Tennis Doubles League
          </h1>
          <p className="text-gray-600">Building wealth on the court • Individual scoring • Mixed pairs</p>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Leaderboard
            </h2>
            <div className="flex gap-2">
              <button
                onClick={exportToJSON}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all"
              >
                ⬇️ Export
              </button>
              <label className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all cursor-pointer">
                ⬆️ Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importFromJSON}
                  className="hidden"
                />
              </label>
              <button
                onClick={addPlayer}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all"
              >
                ➕ Add Player
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-purple-200">
                  <th className="text-left py-3 px-4 text-purple-700">Rank</th>
                  <th className="text-left py-3 px-4 text-purple-700">Player Name</th>
                  <th className="text-center py-3 px-4 text-purple-700">Points</th>
                  <th className="text-center py-3 px-4 text-purple-700">Wins</th>
                  <th className="text-center py-3 px-4 text-purple-700">Losses</th>
                  <th className="text-center py-3 px-4 text-purple-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.map((player, index) => (
                  <tr key={player.id} className="border-b border-purple-50 hover:bg-purple-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm">
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) => updatePlayerName(player.id, e.target.value)}
                        className="border border-purple-200 rounded-lg px-3 py-2 w-full focus:border-purple-400 focus:outline-none transition-colors"
                      />
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full font-bold">
                        {player.points}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4 font-semibold text-green-600">{player.wins}</td>
                    <td className="text-center py-3 px-4 font-semibold text-gray-500">{player.losses}</td>
                    <td className="text-center py-3 px-4">
                      <button
                        onClick={() => removePlayer(player.id)}
                        className="text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-600 bg-purple-50 rounded-lg p-3">
            <p><strong className="text-purple-700">Scoring:</strong> Win = 3 points, Loss = 1 point</p>
          </div>
        </div>

        {/* Add Match */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-purple-100">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Record Match
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-purple-200 rounded-xl p-4 bg-gradient-to-br from-purple-50 to-white">
              <h3 className="font-bold text-lg mb-3 text-purple-700">Team 1</h3>
              <div className="space-y-3">
                <select
                  value={newMatch.team1Player1}
                  onChange={(e) => setNewMatch({...newMatch, team1Player1: e.target.value})}
                  className="w-full border border-purple-200 rounded-lg px-3 py-2 focus:border-purple-400 focus:outline-none transition-colors"
                >
                  <option value="">Select Player 1</option>
                  {players.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <select
                  value={newMatch.team1Player2}
                  onChange={(e) => setNewMatch({...newMatch, team1Player2: e.target.value})}
                  className="w-full border border-purple-200 rounded-lg px-3 py-2 focus:border-purple-400 focus:outline-none transition-colors"
                >
                  <option value="">Select Player 2</option>
                  {players.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Score"
                  value={newMatch.team1Score}
                  onChange={(e) => setNewMatch({...newMatch, team1Score: e.target.value})}
                  className="w-full border border-purple-200 rounded-lg px-3 py-2 focus:border-purple-400 focus:outline-none transition-colors"
                  min="0"
                />
              </div>
            </div>

            <div className="border-2 border-blue-200 rounded-xl p-4 bg-gradient-to-br from-blue-50 to-white">
              <h3 className="font-bold text-lg mb-3 text-blue-700">Team 2</h3>
              <div className="space-y-3">
                <select
                  value={newMatch.team2Player1}
                  onChange={(e) => setNewMatch({...newMatch, team2Player1: e.target.value})}
                  className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:border-blue-400 focus:outline-none transition-colors"
                >
                  <option value="">Select Player 1</option>
                  {players.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <select
                  value={newMatch.team2Player2}
                  onChange={(e) => setNewMatch({...newMatch, team2Player2: e.target.value})}
                  className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:border-blue-400 focus:outline-none transition-colors"
                >
                  <option value="">Select Player 2</option>
                  {players.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Score"
                  value={newMatch.team2Score}
                  onChange={(e) => setNewMatch({...newMatch, team2Score: e.target.value})}
                  className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:border-blue-400 focus:outline-none transition-colors"
                  min="0"
                />
              </div>
            </div>
          </div>

          <button
            onClick={addMatch}
            className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-full font-bold hover:shadow-lg transition-all transform hover:scale-105"
          >
            Record Match
          </button>
        </div>

        {/* Match History */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Match History
          </h2>
          {matches.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-3">🏆</div>
              <p className="text-gray-500">No matches recorded yet</p>
              <p className="text-sm text-gray-400 mt-1">Start building your wealth of wins!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...matches].reverse().map((match) => {
                const team1Players = match.team1.map(id => 
                  players.find(p => p.id === parseInt(id))?.name || 'Unknown'
                );
                const team2Players = match.team2.map(id => 
                  players.find(p => p.id === parseInt(id))?.name || 'Unknown'
                );
                
                return (
                  <div key={match.id} className="border-2 border-purple-100 rounded-xl p-4 flex items-center justify-between hover:border-purple-300 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className={`flex-1 ${match.winner === 'team1' ? 'font-bold text-purple-700' : 'text-gray-600'}`}>
                          {team1Players.join(' & ')}
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          {match.team1Score} - {match.team2Score}
                        </div>
                        <div className={`flex-1 text-right ${match.winner === 'team2' ? 'font-bold text-blue-700' : 'text-gray-600'}`}>
                          {team2Players.join(' & ')}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMatch(match.id)}
                      className="ml-4 text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chip Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Powered by Chip Financial • Building wealth on and off the court</p>
        </div>
      </div>
    </div>
  );
}

export default App;
