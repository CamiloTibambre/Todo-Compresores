export type PaymentMethod = 'efectivo' | 'nequi_davi' | 'tarjeta';

export type ProductCategory = 
  | 'aceite' 
  | 'repuesto' 
  | 'bobinado' 
  | 'mantenimiento' 
  | 'acople' 
  | 'valvula' 
  | 'filtro'
  | 'otro';

export interface Sale {
  id: string;
  item_name: string;
  price: number;
  payment_method: PaymentMethod;
  category: ProductCategory;
  notes?: string;
  customer_name?: string;
  created_at: string; // ISO string
  created_time_str: string; // e.g. "2:39 PM"
  created_date_str: string; // e.g. "2026-10-24"
  synced_to_supabase?: boolean;
}

export interface DaySalesGroup {
  date_label: string; // e.g. "Hoy — Viernes, 24 de Octubre"
  date_key: string;
  is_today: boolean;
  is_yesterday: boolean;
  total_amount: number;
  sales_count: number;
  sales: Sale[];
}

export interface StatsSummary {
  today_total: number;
  yesterday_total: number;
  today_vs_yesterday_pct: number;
  today_count: number;
  today_target: number; // e.g. 600000
  today_target_pct: number; // e.g. 64%
  average_ticket: number; // e.g. 27500
  
  week_total: number;
  week_vs_last_week_pct: number;
  
  month_total: number;
  month_target: number; // e.g. 10000000
  month_target_pct: number; // e.g. 98.2%
  month_days_remaining: number;
  month_gap_to_record: number; // e.g. 180000
  
  last_7_days: {
    day_name: string; // "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"
    date_str: string;
    amount: number;
    formatted_k: string; // "$385k"
    is_today: boolean;
    is_highest: boolean;
  }[];
  
  top_products: {
    rank: number;
    name: string;
    sold_count: number;
    unit_label: string;
    total_revenue: number;
    badge_label: string; // "Mayor ganancia", "Alta rotación", "Margen alto"
    badge_type: 'amber' | 'green' | 'orange';
  }[];
  
  intelligent_tip: {
    title: string;
    badge: string;
    highlight_text: string;
    message: string;
  };
}

export interface CashClosure {
  id: string;
  closed_at: string;
  date_str: string;
  total_sales: number;
  cash_amount: number;
  nequi_davi_amount: number;
  card_amount: number;
  transactions_count: number;
  cashier_name: string;
  notes?: string;
  synced_to_supabase?: boolean;
}

export interface SupabaseConfig {
  url: string;
  anon_key: string;
  is_configured: boolean;
  is_connected: boolean;
  table_name: string;
  last_sync_at?: string;
}
