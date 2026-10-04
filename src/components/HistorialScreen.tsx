import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Pencil, 
  Trash2, 
  Droplets, 
  Wrench, 
  Cpu, 
  Package, 
  Gauge, 
  Sparkles, 
  Calendar,
  AlertTriangle
} from 'lucide-react';
import type { DaySalesGroup, Sale } from '../types.ts';

interface HistorialScreenProps {
  groups: DaySalesGroup[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFilter: 'today' | 'week' | 'all';
  onFilterChange: (f: 'today' | 'week' | 'all') => void;
  onEditSale: (sale: Sale) => void;
  onDeleteSale: (saleId: string) => Promise<void>;
}

export const HistorialScreen: React.FC<HistorialScreenProps> = ({
  groups,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  onEditSale,
  onDeleteSale
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val).replace('COP', '').trim();
  };

  const getSaleIcon = (name: string, category: string) => {
    const lower = (name + ' ' + category).toLowerCase();
    if (lower.includes('aceite')) {
      return <Droplets className="w-5 h-5 text-[#ffd600]" />;
    }
    if (lower.includes('bobinado') || lower.includes('motor')) {
      return <Cpu className="w-5 h-5 text-[#ffd600]" />;
    }
    if (lower.includes('manómetro') || lower.includes('manometro') || lower.includes('presión')) {
      return <Gauge className="w-5 h-5 text-[#ffd600]" />;
    }
    if (lower.includes('mantenimiento') || lower.includes('acople') || lower.includes('válvula') || lower.includes('empaquetadura')) {
      return <Wrench className="w-5 h-5 text-[#ffd600]" />;
    }
    return <Package className="w-5 h-5 text-[#ffd600]" />;
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDeleteSale(id);
      setConfirmDeleteId(null);
    } catch (e: any) {
      alert(`Error al eliminar: ${e.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const totalFilteredSales = groups.reduce((acc, g) => acc + g.sales_count, 0);

  return (
    <div className="pb-24 pt-3 px-4 max-w-md mx-auto space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>Historial de Ventas</span>
          <span className="text-lg">📋</span>
        </h2>
        <span className="text-xs text-slate-400 font-semibold bg-[#1E2438] px-2.5 py-1 rounded-full border border-white/5">
          {totalFilteredSales} registradas
        </span>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="flex items-center bg-[#131826] border border-white/10 focus-within:border-[#ffd600] rounded-xl px-3 py-2.5 transition-colors">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por producto o cliente..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => onFilterChange('today')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeFilter === 'today'
              ? 'bg-[#ffd600] text-black shadow-md shadow-[#ffd600]/20'
              : 'bg-[#1E2438] text-slate-300 hover:text-white border border-white/5'
          }`}
        >
          Hoy (14)
        </button>

        <button
          onClick={() => onFilterChange('week')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeFilter === 'week'
              ? 'bg-[#ffd600] text-black shadow-md shadow-[#ffd600]/20'
              : 'bg-[#1E2438] text-slate-300 hover:text-white border border-white/5'
          }`}
        >
          Esta semana (68)
        </button>

        <button
          onClick={() => onFilterChange('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#ffd600] text-black shadow-md shadow-[#ffd600]/20'
              : 'bg-[#1E2438] text-slate-300 hover:text-white border border-white/5'
          }`}
        >
          Todos los registros
        </button>
      </div>

      {/* Grouped Sales List */}
      <div className="space-y-6">
        {groups.length === 0 ? (
          <div className="bg-[#131826] border border-white/10 rounded-2xl p-8 text-center space-y-3">
            <Package className="w-12 h-12 text-slate-500 mx-auto stroke-1" />
            <p className="text-sm font-semibold text-slate-300">
              No se encontraron ventas con este criterio.
            </p>
            <button
              onClick={() => {
                onSearchChange('');
                onFilterChange('all');
              }}
              className="text-xs font-bold text-[#ffd600] underline cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.date_key} className="space-y-2.5">
              {/* Day Header with Total Pill */}
              <div className="flex flex-col gap-1 px-1">
                <div className="flex items-center gap-1.5 text-sm font-extrabold text-white">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  <span>{group.date_label}</span>
                </div>
                <div>
                  <span className="inline-block text-[11px] font-bold text-[#ffd600] bg-[#ffd600]/10 border border-[#ffd600]/20 px-2.5 py-0.5 rounded-full">
                    Total: ${formatCOP(group.total_amount)} ({group.sales_count} ventas)
                  </span>
                </div>
              </div>

              {/* Day Sales Cards */}
              <div className="space-y-2.5">
                {group.sales.map((sale) => (
                  <div
                    key={sale.id}
                    className="bg-[#131826]/90 border border-white/5 hover:border-white/15 rounded-2xl p-3.5 space-y-3 shadow-md transition-all"
                  >
                    {/* Top Row: Icon + Title + Big Yellow Price */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#2A2D1F] border border-[#ffd600]/30 flex items-center justify-center shrink-0">
                          {getSaleIcon(sale.item_name, sale.category)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white truncate">
                            {sale.item_name}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            {sale.created_time_str && (
                              <span>{sale.created_time_str}</span>
                            )}
                            {sale.customer_name && (
                              <>
                                <span>•</span>
                                <span className="truncate text-slate-300">{sale.customer_name}</span>
                              </>
                            )}
                            <span>•</span>
                            <span className="capitalize text-slate-300">
                              {sale.payment_method === 'nequi_davi' ? 'Nequi' : sale.payment_method}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="text-lg font-black text-[#ffd600] tracking-tight">
                          ${formatCOP(sale.price)}
                        </span>
                      </div>
                    </div>

                    {/* Delete confirmation banner if active */}
                    {confirmDeleteId === sale.id ? (
                      <div className="bg-red-950/80 border border-red-500/50 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-red-300 font-semibold">
                          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                          <span>¿Seguro que deseas eliminar?</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleDelete(sale.id)}
                            disabled={deletingId === sale.id}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-1 rounded-lg text-xs cursor-pointer"
                          >
                            {deletingId === sale.id ? 'Borrando...' : 'Sí, borrar'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="bg-slate-800 text-slate-300 hover:text-white px-2 py-1 rounded-lg text-xs cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Action Buttons: Editar Venta | Eliminar */
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                        <button
                          onClick={() => onEditSale(sale)}
                          className="py-2 px-3 rounded-xl bg-[#1E2438] hover:bg-[#272a33] text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/5"
                        >
                          <Pencil className="w-3.5 h-3.5 text-[#ffd600]" />
                          <span>Editar Venta</span>
                        </button>

                        <button
                          onClick={() => setConfirmDeleteId(sale.id)}
                          className="py-2 px-3 rounded-xl bg-[#2D1618] hover:bg-[#3D1D20] text-xs font-bold text-red-400 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-red-500/20"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Info Banner */}
      <div className="bg-[#131826] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#2A2D1F] border border-[#ffd600]/30 flex items-center justify-center text-[#ffd600] shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="text-xs">
          <div className="font-bold text-white">
            Mostrando {totalFilteredSales} ventas
          </div>
          <div className="text-slate-400 mt-0.5">
            ¿Buscas una venta más antigua? Usa los filtros de arriba para navegar fácilmente.
          </div>
        </div>
      </div>
    </div>
  );
};
