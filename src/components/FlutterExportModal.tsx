import React, { useState } from 'react';
import { X, Smartphone, Copy, Check, Download, FileCode, Terminal } from 'lucide-react';
import { FLUTTER_CODE_FILES, FlutterFile } from '../server/flutterCode.ts';

interface FlutterExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlutterExportModal: React.FC<FlutterExportModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedFile, setSelectedFile] = useState<FlutterFile>(FLUTTER_CODE_FILES[1]); // main.dart
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    // Generate a downloadable text/json or trigger download
    const blob = new Blob([
      `# ARCHIVOS DEL PROYECTO FLUTTER - TODO COMPRESORES Y BOBINADOS\n\n` +
      FLUTTER_CODE_FILES.map(f => `--- ARCHIVO: ${f.path} ---\n${f.content}\n\n`).join('\n')
    ], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todo_compresores_flutter_project.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#131826] border border-[#ffd600]/30 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ffd600]/20 text-[#ffd600] flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Proyecto Flutter Android</span>
                <span className="text-[10px] bg-[#ffd600] text-black px-1.5 py-0.5 rounded font-black">
                  APK READY
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Código fuente nativo Flutter con conexión Supabase & tema ElectroTech Dark Glass
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

        {/* Build APK Quick Command Strip */}
        <div className="bg-[#0C0F17] px-4 py-2.5 border-b border-white/5 flex items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2 font-mono text-emerald-400 truncate">
            <Terminal className="w-4 h-4 text-[#ffd600] shrink-0" />
            <span className="text-slate-400 select-none">$</span>
            <span className="truncate">flutter build apk --release</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadAll}
              className="px-2.5 py-1 rounded-lg bg-[#1E2438] hover:bg-[#272a33] text-xs font-semibold text-slate-300 flex items-center gap-1 border border-white/5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#ffd600]" />
              <span className="hidden sm:inline">Descargar Archivos</span>
            </button>
          </div>
        </div>

        {/* File Navigator Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/5 overflow-x-auto no-scrollbar shrink-0 bg-[#161B2B]">
          {FLUTTER_CODE_FILES.map((file) => (
            <button
              key={file.path}
              onClick={() => setSelectedFile(file)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedFile.path === file.path
                  ? 'bg-[#ffd600] text-black font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{file.path.split('/').pop()}</span>
            </button>
          ))}
        </div>

        {/* File Details bar */}
        <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-400 bg-[#0C0F17]/50 border-b border-white/5 shrink-0">
          <span className="font-mono text-[11px] text-slate-300">
            {selectedFile.path} — <span className="text-slate-400 font-sans">{selectedFile.description}</span>
          </span>
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded bg-[#ffd600]/10 hover:bg-[#ffd600]/20 text-[#ffd600] font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Código</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content View */}
        <div className="flex-1 overflow-auto bg-[#07090E] p-4 text-xs font-mono text-slate-300 leading-relaxed select-all">
          <pre>{selectedFile.content}</pre>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#131826] border-t border-white/10 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Total: {FLUTTER_CODE_FILES.length} archivos fuente listos para compilar en Android</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#ffd600] text-black font-bold text-xs cursor-pointer hover:bg-[#ffe14d]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
