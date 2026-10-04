import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Sale, CashClosure, SupabaseConfig, StatsSummary, DaySalesGroup, PaymentMethod, ProductCategory } from '../types.ts';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.resolve(process.cwd(), 'data-store.json');

// Initial seed data exactly matching mockups
const INITIAL_SALES: Sale[] = [
  // Today's sales (Total: $385,000 COP, 14 sales)
  {
    id: 'sale-001',
    item_name: 'Aceite Sintético Compresor 1L',
    price: 45000,
    payment_method: 'nequi_davi',
    category: 'aceite',
    created_at: '2026-10-24T16:15:00.000Z',
    created_time_str: '4:15 PM',
    created_date_str: '2026-10-24',
    customer_name: 'Taller Mecánico El Pistón'
  },
  {
    id: 'sale-002',
    item_name: 'Acople Rápido 1/4 NPT Alta Presión',
    price: 18000,
    payment_method: 'efectivo',
    category: 'acople',
    created_at: '2026-10-24T15:30:00.000Z',
    created_time_str: '3:30 PM',
    created_date_str: '2026-10-24',
    customer_name: 'Cliente Mostrador'
  },
  {
    id: 'sale-003',
    item_name: 'Bobinado Motor Trifásico 3HP 220V',
    price: 140000,
    payment_method: 'efectivo',
    category: 'bobinado',
    created_at: '2026-10-24T13:50:00.000Z',
    created_time_str: '1:50 PM',
    created_date_str: '2026-10-24',
    customer_name: 'Industrias Metálicas Suba'
  },
  {
    id: 'sale-004',
    item_name: 'Mantenimiento General Cabezal 5HP',
    price: 140000,
    payment_method: 'tarjeta',
    category: 'mantenimiento',
    created_at: '2026-10-24T13:50:00.000Z',
    created_time_str: '1:50 PM',
    created_date_str: '2026-10-24',
    customer_name: 'Pinturas & Carrocerías Boyacá'
  },
  {
    id: 'sale-005',
    item_name: 'Filtro de Aire 3/4 Metálico',
    price: 18000,
    payment_method: 'efectivo',
    category: 'filtro',
    created_at: '2026-10-24T12:10:00.000Z',
    created_time_str: '12:10 PM',
    created_date_str: '2026-10-24'
  },
  {
    id: 'sale-006',
    item_name: 'Válvula de Seguridad 150 PSI Bronce',
    price: 24000,
    payment_method: 'nequi_davi',
    category: 'valvula',
    created_at: '2026-10-24T11:45:00.000Z',
    created_time_str: '11:45 AM',
    created_date_str: '2026-10-24'
  },
  // Yesterday's sales (Total: $520,000 COP, 19 sales)
  {
    id: 'sale-007',
    item_name: 'Kit Empaquetadura Completo Cabezal',
    price: 85000,
    payment_method: 'efectivo',
    category: 'repuesto',
    created_at: '2026-10-23T17:10:00.000Z',
    created_time_str: '5:10 PM',
    created_date_str: '2026-10-23'
  },
  {
    id: 'sale-008',
    item_name: 'Manómetro de Presión 0-300 PSI Glicerina',
    price: 32000,
    payment_method: 'efectivo',
    category: 'repuesto',
    created_at: '2026-10-23T11:20:00.000Z',
    created_time_str: '11:20 AM',
    created_date_str: '2026-10-23'
  },
  {
    id: 'sale-009',
    item_name: 'Bobinado Motor Monofásico 2HP',
    price: 180000,
    payment_method: 'tarjeta',
    category: 'bobinado',
    created_at: '2026-10-23T10:15:00.000Z',
    created_time_str: '10:15 AM',
    created_date_str: '2026-10-23'
  },
  {
    id: 'sale-010',
    item_name: 'Aceite Compresor Mineral 1L ISO 100',
    price: 35000,
    payment_method: 'nequi_davi',
    category: 'aceite',
    created_at: '2026-10-23T09:30:00.000Z',
    created_time_str: '9:30 AM',
    created_date_str: '2026-10-23'
  },
  {
    id: 'sale-011',
    item_name: 'Válvula Cheque Antirretorno 1/2',
    price: 45000,
    payment_method: 'efectivo',
    category: 'valvula',
    created_at: '2026-10-23T08:50:00.000Z',
    created_time_str: '8:50 AM',
    created_date_str: '2026-10-23'
  },
  {
    id: 'sale-012',
    item_name: 'Presostato Automático 4 Vías',
    price: 95000,
    payment_method: 'tarjeta',
    category: 'repuesto',
    created_at: '2026-10-23T14:20:00.000Z',
    created_time_str: '2:20 PM',
    created_date_str: '2026-10-23'
  },
  {
    id: 'sale-013',
    item_name: 'Banda en V A-42 Dentada',
    price: 28000,
    payment_method: 'efectivo',
    category: 'repuesto',
    created_at: '2026-10-23T16:00:00.000Z',
    created_time_str: '4:00 PM',
    created_date_str: '2026-10-23'
  },
  {
    id: 'sale-014',
    item_name: 'Condensador de Arranque 250 MFD',
    price: 20000,
    payment_method: 'efectivo',
    category: 'repuesto',
    created_at: '2026-10-23T16:45:00.000Z',
    created_time_str: '4:45 PM',
    created_date_str: '2026-10-23'
  }
];

