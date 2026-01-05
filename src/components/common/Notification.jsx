import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertCircle } from 'lucide-react';

const Notification = ({ id, message, type = 'info', duration = 5000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/50' },
    error: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50' },
    info: { icon: Info, color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/50' },
    warning: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50' }
  };

  const config = icons[type] || icons.info;
  const Icon = config.icon;

  return (
    <div className={`animate-slide-in-up ${config.bg} ${config.border} border rounded-xl p-4 mb-2 shadow-lg backdrop-blur-sm`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${config.color}`} />
        <span className="font-medium">{message}</span>
        <button 
          onClick={() => onClose(id)}
          className="ml-auto text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Notification;