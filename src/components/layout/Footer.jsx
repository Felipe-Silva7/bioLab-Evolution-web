import React from 'react';
import { Heart, Code, Coffee } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-12 border-t border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">
            <p>🧬 BIO-LAB EVOLUTION v2.0</p>
            <p className="mt-1">Jogo educacional de biotecnologia</p>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-400" />
              Feito com
            </span>
            <span className="flex items-center gap-1">
              <Code className="w-4 h-4 text-cyan-400" />
              React + Tailwind
            </span>
            <span className="flex items-center gap-1">
              <Coffee className="w-4 h-4 text-yellow-400" />
              Muito café
            </span>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <div className="text-sm font-medium text-gray-300">
              Desenvolvido por <span className="text-cyan-400 font-bold">FelipeDev</span>
            </div>
            <div className="text-xs text-gray-500">
              © {new Date().getFullYear()} BioLab Evolution - Fins educacionais
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;