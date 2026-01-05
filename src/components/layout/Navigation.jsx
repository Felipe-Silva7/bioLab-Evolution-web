import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Beaker, Activity, TrendingUp, Trophy, BookOpen } from 'lucide-react';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: '/', icon: Beaker, label: 'Laboratório' },
    { id: '/experiments', icon: Activity, label: 'Experimentos' },
    { id: '/shop', icon: TrendingUp, label: 'Equipamentos' },
    { id: '/progress', icon: Trophy, label: 'Progresso' },
    { id: '/learn', icon: BookOpen, label: 'Aprendizado' },
  ];

  return (
    <nav className="bg-black/20 backdrop-blur border-b border-cyan-500/20 sticky top-[108px] z-30">
      <div className="max-w-7xl mx-auto px-6 flex gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => navigate(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 transition-all ${
              location.pathname === tab.id
                ? 'bg-cyan-500/20 border-b-2 border-cyan-400 text-cyan-400'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}