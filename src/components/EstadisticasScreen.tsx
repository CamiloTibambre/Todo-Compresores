import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  CalendarRange, 
  Trophy, 
  BarChart2, 
  Star, 
  Lightbulb, 
  Share2, 
  Receipt,
  CheckCircle2
} from 'lucide-react';
import type { StatsSummary } from '../types.ts';

interface EstadisticasScreenProps {
  stats: StatsSummary | null;
  onOpenCierreModal: () => void;
  onShareReport: () => void;
}

export const EstadisticasScreen: React.FC<EstadisticasScreenProps> = ({
  stats,
  onOpenCierreModal,
  onShareReport
}) => {
  const [period, setPeriod] = useState<'dias' | 'semanas' | 'meses'>('dias');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(4); // default Friday / today
  const [copiedShare, setCopiedShare] = useState(false);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val).replace('COP', '').trim();
  };

  const chartDays = stats?.last_7_days || [
    { day_name: 'Lun', date_str: '19 Oct', amount: 280000, formatted_k: '$280k', is_today: false, is_highest: false },
    { day_name: 'Mar', date_str: '20 Oct', amount: 310000, formatted_k: '$310k', is_today: false, is_highest: false },
    { day_name: 'Mié', date_str: '21 Oct', amount: 290000, formatted_k: '$290k', is_today: false, is_highest: false },
    { day_name: 'Jue', date_str: '22 Oct', amount: 520000, formatted_k: '$520k', is_today: false, is_highest: true },
    { day_name: 'Vie', date_str: '23 Oct', amount: 385000, formatted_k: '$385k', is_today: true, is_highest: false },
    { day_name: 'Sáb', date_str: '24 Oct', amount: 260000, formatted_k: 'Est.', is_today: false, is_highest: false },
    { day_name: 'Dom', date_str: '25 Oct', amount: 0, formatted_k: '—', is_today: false, is_highest: false },
  ];

  const maxAmount = Math.max(...chartDays.map(d => d.amount), 520000);
  const selectedDay = chartDays[selectedDayIndex] || chartDays[4];

  const handleShareClick = () => {
    onShareReport();
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
  };

  return (
    <div className="pb-24 pt-3 px-4 max-w-md mx-auto space-y-4">
      {/* Month Navigator Header */}
      <div className="flex items-center justify-between gap-2">
        <button className="w-8 h-8 rounded-lg bg-[#1E2438] border border-white/5 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer">
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-[#131826] border border-white/10 rounded-xl text-xs font-bold text-white shadow-sm">
          <span>📅</span>
          <span>Octubre 2026</span>
        </div>

        <button className="w-8 h-8 rounded-lg bg-[#1E2438] border border-white/5 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Period Selector Tabs: Días | Semanas | Meses */}
      <div className="grid grid-cols-3 gap-2 bg-[#131826] p-1 rounded-xl border border-white/5">
        <button
          onClick={() => setPeriod('dias')}
          className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            period === 'dias'
              ? 'bg-[#ffd600] text-black shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Días
        </button>
        <button
          onClick={() => setPeriod('semanas')}
          className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            period === 'semanas'
              ? 'bg-[#ffd600] text-black shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Semanas
        </button>
        <button
          onClick={() => setPeriod('meses')}
          className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            period === 'meses'
              ? 'bg-[#ffd600] text-black shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Meses
        </button>
      </div>

      {/* Card 1: VENDIDO HOY */}
      <div className="bg-[#131826] border border-white/10 rounded-2xl p-4 shadow-lg space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ffd600]/20 flex items-center justify-center text-[#ffd600]">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-white">VENDIDO HOY</div>
              <div className="text-[11px] text-slate-400">Viernes en curso</div>
            </div>
          </div>
          <span className="text-xs font-bold text-[#ffd600] bg-[#ffd600]/10 border border-[#ffd600]/30 px-2.5 py-0.5 rounded-full">
            ↗ +12%
          </span>
        </div>

        <div className="pt-1">
          <div className="text-xs text-slate-400 font-bold">COP</div>
          <div className="text-3xl font-black text-[#ffd600] tracking-tight">
            ${formatCOP(stats?.today_total ?? 385000)}
          </div>
        </div>

        <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1 pt-0.5">
          <span>↑</span>
          <span>+$41.000 más que ayer a esta misma hora</span>
        </div>
      </div>

      {/* Card 2: ESTA SEMANA */}
      <div className="bg-[#131826] border border-white/10 rounded-2xl p-4 shadow-lg space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">
              <CalendarRange className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-white">ESTA SEMANA</div>
              <div className="text-[11px] text-slate-400">Lunes a Domingo</div>
            </div>
          </div>
          <span className="text-xs font-bold text-[#ffd600] bg-[#ffd600]/10 border border-[#ffd600]/30 px-2.5 py-0.5 rounded-full">
            ↗ +8%
          </span>
        </div>

        <div className="pt-1">
          <div className="text-xs text-slate-400 font-bold">COP</div>
          <div className="text-3xl font-black text-[#ffd600] tracking-tight">
            ${formatCOP(stats?.week_total ?? 2450000)}
          </div>
        </div>

        <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1 pt-0.5">
          <span>✓</span>
          <span>Superó la semana anterior con 3 días restantes</span>
        </div>
      </div>

      {/* Card 3: ESTE MES */}
      <div className="bg-[#131826] border border-white/10 rounded-2xl p-4 shadow-lg space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ffd600]/20 flex items-center justify-center text-[#ffd600]">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-white">ESTE MES</div>
              <div className="text-[11px] text-slate-400">
                Meta: ${formatCOP(stats?.month_target ?? 10000000)}
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-[#ffd600] bg-[#ffd600]/10 border border-[#ffd600]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span>🏆</span>
            <span>{stats?.month_target_pct ?? 98.2}%</span>
          </span>
        </div>

        <div className="pt-1">
          <div className="text-xs text-slate-400 font-bold">COP</div>
          <div className="text-3xl font-black text-[#ffd600] tracking-tight">
            ${formatCOP(stats?.month_total ?? 9820000)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 via-[#ffd600] to-[#ffd600]"
            style={{ width: `${Math.min(100, stats?.month_target_pct ?? 98.2)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-semibold pt-0.5">
          <span className="text-[#ffd600]">
            ¡A sólo ${formatCOP(stats?.month_gap_to_record ?? 180000)} del récord!
          </span>
          <span className="text-slate-400">
            Faltan {stats?.month_days_remaining ?? 7} días
          </span>
        </div>
      </div>

      {/* Interactive Bar Chart: Ventas de los últimos 7 días */}
      <div className="bg-[#131826] border border-white/10 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[#ffd600]" />
          <div>
            <h3 className="text-sm font-extrabold text-white">
              Ventas de los últimos 7 días
            </h3>
            <p className="text-[11px] text-slate-400">
              Toca cualquier barra para ver el dinero exacto
            </p>
          </div>
        </div>

        {/* Selected Day Pill */}
        <div className="bg-[#10131B] border border-[#ffd600]/30 rounded-xl px-3 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="w-2 h-2 rounded-full bg-[#ffd600]"></span>
            <span>{selectedDay.day_name} ({selectedDay.is_today ? 'Hoy' : selectedDay.date_str})</span>
          </div>
          <div className="font-black text-[#ffd600] text-sm">
            {selectedDay.amount > 0 ? `$${formatCOP(selectedDay.amount)} COP` : '— Sin ventas'}
          </div>
        </div>

        {/* Bar Chart Canvas */}
        <div className="pt-8 pb-2">
          <div className="h-44 flex items-end justify-between gap-2 px-1">
            {chartDays.map((d, idx) => {
              const heightPct = d.amount > 0 ? Math.max(12, Math.round((d.amount / maxAmount) * 100)) : 4;
              const isSelected = selectedDayIndex === idx;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDayIndex(idx)}
                  className="flex-1 flex flex-col items-center justify-end h-full cursor-pointer group"
                >
                  {/* Amount label atop bar */}
                  <div className="text-[10px] font-bold mb-1 transition-all">
                    {d.is_today && (
                      <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm block mb-1">
                        HOY
                      </span>
                    )}
                    <span className={isSelected || d.is_highest ? 'text-[#ffd600] font-black' : 'text-slate-400'}>
                      {d.formatted_k}
                    </span>
                  </div>

                  {/* Vertical bar */}
                  <div className="w-full max-w-[32px] h-full flex items-end">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        d.is_today || isSelected || d.is_highest
                          ? 'bg-[#ffd600] shadow-md shadow-[#ffd600]/30'
                          : 'bg-[#272A33] hover:bg-[#32353E]'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>

                  {/* Day label */}
                  <span className={`text-xs mt-2 font-bold ${isSelected ? 'text-[#ffd600]' : 'text-slate-400'}`}>
                    {d.day_name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top 3 Products: Lo que más se vende */}
      <div className="bg-[#131826] border border-white/10 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-[#ffd600] fill-[#ffd600]" />
            <h3 className="text-sm font-extrabold text-white">
              Lo que más se vende
            </h3>
          </div>
          <span className="text-[11px] font-bold text-[#ffd600] bg-[#ffd600]/10 border border-[#ffd600]/30 px-2 py-0.5 rounded-full">
            Top 3 del Mes
          </span>
        </div>

        <div className="space-y-2">
          {stats?.top_products.map((item) => (
            <div
              key={item.rank}
              className="bg-[#1E2438]/80 border border-white/5 rounded-xl p-3 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#ffd600] text-black font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                  {item.rank}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">
                    {item.name}
                  </h4>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {item.sold_count} {item.unit_label}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-black text-[#ffd600]">
                  ${formatCOP(item.total_revenue)}
                </div>
                <span className={`text-[10px] font-bold ${
                  item.badge_type === 'amber' ? 'text-red-400' :
                  item.badge_type === 'green' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {item.badge_label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consejo Inteligente - Taller */}
      <div className="bg-[#131826] border border-[#ffd600]/30 rounded-2xl p-4 shadow-lg space-y-2 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#ffd600] text-black flex items-center justify-center font-bold">
              <Lightbulb className="w-5 h-5 fill-black" />
            </div>
            <h3 className="text-sm font-extrabold text-white">
              {stats?.intelligent_tip.title || 'Consejo Inteligente'}
            </h3>
          </div>
          <span className="text-[10px] font-extrabold text-red-400 bg-red-950/60 border border-red-500/30 px-2 py-0.5 rounded-full uppercase">
            {stats?.intelligent_tip.badge || 'Taller'}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed pt-1">
          <span className="font-bold text-[#ffd600]">¡Gran trabajo!</span> Tu día con más ventas siempre suele ser el{' '}
          <span className="font-extrabold text-[#ffd600] underline">
            {stats?.intelligent_tip.highlight_text || 'Jueves'}
          </span>
          . Asegúrate de pedir aceite y filtros los miércoles para tener inventario suficiente en el mostrador.
        </p>
      </div>

      {/* Bottom Action Bar: Compartir Informe & Cierre de Caja */}
      <div className="grid grid-cols-2 gap-2.5 pt-2">
        <button
          onClick={handleShareClick}
          className="py-3 px-3 rounded-xl bg-[#1E2438] hover:bg-[#272a33] text-xs font-bold text-white flex items-center justify-center gap-2 border border-white/10 transition-all cursor-pointer shadow-md"
        >
          {copiedShare ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">¡Copiado!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-[#ffd600]" />
              <span>Compartir Informe</span>
            </>
          )}
        </button>

        <button
          onClick={onOpenCierreModal}
          className="py-3 px-3 rounded-xl bg-[#1E2438] hover:bg-[#272a33] text-xs font-bold text-white flex items-center justify-center gap-2 border border-red-500/30 transition-all cursor-pointer shadow-md"
        >
          <Receipt className="w-4 h-4 text-red-500" />
          <span>Cierre de Caja</span>
        </button>
      </div>
    </div>
  );
};
