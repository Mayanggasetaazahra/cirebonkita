import React, { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText, ChevronDown, Check } from 'lucide-react';

interface ReportExportButtonProps {
  label?: string;
  onExport: (format: 'xlsx' | 'csv') => Promise<void> | void;
  className?: string;
  size?: 'sm' | 'md';
}

export const ReportExportButton: React.FC<ReportExportButtonProps> = ({
  label = 'Unduh Laporan',
  onExport,
  className = '',
  size = 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [justExported, setJustExported] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownload = async (format: 'xlsx' | 'csv') => {
    setIsExporting(format);
    try {
      await onExport(format);
      setJustExported(format);
      setTimeout(() => setJustExported(null), 2500);
    } finally {
      setIsExporting(null);
      setIsOpen(false);
    }
  };

  const isSmall = size === 'sm';

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`flex items-center gap-2 font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-[#014B35] hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs transition-all cursor-pointer select-none ${
          isSmall ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-xs'
        }`}
        title="Unduh Laporan data dalam format Excel (.xlsx) atau CSV"
      >
        <Download className={`${isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-[#014B35]`} />
        <span>{label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Pilih Format Berkas
            </p>
          </div>

          <div className="p-1 space-y-0.5">
            {/* XLSX Option */}
            <button
              type="button"
              onClick={() => handleDownload('xlsx')}
              disabled={isExporting !== null}
              className="w-full flex items-center justify-between px-3 py-2 text-left rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 transition cursor-pointer group text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 group-hover:text-emerald-950">
                    Format Excel (.xlsx)
                  </div>
                  <div className="text-[10px] text-slate-400 group-hover:text-emerald-700">
                    Tabel spreadsheet rapi berformat
                  </div>
                </div>
              </div>
              {justExported === 'xlsx' && (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
            </button>

            {/* CSV Option */}
            <button
              type="button"
              onClick={() => handleDownload('csv')}
              disabled={isExporting !== null}
              className="w-full flex items-center justify-between px-3 py-2 text-left rounded-xl hover:bg-blue-50 text-slate-700 hover:text-blue-900 transition cursor-pointer group text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 group-hover:text-blue-950">
                    Format CSV (.csv)
                  </div>
                  <div className="text-[10px] text-slate-400 group-hover:text-blue-700">
                    Kompatibel dengan semua sistem
                  </div>
                </div>
              </div>
              {justExported === 'csv' && (
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
              )}
            </button>
          </div>

          <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 rounded-b-2xl">
            Diunduh langsung dari data aktif portal
          </div>
        </div>
      )}
    </div>
  );
};
