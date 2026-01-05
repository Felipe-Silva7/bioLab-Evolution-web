import React, { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import { formatNumber } from '../../utils/formatters';

export default function Header() {
  const { gameState } = useGame();
  const { user, signOut } = useAuth();
  const [logoOk, setLogoOk] = useState(true);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-cyan-500/30 px-6 py-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-cyan-500/30 bg-black/20 flex items-center justify-center">
              {logoOk ? (
                <img
                  src="/assets/images/logo.png"
                  alt="BioLab Evolution"
                  className="w-full h-full object-cover"
                  onError={() => setLogoOk(false)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                  <div className="text-2xl">🧬</div>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                BIO-LAB EVOLUTION
              </h1>
              <div className="text-xs text-gray-400">
                {user ? (
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    <span>{user.user_metadata?.username || 'Cientista'}</span>
                    <span className="mx-1">•</span>
                    <span>Ato {gameState.act} • Nível {gameState.level}</span>
                  </div>
                ) : (
                  <span>Ato {gameState.act} • Nível {gameState.level}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-sm text-gray-400">Conhecimento</div>
                <div className="text-xl font-bold text-cyan-400">{formatNumber(gameState.knowledge)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400">Financiamento</div>
                <div className="text-xl font-bold text-green-400">${formatNumber(gameState.funding)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400">Reputação</div>
                <div className="text-xl font-bold text-purple-400">{gameState.reputation}%</div>
              </div>
            </div>
            
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            )}
          </div>
        </div>
        
     <div className="mb-3">
  <div className="md:hidden grid grid-cols-3 gap-2 mt-2">
    <div className="px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
      <div className="text-[10px] text-gray-400">Conhecimento</div>
      <div className="text-sm font-bold text-cyan-400">
        {formatNumber(gameState.knowledge)}
      </div>
    </div>
    <div className="px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
      <div className="text-[10px] text-gray-400">Financiamento</div>
      <div className="text-sm font-bold text-green-400">
        ${formatNumber(gameState.funding)}
      </div>
    </div>
    <div className="px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
      <div className="text-[10px] text-gray-400">Reputação</div>
      <div className="text-sm font-bold text-purple-400">
        {gameState.reputation}%
      </div>
    </div>
  </div>
</div>
        
        <div className="bg-black/40 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
            style={{ width: `${(gameState.experience % 1000) / 10}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {gameState.experience % 1000}/1000 XP para próximo nível
        </div>
      </div>
    </header>
  );
}
