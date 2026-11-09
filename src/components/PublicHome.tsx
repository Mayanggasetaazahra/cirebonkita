import React, { useState } from 'react';
import { 
  ArrowRight, 
  Store, 
  MapPin, 
  Home as HomeIcon, 
  Tag, 
  Heart,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { WisataItem, UmkmItem, HomestayItem } from '../types';

const keratonKasepuhanUrl = 'https://updatecirebon.com/wp-content/uploads/2024/02/sejarah_keraton_kasepuhan_1_8355da556d.jpg';
const keratonKasepuhanLocal = '/assets/sejarah_keraton_kasepuhan_1_8355da556d.jpg';

interface PublicHomeProps {
  wisataList: WisataItem[];
  umkmList: UmkmItem[];
  homestayList?: HomestayItem[];
  onNavigate: (view: string) => void;
  onAddToCart: (item: UmkmItem) => void;
  onSelectProduct: (item: UmkmItem) => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({
  wisataList,
  umkmList,
  homestayList = [],
  onNavigate,
  onAddToCart,
  onSelectProduct,
}) => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const featuredUmkm = umkmList.slice(0, 5);
  const featuredWisata = wisataList.slice(0, 3);
  const featuredHomestay = homestayList.slice(0, 3);

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. HERO SECTION (Clean, Minimal, Anti-AI Slop) */}
      <section className="relative overflow-hidden bg-[#002B36] text-white">
        {/* Background Image of Keraton Kasepuhan */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{ backgroundImage: `url(${keratonKasepuhanUrl}), url(${keratonKasepuhanLocal})` }}
        />
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#002B36] via-[#002B36]/85 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-2xl space-y-6">
            <div className="space-y-2">
              <span className="text-emerald-300 text-sm font-semibold tracking-wide block">
                Selamat Datang di
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                CirebonKita
              </h1>
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl font-normal">
              Jelajahi pesona budaya Cirebon, temukan produk UMKM lokal, pesan homestay, dan nikmati pengalaman wisata yang tak terlupakan.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('umkm')}
                className="bg-[#014B35] hover:bg-[#003827] text-white font-semibold px-6 py-3 rounded-lg text-sm flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <span>Jelajahi Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Keraton Kasepuhan subtle pointer note */}
          <div className="hidden lg:flex absolute right-12 bottom-12 items-center gap-2 text-white/80 text-xs italic">
            <span>Keraton Kasepuhan Cirebon</span>
            <svg className="w-8 h-6 stroke-current text-emerald-300" viewBox="0 0 40 24" fill="none">
              <path d="M4 18 Q 20 4, 34 10" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M28 8 L35 10 L31 16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* 2. 4 QUICK FEATURE CARDS (Directly under Hero) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {/* Card 1: Produk UMKM */}
          <button
            type="button"
            onClick={() => onNavigate('umkm')}
            className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs transition text-left flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#014B35] flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#014B35] truncate transition">
                Produk UMKM
              </h3>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                Kerajinan &amp; Kuliner
              </p>
            </div>
          </button>

          {/* Card 2: Destinasi Wisata */}
          <button
            type="button"
            onClick={() => onNavigate('wisata')}
            className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs transition text-left flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 truncate transition">
                Destinasi Wisata
              </h3>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                Budaya &amp; Alam
              </p>
            </div>
          </button>

          {/* Card 3: Homestay */}
          <button
            type="button"
            onClick={() => onNavigate('homestay')}
            className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs transition text-left flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <HomeIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-700 truncate transition">
                Homestay
              </h3>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                Akomodasi Lokal
              </p>
            </div>
          </button>

          {/* Card 4: Promo & Event */}
          <button
            type="button"
            onClick={() => onNavigate('umkm')}
            className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs transition text-left flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                Promo &amp; Event
              </h3>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                Terbaru
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* 3. PRODUK UNGGULAN UMKM (Exact layout from Figma) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Produk Unggulan UMKM
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Jelajahi pesona keunggulan UMKM lokal Cirebon
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('umkm')}
            className="text-xs sm:text-sm font-semibold text-[#014B35] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {featuredUmkm.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectProduct(item)}
              className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col group cursor-pointer"
            >
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src={item.foto}
                  alt={item.nama_produk}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(item.id, e)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-rose-600 flex items-center justify-center shadow-2xs transition"
                  title="Favorit"
                >
                  <Heart className={`w-3.5 h-3.5 ${favorites.includes(item.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-[#014B35] transition">
                    {item.nama_produk}
                  </h3>
                  <span className="text-[11px] text-slate-400 block mt-0.5 truncate">
                    {item.mitra_pengrajin}
                  </span>
                  <div className="text-xs sm:text-sm font-black text-slate-900 mt-1">
                    Rp {item.harga.toLocaleString('id-ID')}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 text-[10px] font-medium">
                    {item.kategori}
                  </span>
                  <span className="text-[#014B35] font-semibold flex items-center gap-1 group-hover:underline">
                    <Eye className="w-3 h-3" />
                    <span>Detail</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DESTINASI WISATA PILIHAN (Live sync with Admin Wisata edits) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Destinasi Budaya &amp; Wisata Pilihan
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Eksplorasi situs cagar budaya, keraton peninggalan wali, dan keindahan alam Cirebon
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('wisata')}
            className="text-xs sm:text-sm font-semibold text-[#014B35] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Lihat Semua Wisata</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredWisata.map((w) => (
            <div
              key={w.id}
              onClick={() => onNavigate('wisata')}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col group cursor-pointer"
            >
              <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                <img
                  src={w.foto}
                  alt={w.nama_wisata}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#002B36]/80 backdrop-blur-xs text-white text-[10px] font-bold">
                  {w.kategori}
                </span>
                <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  w.status_operasional.includes('Buka') 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-amber-500 text-white'
                }`}>
                  {w.status_operasional}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#014B35] transition">
                    {w.nama_wisata}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{w.lokasi}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Tiket Masuk (HTM)</span>
                    <span className="text-sm font-black text-[#002B36]">
                      {w.harga_tiket === 0 ? 'Infaq Sukarela' : `Rp ${w.harga_tiket.toLocaleString('id-ID')}`}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#014B35] group-hover:underline flex items-center gap-1">
                    <span>Pesan Tiket</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. AKOMODASI & HOMESTAY DESA REKOMENDASI (Live sync with Admin Homestay edits) */}
      {featuredHomestay.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Rekomendasi Hotel &amp; Penginapan Cirebon
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Pilihan hotel berbintang, resort, homestay, dan guest house terpercaya di Cirebon
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('homestay')}
              className="text-xs sm:text-sm font-semibold text-[#014B35] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Lihat Semua Penginapan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredHomestay.map((h) => (
              <div
                key={h.id}
                onClick={() => onNavigate('homestay')}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col group cursor-pointer"
              >
                <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                  <img
                    src={h.foto}
                    alt={h.nama_homestay}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#002B36]/80 backdrop-blur-xs text-white text-[10px] font-bold">
                    {h.kategori || 'Homestay'}
                  </span>
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#014B35] transition">
                      {h.nama_homestay}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {h.tipe_kamar} &bull; Kapasitas {h.kapasitas_tamu} Tamu
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Tarif per Malam</span>
                      <span className="text-sm font-black text-emerald-800">
                        Rp {h.harga_per_malam.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-[#014B35] group-hover:underline flex items-center gap-1">
                      <span>Reservasi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. BANNER DUKUNG UMKM CIREBON BERSAMA KITA (Exact matching Figma image) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#002B36] text-white p-7 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left copy */}
          <div className="space-y-4 max-w-lg z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
              Dukung UMKM Cirebon Bersama Kita
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              Setiap pembelian produk lokal adalah langkah nyata untuk melestarikan budaya dan meningkatkan kesejahteraan masyarakat Cirebon.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('umkm')}
                className="bg-[#014B35] hover:bg-[#003827] text-white text-xs font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <span>Belanja Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Keraton Kasepuhan image requested */}
          <div className="relative w-full md:w-1/2 aspect-16/9 sm:aspect-16/10 rounded-xl overflow-hidden border border-white/10 shadow-lg">
            <img
              src={keratonKasepuhanUrl}
              onError={(e) => {
                (e.target as HTMLImageElement).src = keratonKasepuhanLocal;
              }}
              alt="Keraton Kasepuhan & UMKM Cirebon"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 right-3 text-right text-xs text-white/95 italic font-medium flex items-center gap-1.5">
              <span>Keraton Kasepuhan &amp; UMKM Cirebon</span>
              <svg className="w-5 h-4 stroke-current text-amber-300" viewBox="0 0 24 16" fill="none">
                <path d="M2 12 Q 12 2, 22 8" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
