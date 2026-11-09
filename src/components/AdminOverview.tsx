import React from 'react';
import { 
  Compass, 
  ShoppingBag, 
  Home as HomeIcon, 
  TrendingUp, 
  CheckCircle2, 
  ArrowUpRight, 
  Calendar,
  Layers,
  Clock,
  MapPin,
  Download,
  AlertTriangle,
  QrCode
} from 'lucide-react';
import { WisataItem, UmkmItem, HomestayItem, BookingItem } from '../types';
import { ReportExportButton } from './ReportExportButton';
import { exportUmkmReport, exportWisataReport, exportHomestayReport } from '../utils/reportExport';

interface AdminOverviewProps {
  wisataList: WisataItem[];
  umkmList: UmkmItem[];
  homestayList: HomestayItem[];
  bookingList: BookingItem[];
  onNavigateTab: (tab: 'wisata' | 'umkm' | 'homestay') => void;
  onOpenCodeExplorer?: () => void;
  onDownloadZip: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  wisataList,
  umkmList,
  homestayList,
  bookingList,
  onNavigateTab,
  onDownloadZip,
}) => {
  const totalWisata = wisataList.length;
  const totalUmkm = umkmList.length;
  const totalHomestay = homestayList.length;
  const totalBookings = bookingList.length;

  const lowStockUmkm = umkmList.filter(u => u.stok <= 10).length;
  const totalRevenueEstimasi = 
    bookingList.reduce((acc, b) => acc + b.total_biaya, 0) + 
    (wisataList.reduce((acc, w) => acc + (w.harga_tiket * w.kuota_terisi), 0));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#002B36] to-[#024B35] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-emerald-400/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Konsol Manajemen Terpadu v1.4 • CirebonKita
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Portal Smart Tourism Desa Wisata Mandiri Cirebon
            </h1>
            <p className="mt-2 text-white/80 text-sm md:text-base leading-relaxed">
              Pusat tata kelola terpadu pariwisata daerah Cirebon. Mengintegrasikan inventaris destinasi cagar budaya, etalase komoditas UMKM perajin lokal, reservasi homestay, dan monitoring retribusi secara real-time.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <ReportExportButton
              label="Laporan UMKM"
              onExport={(format) => exportUmkmReport(umkmList, format)}
            />
            <ReportExportButton
              label="Laporan Wisata"
              onExport={(format) => exportWisataReport(wisataList, format)}
            />
            <ReportExportButton
              label="Laporan Homestay"
              onExport={(format) => exportHomestayReport(homestayList, format)}
            />
            <button
              onClick={onDownloadZip}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Arsip .zip</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigateTab('wisata')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-[#004C6D]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Destinasi &amp; Tiket</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004C6D] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-800">{totalWisata} Spot</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-emerald-600 font-medium">+2 spot cagar budaya</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#004C6D]" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('umkm')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-[#024B35]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Produk UMKM</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#024B35] flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-800">{totalUmkm} Produk</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-amber-600 font-medium">{lowStockUmkm} Perlu Restok</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#024B35]" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('homestay')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-amber-600"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Homestay &amp; Tamu</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HomeIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-800">{totalHomestay} Unit Inap</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-slate-500">{totalBookings} Reservasi Aktif</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Omzet &amp; PAD Desa</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-800">
              Rp {totalRevenueEstimasi.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-emerald-600 font-semibold">+18.4% vs bln lalu</span>
              <span className="text-xs text-slate-400">Kas Terverifikasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Manajemen Modul Layanan Desa */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#004C6D]" />
          Manajemen Modul Layanan Desa Wisata
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Modul 1 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-[#004C6D] transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-[#004C6D] text-xs font-semibold">
                  Sektor Rekreasi
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">Daya Tarik Wisata &amp; Tiket</h3>
                <p className="text-xs text-slate-500">Pusat kelola cagar budaya &amp; kuota harian</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#004C6D] text-white flex items-center justify-center font-bold text-sm">
                <Compass className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Katalog Master Daya Tarik Wisata Cirebon</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>E-Ticketing &amp; Pengendalian Kuota Masuk Gerbang</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Galeri Foto &amp; Filter Kategori Wisata</span>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => onNavigateTab('wisata')}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-[#004C6D] font-semibold text-xs border border-slate-200 hover:border-blue-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Buka Panel Wisata &amp; Tiket
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Modul 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-[#024B35] transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#024B35] text-xs font-semibold">
                  Sektor Ekonomi Kreatif
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">Produk UMKM &amp; Kuliner</h3>
                <p className="text-xs text-slate-500">Etalase komoditas perajin &amp; sentra desa</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#024B35] text-white flex items-center justify-center font-bold text-sm">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Katalog Produk Kerajinan Batik &amp; Kuliner Otentik</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Pencarian Cepat &amp; Filter Kategori Produk</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Manajemen Stok Inventori &amp; Ekspor Rekap CSV</span>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => onNavigateTab('umkm')}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-[#024B35] font-semibold text-xs border border-slate-200 hover:border-emerald-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Buka Panel Produk UMKM
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Modul 3 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-amber-600 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                  Sektor Akomodasi
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">Homestay &amp; Moderasi Ulasan</h3>
                <p className="text-xs text-slate-500">Reservasi penginapan warga &amp; ulasan</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
                <HomeIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Daftar Reservasi Tamu &amp; Durasi Malam Menginap</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Kalkulasi Otomatis Check-in/Check-out</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Moderasi Ulasan Wisatawan &amp; Rating Bintang</span>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => onNavigateTab('homestay')}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-amber-50 text-amber-800 font-semibold text-xs border border-slate-200 hover:border-amber-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Buka Panel Homestay &amp; Ulasan
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Operasional & Log Aktivitas Terkini */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#024B35] flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Status Operasional &amp; Integrasi Layanan</h3>
              <p className="text-xs text-slate-500">Monitoring konektivitas sistem desa wisata</p>
            </div>
          </div>
          <div className="space-y-3 text-xs text-slate-600">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Gerbang E-Ticketing Destinasi</span>
                <span className="text-[11px] text-slate-500">Turnstile barcode &amp; sinkronisasi kuota otomatis</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">Online</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Sistem QRIS Pembayaran Desa</span>
                <span className="text-[11px] text-slate-500">Terhubung ke rekening kas BUMDes &amp; Bank Daerah</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">Aktif</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Notifikasi Reservasi Homestay</span>
                <span className="text-[11px] text-slate-500">Integrasi pesan WhatsApp otomatis ke pemilik homestay</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">Siap Pakai</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Perhatian Pengelola &amp; Inventori</h3>
              <p className="text-xs text-slate-500">Catatan pemeliharaan dan pengingat stok</p>
            </div>
          </div>
          <div className="space-y-3 text-xs text-slate-600">
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900 block mb-0.5">{lowStockUmkm} Komoditas Stok Menipis</span>
                <span className="text-[11px] text-amber-800">
                  Perlu restok pada sentra pengrajin Plumbon dan Terasi Udang Samadikun sebelum puncak kunjungan akhir pekan.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-blue-900 block mb-0.5">Pemeliharaan Spot Hutan Kera Plangon</span>
                <span className="text-[11px] text-blue-800">
                  Jalur trekking makam sedang dalam perbaikan berkala oleh dinas pariwisata daerah.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Cadangan Basis Data Portal</span>
                <span className="text-[11px] text-slate-500">Unduh data terkini untuk arsip dan pembukuan pengelola</span>
              </div>
              <button
                onClick={onDownloadZip}
                className="px-3 py-1.5 rounded-lg bg-[#004C6D] text-white font-semibold text-xs hover:bg-[#002B36] transition-colors shrink-0 cursor-pointer"
              >
                Unduh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
