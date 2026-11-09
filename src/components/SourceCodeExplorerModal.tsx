import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  FolderTree, 
  Download, 
  Copy, 
  Check, 
  User, 
  ShieldCheck, 
  FileText, 
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';
import { phpCodeFiles, PhpFileEntry } from '../data/phpCodeFiles';

interface SourceCodeExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadZip: () => void;
}

export const SourceCodeExplorerModal: React.FC<SourceCodeExplorerModalProps> = ({
  isOpen,
  onClose,
  onDownloadZip,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeFile, setActiveFile] = useState<PhpFileEntry>(phpCodeFiles[0]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Semua File (22)' },
    { id: 'core', label: 'Core & Config (4)' },
    { id: 'model', label: 'Models / PDO (4)' },
    { id: 'controller', label: 'Controllers (5)' },
    { id: 'view', label: 'Views & Layouts (6)' },
    { id: 'sql', label: 'Database & Docs (3)' },
  ];

  const filteredFiles = selectedCategory === 'all' 
    ? phpCodeFiles 
    : phpCodeFiles.filter(f => f.category === selectedCategory);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-6xl h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#002B36] text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base md:text-lg">
                  Arsitektur Pure PHP MVC & Dokumentasi Sistem
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
                  CirebonKita
                </span>
              </div>
              <p className="text-xs text-white/70">
                Pemeriksaan kode sumber native PHP, PDO Prepared Statements, dan arsitektur portal desa wisata.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDownloadZip}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unduh</span> cirebonkita.zip
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#004C6D] text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main Content Area (Sidebar + Editor) */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Tree List */}
          <div className="w-72 sm:w-80 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0">
            <div className="p-3 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-slate-400" />
              Daftar Berkas Proyek
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredFiles.map((file) => {
                const isSelected = activeFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setActiveFile(file)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex flex-col gap-0.5 ${
                      isSelected
                        ? 'bg-white text-[#004C6D] shadow-xs border border-blue-200'
                        : 'text-slate-700 hover:bg-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono text-xs font-bold truncate">{file.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                        file.category === 'model' ? 'bg-amber-100 text-amber-800' :
                        file.category === 'controller' ? 'bg-emerald-100 text-emerald-800' :
                        file.category === 'core' ? 'bg-purple-100 text-purple-800' :
                        file.category === 'view' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {file.category}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono truncate">{file.path}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{file.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer & Exam Notes */}
          <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 overflow-hidden">
            {/* Active File Bar */}
            <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-emerald-400 font-bold">{activeFile.path}</span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  {activeFile.developer}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Tersalin' : 'Salin Kode'}
                </button>
              </div>
            </div>

            {/* Oral Exam Defense Box */}
            <div className="p-3 bg-slate-800/80 border-b border-slate-700/80 text-xs shrink-0 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-amber-200">
                  Poin Penjelasan Saat Ujian Lisan / Sidang Dosen:
                </div>
                <div className="text-slate-300 leading-relaxed text-[11px]">
                  {activeFile.oralExamNote}
                </div>
              </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed bg-[#0d1117] text-slate-200">
              <pre className="whitespace-pre">
                <code>{activeFile.content}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Bottom Footer Note */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              100% Native Pure PHP MVC tanpa framework • MySQL PDO Prepared Statements • XSS htmlspecialchars
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-mono text-[11px]">Lokasi Folder: /cirebonkita/</span>
            <button
              onClick={onDownloadZip}
              className="font-bold text-[#004C6D] hover:underline cursor-pointer"
            >
              Unduh Seluruh Proyek (.zip)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
