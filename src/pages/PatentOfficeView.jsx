import React from 'react';
import { FileText, Plus, ShieldCheck } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

export default function PatentOfficeView() {
  const { gameState } = useGame();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="text-blue-400" />
          Escritório de Patentes
        </h2>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={16} />
          Registrar Nova Patente
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-blue-400" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Proteja suas Descobertas</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Registre patentes para suas descobertas genéticas e receba royalties passivos de outros laboratórios.
            </p>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <h3 className="font-bold mb-4">Estatísticas de Royalties</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Patentes Ativas</span>
              <span className="font-mono text-white">0</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Renda Diária</span>
              <span className="font-mono text-green-400">$0</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Valor Total</span>
              <span className="font-mono text-blue-400">$0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
