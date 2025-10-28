import React, { useState, useEffect } from 'react';

// NOTE: TS 'as const' is used for type assertions in the functions below

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
  date: string;
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

// Interface for the detailed stats returned by getPlayerStats
interface DetailedPlayerStats extends Player {
    totalMatches: number;
    winRate: string;
    recentMatches: Match[];
    scoreMargin: string;
    currentStreak: string;
    bestPartner: { name: string; winRate: string } | null;
    worstPartner: { name: string; winRate: string } | null;
}

function App() {
  const [currentView, setCurrentView] = useState<'leaderboard' | 'stats'>('leaderboard');
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [filterPlayer, setFilterPlayer] = useState<string>('');
  
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('tennisPlayers');
    return saved ? JSON.parse(saved) : [
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
    ];
  });
  
  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('tennisMatches');
    return saved ? JSON.parse(saved) : [];
  });

  const [newMatch, setNewMatch] = useState<NewMatch>({
    team1Player1: '',
    team1Player2: '',
    team2Player1: '',
    team2Player2: '',
    team1Score: '',
    team2Score: ''
  });

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('tennisPlayers', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('tennisMatches', JSON.stringify(matches));
  }, [matches]);

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

  const validateMatch = (): string | null => {
    const { team1Player1, team1Player2, team2Player1, team2Player2 } = newMatch;
    
    if (!team1Player1 || !team1Player2 || !team2Player1 || !team2Player2) {
      return 'Please select all players';
    }

    const allPlayers = [team1Player1, team1Player2, team2Player1, team2Player2];
    const uniquePlayers = new Set(allPlayers);
    
    if (uniquePlayers.size !== 4) {
      return 'Each player can only be selected once per match';
    }

    if (newMatch.team1Score === '' || newMatch.team2Score === '') {
      return 'Please enter scores for both teams';
    }

    return null;
  };

  const updatePlayerStats = (match: Match, action: 'add' | 'remove') => {
    const updatedPlayers = [...players];
    const pointsForWin = 3;
    const pointsForLoss = 1;
    const multiplier = action === 'add' ? 1 : -1;

    const winningTeam = match.winner === 'team1' ? match.team1 : match.team2;
    const losingTeam = match.winner === 'team1' ? match.team2 : match.team1;

    winningTeam.forEach(playerId => {
      const player = updatedPlayers.find(p => p.id === parseInt(playerId));
      if (player) {
        player.points += pointsForWin * multiplier;
        player.wins += 1 * multiplier;
      }
    });

    losingTeam.forEach(playerId => {
      const player = updatedPlayers.find(p => p.id === parseInt(playerId));
      if (player) {
        player.points += pointsForLoss * multiplier;
        player.losses += 1 * multiplier;
      }
    });

    setPlayers(updatedPlayers);
  };

  const addMatch = () => {
    const validationError = validateMatch();
    if (validationError) {
      alert(validationError);
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
      winner: team1Score > team2Score ? 'team1' as const : 'team2' as const,
      date: new Date().toISOString()
    };

    updatePlayerStats(match, 'add');
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

    if (confirm('Are you sure you want to delete this match?')) {
      updatePlayerStats(match, 'remove');
      setMatches(matches.filter(m => m.id !== matchId));
    }
  };

  const startEditMatch = (match: Match) => {
    setEditingMatch(match);
  };

  const saveEditMatch = () => {
    if (!editingMatch) return;

    const oldMatch = matches.find(m => m.id === editingMatch.id);
    if (!oldMatch) return;

    // Remove old stats
    updatePlayerStats(oldMatch, 'remove');

    // Update match with new winner
    const updatedMatch: Match = {
      ...editingMatch,
      winner: editingMatch.team1Score > editingMatch.team2Score ? 'team1' as const : 'team2' as const
    };

    // Add new stats
    updatePlayerStats(updatedMatch, 'add');

    // Update matches
    setMatches(matches.map(m => m.id === updatedMatch.id ? updatedMatch : m));
    setEditingMatch(null);
  };

  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

  const filteredMatches = filterPlayer 
    ? matches.filter(m => 
        m.team1.includes(filterPlayer) || m.team2.includes(filterPlayer)
      )
    : matches;

  const getPlayerStats = (playerId: number): DetailedPlayerStats | null => {
    const player = players.find(p => p.id === playerId);
    if (!player) return null;

    const playerIdStr = String(playerId);
    const playerMatches = matches.filter(m => 
      m.team1.includes(playerIdStr) || m.team2.includes(playerIdStr)
    );

    const totalMatches = player.wins + player.losses;

    const winRate = totalMatches > 0 
      ? ((player.wins / totalMatches) * 100).toFixed(1)
      : '0.0';

    // 1. Average Score Margin Calculation
    let totalScoreDiff = 0;
    
    playerMatches.forEach(match => {
      const isTeam1 = match.team1.includes(playerIdStr);
      const scoreFor = isTeam1 ? match.team1Score : match.team2Score;
      const scoreAgainst = isTeam1 ? match.team2Score : match.team1Score;
      totalScoreDiff += (scoreFor - scoreAgainst);
    });

    const scoreMargin = totalMatches > 0 
      ? (totalScoreDiff / totalMatches).toFixed(1)
      : '0.0';

    // 2. Current Streak Calculation
    let currentStreak = 0;
    let streakType: 'Win' | 'Loss' = 'Win';
    const reversedMatches = [...playerMatches].sort((a, b) => b.id - a.id); // Sort by most recent first
    
    for (const match of reversedMatches) {
        const isWin = (match.team1.includes(playerIdStr) && match.winner === 'team1') || 
                      (match.team2.includes(playerIdStr) && match.winner === 'team2');
        
        if (currentStreak === 0) {
            streakType = isWin ? 'Win' : 'Loss';
            currentStreak = 1;
        } else if ((isWin && streakType === 'Win') || (!isWin && streakType === 'Loss')) {
            currentStreak++;
        } else {
            break; // Streak broken
        }
    }
    const streakDisplay = currentStreak > 0 ? `${currentStreak}-${streakType}` : 'N/A';
    
    // 3. Best/Worst Partner Calculation
    const partnerStats: { [partnerId: string]: { wins: number; total: number } } = {};

    playerMatches.forEach(match => {
        const isTeam1 = match.team1.includes(playerIdStr);
        const partnerTeam = isTeam1 ? match.team1 : match.team2;
        const partnerId = partnerTeam.find(id => id !== playerIdStr);
        if (!partnerId) return;

        const isWin = (isTeam1 && match.winner === 'team1') || (!isTeam1 && match.winner === 'team2');

        if (!partnerStats[partnerId]) {
            partnerStats[partnerId] = { wins: 0, total: 0 };
        }
        partnerStats[partnerId].total++;
        if (isWin) {
            partnerStats[partnerId].wins++;
        }
    });

    let bestPartner: { name: string; winRate: string } | null = null;
    let worstPartner: { name: string; winRate: string } | null = null;
    let bestRate = -1;
    let worstRate = 2; // Start high

    for (const id in partnerStats) {
        const stats = partnerStats[id];
        if (stats.total < 2) continue; // Require minimum 2 matches together
        
        const rate = stats.wins / stats.total;
        const partnerName = players.find(p => String(p.id) === id)?.name || 'Unknown';

        if (rate > bestRate) {
            bestRate = rate;
            bestPartner = { name: partnerName, winRate: (rate * 100).toFixed(1) + '%' };
        }
        if (rate < worstRate) {
            worstRate = rate;
            worstPartner = { name: partnerName, winRate: (rate * 100).toFixed(1) + '%' };
        }
    }

    return {
      ...player,
      totalMatches,
      winRate,
      recentMatches: playerMatches.slice(-5).reverse(), // Still need the slice for display
      scoreMargin: scoreMargin,
      currentStreak: streakDisplay,
      bestPartner,
      worstPartner: bestPartner?.name !== worstPartner?.name ? worstPartner : null, // Prevent showing the same partner twice
    };
  };

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
    event.target.value = '';
  };

  const printLeaderboard = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-block bg-gradient-to-r from-green-800 to-green-600 text-white px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">
            CHIP FINANCIAL
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Tennis Doubles League
          </h1>
          <p className="text-sm md:text-base text-gray-600">Individual scoring • Mixed pairs</p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6 print:hidden">
          <button
            onClick={() => setCurrentView('leaderboard')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              currentView === 'leaderboard'
                ? 'bg-green-800 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📊 Leaderboard
          </button>
          <button
            onClick={() => setCurrentView('stats')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              currentView === 'stats'
                ? 'bg-green-800 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📈 Player Stats
          </button>
        </div>

        {currentView === 'leaderboard' ? (
          <>
            {/* Leaderboard */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Leaderboard
                </h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={exportToJSON}
                    className="flex items-center gap-2 bg-green-600 text-white px-3 md:px-4 py-2 rounded-full hover:bg-green-700 transition-all text-sm"
                  >
                    ⬇️ Export
                  </button>
                  <label className="flex items-center gap-2 bg-green-700 text-white px-3 md:px-4 py-2 rounded-full hover:bg-green-800 transition-all cursor-pointer text-sm">
                    ⬆️ Import
                    <input
                      type="file"
                      accept=".json"
                      onChange={importFromJSON}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={printLeaderboard}
                    className="flex items-center gap-2 bg-gray-600 text-white px-3 md:px-4 py-2 rounded-full hover:bg-gray-700 transition-all text-sm"
                  >
                    🖨️ Print
                  </button>
                  <button
                    onClick={addPlayer}
                    className="flex items-center gap-2 bg-green-800 text-white px-3 md:px-4 py-2 rounded-full hover:bg-green-900 transition-all text-sm"
                  >
                    ➕ Add Player
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-2 md:px-4 text-gray-700 text-sm">Rank</th>
                      <th className="text-left py-3 px-2 md:px-4 text-gray-700 text-sm">Player Name</th>
                      <th className="text-center py-3 px-2 md:px-4 text-gray-700 text-sm">Points</th>
                      <th className="text-center py-3 px-2 md:px-4 text-gray-700 text-sm">Wins</th>
                      <th className="text-center py-3 px-2 md:px-4 text-gray-700 text-sm">Losses</th>
                      <th className="text-center py-3 px-2 md:px-4 text-gray-700 text-sm print:hidden">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPlayers.map((player, index) => (
                      <tr key={player.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-2 md:px-4">
                          <span className="inline-flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-green-800 text-white font-bold text-xs md:text-sm">
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-2 md:px-4">
                          <input
                            type="text"
                            value={player.name}
                            onChange={(e) => updatePlayerName(player.id, e.target.value)}
                            className="border border-gray-300 rounded-lg px-2 md:px-3 py-1 md:py-2 w-full focus:border-green-600 focus:outline-none transition-colors text-sm print:border-0"
                          />
                        </td>
                        <td className="text-center py-3 px-2 md:px-4">
                          <span className="inline-block bg-green-800 text-white px-2 md:px-3 py-1 rounded-full font-bold text-sm">
                            {player.points}
                          </span>
                        </td>
                        <td className="text-center py-3 px-2 md:px-4 font-semibold text-green-600 text-sm">{player.wins}</td>
                        <td className="text-center py-3 px-2 md:px-4 font-semibold text-gray-500 text-sm">{player.losses}</td>
                        <td className="text-center py-3 px-2 md:px-4 print:hidden">
                          <button
                            onClick={() => removePlayer(player.id)}
                            className="text-red-500 hover:text-red-700 transition-colors text-xs font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-xs md:text-sm text-gray-600 bg-green-50 rounded-lg p-3">
                <p><strong className="text-green-800">Scoring:</strong> Win = 3 points, Loss = 1 point</p>
                <p className="text-xs mt-1 text-gray-500">💾 Auto-saved to browser storage</p>
              </div>
            </div>

            {/* Add Match */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 print:hidden">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Record Match
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="border-2 border-green-200 rounded-xl p-4 bg-green-50">
                  <h3 className="font-bold text-base md:text-lg mb-3 text-green-800">Team 1</h3>
                  <div className="space-y-3">
                    <select
                      value={newMatch.team1Player1}
                      onChange={(e) => setNewMatch({...newMatch, team1Player1: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-green-600 focus:outline-none transition-colors text-sm"
                    >
                      <option value="">Select Player 1</option>
                      {players.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <select
                      value={newMatch.team1Player2}
                      onChange={(e) => setNewMatch({...newMatch, team1Player2: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-green-600 focus:outline-none transition-colors text-sm"
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
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-green-600 focus:outline-none transition-colors text-sm"
                      min="0"
                    />
                  </div>
                </div>

                <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
                  <h3 className="font-bold text-base md:text-lg mb-3 text-gray-700">Team 2</h3>
                  <div className="space-y-3">
                    <select
                      value={newMatch.team2Player1}
                      onChange={(e) => setNewMatch({...newMatch, team2Player1: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-400 focus:outline-none transition-colors text-sm"
                    >
                      <option value="">Select Player 1</option>
                      {players.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <select
                      value={newMatch.team2Player2}
                      onChange={(e) => setNewMatch({...newMatch, team2Player2: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-400 focus:outline-none transition-colors text-sm"
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
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-400 focus:outline-none transition-colors text-sm"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={addMatch}
                className="mt-6 w-full bg-green-800 text-white py-3 rounded-full font-bold hover:bg-green-900 transition-all transform hover:scale-105"
              >
                Record Match
              </button>
            </div>

            {/* Match History */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 print:hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Match History
                </h2>
                <select
                  value={filterPlayer}
                  onChange={(e) => setFilterPlayer(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:border-green-600 focus:outline-none text-sm"
                >
                  <option value="">All Players</option>
                  {players.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {filteredMatches.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl md:text-6xl mb-3">🏆</div>
                  <p className="text-gray-500">No matches recorded yet</p>
                  <p className="text-xs md:text-sm text-gray-400 mt-1">Start recording matches!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...filteredMatches].reverse().map((match) => {
                    const team1Players = match.team1.map(id => 
                      players.find(p => p.id === parseInt(id))?.name || 'Unknown'
                    );
                    const team2Players = match.team2.map(id => 
                      players.find(p => p.id === parseInt(id))?.name || 'Unknown'
                    );
                    
                    const matchDate = new Date(match.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    });

                    if (editingMatch?.id === match.id) {
                      return (
                        <div key={match.id} className="border-2 border-green-600 rounded-xl p-4 bg-green-50">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                            <div className="text-center">
                              <p className="text-xs text-gray-600 mb-1">Team 1 Score</p>
                              <input
                                type="number"
                                value={editingMatch.team1Score}
                                onChange={(e) => setEditingMatch({
                                  ...editingMatch,
                                  team1Score: parseInt(e.target.value) || 0
                                })}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-center text-lg font-bold"
                                min="0"
                              />
                            </div>
                            <div className="text-center text-xl font-bold text-gray-400">VS</div>
                            <div className="text-center">
                              <p className="text-xs text-gray-600 mb-1">Team 2 Score</p>
                              <input
                                type="number"
                                value={editingMatch.team2Score}
                                onChange={(e) => setEditingMatch({
                                  ...editingMatch,
                                  team2Score: parseInt(e.target.value) || 0
                                })}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-center text-lg font-bold"
                                min="0"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={saveEditMatch}
                              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingMatch(null)}
                              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition text-sm font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={match.id} className="border-2 border-gray-200 rounded-xl p-3 md:p-4 hover:border-green-600 transition-colors">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex-1 w-full">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                              <div className={`flex-1 text-sm ${match.winner === 'team1' ? 'font-bold text-green-800' : 'text-gray-600'}`}>
                                {team1Players.join(' & ')}
                              </div>
                              <div className="text-lg md:text-2xl font-bold text-green-800">
                                {match.team1Score} - {match.team2Score}
                              </div>
                              <div className={`flex-1 sm:text-right text-sm ${match.winner === 'team2' ? 'font-bold text-gray-800' : 'text-gray-600'}`}>
                                {team2Players.join(' & ')}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">{matchDate}</p>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => startEditMatch(match)}
                              className="flex-1 sm:flex-none text-green-600 hover:text-green-800 transition-colors text-xs font-medium px-3 py-1 border border-green-600 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteMatch(match.id)}
                              className="flex-1 sm:flex-none text-red-500 hover:text-red-700 transition-colors text-xs font-medium px-3 py-1 border border-red-500 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Player Statistics View */
          <div className="space-y-6">
            {sortedPlayers.map((player) => {
              const stats = getPlayerStats(player.id);
              if (!stats) return null;

              return (
                <div key={player.id} className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">{player.name}</h3>
                      <p className="text-sm text-gray-600">Rank #{sortedPlayers.indexOf(player) + 1}</p>
                    </div>
                    <div className="bg-green-800 text-white px-4 py-2 rounded-full font-bold">
                      {player.points} pts
                    </div>
                  </div>

                  {/* 1. Core Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6 border-b pb-4">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-xs md:text-sm text-gray-600 mb-1">Total Matches</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.totalMatches}</p>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3 text-center">
                      <p className="text-xs md:text-sm text-gray-600 mb-1">Wins</p>
                      <p className="text-xl md:text-2xl font-bold text-green-700">{player.wins}</p>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 text-center">
                      <p className="text-xs md:text-sm text-gray-600 mb-1">Losses</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-600">{player.losses}</p>
                    </div>
                    <div className="bg-green-200 rounded-lg p-3 text-center">
                      <p className="text-xs md:text-sm text-gray-600 mb-1">Win Rate</p>
                      <p className="text-xl md:text-2xl font-bold text-green-800">{stats.winRate}%</p>
                    </div>
                  </div>
                  
                  {/* 2. Advanced Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6">
                    <div className={`rounded-lg p-3 text-center ${stats.scoreMargin > '0' ? 'bg-blue-100' : 'bg-red-100'}`}>
                      <p className="text-xs md:text-sm text-gray-600 mb-1">Avg Score Margin</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.scoreMargin}</p>
                    </div>
                    <div className={`rounded-lg p-3 text-center ${stats.currentStreak.includes('Win') ? 'bg-yellow-100' : 'bg-red-100'}`}>
                      <p className="text-xs md:text-sm text-gray-600 mb-1">Current Streak</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.currentStreak}</p>
                    </div>
                    
                    {stats.bestPartner && (
                        <div className="bg-purple-100 rounded-lg p-3 text-center">
                            <p className="text-xs md:text-sm text-gray-600 mb-1">Best Partner ({stats.bestPartner.winRate})</p>
                            <p className="text-xl md:text-2xl font-bold text-purple-700">{stats.bestPartner.name}</p>
                        </div>
                    )}
                    {stats.worstPartner && (
                        <div className="bg-red-100 rounded-lg p-3 text-center">
                            <p className="text-xs md:text-sm text-gray-600 mb-1">Worst Partner ({stats.worstPartner.winRate})</p>
                            <p className="text-xl md:text-2xl font-bold text-red-700">{stats.worstPartner.name}</p>
                        </div>
                    )}
                  </div>


                  {/* 3. Recent Matches */}
                  {stats.recentMatches.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Matches</h4>
                      <div className="space-y-2">
                        {stats.recentMatches.map((match) => {
                          const isTeam1 = match.team1.includes(String(player.id));
                          const isWinner = (isTeam1 && match.winner === 'team1') || (!isTeam1 && match.winner === 'team2');
                          const partnerTeam = isTeam1 ? match.team1 : match.team2;
                          const partnerId = partnerTeam.find(id => id !== String(player.id));
                          const partner = players.find(p => p.id === parseInt(partnerId || '0'));
                          const opponentTeam = isTeam1 ? match.team2 : match.team1;
                          const opponents = opponentTeam.map(id => 
                            players.find(p => p.id === parseInt(id))?.name || 'Unknown'
                          );

                          const matchDate = new Date(match.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short'
                          });

                          return (
                            <div 
                              key={match.id} 
                              className={`p-3 rounded-lg border-2 ${
                                isWinner ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="text-xs md:text-sm font-medium">
                                    {isWinner ? '✅ Win' : '❌ Loss'} with {partner?.name || 'Unknown'}
                                  </p>
                                  <p className="text-xs text-gray-600">vs {opponents.join(' & ')}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm md:text-base font-bold">
                                    {isTeam1 ? `${match.team1Score}-${match.team2Score}` : `${match.team2Score}-${match.team1Score}`}
                                  </p>
                                  <p className="text-xs text-gray-500">{matchDate}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-xs md:text-sm text-gray-500 print:hidden">
          <p>Powered by Chip Financial • Building wealth on and off the court</p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-adjust-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:border-0 {
            border: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