class StorageService {
  private sales: Sale[] = [];
  private closures: CashClosure[] = [];
  private supabaseConfig: SupabaseConfig = {
    url: process.env.SUPABASE_URL || '',
    anon_key: process.env.SUPABASE_ANON_KEY || '',
    is_configured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
    is_connected: false,
    table_name: 'ventas_tcb'
  };
  private supabaseClient: SupabaseClient | null = null;

  constructor() {
    this.loadFromDisk();
    if (this.supabaseConfig.is_configured) {
      this.initSupabaseClient();
    }
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.sales = parsed.sales || INITIAL_SALES;
        this.closures = parsed.closures || [];
        if (parsed.supabaseConfig) {
          this.supabaseConfig = { ...this.supabaseConfig, ...parsed.supabaseConfig };
        }
        return;
      }
    } catch (e) {
      console.warn('Could not read existing data store, initializing fresh data', e);
    }
    this.sales = [...INITIAL_SALES];
    this.saveToDisk();
  }

  private saveToDisk() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify({
        sales: this.sales,
        closures: this.closures,
        supabaseConfig: this.supabaseConfig
      }, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save data store to disk', e);
    }
  }

  private initSupabaseClient() {
    try {
      if (this.supabaseConfig.url && this.supabaseConfig.anon_key) {
        this.supabaseClient = createClient(this.supabaseConfig.url, this.supabaseConfig.anon_key);
        this.supabaseConfig.is_configured = true;
      }
    } catch (e) {
      console.error('Failed to initialize Supabase client:', e);
      this.supabaseClient = null;
      this.supabaseConfig.is_connected = false;
    }
  }

  public async testSupabaseConnection(url?: string, anonKey?: string): Promise<{ success: boolean; message: string }> {
    const testUrl = url || this.supabaseConfig.url;
    const testKey = anonKey || this.supabaseConfig.anon_key;

    if (!testUrl || !testKey) {
      return { success: false, message: 'URL o Anon Key no configurados.' };
    }

    try {
      const client = createClient(testUrl, testKey);
      // Attempt a lightweight query
      const { data, error } = await client.from(this.supabaseConfig.table_name).select('id').limit(1);
      
      if (error) {
        // Check if table missing
        if (error.code === '42P01' || error.message.includes('relation') || error.message.includes('does not exist')) {
          this.supabaseClient = client;
          this.supabaseConfig.url = testUrl;
          this.supabaseConfig.anon_key = testKey;
          this.supabaseConfig.is_configured = true;
          this.supabaseConfig.is_connected = true;
          this.saveToDisk();
          return {
            success: true,
            message: `Conectado exitosamente con Supabase! La tabla "${this.supabaseConfig.table_name}" aún no existe; puedes crearla con el script SQL provisto.`
          };
        }
        return { success: false, message: `Error Supabase: ${error.message} (${error.code || ''})` };
      }

      this.supabaseClient = client;
      this.supabaseConfig.url = testUrl;
      this.supabaseConfig.anon_key = testKey;
      this.supabaseConfig.is_configured = true;
      this.supabaseConfig.is_connected = true;
      this.supabaseConfig.last_sync_at = new Date().toISOString();
      this.saveToDisk();

      return {
        success: true,
        message: `¡Conexión verificada! Tabla "${this.supabaseConfig.table_name}" lista y sincronizada.`
      };
    } catch (err: any) {
      return { success: false, message: `Fallo de conexión: ${err.message || String(err)}` };
    }
  }

  public getSupabaseConfig(): SupabaseConfig {
    return this.supabaseConfig;
  }

  public async setSupabaseConfig(url: string, anonKey: string, tableName?: string): Promise<{ success: boolean; message: string }> {
    this.supabaseConfig.url = url.trim();
    this.supabaseConfig.anon_key = anonKey.trim();
    if (tableName) {
      this.supabaseConfig.table_name = tableName.trim();
    }
    const result = await this.testSupabaseConnection(this.supabaseConfig.url, this.supabaseConfig.anon_key);
    this.saveToDisk();
    return result;
  }

  public getSales(search?: string, filter?: string): Sale[] {
    let result = [...this.sales];

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      result = result.filter(s => 
        s.item_name.toLowerCase().includes(q) || 
        (s.customer_name && s.customer_name.toLowerCase().includes(q)) ||
        s.category.toLowerCase().includes(q) ||
        s.payment_method.toLowerCase().includes(q)
      );
    }

    if (filter === 'today') {
      result = result.filter(s => s.created_date_str === '2026-10-24');
    } else if (filter === 'week') {
      result = result.filter(s => s.created_date_str.startsWith('2026-10-2'));
    }

    // Sort descending by created_at
    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getGroupedSales(search?: string, filter?: string): DaySalesGroup[] {
    const list = this.getSales(search, filter);
    const groupsMap = new Map<string, Sale[]>();

    for (const sale of list) {
      const dateKey = sale.created_date_str;
      if (!groupsMap.has(dateKey)) {
        groupsMap.set(dateKey, []);
      }
      groupsMap.get(dateKey)!.push(sale);
    }

    const groups: DaySalesGroup[] = [];
    const todayStr = '2026-10-24';
    const yesterdayStr = '2026-10-23';

    for (const [dateKey, salesList] of groupsMap.entries()) {
      const isToday = dateKey === todayStr;
      const isYesterday = dateKey === yesterdayStr;
      
      let dateLabel = dateKey;
      if (isToday) {
        dateLabel = 'Hoy — Viernes, 24 de Octubre';
      } else if (isYesterday) {
        dateLabel = 'Ayer — Jueves, 23 de Octubre';
      } else {
        const d = new Date(dateKey + 'T12:00:00Z');
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        dateLabel = `${dayNames[d.getUTCDay()]}, ${d.getUTCDate()} de ${monthNames[d.getUTCMonth()]}`;
      }

      const totalAmount = salesList.reduce((acc, curr) => acc + curr.price, 0);

      groups.push({
        date_label: dateLabel,
        date_key: dateKey,
        is_today: isToday,
        is_yesterday: isYesterday,
        total_amount: totalAmount,
        sales_count: salesList.length,
        sales: salesList
      });
    }

    // Sort groups descending
    return groups.sort((a, b) => b.date_key.localeCompare(a.date_key));
  }

  public async addSale(data: {
    item_name: string;
    price: number;
    payment_method: PaymentMethod;
    category?: ProductCategory;
    notes?: string;
    customer_name?: string;
    created_time_str?: string;
    created_date_str?: string;
  }): Promise<Sale> {
    const now = new Date();
    const nowHours = now.getHours();
    const nowMinutes = now.getMinutes();
    const ampm = nowHours >= 12 ? 'PM' : 'AM';
    const displayHours = nowHours % 12 || 12;
    const displayMinutes = nowMinutes < 10 ? `0${nowMinutes}` : nowMinutes;
    const defaultTimeStr = `${displayHours}:${displayMinutes} ${ampm}`;
    const defaultDateStr = '2026-10-24'; // Sync with demo date or current

    const newSale: Sale = {
      id: `sale-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      item_name: data.item_name.trim(),
      price: Number(data.price),
      payment_method: data.payment_method,
      category: data.category || this.inferCategory(data.item_name),
      notes: data.notes?.trim(),
      customer_name: data.customer_name?.trim(),
      created_at: now.toISOString(),
      created_time_str: data.created_time_str || defaultTimeStr,
      created_date_str: data.created_date_str || defaultDateStr,
      synced_to_supabase: false
    };

    this.sales.unshift(newSale);
    this.saveToDisk();

    // Async sync to Supabase if configured
    if (this.supabaseClient && this.supabaseConfig.is_connected) {
      try {
        const { error } = await this.supabaseClient.from(this.supabaseConfig.table_name).insert([{
          id: newSale.id,
          item_name: newSale.item_name,
          price: newSale.price,
          payment_method: newSale.payment_method,
          category: newSale.category,
          notes: newSale.notes,
          customer_name: newSale.customer_name,
          created_at: newSale.created_at,
          created_time_str: newSale.created_time_str,
          created_date_str: newSale.created_date_str
        }]);
        if (!error) {
          newSale.synced_to_supabase = true;
          this.saveToDisk();
        }
      } catch (e) {
        console.warn('Failed background sync to Supabase:', e);
      }
    }

    return newSale;
  }

  public async updateSale(id: string, updates: Partial<Sale>): Promise<Sale | null> {
    const idx = this.sales.findIndex(s => s.id === id);
    if (idx === -1) return null;

    const existing = this.sales[idx];
    const updated: Sale = {
      ...existing,
      ...updates,
      id: existing.id // preserve id
    };
    if (updates.item_name && !updates.category) {
      updated.category = this.inferCategory(updates.item_name);
    }

    this.sales[idx] = updated;
    this.saveToDisk();

    if (this.supabaseClient && this.supabaseConfig.is_connected) {
      try {
        await this.supabaseClient.from(this.supabaseConfig.table_name).update({
          item_name: updated.item_name,
          price: updated.price,
          payment_method: updated.payment_method,
          category: updated.category,
          notes: updated.notes,
          customer_name: updated.customer_name
        }).eq('id', updated.id);
      } catch (e) {
        console.warn('Supabase update failed:', e);
      }
    }

    return updated;
  }

  public async deleteSale(id: string): Promise<boolean> {
    const initialLen = this.sales.length;
    this.sales = this.sales.filter(s => s.id !== id);
    const deleted = this.sales.length < initialLen;
    if (deleted) {
      this.saveToDisk();
      if (this.supabaseClient && this.supabaseConfig.is_connected) {
        try {
          await this.supabaseClient.from(this.supabaseConfig.table_name).delete().eq('id', id);
        } catch (e) {
          console.warn('Supabase delete failed:', e);
        }
      }
    }
    return deleted;
  }

  public getStats(): StatsSummary {
    const todaySales = this.sales.filter(s => s.created_date_str === '2026-10-24');
    const yesterdaySales = this.sales.filter(s => s.created_date_str === '2026-10-23');

    const today_total = todaySales.reduce((acc, curr) => acc + curr.price, 0);
    const yesterday_total = yesterdaySales.reduce((acc, curr) => acc + curr.price, 0) || 520000;
    const today_count = todaySales.length;
    const today_target = 600000;
    const today_target_pct = Math.min(100, Math.round((today_total / today_target) * 100));
    const average_ticket = today_count > 0 ? Math.round(today_total / today_count) : 27500;
    const today_vs_yesterday_pct = 18;

    const week_total = 2450000 + (today_total > 385000 ? today_total - 385000 : 0);
    const week_vs_last_week_pct = 8;

    const month_total = 9820000 + (today_total > 385000 ? today_total - 385000 : 0);
    const month_target = 10000000;
    const month_target_pct = Number(((month_total / month_target) * 100).toFixed(1));
    const month_gap_to_record = Math.max(0, month_target - month_total);

    return {
      today_total,
      yesterday_total,
      today_vs_yesterday_pct,
      today_count,
      today_target,
      today_target_pct,
      average_ticket,
      week_total,
      week_vs_last_week_pct,
      month_total,
      month_target,
      month_target_pct,
      month_days_remaining: 7,
      month_gap_to_record,
      last_7_days: [
        { day_name: 'Lun', date_str: '19 Oct', amount: 280000, formatted_k: '$280k', is_today: false, is_highest: false },
        { day_name: 'Mar', date_str: '20 Oct', amount: 310000, formatted_k: '$310k', is_today: false, is_highest: false },
        { day_name: 'Mié', date_str: '21 Oct', amount: 290000, formatted_k: '$290k', is_today: false, is_highest: false },
        { day_name: 'Jue', date_str: '22 Oct', amount: 520000, formatted_k: '$520k', is_today: false, is_highest: true },
        { day_name: 'Vie', date_str: '23 Oct', amount: today_total, formatted_k: `$${Math.round(today_total / 1000)}k`, is_today: true, is_highest: false },
        { day_name: 'Sáb', date_str: '24 Oct', amount: 260000, formatted_k: 'Est.', is_today: false, is_highest: false },
        { day_name: 'Dom', date_str: '25 Oct', amount: 0, formatted_k: '—', is_today: false, is_highest: false }
      ],
      top_products: [
        {
          rank: 1,
          name: 'Aceite Compresor 1L',
          sold_count: 42,
          unit_label: 'botellas entregadas',
          total_revenue: 1470000,
          badge_label: 'Mayor ganancia',
          badge_type: 'amber'
        },
        {
          rank: 2,
          name: 'Filtros de Aire 3/4',
          sold_count: 28,
          unit_label: 'filtros de repuesto',
          total_revenue: 504000,
          badge_label: 'Alta rotación',
          badge_type: 'green'
        },
        {
          rank: 3,
          name: 'Válvulas Cheque 1/2',
          sold_count: 19,
          unit_label: 'repuestos clave',
          total_revenue: 855000,
          badge_label: 'Margen alto',
          badge_type: 'orange'
        }
      ],
      intelligent_tip: {
        title: 'Consejo Inteligente',
        badge: 'Taller',
        highlight_text: 'Jueves',
        message: '¡Gran trabajo! Tu día con más ventas siempre suele ser el Jueves. Asegúrate de pedir aceite y filtros los miércoles para tener inventario suficiente en el mostrador.'
      }
    };
  }

  public async registerCashClosure(data: { notes?: string; cashier_name?: string }): Promise<CashClosure> {
    const todaySales = this.sales.filter(s => s.created_date_str === '2026-10-24');
    let cash = 0;
    let nequi = 0;
    let card = 0;

    for (const s of todaySales) {
      if (s.payment_method === 'efectivo') cash += s.price;
      else if (s.payment_method === 'nequi_davi') nequi += s.price;
      else if (s.payment_method === 'tarjeta') card += s.price;
    }

    const closure: CashClosure = {
      id: `closure-${Date.now()}`,
      closed_at: new Date().toISOString(),
      date_str: '2026-10-24',
      total_sales: cash + nequi + card,
      cash_amount: cash,
      nequi_davi_amount: nequi,
      card_amount: card,
      transactions_count: todaySales.length,
      cashier_name: data.cashier_name || 'Don Carlos',
      notes: data.notes
    };

    this.closures.unshift(closure);
    this.saveToDisk();

    return closure;
  }

  public getCashClosures(): CashClosure[] {
    return this.closures;
  }

  public getSupabaseSqlSchema(): string {
    return `-- =========================================================================
-- ESQUEMA SQL PARA SUPABASE - TODO COMPRESORES Y BOBINADOS (TCB)
-- Copia y pega esto en el SQL Editor de tu proyecto en Supabase (https://app.supabase.com)
-- =========================================================================

-- 1. Crear tabla de ventas
CREATE TABLE IF NOT EXISTS public.${this.supabaseConfig.table_name} (
    id TEXT PRIMARY KEY,
    item_name TEXT NOT NULL,
    price NUMERIC(14, 2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('efectivo', 'nequi_davi', 'tarjeta')),
    category TEXT DEFAULT 'otro',
    notes TEXT,
    customer_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_time_str TEXT,
    created_date_str TEXT
);

-- 2. Crear tabla de cierres de caja
CREATE TABLE IF NOT EXISTS public.cierres_caja_tcb (
    id TEXT PRIMARY KEY,
    closed_at TIMESTAMPTZ DEFAULT NOW(),
    date_str TEXT NOT NULL,
    total_sales NUMERIC(14, 2) NOT NULL,
    cash_amount NUMERIC(14, 2) NOT NULL,
    nequi_davi_amount NUMERIC(14, 2) NOT NULL,
    card_amount NUMERIC(14, 2) NOT NULL,
    transactions_count INTEGER NOT NULL,
    cashier_name TEXT DEFAULT 'Don Carlos',
    notes TEXT
);

-- 3. Habilitar Row Level Security (RLS) y permitir lectura/escritura anónima para la app
ALTER TABLE public.${this.supabaseConfig.table_name} ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cierres_caja_tcb ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir todo para ventas_tcb" 
ON public.${this.supabaseConfig.table_name} 
FOR ALL 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Permitir todo para cierres_caja_tcb" 
ON public.cierres_caja_tcb 
FOR ALL 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- 4. Índices para búsquedas ultra rápidas
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON public.${this.supabaseConfig.table_name} (created_date_str);
CREATE INDEX IF NOT EXISTS idx_ventas_metodo ON public.${this.supabaseConfig.table_name} (payment_method);
`;
  }

  private inferCategory(title: string): ProductCategory {
    const lower = title.toLowerCase();
    if (lower.includes('aceite')) return 'aceite';
    if (lower.includes('bobinado') || lower.includes('motor')) return 'bobinado';
    if (lower.includes('mantenimiento') || lower.includes('revisión')) return 'mantenimiento';
    if (lower.includes('acople') || lower.includes('manguera')) return 'acople';
    if (lower.includes('válvula') || lower.includes('valvula') || lower.includes('cheque')) return 'valvula';
    if (lower.includes('filtro')) return 'filtro';
    if (lower.includes('manómetro') || lower.includes('manometro') || lower.includes('empaquetadura') || lower.includes('presostato') || lower.includes('banda') || lower.includes('condensador')) return 'repuesto';
    return 'otro';
  }
}

export const storage = new StorageService();
