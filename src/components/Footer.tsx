import React from 'react';
import { MapPin, Phone } from 'lucide-react';
import { CirebonLogo } from './CirebonLogo';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenTentang?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenTentang }) => {
  return (
    <footer className="bg-[#002B36] text-slate-300 pt-16 pb-10 border-t border-white/10 relative overflow-hidden">
      {/* Decorative Traditional Keraton Bentar Gate silhouette on bottom-right */}
      <div className="absolute right-4 bottom-2 opacity-5 pointer-events-none select-none hidden lg:block">
        <svg viewBox="0 0 100 100" className="w-56 h-56" fill="#FFFFFF">
          <circle cx="50" cy="10" r="4.5" />
          <path d="M47 15h6v5h-6z" />
          <path d="M50 20 L40 28 Q44 30 50 30 Q56 30 60 28 Z" />
          <path d="M30 35 Q50 31 70 35 L74 41 Q50 38 26 41 Z" />
          <path d="M32 45 Q50 40 68 45 L68 55 Q50 51 32 55 Z" />
          <path d="M22 56 L34 56 L34 88 Q28 88 22 84 Z" />
          <path d="M78 56 L66 56 L66 88 Q72 88 78 84 Z" />
          <path d="M18 88 Q50 86 82 88 L85 94 Q50 93 15 94 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <CirebonLogo variant="light" size="md" showTagline={true} />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm pt-2">
              Portal integrasi desa wisata mandiri pesisir Keraton Cirebon menghadirkan cagar budaya, produk kriya UMKM lokal, dan homestay warga ramah lingkungan.
            </p>
          </div>

          {/* Menu Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Menu
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('umkm')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Produk
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('wisata')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Wisata
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('homestay')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Homestay
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenTentang ? onOpenTentang() : onNavigate('home')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Tentang
                </button>
              </li>
            </ul>
          </div>

          {/* Kategori Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Kategori
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('umkm')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Kerajinan Tangan
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('umkm')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Kuliner Khas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('umkm')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Batik Cirebon
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('umkm')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Aksesoris
                </button>
              </li>
            </ul>
          </div>

          {/* Kontak Column: Alamat Baru & 3 Kotak Telepon (Tanpa Email) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              KONTAK
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug text-slate-100 font-semibold text-xs">
                  Jl. Perjuangan No.10B, Karyamulya, Kec. Kesambi, Kota Cirebon, Jawa Barat
                </span>
              </div>

              {/* 3 Kotak Telepon */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Layanan Telepon &amp; WhatsApp:
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  <a
                    href="tel:083155853722"
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/10 hover:bg-emerald-950/60 border border-white/10 hover:border-emerald-500/50 text-white transition group"
                  >
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-xs font-bold tracking-wide">083155853722</span>
                    </div>
                    <span className="text-[10px] text-emerald-300 font-medium">Hubungi &rarr;</span>
                  </a>

                  <a
                    href="tel:081949684163"
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/10 hover:bg-emerald-950/60 border border-white/10 hover:border-emerald-500/50 text-white transition group"
                  >
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-xs font-bold tracking-wide">081949684163</span>
                    </div>
                    <span className="text-[10px] text-emerald-300 font-medium">Hubungi &rarr;</span>
                  </a>

                  <a
                    href="tel:085717412815"
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/10 hover:bg-emerald-950/60 border border-white/10 hover:border-emerald-500/50 text-white transition group"
                  >
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-xs font-bold tracking-wide">085717412815</span>
                    </div>
                    <span className="text-[10px] text-emerald-300 font-medium">Hubungi &rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>&copy; 2025 CirebonKita. Semua hak dilindungi.</p>
          <div className="flex gap-5">
            <span className="hover:text-slate-300 cursor-pointer">Kebijakan Privasi</span>
            <span className="hover:text-slate-300 cursor-pointer">Syarat &amp; Ketentuan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
