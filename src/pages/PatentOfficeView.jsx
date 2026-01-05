import React from 'react';
import { FileText, ShieldCheck } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import patentsData from '../data/patents.json';

export default function PatentOfficeView() {
  const { gameState, dispatch } = useGame();

  const canFile = (patent) => {
    if (gameState.funding < patent.cost) return false;
    if ((patent.requirements?.knowledge || 0) > gameState.knowledge) return false;
    if (patent.requirements?.reputation && gameState.reputation < patent.requirements.reputation) return false;
    if (patent.requirements?.ethics && gameState.ethicsScore < patent.requirements.ethics) return false;
    if (patent.requirements?.equipment) {
      const ok = patent.requirements.equipment.every(eq => gameState.equipment[eq]?.owned);
      if (!ok) return false;
    }
    if (patent.requirements?.experiments) {
      const ok = patent.requirements.experiments.every(exp => gameState.completedExperiments.includes(exp));
      if (!ok) return false;
    }
    return true;
  };

  const filePatent = (patent) => {
    if (!canFile(patent)) return;
    const filedAt = Date.now();
    const readyAt = filedAt + (patent.duration * 1000);
    dispatch({ type: 'FILE_PATENT', payload: { id: patent.id, cost: patent.cost, filedAt, readyAt } });
    dispatch({ type: 'PUSH_NOTIFICATION', payload: { id: Date.now() + Math.random(), type: 'info', message: `Patente registrada: ${patent.name}` } });
  };

  const activeCount = Object.values(gameState.patents).filter(p => p.status === 'active').length;
  const dailyIncome = Object.keys(gameState.patents).reduce((sum, id) => {
    const status = gameState.patents[id]?.status;
    if (status === 'active') {
      const p = patentsData.patents.find(x => x.id === id);
      return sum + (p?.rewards?.passiveIncome || 0);
    }
    return sum;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="text-blue-400" />
          Escritório de Patentes
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          {patentsData.patents.map(patent => {
            const status = gameState.patents[patent.id]?.status || 'available';
            const eligible = canFile(patent);
            const isActive = status === 'active';
            const isPending = status === 'pending';
            const canRegister = eligible && status === 'available';
            return (
              <div key={patent.id} className="bg-black/40 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{patent.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-blue-400">{patent.name}</h3>
                    <p className="text-sm text-gray-400">{patent.description}</p>
                    <div className="mt-3 text-xs text-gray-400">
                      Custo: <span className="text-green-400">${patent.cost}</span> • Duração: <span className="text-blue-400">{Math.round(patent.duration/86400)}d</span> • Categoria: <span className="capitalize">{patent.tier}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {isActive && (
                      <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">Ativa</span>
                    )}
                    {isPending && (
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">Em análise</span>
                    )}
                    {canRegister && (
                      <button
                        onClick={() => filePatent(patent)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium"
                      >
                        Registrar
                      </button>
                    )}
                    {!canRegister && status === 'available' && (
                      <span className="px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-xs">Requisitos não atendidos</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 space-y-6">
          <h3 className="font-bold mb-4">Estatísticas de Royalties</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Patentes Ativas</span>
              <span className="font-mono text-white">{activeCount}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Renda Diária</span>
              <span className="font-mono text-green-400">${dailyIncome}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Valor Total</span>
              <span className="font-mono text-blue-400">${Math.round(gameState.funding)}</span>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="text-blue-400" size={32} />
              </div>
              <p className="text-gray-400 text-sm">
                Patentes ativas geram renda passiva automaticamente.
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-3">Em Processamento</h3>
            <div className="space-y-3">
              {Object.entries(gameState.patents || {})
                .filter(([_, p]) => p.status === 'pending')
                .map(([id, p]) => {
                  const patent = patentsData.patents.find(x => x.id === id);
                  const now = Date.now();
                  const total = Math.max(1, (p.readyAt - p.filedAt));
                  const progress = Math.min(100, Math.round(((now - p.filedAt) / total) * 100));
                  const remainingMs = Math.max(0, p.readyAt - now);
                  const remainingMin = Math.ceil(remainingMs / 60000);
                  return (
                    <div key={id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{patent?.icon}</span>
                          <span className="text-sm font-semibold">{patent?.name || id}</span>
                        </div>
                        <span className="text-xs text-gray-400">{remainingMin} min</span>
                      </div>
                      <div className="h-2 bg-black/40 rounded-full overflow-hidden" data-testid="patent-progress-bar">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              {Object.values(gameState.patents || {}).filter(p => p.status === 'pending').length === 0 && (
                <div className="text-sm text-gray-500">Nenhuma patente em processamento</div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3">Histórico de Ativações</h3>
            <div className="space-y-3">
              {Object.entries(gameState.patents || {})
                .filter(([_, p]) => p.status === 'active')
                .map(([id, p]) => {
                  const patent = patentsData.patents.find(x => x.id === id);
                  return (
                    <div key={id} className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{patent?.icon}</span>
                          <span className="text-sm font-semibold text-green-400">{patent?.name || id}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {p.activatedAt ? new Date(p.activatedAt).toLocaleString() : 'Ativa'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              {Object.values(gameState.patents || {}).filter(p => p.status === 'active').length === 0 && (
                <div className="text-sm text-gray-500">Sem histórico ainda</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
