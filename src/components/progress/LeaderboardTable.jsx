import React, { useState } from 'react';
import { Trophy, TrendingUp, Users, Crown } from 'lucide-react';

const LeaderboardTable = () => {
  const [timeframe, setTimeframe] = useState('all');
  const [sortBy, setSortBy] = useState('knowledge');

  // Dados mockados - substituir por dados reais do Supabase
  const leaderboardData = [
    { rank: 1, username: 'Dr. Silva', knowledge: 12500, experiments: 42, reputation: 98, level: 15 },
    { rank: 2, username: 'BioGenius', knowledge: 11200, experiments: 38, reputation: 95, level: 14 },
    { rank: 3, username: 'LabMaster', knowledge: 9800, experiments: 35, reputation: 92, level: 13 },
    { rank: 4, username: 'SciencePro', knowledge: 8500, experiments: 30, reputation: 88, level: 12 },
    { rank: 5, username: 'DNASequencer', knowledge: 7200, experiments: 28, reputation: 85, level: 11 },
    { rank: 6, username: 'MicrobeHunter', knowledge: 6500, experiments: 25, reputation: 82, level: 10 },
    { rank: 7, username: 'CRISPRExpert', knowledge: 5800, experiments: 22, reputation: 80, level: 9 },
    { rank: 8, username: 'FermentMaster', knowledge: 5200, experiments: 20, reputation: 78, level: 8 },
    { rank: 9, username: 'BioStudent', knowledge: 4800, experiments: 18, reputation: 75, level: 8 },
    { rank: 10, username: 'LabNewbie', knowledge: 4200, experiments: 15, reputation: 70, level: 7 },
  ];

  const getRankColor = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400 to-gray-500';
    if (rank === 3) return 'bg-gradient-to-r from-amber-700 to-amber-800';
    return 'bg-gray-800';
  };

  const formatNumber = (num) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="text-yellow-400" />
            Leaderboard
          </h2>
          <p className="text-gray-400 text-sm">
            Compare seu desempenho com outros cientistas
          </p>
        </div>

        <div className="flex gap-2">
          {['all', 'week', 'month'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeframe === period
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {period === 'all' ? 'Todos' : period === 'week' ? 'Semana' : 'Mês'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 text-sm text-gray-400 font-medium">
          <div className="col-span-1">#</div>
          <div className="col-span-4">Cientista</div>
          <div className="col-span-2">Conhecimento</div>
          <div className="col-span-2">Experimentos</div>
          <div className="col-span-2">Reputação</div>
          <div className="col-span-1">Nível</div>
        </div>

        <div className="divide-y divide-gray-800">
          {leaderboardData.map((player) => (
            <div
              key={player.rank}
              className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-800/30 transition-colors"
            >
              <div className="col-span-1 flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getRankColor(
                    player.rank
                  )}`}
                >
                  {player.rank}
                </div>
              </div>

              <div className="col-span-4 flex items-center gap-3">
                {player.rank <= 3 && (
                  <Crown
                    className={`w-5 h-5 ${
                      player.rank === 1
                        ? 'text-yellow-400'
                        : player.rank === 2
                        ? 'text-gray-300'
                        : 'text-amber-600'
                    }`}
                  />
                )}
                <span className="font-medium">{player.username}</span>
              </div>

              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-cyan-300">
                    {formatNumber(player.knowledge)}
                  </span>
                </div>
              </div>

              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-400" />
                  <span className="font-bold text-green-300">
                    {player.experiments}
                  </span>
                </div>
              </div>

              <div className="col-span-2">
                <div className="flex items-center gap-1">
                  <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${player.reputation}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-purple-300 ml-2">
                    {player.reputation}%
                  </span>
                </div>
              </div>

              <div className="col-span-1">
                <span className="px-3 py-1 bg-gray-800 rounded-full text-sm font-bold">
                  {player.level}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm">
        Atualizado em {new Date().toLocaleDateString('pt-BR')}
      </div>
    </div>
  );
};

export default LeaderboardTable;