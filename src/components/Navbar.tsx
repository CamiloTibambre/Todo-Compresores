import React from 'react';
import { LogoBadge } from './LogoBadge.tsx';
import { User, Database, Smartphone, Code2 } from 'lucide-react';
import type { SupabaseConfig } from '../types.ts';

interface NavbarProps {
  currentTab: 'historial' | 'vender' | 'estadisticas';
  supabaseConfig: SupabaseConfig;
  isAndroidFrame: boolean;
  onToggleAndroidFrame: () => void;
  onOpenSupabaseModal: () => void;
  onOpenFlutterModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  supabaseConfig,
  isAndroidFrame,
  onToggleAndroidFrame,
  onOpenSupabaseModal,
  onOpenFlutterModal
}) => {
  const getTitles = () => {
    switch (currentTab) {
      case 'vender':
        return {
          title: 'Todo Compresores y Bobin...',
          subtitle: 'Nueva Venta • Modo Fácil'
        };
      case 'historial':
        return {
          title: 'Todo Compresores',
          subtitle: 'Historial De Ventas • Modo Fácil'
        };
      case 'estadisticas':
        return {
          title: 'Todo Compresores',
          subtitle: 'Estadísticas y Cierre • Modo Fácil'
        };
    }
  };

  const { title, subtitle } = getTitles();

  return (
    <header className="sticky top-0 z-30 bg-[#131826]/95 backdrop-blur-md border-b border-white/10 px-4 py-2.5">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <LogoBadge size="sm" />
          <div className="min-w-0">
            <h1 className="text-[14px] font-bold text-white truncate tracking-tight">
              {title}
            </h1>
            <div className="flex items-center gap-1.5 text-[11px] text-[#ffd600] font-medium">
              <span className="truncate">{subtitle}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffd600] inline-block animate-pulse"></span>
            </div>
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-1.5">
          {/* Flutter Code Button */}
          <button
            onClick={onOpenFlutterModal}
            title="Ver código Flutter Android y compilar APK"
            className="p-1.5 rounded-lg bg-[#1E2438] text-slate-300 hover:text-[#ffd600] hover:bg-[#272a33] transition-colors border border-white/5 cursor-pointer flex items-center gap-1 text-[11px] font-semibold px-2"
          >
            <Code2 className="w-4 h-4 text-[#ffd600]" />
            <span className="hidden sm:inline">Flutter</span>
          </button>

          {/* Supabase status indicator */}
          <button
            onClick={onOpenSupabaseModal}
            title={
              supabaseConfig.is_connected
                ? 'Supabase Conectado en tiempo real'
                : 'Configurar conexión a Supabase'
            }
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-semibold px-2 ${
              supabaseConfig.is_connected
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                : 'bg-[#1E2438] border-white/10 text-slate-300 hover:text-[#ffd600]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className={`w-1.5 h-1.5 rounded-full ${supabaseConfig.is_connected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
          </button>

          {/* Android Frame toggle (desktop/wide screens) */}
          <button
            onClick={onToggleAndroidFrame}
            title={isAndroidFrame ? 'Ver en ancho completo' : 'Activar marco Android'}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isAndroidFrame
                ? 'bg-[#ffd600]/20 border-[#ffd600] text-[#ffd600]'
                : 'bg-[#1E2438] border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
          </button>

          {/* Profile Don Carlos button */}
          <button
            onClick={onOpenSupabaseModal}
            className="w-8 h-8 rounded-full bg-[#272A33] border border-[#ffd600]/40 flex items-center justify-center text-[#ffd600] hover:bg-[#32353e] transition-colors cursor-pointer"
            title="Perfil de Don Carlos y Configuración"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
