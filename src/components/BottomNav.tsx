import React from 'react';
import { History, Plus, BarChart3 } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'historial' | 'vender' | 'estadisticas';
  onSelectTab: (tab: 'historial' | 'vender' | 'estadisticas') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#10131B]/95 backdrop-blur-xl border-t border-white/10 px-4 py-2 select-none">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Historial Tab */}
        <button
          onClick={() => onSelectTab('historial')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 cursor-pointer ${
            currentTab === 'historial' ? 'text-[#ffd600]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className={`w-5 h-5 transition-transform ${currentTab === 'historial' ? 'scale-110' : ''}`} />
          <span className={`text-[11px] mt-1 ${currentTab === 'historial' ? 'font-bold' : 'font-medium'}`}>
            Historial
          </span>
        </button>

        {/* Central Prominent Vender Button */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            onClick={() => onSelectTab('vender')}
            className={`relative flex items-center justify-center gap-2 px-6 py-3 rounded-full font-extrabold text-sm transition-all duration-200 cursor-pointer shadow-lg active:scale-95 ${
              currentTab === 'vender'
                ? 'bg-[#ffd600] text-black shadow-[#ffd600]/40 scale-105 ring-4 ring-[#ffd600]/20'
                : 'bg-[#ffd600] text-black hover:bg-[#ffe14d] shadow-[#ffd600]/30'
            }`}
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span className="tracking-wider">VENDER</span>
          </button>
        </div>

        {/* Estadísticas Tab */}
        <button
          onClick={() => onSelectTab('estadisticas')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 cursor-pointer ${
            currentTab === 'estadisticas' ? 'text-[#ffd600]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className={`w-5 h-5 transition-transform ${currentTab === 'estadisticas' ? 'scale-110' : ''}`} />
          <span className={`text-[11px] mt-1 ${currentTab === 'estadisticas' ? 'font-bold' : 'font-medium'}`}>
            Estadísticas
          </span>
        </button>
      </div>
    </div>
  );
};
