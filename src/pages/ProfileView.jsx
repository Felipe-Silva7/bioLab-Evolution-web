import React from 'react';
import { User, Settings, Mail, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';

export default function ProfileView() {
  const { user } = useAuth();
  const { gameState } = useGame();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
          {user?.email?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <h2 className="text-3xl font-bold">{user?.email?.split('@')[0] || 'Cientista'}</h2>
          <div className="flex items-center gap-2 text-gray-400 mt-1">
            <Shield size={16} className="text-cyan-400" />
            <span>Nível {gameState.level}</span>
            <span className="mx-2">•</span>
            <span>{gameState.reputation} Reputação</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <User className="text-cyan-400" />
            Dados Pessoais
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase mb-1">Email</label>
              <div className="flex items-center gap-2 text-gray-300">
                <Mail size={16} />
                {user?.email}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase mb-1">ID do Pesquisador</label>
              <div className="font-mono text-gray-300">{user?.uid?.slice(0, 8)}...</div>
            </div>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Settings className="text-gray-400" />
            Configurações
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm">
              Alterar Senha
            </button>
            <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm">
              Notificações
            </button>
            <button className="w-full text-left px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm">
              Resetar Progresso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
