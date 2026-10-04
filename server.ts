import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { storage } from './src/server/storage.ts';
import { FLUTTER_CODE_FILES } from './src/server/flutterCode.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// API Routes

// 1. Sales API
app.get('/api/sales', (req, res) => {
  const { search, filter } = req.query;
  const sales = storage.getSales(search as string, filter as string);
  res.json({ success: true, count: sales.length, sales });
});

app.get('/api/sales/grouped', (req, res) => {
  const { search, filter } = req.query;
  const groups = storage.getGroupedSales(search as string, filter as string);
  res.json({ success: true, groups });
});

app.post('/api/sales', async (req, res) => {
  try {
    const { item_name, price, payment_method, category, notes, customer_name, created_time_str, created_date_str } = req.body;
    if (!item_name || !price) {
      return res.status(400).json({ success: false, message: 'Producto y precio requeridos' });
    }
    const sale = await storage.addSale({
      item_name,
      price: Number(price),
      payment_method: payment_method || 'efectivo',
      category,
      notes,
      customer_name,
      created_time_str,
      created_date_str
    });
    res.status(201).json({ success: true, sale });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/sales/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await storage.updateSale(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Venta no encontrada' });
    }
    res.json({ success: true, sale: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/sales/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ok = await storage.deleteSale(id);
    if (!ok) {
      return res.status(404).json({ success: false, message: 'Venta no encontrada' });
    }
    res.json({ success: true, message: 'Venta eliminada' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Stats API
app.get('/api/stats', (_req, res) => {
  try {
    const stats = storage.getStats();
    res.json({ success: true, stats });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Cash Closures
app.get('/api/closures', (_req, res) => {
  const closures = storage.getCashClosures();
  res.json({ success: true, closures });
});

app.post('/api/closures', async (req, res) => {
  try {
    const closure = await storage.registerCashClosure(req.body);
    res.status(201).json({ success: true, closure });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Supabase Configuration & Sync
app.get('/api/supabase/config', (_req, res) => {
  res.json({ success: true, config: storage.getSupabaseConfig() });
});

app.post('/api/supabase/config', async (req, res) => {
  try {
    const { url, anon_key, table_name } = req.body;
    const result = await storage.setSupabaseConfig(url || '', anon_key || '', table_name);
    res.json({ ...result, config: storage.getSupabaseConfig() });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/supabase/schema', (_req, res) => {
  res.json({ success: true, sql: storage.getSupabaseSqlSchema() });
});

// 5. Flutter Android Project Files API
app.get('/api/flutter/files', (_req, res) => {
  res.json({
    success: true,
    totalFiles: FLUTTER_CODE_FILES.length,
    files: FLUTTER_CODE_FILES
  });
});

// Vite or Static file serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Backend server ready on http://0.0.0.0:${port}`);
  });
}

startServer();
