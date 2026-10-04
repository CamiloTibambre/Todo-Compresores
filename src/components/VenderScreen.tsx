import React, { useState } from 'react';
import { 
  Zap, 
  Receipt, 
  Wallet, 
  Smartphone, 
  CreditCard, 
  Save, 
  X, 
  ChevronRight, 
  Pencil, 
  MessageCircle, 
  CheckCircle2, 
  Droplets, 
  Wrench, 
  Cpu, 
  Package, 
  Clock 
} from 'lucide-react';
import type { Sale, StatsSummary, PaymentMethod } from '../types.ts';
import confetti from 'canvas-confetti';

interface VenderScreenProps {
  stats: StatsSummary | null;
  recentSales: Sale[];
  onAddSale: (saleData: {
    item_name: string;
    price: number;
    payment_method: PaymentMethod;
    notes?: string;
  }) => Promise<void>;
  onEditSale: (sale: Sale) => void;
  onNavigateToHistorial: () => void;
}

export const VenderScreen: React.FC<VenderScreenProps> = ({
  stats,
  recentSales,
  onAddSale,
  onEditSale,
  onNavigateToHistorial
}) => {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('35000');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quick suggestions based on workshop catalog
  const quickItems = [
    { name: 'Aceite Compresor 1L', price: 35000 },
    { name: 'Bobinado Motor 2HP', price: 120000 },
    { name: 'Mantenimiento General Cabezal', price: 140000 },
    { name: 'Acople Rápido 1/4 NPT', price: 18000 },
    { name: 'Manómetro Glicerina 0-300 PSI', price: 32000 },
    { name: 'Filtro de Aire 3/4 Metálico', price: 18000 },
  ];

  const handleQuickSelect = (name: string, p: number) => {
    setItemName(name);
    setPrice(p.toString());
  };

  const handleAddAmount = (extra: number) => {
    const current = parseInt(price.replace(/\D/g, '') || '0', 10);
    setPrice((current + extra).toString());
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!itemName.trim()) {
      alert('Por favor indica qué producto o trabajo se vendió.');
      return;
    }
    const numPrice = parseInt(price.replace(/\D/g, '') || '0', 10);
    if (numPrice <= 0) {
      alert('Por favor ingresa un precio válido.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddSale({
        item_name: itemName.trim(),
        price: numPrice,
        payment_method: paymentMethod
      });

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#ffd600', '#e52421', '#ffffff']
      });

      setSuccessMessage(`¡Venta guardada: $${numPrice.toLocaleString('es-CO')} COP!`);
      setTimeout(() => setSuccessMessage(null), 3500);

      setItemName('');
      setPrice('35000');
    } catch (err: any) {
      alert(`Error al guardar venta: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val).replace('COP', '').trim();
  };

  const getItemIcon = (name: string, category: string) => {
    const lower = (name + ' ' + category).toLowerCase();
    if (lower.includes('aceite')) {
      return <Droplets className="w-5 h-5 text-amber-400" />;
    }
    if (lower.includes('bobinado') || lower.includes('motor')) {
      return <Cpu className="w-5 h-5 text-red-400" />;
    }
    if (lower.includes('mantenimiento') || lower.includes('acople') || lower.includes('válvula')) {
      return <Wrench className="w-5 h-5 text-yellow-400" />;
    }
    return <Package className="w-5 h-5 text-slate-400" />;
  };

  const todayTotal = stats?.today_total ?? 385000;
  const todayTarget = stats?.today_target ?? 600000;
  const targetPct = stats?.today_target_pct ?? 64;
  const todayCount = stats?.today_count ?? 14;
  const avgTicket = stats?.average_ticket ?? 27500;

  return (
    <div className="pb-24 pt-3 px-4 max-w-md mx-auto space-y-4">
      {/* 1. Greeting & Cash status */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              ¡Hola Don Carlos! 👋
            </h2>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
            <span>📅</span> Viernes, 24 de Octubre de 2026
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#ffd600]/15 border border-[#ffd600]/40 px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#ffd600] animate-pulse"></span>
          <span className="text-[11px] font-extrabold text-[#ffd600] tracking-wider">
            CAJA ABIERTA
          </span>
        </div>
      </div>

      {/* 2. Metric Hero Card: VENDIDO HOY */}
      <div className="relative overflow-hidden rounded-2xl bg-[#131826]/90 border border-white/10 p-4 shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffd600]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#ffd600]/20 flex items-center justify-center text-[#ffd600]">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Vendido Hoy
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-0.5">
            ↗ +18% vs ayer
          </span>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-black text-[#ffd600] tracking-tight">
            ${formatCOP(todayTotal)}
          </span>
          <span className="text-xs font-bold text-slate-400">COP</span>
        </div>

        <p className="text-xs text-slate-400 mt-1">
          Meta diaria: ${formatCOP(todayTarget)} COP ({targetPct}%)
        </p>

        {/* Dual-tone Progress Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full mt-2.5 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#e52421] via-[#ffd600] to-[#ffd600] transition-all duration-500"
            style={{ width: `${Math.min(100, targetPct)}%` }}
          />
        </div>

        {/* Stat badges row */}
        <div className="grid grid-cols-2 gap-2 mt-3.5">
          <div className="bg-[#1E2438]/80 rounded-xl p-2.5 border border-white/5">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#ffd600]" />
              <span>Ventas hoy</span>
            </div>
            <div className="text-sm font-bold text-white mt-0.5">
              {todayCount} facturadas
            </div>
          </div>
          <div className="bg-[#1E2438]/80 rounded-xl p-2.5 border border-white/5">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Receipt className="w-3.5 h-3.5 text-red-400" />
              <span>Ticket prom.</span>
            </div>
            <div className="text-sm font-bold text-white mt-0.5">
              ${formatCOP(avgTicket)}
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 px-3.5 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 3. Card: Registrar Nueva Venta (Rápido, en 3 pasos sencillos ⚡) */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-[#131826] border border-[#ffd600]/30 p-4 shadow-2xl relative space-y-4"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ffd600]/15 flex items-center justify-center text-[#ffd600]">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Registrar Nueva Venta
              </h3>
              <p className="text-[11px] text-slate-400">
                Rápido, en 3 pasos sencillos
              </p>
            </div>
          </div>
          <Zap className="w-5 h-5 text-[#ffd600] fill-[#ffd600]" />
        </div>

        {/* Step 1: Producto o trabajo */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#ffd600] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[#ffd600] text-black text-[10px] flex items-center justify-center font-black">
                1
              </span>
              ¿Qué producto o trabajo vendiste?
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Ej: Bobinado motor 3HP, Aceite..."
              className="w-full bg-[#0C0F17] border border-white/15 focus:border-[#ffd600] focus:ring-1 focus:ring-[#ffd600] rounded-xl px-3.5 py-3 text-sm text-white placeholder-slate-500 transition-colors pr-9"
            />
            {itemName && (
              <button
                type="button"
                onClick={() => setItemName('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-400 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick chips from workshop */}
          <div className="pt-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#ffd600]" />
              <span>Más vendidos en taller (toca para rellenar):</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {quickItems.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickSelect(item.name, item.price)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#1E2438] hover:bg-[#272a33] text-[11px] font-semibold text-[#ffd600] border border-[#ffd600]/25 transition-colors cursor-pointer shrink-0"
                >
                  + {item.name} <span className="text-slate-300">(${formatCOP(item.price)})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Precio a cobrar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#ffd600] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[#ffd600] text-black text-[10px] flex items-center justify-center font-black">
                2
              </span>
              Precio a cobrar
            </label>
            <span className="text-[11px] font-bold text-[#ffd600]">
              Pesos Colombianos
            </span>
          </div>

          <div className="relative">
            <div className="flex items-center bg-[#0C0F17] border border-white/15 focus-within:border-[#ffd600] focus-within:ring-1 focus-within:ring-[#ffd600] rounded-xl px-3.5 py-2.5">
              <span className="text-2xl font-black text-[#ffd600] mr-1.5">$</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-transparent text-2xl font-black text-[#ffd600] focus:outline-none tracking-tight"
                placeholder="0"
              />
              <span className="text-xs font-bold text-slate-400 ml-2">COP</span>
            </div>
          </div>

          {/* Quick Increment Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => handleAddAmount(5000)}
              className="py-1.5 rounded-lg bg-[#1E2438] hover:bg-[#2a324b] text-xs font-bold text-white border border-white/10 transition-colors cursor-pointer"
            >
              + $5.000
            </button>
            <button
              type="button"
              onClick={() => handleAddAmount(10000)}
              className="py-1.5 rounded-lg bg-[#1E2438] hover:bg-[#2a324b] text-xs font-bold text-white border border-white/10 transition-colors cursor-pointer"
            >
              + $10.000
            </button>
            <button
              type="button"
              onClick={() => handleAddAmount(50000)}
              className="py-1.5 rounded-lg bg-[#1E2438] hover:bg-[#2a324b] text-xs font-bold text-white border border-white/10 transition-colors cursor-pointer"
            >
              + $50.000
            </button>
          </div>
        </div>

        {/* Step 3: Método de pago */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#ffd600] flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-[#ffd600] text-black text-[10px] flex items-center justify-center font-black">
              3
            </span>
            ¿Cómo te pagó el cliente?
          </label>

          <div className="grid grid-cols-3 gap-2">
            {/* Efectivo */}
            <button
              type="button"
              onClick={() => setPaymentMethod('efectivo')}
              className={`py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
                paymentMethod === 'efectivo'
                  ? 'bg-[#ffd600]/20 border-2 border-[#ffd600] text-[#ffd600]'
                  : 'bg-[#1E2438] border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              {paymentMethod === 'efectivo' && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ffd600]"></span>
              )}
              <Wallet className="w-5 h-5" />
              <span className="text-xs font-bold">Efectivo</span>
            </button>

            {/* Nequi / Davi */}
            <button
              type="button"
              onClick={() => setPaymentMethod('nequi_davi')}
              className={`py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
                paymentMethod === 'nequi_davi'
                  ? 'bg-[#ffd600]/20 border-2 border-[#ffd600] text-[#ffd600]'
                  : 'bg-[#1E2438] border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              {paymentMethod === 'nequi_davi' && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ffd600]"></span>
              )}
              <Smartphone className="w-5 h-5" />
              <span className="text-xs font-bold">Nequi/Davi</span>
            </button>

            {/* Tarjeta */}
            <button
              type="button"
              onClick={() => setPaymentMethod('tarjeta')}
              className={`py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
                paymentMethod === 'tarjeta'
                  ? 'bg-[#ffd600]/20 border-2 border-[#ffd600] text-[#ffd600]'
                  : 'bg-[#1E2438] border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              {paymentMethod === 'tarjeta' && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ffd600]"></span>
              )}
              <CreditCard className="w-5 h-5" />
              <span className="text-xs font-bold">Tarjeta</span>
            </button>
          </div>

          {/* Time indicator */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 px-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Hoy a las 2:39 PM
            </span>
            <span className="text-[#ffd600] bg-[#ffd600]/10 px-2 py-0.5 rounded font-semibold text-[10px]">
              Automático
            </span>
          </div>
        </div>

        {/* Primary CTA Button: GUARDAR VENTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-[#ffd600] hover:bg-[#ffe14d] active:scale-[0.99] text-black font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#ffd600]/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-5 h-5 stroke-[2.5]" />
            <span>{isSubmitting ? 'GUARDANDO VENTA...' : 'GUARDAR VENTA 💾'}</span>
          </button>
          <div className="text-center mt-1.5 text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffd600]"></span>
            <span>¡Listo para registrar con un toque!</span>
          </div>
        </div>
      </form>

      {/* 4. Section: Últimas ventas de hoy */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Receipt className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-extrabold text-white">
              Últimas ventas de hoy
            </h3>
          </div>
          <button
            onClick={onNavigateToHistorial}
            className="text-xs font-bold text-[#ffd600] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Ver todas</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {recentSales.slice(0, 4).map((sale) => (
            <div
              key={sale.id}
              className="bg-[#131826]/90 border border-white/5 hover:border-white/15 rounded-xl p-3 flex items-center justify-between gap-3 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#1E2438] border border-white/5 flex items-center justify-center shrink-0">
                  {getItemIcon(sale.item_name, sale.category)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">
                    {sale.item_name}
                  </h4>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span>{sale.created_time_str}</span>
                    <span>•</span>
                    <span className="capitalize text-[#ffd600] font-medium">
                      {sale.payment_method === 'nequi_davi' ? 'Nequi' : sale.payment_method}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-black text-[#ffd600]">
                  +${formatCOP(sale.price)}
                </span>
                <button
                  onClick={() => onEditSale(sale)}
                  className="p-1.5 rounded-lg bg-[#1E2438] text-slate-400 hover:text-white cursor-pointer hover:bg-[#272a33]"
                  title="Editar venta"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Support & WhatsApp Card */}
      <a
        href="https://wa.me/573112321234?text=Hola%20Todo%20Compresores,%20solicito%20asistencia%20con%20el%20sistema"
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-[#131826] border border-emerald-500/30 hover:border-emerald-500/60 rounded-xl p-3.5 transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-5 h-5 fill-emerald-500/20" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
              ¿Dudas o soporte con WhatsApp?
            </h4>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              Toca aquí: 311 2321234 • Cra 104 Suba
            </p>
          </div>
          <span className="text-emerald-400 text-sm">💬</span>
        </div>
      </a>
    </div>
  );
};
