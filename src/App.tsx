import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { VenderScreen } from './components/VenderScreen.tsx';
import { HistorialScreen } from './components/HistorialScreen.tsx';
import { EstadisticasScreen } from './components/EstadisticasScreen.tsx';
import { SupabaseModal } from './components/SupabaseModal.tsx';
import { FlutterExportModal } from './components/FlutterExportModal.tsx';
import { EditSaleModal } from './components/EditSaleModal.tsx';
import { CierreCajaModal } from './components/CierreCajaModal.tsx';
import type { Sale, DaySalesGroup, StatsSummary, SupabaseConfig, PaymentMethod } from './types.ts';
import { Wifi, Signal, Battery, Smartphone } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'historial' | 'vender' | 'estadisticas'>('vender');
  const [sales, setSales] = useState<Sale[]>([]);
  const [groupedSales, setGroupedSales] = useState<DaySalesGroup[]>([]);
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'today' | 'week' | 'all'>('today');
  
  // Frame toggle: on wider screens, user can preview the authentic Android Flutter phone mockup!
  const [isAndroidFrame, setIsAndroidFrame] = useState(true);

  // Modals state
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isFlutterModalOpen, setIsFlutterModalOpen] = useState(false);
  const [isCierreModalOpen, setIsCierreModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  // Supabase config state
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>({
    url: '',
    anon_key: '',
    is_configured: false,
    is_connected: false,
    table_name: 'ventas_tcb'
  });
  const [sqlSchema, setSqlSchema] = useState('');

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      // 1. Fetch grouped sales
      const q = new URLSearchParams();
      if (searchQuery) q.set('search', searchQuery);
      if (activeFilter !== 'all') q.set('filter', activeFilter);

      const [resGrouped, resStats, resConfig, resSchema] = await Promise.all([
        fetch(`/api/sales/grouped?${q.toString()}`).then(r => r.json()),
        fetch('/api/stats').then(r => r.json()),
        fetch('/api/supabase/config').then(r => r.json()),
        fetch('/api/supabase/schema').then(r => r.json()),
      ]);

      if (resGrouped.success) {
        setGroupedSales(resGrouped.groups);
        // Flatten for recent sales
        const flat: Sale[] = [];
        resGrouped.groups.forEach((g: DaySalesGroup) => flat.push(...g.sales));
        setSales(flat);
      }

      if (resStats.success) {
        setStats(resStats.stats);
      }

      if (resConfig.success) {
        setSupabaseConfig(resConfig.config);
      }

      if (resSchema.success) {
        setSqlSchema(resSchema.sql);
      }
    } catch (e) {
      console.error('Error fetching data from backend:', e);
    }
  }, [searchQuery, activeFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handler: Add Sale
  const handleAddSale = async (saleData: {
    item_name: string;
    price: number;
    payment_method: PaymentMethod;
    notes?: string;
  }) => {
    const res = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saleData)
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || 'Error al guardar');
    }
    await fetchData();
  };

  // Handler: Edit Sale
  const handleSaveEditSale = async (saleId: string, updates: Partial<Sale>) => {
    const res = await fetch(`/api/sales/${saleId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || 'Error al actualizar');
    }
    await fetchData();
  };

  // Handler: Delete Sale
  const handleDeleteSale = async (saleId: string) => {
    const res = await fetch(`/api/sales/${saleId}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || 'Error al eliminar');
    }
    await fetchData();
  };

  // Handler: Save Supabase Config
  const handleSaveSupabaseConfig = async (url: string, anonKey: string, tableName?: string) => {
    const res = await fetch('/api/supabase/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, anon_key: anonKey, table_name: tableName })
    });
    const data = await res.json();
    if (data.config) {
      setSupabaseConfig(data.config);
    }
    await fetchData();
    return data;
  };

  // Handler: Confirm Cierre
  const handleConfirmCierre = async (cierreData: { cashier_name: string; notes?: string }) => {
    const res = await fetch('/api/closures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cierreData)
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || 'Error al registrar cierre');
    }
    await fetchData();
  };

  // Share report
  const handleShareReport = () => {
    const todayTotal = stats?.today_total ?? 385000;
    const weekTotal = stats?.week_total ?? 2450000;
    const monthTotal = stats?.month_total ?? 9820000;
    const text = `📊 *INFORME DE VENTAS - TODO COMPRESORES Y BOBINADOS*\n` +
      `📅 Fecha: 24 de Octubre de 2026\n` +
      `💰 Hoy: $${todayTotal.toLocaleString('es-CO')} COP (${stats?.today_count ?? 14} ventas)\n` +
      `📈 Esta Semana: $${weekTotal.toLocaleString('es-CO')} COP\n` +
      `🏆 Este Mes: $${monthTotal.toLocaleString('es-CO')} COP (${stats?.month_target_pct ?? 98.2}% meta)\n` +
      `📍 Suba, Bogotá • Tel: 311 2321234`;

    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-[#e0e2ee] flex flex-col items-center justify-start antialiased selection:bg-[#ffd600] selection:text-black">
      {/* Top Banner: Quick controls */}
      <div className="w-full bg-[#10131B] border-b border-white/5 py-1.5 px-4 hidden md:flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-[#ffd600]">
            ⚡ Todo Compresores y Bobinados
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${supabaseConfig.is_connected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            {supabaseConfig.is_connected ? 'Supabase Sincronizado' : 'Modo Backend Local'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFlutterModalOpen(true)}
            className="text-xs font-bold text-[#ffd600] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>📱 Ver Código Flutter / APK Android</span>
          </button>
          <span>•</span>
          <button
            onClick={() => setIsAndroidFrame(!isAndroidFrame)}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#ffd600]" />
            <span>{isAndroidFrame ? 'Desactivar Marco Android' : 'Activar Marco Android'}</span>
          </button>
        </div>
      </div>

      {/* Main Container - either standard full responsive or Android Frame */}
      <div className={`w-full ${isAndroidFrame ? 'max-w-[430px] my-0 md:my-6 md:rounded-[44px] md:border-[10px] md:border-[#272a33] md:shadow-2xl md:ring-1 md:ring-white/10' : 'max-w-md'} bg-[#0C0F17] min-h-screen relative overflow-hidden flex flex-col`}>
        {/* Android Phone Status Bar (Simulated) */}
        <div className="bg-[#131826] px-5 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-bold text-slate-300 select-none border-b border-white/5">
          <div className="flex items-center gap-1">
            <span>2:39 PM</span>
          </div>
          {/* Camera notch simulation */}
          <div className="w-3 h-3 rounded-full bg-black border border-white/10"></div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#ffd600]">5G</span>
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px]">98%</span>
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Top Navbar */}
        <Navbar
          currentTab={currentTab}
          supabaseConfig={supabaseConfig}
          isAndroidFrame={isAndroidFrame}
          onToggleAndroidFrame={() => setIsAndroidFrame(!isAndroidFrame)}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
          onOpenFlutterModal={() => setIsFlutterModalOpen(true)}
        />

        {/* Screen Content */}
        <main className="flex-1 overflow-y-auto">
          {currentTab === 'vender' && (
            <VenderScreen
              stats={stats}
              recentSales={sales}
              onAddSale={handleAddSale}
              onEditSale={(sale) => setEditingSale(sale)}
              onNavigateToHistorial={() => setCurrentTab('historial')}
            />
          )}

          {currentTab === 'historial' && (
            <HistorialScreen
              groups={groupedSales}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              onEditSale={(sale) => setEditingSale(sale)}
              onDeleteSale={handleDeleteSale}
            />
          )}

          {currentTab === 'estadisticas' && (
            <EstadisticasScreen
              stats={stats}
              onOpenCierreModal={() => setIsCierreModalOpen(true)}
              onShareReport={handleShareReport}
            />
          )}
        </main>

        {/* Persistent Bottom Navigation */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
        />

        {/* Android Home Indicator Bar (Simulated) */}
        <div className="bg-[#10131B] pb-2 pt-1 flex justify-center select-none">
          <div className="w-32 h-1 bg-white/20 rounded-full"></div>
        </div>
      </div>

      {/* Modals */}
      <SupabaseModal
        config={supabaseConfig}
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onSaveConfig={handleSaveSupabaseConfig}
        sqlSchema={sqlSchema}
      />

      <FlutterExportModal
        isOpen={isFlutterModalOpen}
        onClose={() => setIsFlutterModalOpen(false)}
      />

      <EditSaleModal
        sale={editingSale}
        isOpen={Boolean(editingSale)}
        onClose={() => setEditingSale(null)}
        onSave={handleSaveEditSale}
      />

      <CierreCajaModal
        isOpen={isCierreModalOpen}
        onClose={() => setIsCierreModalOpen(false)}
        sales={sales}
        onConfirmCierre={handleConfirmCierre}
      />
    </div>
  );
}
