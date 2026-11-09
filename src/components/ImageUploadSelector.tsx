import React, { useState, useRef } from 'react';
import { 
  Link as LinkIcon, 
  UploadCloud, 
  Image as ImageIcon, 
  Check, 
  X, 
  FileCheck,
  RefreshCw
} from 'lucide-react';
import { uploadImageToServer } from '../utils/apiSync';

interface ImageUploadSelectorProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
}

export const ImageUploadSelector: React.FC<ImageUploadSelectorProps> = ({
  label,
  value,
  onChange,
  placeholder = 'https://... atau /assets/aistudio/...',
  required = false,
  helperText = 'Pilih metode input foto: tempelkan tautan link web atau unggah berkas gambar langsung.',
}) => {
  // Determine initial mode: if starts with 'data:image', it's uploaded file, else link
  const isDataUrl = value && value.startsWith('data:image');
  const [mode, setMode] = useState<'link' | 'upload'>(isDataUrl ? 'upload' : 'link');
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (JPG, PNG, WebP).');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) return;

      // Compress and resize image using HTML5 Canvas to keep under ~100KB for localStorage
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1000;
        const maxHeight = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          onChange(compressed);
          // Upload to server for permanent cross-device static link
          uploadImageToServer(compressed, file.name).then((serverUrl) => {
            if (serverUrl && serverUrl !== compressed) {
              onChange(serverUrl);
            }
          }).catch(() => {});
        } else {
          onChange(result);
          uploadImageToServer(result, file.name).then((serverUrl) => {
            if (serverUrl && serverUrl !== result) {
              onChange(serverUrl);
            }
          }).catch(() => {});
        }
      };
      img.onerror = () => {
        onChange(result);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <label className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>

        {/* 2 Version Mode Toggle Buttons */}
        <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setMode('link')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition cursor-pointer ${
              mode === 'link'
                ? 'bg-white text-[#014B35] font-bold shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Paste Link / URL</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition cursor-pointer ${
              mode === 'upload'
                ? 'bg-[#014B35] text-white font-bold shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UploadCloud className="w-3 h-3" />
            <span>Upload Langsung</span>
          </button>
        </div>
      </div>

      {/* Main Container with Preview on Left and Input Method on Right */}
      <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/90 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Live Preview Box */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-200/60 shrink-0 shadow-inner flex items-center justify-center group">
            {value ? (
              <>
                <img 
                  src={value} 
                  alt="Preview" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/aistudio/hotel_santika_6375e40f.jpeg';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-bold">
                  Pratinjau
                </div>
              </>
            ) : (
              <div className="text-center p-1 text-slate-400">
                <ImageIcon className="w-6 h-6 mx-auto mb-1 stroke-1" />
                <span className="text-[9px] font-medium block">Tanpa Foto</span>
              </div>
            )}
          </div>

          {/* Versi 1: Paste Link Input */}
          {mode === 'link' ? (
            <div className="flex-1 space-y-1.5">
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required={required && !value}
                  value={value && !value.startsWith('data:image') ? value : ''}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white outline-none focus:border-[#014B35] font-medium text-slate-800"
                />
              </div>
              <p className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Tempel tautan gambar dari web (contoh: https://... atau /assets/aistudio/...)</span>
                {value && !value.startsWith('data:image') && (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Link terpasang
                  </span>
                )}
              </p>
            </div>
          ) : (
            /* Versi 2: Upload File Langsung */
            <div className="flex-1 space-y-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1 ${
                  isDragging
                    ? 'border-[#014B35] bg-emerald-50 text-[#014B35]'
                    : value && value.startsWith('data:image')
                    ? 'border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50'
                    : 'border-slate-300 bg-white hover:border-[#014B35] hover:bg-slate-50'
                }`}
              >
                {value && value.startsWith('data:image') ? (
                  <div className="flex items-center gap-2 text-emerald-800">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold truncate max-w-xs">
                      {fileName || 'Foto berhasil diunggah langsung dari perangkat'}
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-semibold">
                      Klik untuk ganti
                    </span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-[#014B35]" />
                    <div className="text-xs text-slate-600">
                      <span className="font-bold text-[#014B35] hover:underline">Klik di sini</span> untuk pilih foto atau seret berkas ke area ini
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Mendukung JPG, PNG, WebP (langsung tersimpan)
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {helperText && (
          <p className="text-[10.5px] text-slate-400 border-t border-slate-200/60 pt-2 flex items-center justify-between">
            <span>{helperText}</span>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setFileName('');
                }}
                className="text-rose-500 hover:text-rose-700 font-semibold cursor-pointer"
              >
                Hapus Foto
              </button>
            )}
          </p>
        )}
      </div>
    </div>
  );
};
