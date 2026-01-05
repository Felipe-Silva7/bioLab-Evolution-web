import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  TestTube, 
  ShoppingBag, 
  BookOpen, 
  Trophy, 
  Award, 
  BarChart2, 
  FileText, 
  User 
} from 'lucide-react';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: '/', icon: Home, label: 'Laboratório' },
    { id: '/experiments', icon: TestTube, label: 'Experimentos' },
    { id: '/shop', icon: ShoppingBag, label: 'Loja' },
    { id: '/learn', icon: BookOpen, label: 'Aprender' },
    { id: '/progress', icon: Trophy, label: 'Progresso' },
    { id: '/achievements', icon: Award, label: 'Conquistas' },
    { id: '/leaderboard', icon: BarChart2, label: 'Ranking' },
    { id: '/patents', icon: FileText, label: 'Patentes' },
    { id: '/profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="bg-black/20 backdrop-blur border-b border-cyan-500/20 sticky top-[108px] z-30 overflow-x-auto">
      <div className="max-w-7xl mx-auto px-6 flex gap-1 min-w-max">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => navigate(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 transition-all whitespace-nowrap ${
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