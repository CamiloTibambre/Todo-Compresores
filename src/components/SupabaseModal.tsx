import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertCircle, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import type { SupabaseConfig } from '../types.ts';

interface SupabaseModalProps {
  config: SupabaseConfig;
  isOpen: boolean;
  onClose: () => void;
  onSaveConfig: (url: string, anonKey: string, tableName?: string) => Promise<{ success: boolean; message: string }>;
  sqlSchema: string;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  config,
  isOpen,
  onClose,
  onSaveConfig,
  sqlSchema
}) => {
  const [url, setUrl] = useState(config.url || '');
  const [anonKey, setAnonKey] = useState(config.anon_key || '');
  const [tableName, setTableName] = useState(config.table_name || 'ventas_tcb');
  const [isTesting, setIsTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'sql'>('config');

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setStatusMessage(null);
    try {
      const res = await onSaveConfig(url, anonKey, tableName);
      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error al conectar' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#131826] border border-[#ffd600]/30 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl space-y-4 p-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Conexión a Supabase
              </h3>
              <p className="text-[11px] text-slate-400">
                Base de datos en la nube & sincronización en tiempo real
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Configuración | Script SQL */}
        <div className="grid grid-cols-2 gap-2 bg-[#0C0F17] p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('config')}
            className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'config'
                ? 'bg-[#ffd600] text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Configuración & Credenciales
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sql'
                ? 'bg-[#ffd600] text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Esquema SQL (Tablas)
          </button>
        </div>

        {activeTab === 'config' ? (
          <form onSubmit={handleSave} className="space-y-4">
            {/* Status indicator */}
            <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
              config.is_connected
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
            }`}>
              {config.is_connected ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold">
                  {config.is_connected ? 'Supabase Activo & Conectado' : 'Modo Local / Esperando Supabase'}
                </span>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  {config.is_connected
                    ? 'Las ventas se sincronizan directamente con tu base de datos Supabase.'
                    : 'Puedes ingresar tus credenciales de Supabase o usar la app con almacenamiento local en el backend.'}
                </p>
              </div>
            </div>

            {statusMessage && (
              <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                  : 'bg-red-950/80 border-red-500 text-red-200'
              }`}>
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Supabase URL */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Project URL de Supabase</span>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-[#ffd600] hover:underline flex items-center gap-1"
                >
                  <span>Dashboard Supabase</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzabcdefghijklm.supabase.co"
                className="w-full bg-[#0C0F17] border border-white/10 focus:border-[#ffd600] rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none"
              />
            </div>

            {/* Anon Key */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Anon Public Key (API Key)
              </label>
              <input
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-[#0C0F17] border border-white/10 focus:border-[#ffd600] rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none"
              />
            </div>

            {/* Table Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Nombre de tabla
              </label>
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="ventas_tcb"
                className="w-full bg-[#0C0F17] border border-white/10 focus:border-[#ffd600] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                Cerrar
              </button>
              <button
                type="submit"
                disabled={isTesting}
                className="px-5 py-2.5 rounded-xl bg-[#ffd600] hover:bg-[#ffe14d] text-black text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#ffd600]/20 disabled:opacity-50"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-3.5 h-3.5" />
                    <span>Guardar y Probar Conexión</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* SQL Tab */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-300">
                Ejecuta este código en el <b>SQL Editor</b> de Supabase para crear las tablas con RLS automático:
              </p>
              <button
                onClick={handleCopySql}
                className="px-3 py-1.5 rounded-lg bg-[#ffd600] text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#ffe14d]"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSql ? '¡Copiado!' : 'Copiar SQL'}</span>
              </button>
            </div>

            <pre className="bg-[#0C0F17] border border-white/10 rounded-xl p-3 text-[11px] text-emerald-400 font-mono overflow-x-auto max-h-64 leading-relaxed select-all">
              {sqlSchema}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
