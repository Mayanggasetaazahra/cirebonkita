import React, { useState } from 'react';
import { 
  Landmark, 
  Home as HomeIcon, 
  Star, 
  Ticket, 
  MapPin, 
  Info, 
  CheckCircle2, 
  Calendar,
  X,
  CreditCard,
  QrCode,
  Eye
} from 'lucide-react';
import { WisataItem } from '../types';
import { DetailWisataModal } from './DetailWisataModal';

interface PublicWisataProps {
  wisataList: WisataItem[];
  onNavigate: (view: string) => void;
  selectedWisataModal: WisataItem | null;
  setSelectedWisataModal: (item: WisataItem | null) => void;
}

export const PublicWisata: React.FC<PublicWisataProps> = ({
  wisataList,
  onNavigate,
  selectedWisataModal,
  setSelectedWisataModal,
}) => {
  const [activeKategori, setActiveKategori] = useState<string>('Semua');
  const [selectedWisataForDetail, setSelectedWisataForDetail] = useState<WisataItem | null>(null);
  const [ticketQty, setTicketQty] = useState<number>(2);
  const [bookingSuccessCode, setBookingSuccessCode] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerWa, setCustomerWa] = useState<string>('');
  const [visitDate, setVisitDate] = useState<string>(new Date().toISOString().slice(0, 10));

  const filtered = wisataList.filter((item) => {
    if (activeKategori === 'Semua') return true;
    if (activeKategori === 'Keraton') return item.kategori === 'Keraton & Sejarah';
    if (activeKategori === 'Sejarah') return item.kategori === 'Situs Cagar Budaya';
    if (activeKategori === 'Wisata Religi') return item.kategori === 'Wisata Religi';
    if (activeKategori === 'Alam & Rekreasi') return item.kategori === 'Wisata Alam & Rekreasi';
    return true;
  });

  const handleBookTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `TKT-CRB-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingSuccessCode(code);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Switcher & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('wisata')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-[#024B35] text-white shadow-xs"
          >
            <Landmark className="w-4 h-4 text-emerald-300" />
            <span>Destinasi Budaya &amp; Wisata</span>
          </button>
          <button
            onClick={() => onNavigate('homestay')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <HomeIcon className="w-4 h-4 text-amber-600" />
            <span>Reservasi Homestay &amp; Penginapan</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Pusat Tiket Real-Time</span>
          </div>
        </div>
      </div>

      {/* Hero Catalog Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#004C6D] text-[11px] font-bold uppercase tracking-wider">
            <Landmark className="w-3.5 h-3.5 text-blue-600" />
            <span>Warisan Arsitektur & Rekreasi Bahari</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#002B36] tracking-tight">
            Eksplorasi Jejak Kesultanan & Panorama Alam Cirebon
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            Dari kemegahan bata merah Keraton Kasepuhan, labirin karang Gua Sunyaragi, hingga rimbunnya hutan lindung Plangon. Pesan e-tiket resmi secara langsung dengan retribusi kas desa transparan.
          </p>
        </div>

        {/* Visitor Statistic Card */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Statistik Pengunjung Desa</span>
            <span className="text-[10px] font-bold bg-teal-50 text-[#004C6D] px-2 py-0.5 rounded">Pekan Ini</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#002B36]">
            14.820+ <span className="text-xs font-semibold text-slate-500">Wisatawan Terverifikasi</span>
          </div>
          <div className="h-8 mt-3 flex items-end">
            <svg viewBox="0 0 100 25" className="w-full h-full">
              <path d="M0 20 Q 25 5, 50 15 T 100 8" fill="none" stroke="#004C6D" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Category Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {[
            { id: 'Semua', label: `Semua Spot (${wisataList.length})` },
            { id: 'Keraton', label: 'Keraton' },
            { id: 'Sejarah', label: 'Sejarah' },
            { id: 'Wisata Religi', label: 'Wisata Religi' },
            { id: 'Alam & Rekreasi', label: 'Alam & Rekreasi' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveKategori(item.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer shrink-0 ${
                activeKategori === item.id
                  ? 'bg-[#024B35] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Info className="w-4 h-4 text-[#004C6D]" />
          <span>Tiket digital terintegrasi QRIS & Cetak di Loket Resmi</span>
        </div>
      </div>

      {/* Wisata Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((w) => (
          <div
            key={w.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col"
          >
            <div 
              onClick={() => setSelectedWisataForDetail(w)}
              className="relative aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer"
            >
              <span className="absolute top-3 left-3 z-10 bg-[#002B36]/85 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                {w.kategori.split(' ')[0]}
              </span>
              <img
                src={w.foto}
                alt={w.nama_wisata}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-[#002B36]/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="bg-white/95 text-[#002B36] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#014B35]" />
                  <span>Lihat Detail</span>
                </span>
              </div>
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-[#002B36] text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{w.rating}</span>
                <span className="text-slate-400">({w.ulasan_count})</span>
              </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{w.lokasi}</span>
              </div>

              <h3 
                onClick={() => setSelectedWisataForDetail(w)}
                className="text-base font-bold text-[#002B36] tracking-tight mb-2 line-clamp-1 cursor-pointer hover:text-[#014B35] transition"
              >
                {w.nama_wisata}
              </h3>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                {w.deskripsi}
              </p>

              <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Harga E-Tiket:</span>
                  <div className="text-sm font-black text-[#002B36]">
                    {w.harga_tiket > 0 ? `Rp ${w.harga_tiket.toLocaleString('id-ID')}` : <span className="text-emerald-700">Gratis / Donasi</span>}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedWisataForDetail(w)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    title="Lihat detail & sejarah lengkap"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Detail</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedWisataModal(w)}
                    className="bg-[#024B35] hover:bg-[#013726] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Pesan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL PESAN TIKET */}
      {selectedWisataModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setSelectedWisataModal(null);
                setBookingSuccessCode(null);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccessCode ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-[#002B36]">E-Tiket Berhasil Diterbitkan!</h3>
                <p className="text-xs text-slate-500">
                  Tiket digital resmi telah diverifikasi ke sistem loket otomatis gerbang masuk desa.
                </p>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kode Tiket:</span>
                    <strong className="text-[#004C6D] font-mono">{bookingSuccessCode}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Destinasi:</span>
                    <strong>{selectedWisataModal.nama_wisata}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pengunjung:</span>
                    <strong>{customerName || 'Tamu CirebonKita'} ({ticketQty} Tiket)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tanggal Kunjungan:</span>
                    <strong>{visitDate}</strong>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold">
                    <span>Total Retribusi:</span>
                    <span className="text-emerald-700">
                      Rp {(ticketQty * selectedWisataModal.harga_tiket).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-teal-50 text-[#004C6D] rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
                  <QrCode className="w-4 h-4" />
                  <span>Tunjukkan QR code ini ke petugas gerbang saat kedatangan.</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedWisataModal(null);
                    setBookingSuccessCode(null);
                  }}
                  className="w-full bg-[#024B35] hover:bg-[#013726] text-white py-3 rounded-xl font-bold text-xs"
                >
                  Tutup & Kembali
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookTicket} className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-bold text-[#004C6D] uppercase">Form Pemesanan E-Tiket</span>
                  <h3 className="text-xl font-black text-[#002B36]">{selectedWisataModal.nama_wisata}</h3>
                  <div className="text-xs text-slate-500 mt-1">{selectedWisataModal.lokasi}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Kunjungan</label>
                    <input
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-[#004C6D]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Pengunjung</label>
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setTicketQty(Math.max(1, ticketQty - 1))}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-sm font-bold"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        readOnly
                        value={ticketQty}
                        className="w-full text-center text-xs font-bold text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => setTicketQty(ticketQty + 1)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-sm font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Pemesan / Perwakilan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Hendrik Pratama"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-[#004C6D]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp (Kirim Tiket)</label>
                  <input
                    type="tel"
                    placeholder="0812-9988-1209"
                    value={customerWa}
                    onChange={(e) => setCustomerWa(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-[#004C6D]"
                    required
                  />
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Harga Satuan:</span>
                    <span>Rp {selectedWisataModal.harga_tiket.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retribusi Kas Desa & Asuransi:</span>
                    <span className="text-emerald-700 font-semibold">Gratis / Termasuk</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-[#002B36] pt-1 border-t border-slate-200">
                    <span>Total Pembayaran:</span>
                    <span className="text-[#024B35]">
                      Rp {(ticketQty * selectedWisataModal.harga_tiket).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#024B35] hover:bg-[#013726] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Konfirmasi & Terbitkan E-Tiket</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL DETAIL WISATA */}
      <DetailWisataModal
        wisata={selectedWisataForDetail}
        isOpen={selectedWisataForDetail !== null}
        onClose={() => setSelectedWisataForDetail(null)}
        onBookTicket={(w) => {
          setSelectedWisataForDetail(null);
          setSelectedWisataModal(w);
        }}
      />
    </div>
  );
};
