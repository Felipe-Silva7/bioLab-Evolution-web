import React from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export default function Notification({ message, type = 'info', onClose }) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
  };

  const colors = {
    success: 'bg-green-500/90 border-green-400',
    error: 'bg-red-500/90 border-red-400',
    info: 'bg-cyan-500/90 border-cyan-400',
  };

  const Icon = icons[type];

  return (
    <div className={`fixed top-32 right-6 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-xl z-50 border-2 animate-bounce ${colors[type]}`}>
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <span className="font-semibold">{message}</span>
      </div>
    </div>
  );
}