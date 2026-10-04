import React, { useState } from 'react';
import { X, Receipt, CheckCircle2, MessageCircle, Wallet, Smartphone, CreditCard, Copy, Check } from 'lucide-react';
import type { Sale } from '../types.ts';

interface CierreCajaModalProps {
  isOpen: boolean;
  onClose: () => void;
  sales: Sale[];
  onConfirmCierre: (data: { cashier_name: string; notes?: string }) => Promise<void>;
}

export const CierreCajaModal: React.FC<CierreCajaModalProps> = ({
  isOpen,
  onClose,
  sales,
  onConfirmCierre
}) => {
  const [cashierName, setCashierName] = useState('Don Carlos');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [closedSuccess, setClosedSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  // Filter today's sales
  const todaySales = sales.filter(s => s.created_date_str === '2026-10-24');
  let cashTotal = 0;
  let nequiTotal = 0;
  let cardTotal = 0;

  for (const s of todaySales) {
    if (s.payment_method === 'efectivo') cashTotal += s.price;
    else if (s.payment_method === 'nequi_davi') nequiTotal += s.price;
    else if (s.payment_method === 'tarjeta') cardTotal += s.price;
  }

  const grandTotal = cashTotal + nequiTotal + cardTotal;

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val).replace('COP', '').trim();
  };

  const getWhatsAppSummary = () => {
    return `*CIERRE DE CAJA - TODO COMPRESORES Y BOBINADOS*\n` +
      `📅 Fecha: Viernes, 24 de Octubre de 2026\n` +
      `👤 Responsable: ${cashierName}\n` +
      `--------------------------------\n` +
      `💰 Total Facturado: $${formatCOP(grandTotal)} COP\n` +
      `💵 Efectivo en Caja: $${formatCOP(cashTotal)} COP\n` +
      `📱 Nequi / Davi: $${formatCOP(nequiTotal)} COP\n` +
      `💳 Tarjetas: $${formatCOP(cardTotal)} COP\n` +
      `⚡ Transacciones: ${todaySales.length}\n` +
      `--------------------------------\n` +
      (notes ? `📝 Notas: ${notes}\n` : '') +
      `📍 Suba Cra 104 • Tel: 311 2321234`;
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(getWhatsAppSummary());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(getWhatsAppSummary());
    window.open(`https://wa.me/573112321234?text=${text}`, '_blank');
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirmCierre({
        cashier_name: cashierName,
        notes: notes || undefined
      });
      setClosedSuccess(true);
    } catch (e: any) {
      alert(`Error al registrar cierre: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#131826] border border-[#ffd600]/30 rounded-2xl w-full max-w-md shadow-2xl p-5 text-white space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Cierre de Caja Diario
              </h3>
              <p className="text-[11px] text-slate-400">
                Arqueo y consolidado de pagos del día
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {closedSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-white">
                ¡Cierre de Caja Registrado!
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Total consolidado: ${formatCOP(grandTotal)} COP en {todaySales.length} transacciones.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleOpenWhatsApp}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg shadow-emerald-900/30"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar Comprobante por WhatsApp</span>
              </button>

              <button
                onClick={handleCopyWhatsApp}
                className="w-full py-2.5 rounded-xl bg-[#1E2438] hover:bg-[#272a33] text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer border border-white/5"
              >
                {copiedText ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>¡Texto Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Resumen de Cierre</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-transparent hover:bg-white/5 text-slate-400 text-xs font-bold cursor-pointer mt-1"
              >
                Finalizar y Cerrar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Grand Total Hero Box */}
            <div className="bg-[#0C0F17] border border-white/10 rounded-xl p-4 text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total Facturado Hoy
              </span>
              <div className="text-3xl font-black text-[#ffd600]">
                ${formatCOP(grandTotal)} <span className="text-xs font-bold text-slate-400">COP</span>
              </div>
              <span className="text-xs text-slate-400">
                {todaySales.length} ventas procesadas
              </span>
            </div>

            {/* Breakdown by Payment Method */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300">
                Desglose por método de pago:
              </span>

              {/* Efectivo */}
              <div className="bg-[#1E2438]/80 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#ffd600]/20 text-[#ffd600] flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Efectivo en Caja</div>
                    <div className="text-[10px] text-slate-400">Para arqueo físico</div>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-[#ffd600]">
                  ${formatCOP(cashTotal)}
                </span>
              </div>

              {/* Nequi / Daviplata */}
              <div className="bg-[#1E2438]/80 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Nequi / DaviPlata</div>
                    <div className="text-[10px] text-slate-400">En cuenta bancaria</div>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-emerald-400">
                  ${formatCOP(nequiTotal)}
                </span>
              </div>

              {/* Tarjeta */}
              <div className="bg-[#1E2438]/80 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Datáfono / Tarjetas</div>
                    <div className="text-[10px] text-slate-400">Voucher / liquidación</div>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-sky-400">
                  ${formatCOP(cardTotal)}
                </span>
              </div>
            </div>

            {/* Cashier input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Responsable del Cierre
              </label>
              <input
                type="text"
                value={cashierName}
                onChange={(e) => setCashierName(e.target.value)}
                className="w-full bg-[#0C0F17] border border-white/10 focus:border-[#ffd600] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Observaciones o Novedades
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Ej: Se dejaron $50.000 de base en billetes pequeños..."
                className="w-full bg-[#0C0F17] border border-white/10 focus:border-[#ffd600] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none resize-none"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center gap-2 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-[#ffd600] hover:bg-[#ffe14d] text-black text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar Cierre'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
