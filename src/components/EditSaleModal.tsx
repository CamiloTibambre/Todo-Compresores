import React, { useState, useEffect } from 'react';
import { X, Pencil, Save, DollarSign } from 'lucide-react';
import type { Sale, PaymentMethod } from '../types.ts';

interface EditSaleModalProps {
  sale: Sale | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (saleId: string, updates: Partial<Sale>) => Promise<void>;
}

export const EditSaleModal: React.FC<EditSaleModalProps> = ({
  sale,
  isOpen,
  onClose,
  onSave
}) => {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (sale) {
      setItemName(sale.item_name);
      setPrice(sale.price.toString());
      setPaymentMethod(sale.payment_method);
      setCustomerName(sale.customer_name || '');
      setNotes(sale.notes || '');
    }
  }, [sale]);

  if (!isOpen || !sale) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) {
      alert('El nombre del producto no puede estar vacío');
      return;
    }
    const numPrice = parseInt(price.replace(/\D/g, '') || '0', 10);
    if (numPrice <= 0) {
      alert('Ingresa un precio válido');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(sale.id, {
        item_name: itemName.trim(),
        price: numPrice,
        payment_method: paymentMethod,
        customer_name: customerName.trim() || undefined,
        notes: notes.trim() || undefined
      });
      onClose();
    } catch (err: any) {
      alert(`Error al actualizar: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#131826] border border-[#ffd600]/30 rounded-2xl w-full max-w-md shadow-2xl p-5 text-white space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ffd600]/20 text-[#ffd600] flex items-center justify-center">
              <Pencil className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Editar Venta</h3>
              <p className="text-[11px] text-slate-400">ID: {sale.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Item Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#ffd600]">
              Producto o Trabajo Realizado
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full bg-[#0C0F17] border border-white/15 focus:border-[#ffd600] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Price */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#ffd600]">
              Precio en COP
            </label>
            <div className="flex items-center bg-[#0C0F17] border border-white/15 focus-within:border-[#ffd600] rounded-xl px-3 py-2">
              <span className="text-[#ffd600] font-black text-sm mr-1">$</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-[#ffd600] focus:outline-none"
              />
              <span className="text-xs text-slate-400 font-bold ml-1">COP</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#ffd600]">
              Método de Pago
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['efectivo', 'nequi_davi', 'tarjeta'] as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                    paymentMethod === method
                      ? 'bg-[#ffd600] text-black shadow-sm'
                      : 'bg-[#1E2438] text-slate-300 hover:text-white'
                  }`}
                >
                  {method === 'nequi_davi' ? 'Nequi' : method}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">
              Cliente (Opcional)
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ej: Taller Suba, Don Juan..."
              className="w-full bg-[#0C0F17] border border-white/15 focus:border-[#ffd600] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#ffd600] hover:bg-[#ffe14d] text-black text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
