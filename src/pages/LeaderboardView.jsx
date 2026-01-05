import React from 'react';
import { BarChart2, Globe } from 'lucide-react';

export default function LeaderboardView() {
  const mockLeaderboard = [
    { rank: 1, name: "Dr. Silva", score: 150000, lab: "BioTech Prime" },
    { rank: 2, name: "Lab. Santos", score: 125000, lab: "Genômica Avançada" },
    { rank: 3, name: "Inst. Oliveira", score: 98000, lab: "MicroVida" },
    { rank: 4, name: "Você", score: 50000, lab: "Seu Laboratório" },
    { rank: 5, name: "BioSolutions", score: 45000, lab: "TechBio" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart2 className="text-purple-400" />
          Ranking Global
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Globe size={16} />
          Temporada 1
        </div>
      </div>

      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-[520px] w-full text-left">
          <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-3 md:p-4 font-semibold text-gray-400">#</th>
                <th className="p-3 md:p-4 font-semibold text-gray-400">Cientista</th>
                <th className="p-3 md:p-4 font-semibold text-gray-400">Laboratório</th>
                <th className="p-3 md:p-4 font-semibold text-gray-400 text-right">Pontuação</th>
            </tr>
          </thead>
          <tbody>
            {mockLeaderboard.map((entry) => (
              <tr 
                key={entry.rank} 
                className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                  entry.name === "Você" ? "bg-cyan-500/10" : ""
                }`}
              >
                <td className="p-3 md:p-4 font-bold text-gray-500">#{entry.rank}</td>
                <td className={`p-3 md:p-4 font-medium ${entry.name === "Você" ? "text-cyan-400" : "text-white"}`}>
                  {entry.name}
                </td>
                <td className="p-3 md:p-4 text-gray-400">{entry.lab}</td>
                <td className="p-3 md:p-4 text-right font-mono text-green-400">
                  {entry.score.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
