import React from 'react';
import { Award } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import AchievementCard from '../components/progress/AchievementCard';
import { AchievementSystem } from '../services/game/achievementSystem';

export default function AchievementsView() {
  const { gameState } = useGame();
  const system = new AchievementSystem(gameState);
  const achievements = system.getAllAchievements();
  const unlockedCount = system.getUnlockedCount();
  const totalCount = system.getTotalCount();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Award className="text-yellow-400" />
          Conquistas
        </h2>
        <div className="text-sm text-gray-400">
          Desbloqueadas: {unlockedCount}/{totalCount}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {achievements.map((ach) => (
          <AchievementCard key={ach.id} achievement={ach} unlocked={ach.unlocked} />
        ))}
      </div>
    </div>
  );
}
