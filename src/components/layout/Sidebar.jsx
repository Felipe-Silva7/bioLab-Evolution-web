import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Settings, Users, Bell, HelpCircle } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

const Sidebar = () => {
  const { gameState } = useGame();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Colaboradores', path: '/team', badge: gameState.team?.length || 0 },
    { icon: Bell, label: 'Notificações', path: '/notifications', badge: 3 },
    { icon: Settings, label: 'Configurações', path: '/settings' },
    { icon: HelpCircle, label: 'Ajuda', path: '/help' }
  ];

  return (
    <div className="w-64 bg-black/20 border-r border-gray-800 min-h-screen p-4">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
            {item.badge > 0 && (
              <span className="ml-auto bg-cyan-500 text-white text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-900/50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-400 mb-2">Laboratório Atual</h4>
        <p className="text-white font-bold">Nível {gameState.level}</p>
        <div className="mt-2 text-xs text-gray-400">
          {gameState.completedExperiments.length} experimentos concluídos
        </div>
        <div className="mt-1 text-xs text-cyan-400">
          {gameState.stats.totalExperiments} experimentos totais
        </div>
      </div>
    </div>
  );
};

export default Sidebar;