import React, { useState, useMemo } from 'react';
import { 
  Landmark, 
  Home as HomeIcon, 
  Star, 
  ArrowRight, 
  Check, 
  MapPin, 
  Heart, 
  X, 
  CheckCircle2, 
  Send,
  Eye,
  Building2,
  Sparkles,
  Search,
  SlidersHorizontal,
  Phone,
  Bed,
  Users,
  Clock,
  Calendar,
  Printer,
  Copy,
  MessageCircle,
  FileText
} from 'lucide-react';
import { HomestayItem, UlasanItem, BookingItem } from '../types';
import { DetailHomestayModal } from './DetailHomestayModal';

interface PublicHomestayProps {
  homestayList: HomestayItem[];
  ulasanList: UlasanItem[];
  onNavigate: (view: string) => void;
  onAddUlasan: (ulasan: UlasanItem) => void;
  onAddBooking: (booking: BookingItem) => void;
}

export const PublicHomestay: React.FC<PublicHomestayProps> = ({
  homestayList,
  ulasanList,
  onNavigate,
  onAddUlasan,
  onAddBooking,
}) => {
  // Filter & Search states
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'Hotel' | 'Homestay' | 'Guest House'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('Semua Lokasi di Cirebon');
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().slice(0, 10));
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const [checkOutDate, setCheckOutDate] = useState(tomorrow.toISOString().slice(0, 10));
  const [guestCount, setGuestCount] = useState('2');

  // Detail Modal state
  const [selectedHomestayForDetail, setSelectedHomestayForDetail] = useState<HomestayItem | null>(null);

  // Interactive Booking Modal
  const [selectedHomestayForBooking, setSelectedHomestayForBooking] = useState<HomestayItem | null>(null);
  const [bookNamaTamu, setBookNamaTamu] = useState('');
  const [bookAsalKota, setBookAsalKota] = useState('DKI Jakarta');
  const [bookKontak, setBookKontak] = useState('');
  const [bookingSuccessModal, setBookingSuccessModal] = useState<BookingItem | null>(null);
  const [copiedBookingCode, setCopiedBookingCode] = useState(false);

  // Review Form state
  const [reviewHomestayId, setReviewHomestayId] = useState<number>(homestayList[0]?.id || 1);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(5);
  const [reviewName, setReviewName] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSuccessToast, setReviewSuccessToast] = useState<boolean>(false);

  // Calculate nights
  const calculateNights = (inDate: string, outDate: string) => {
    const d1 = new Date(inDate);
    const d2 = new Date(outDate);
    const diff = d2.getTime() - d1.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return isNaN(days) || days < 1 ? 1 : days;
  };

  const bookingNights = calculateNights(checkInDate, checkOutDate);

  const starFeedback: Record<number, string> = {
    1: '1.0 - Kurang Memuaskan',
    2: '2.0 - Cukup',
    3: '3.0 - Baik',
    4: '4.0 - Sangat Baik',
    5: '5.0 - Sangat Memuaskan',
  };

  // Filtered homestays
  const filteredHomestays = useMemo(() => {
    return homestayList.filter((item) => {
      // Category filter
      if (categoryFilter !== 'all' && item.kategori !== categoryFilter) {
        return false;
      }
      // Search query filter (name, location, facilities, room type)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.nama_homestay.toLowerCase().includes(q);
        const matchLoc = item.lokasi.toLowerCase().includes(q) || (item.alamat_lengkap || '').toLowerCase().includes(q);
        const matchFac = item.fasilitas.toLowerCase().includes(q);
        const matchTipe = item.tipe_kamar.toLowerCase().includes(q);
        if (!matchName && !matchLoc && !matchFac && !matchTipe) return false;
      }
      return true;
    });
  }, [homestayList, categoryFilter, searchQuery]);

  // Counts
  const hotelCount = homestayList.filter(h => h.kategori === 'Hotel').length;
  const homestayCount = homestayList.filter(h => h.kategori === 'Homestay' || h.kategori === 'Guest House').length;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    const matchedHomestay = homestayList.find(h => h.id === Number(reviewHomestayId)) || homestayList[0];

    const newUlasan: UlasanItem = {
      id: Date.now(),
      homestay_id: matchedHomestay.id,
      nama_homestay: matchedHomestay.nama_homestay,
      nama_pengulas: reviewName,
      rating_bintang: reviewRating,
      komentar: reviewComment,
      created_at: 'Baru saja',
      status_moderasi: 'Disetujui',
    };

    onAddUlasan(newUlasan);
    setReviewName('');
    setReviewComment('');
    setReviewSuccessToast(true);
    setTimeout(() => setReviewSuccessToast(false), 4000);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHomestayForBooking) return;

    const code = `#BK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const total = bookingNights * selectedHomestayForBooking.harga_per_malam;

    const newBooking: BookingItem = {
      id: Date.now(),
      booking_code: code,
      homestay_id: selectedHomestayForBooking.id,
      nama_homestay: selectedHomestayForBooking.nama_homestay,
      tipe_kamar: selectedHomestayForBooking.tipe_kamar,
      nama_tamu: bookNamaTamu || 'Budi Santoso',
      asal_kota: bookAsalKota || 'DKI Jakarta',
      kontak: bookKontak || '0812-9988-1209',
      tgl_checkin: checkInDate,
      tgl_checkout: checkOutDate,
      durasi_malam: bookingNights,
      jumlah_tamu: parseInt(guestCount) || 2,
      total_biaya: total,
      status_transaksi: 'Terkonfirmasi',
      created_at: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };

    onAddBooking(newBooking);
    setSelectedHomestayForBooking(null);
    setBookNamaTamu('');
    setBookKontak('');
    setBookingSuccessModal(newBooking);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Switcher & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('wisata')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <Landmark className="w-4 h-4 text-emerald-700" />
            <span>Destinasi Budaya &amp; Wisata</span>
          </button>
          <button
            onClick={() => onNavigate('homestay')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-[#024B35] text-white shadow-xs"
          >
            <HomeIcon className="w-4 h-4 text-amber-300" />
            <span>Hotel &amp; Penginapan Cirebon</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Akomodasi Resmi Terverifikasi</span>
          </div>
        </div>
      </div>

      {/* Hero Header Hotel & Homestay */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-[11px] font-bold uppercase tracking-wider">
          <Building2 className="w-3.5 h-3.5 text-emerald-700" />
          <span>Hotel Berbintang, Homestay &amp; Guest House Nyaman</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#002B36] tracking-tight">
          Pilihan Hotel &amp; Penginapan Terbaik di Kota &amp; Desa Wisata Cirebon
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          Temukan akomodasi terpercaya di Cirebon mulai dari hotel berbintang dengan kolam renang tropis dan rooftop view Gunung Ciremai, hingga homestay asri berpagar pribadi dekat Keraton Kasepuhan dan sentra batik Trusmi.
        </p>
      </div>

      {/* SEARCH BAR DENGAN DATEPICKER JS & LIVE FILTER */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <Search className="w-3 h-3 text-[#014B35]" /> Cari Nama / Area
            </label>
            <input
              type="text"
              placeholder="Cth: Aston, Santika, Luxton, Kesambi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold text-[#002B36] p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#014B35]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#014B35]" /> Tanggal Check-In
            </label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full text-xs font-semibold text-[#002B36] p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#014B35]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#014B35]" /> Tanggal Check-Out
            </label>
            <input
              type="date"
              value={checkOutDate}
              min={checkInDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full text-xs font-semibold text-[#002B36] p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#014B35]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <Users className="w-3 h-3 text-[#014B35]" /> Tamu &amp; Durasi
            </label>
            <div className="flex items-center gap-2">
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="w-full text-xs font-semibold text-[#002B36] p-2.5 rounded-xl border border-slate-200 outline-none bg-white"
              >
                <option value="1">1 Orang</option>
                <option value="2">2 Orang</option>
                <option value="3">3 Orang</option>
                <option value="4">4 Orang</option>
                <option value="5">5+ Tamu (Rombongan)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-emerald-800 font-bold mb-1 text-center bg-emerald-50 py-1 rounded-lg border border-emerald-100">
              {bookingNights} Malam Menginap
            </div>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('daftar-penginapan');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full bg-[#014B35] hover:bg-[#003827] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition"
            >
              <span>Lihat Ketersediaan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" /> Filter Kategori:
            </span>
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3.5 py-1.5 rounded-full font-bold transition text-xs cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-[#002B36] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({homestayList.length})
            </button>
            <button
              onClick={() => setCategoryFilter('Hotel')}
              className={`px-3.5 py-1.5 rounded-full font-bold transition text-xs cursor-pointer ${
                categoryFilter === 'Hotel'
                  ? 'bg-[#002B36] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Hotel Berbintang ({hotelCount})
            </button>
            <button
              onClick={() => setCategoryFilter('Homestay')}
              className={`px-3.5 py-1.5 rounded-full font-bold transition text-xs cursor-pointer ${
                categoryFilter === 'Homestay'
                  ? 'bg-[#002B36] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Homestay ({homestayList.filter(h => h.kategori === 'Homestay').length})
            </button>
            <button
              onClick={() => setCategoryFilter('Guest House')}
              className={`px-3.5 py-1.5 rounded-full font-bold transition text-xs cursor-pointer ${
                categoryFilter === 'Guest House'
                  ? 'bg-[#002B36] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Guest House ({homestayList.filter(h => h.kategori === 'Guest House').length})
            </button>
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[11px] text-rose-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" /> Reset Pencarian
            </button>
          )}
        </div>
      </div>

      {/* HOMESTAY & HOTEL LISTING CARDS */}
      <div id="daftar-penginapan" className="space-y-6 scroll-mt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#002B36]">
              Daftar Akomodasi Nyata di Cirebon ({filteredHomestays.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik <strong>"Lihat Detail"</strong> untuk melihat foto lengkap, fasilitas kamar, alamat peta, dan kebijakan menginap.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Status:</span>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold">
              ✓ Semua Beroperasi Nyata di Cirebon
            </span>
          </div>
        </div>

        {filteredHomestays.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-3xl bg-white border border-slate-200 space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">Tidak ada penginapan yang sesuai dengan filter</h4>
            <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian atau pilih kategori "Semua".</p>
            <button
              onClick={() => {
                setCategoryFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-[#014B35] text-white font-bold text-xs"
            >
              Tampilkan Seluruh Penginapan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHomestays.map((h) => (
              <div
                key={h.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                {/* Photo & Badges */}
                <div 
                  onClick={() => setSelectedHomestayForDetail(h)}
                  className="relative aspect-16/10 bg-slate-900 overflow-hidden cursor-pointer"
                >
                  <img
                    src={h.foto}
                    alt={h.nama_homestay}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Kategori Badge */}
                  <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
                    <span className="bg-[#002B36]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Building2 className="w-3 h-3 text-emerald-300" />
                      <span>{h.kategori || 'Penginapan'}</span>
                    </span>
                    {h.bintang && (
                      <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>Bintang {h.bintang}</span>
                      </span>
                    )}
                  </div>

                  {/* Room Type Tag */}
                  <span className="absolute bottom-3 left-3 z-10 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                    {h.tipe_kamar}
                  </span>

                  {/* Quick Detail Hover Overlay Icon */}
                  <div className="absolute inset-0 bg-[#014B35]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-[#014B35] font-bold text-xs shadow-lg flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Klik Lihat Detail</span>
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <div className="flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[150px]">{h.jarak_pusat}</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-slate-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{h.avg_rating}</span>
                      <span className="text-slate-400 font-normal text-[11px]">({h.total_ulasan})</span>
                    </div>
                  </div>

                  <h3 
                    onClick={() => setSelectedHomestayForDetail(h)}
                    className="text-lg font-black text-[#002B36] tracking-tight mb-1 hover:text-[#014B35] transition cursor-pointer line-clamp-1"
                    title={h.nama_homestay}
                  >
                    {h.nama_homestay}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {h.alamat_lengkap || h.lokasi}
                  </p>

                  {/* Facilities snippet */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {h.fasilitas.split(',').slice(0, 3).map((f, i) => (
                      <span key={i} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{f.trim()}</span>
                      </span>
                    ))}
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Tarif Mulai</span>
                      <div className="text-base font-black text-[#014B35]">
                        Rp {h.harga_per_malam.toLocaleString('id-ID')}
                        <span className="text-[10px] font-normal text-slate-500"> /mlm</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedHomestayForDetail(h)}
                        className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                        title="Buka rincian lengkap & foto"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Detail</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedHomestayForBooking(h);
                          setBookNamaTamu('');
                          setBookKontak('');
                        }}
                        className="bg-[#014B35] hover:bg-[#003827] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                      >
                        <span>Pesan</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAIL MODAL INTERAKTIF */}
      <DetailHomestayModal
        homestay={selectedHomestayForDetail}
        ulasanList={ulasanList}
        isOpen={Boolean(selectedHomestayForDetail)}
        onClose={() => setSelectedHomestayForDetail(null)}
        bookingNights={bookingNights}
        onAddUlasan={onAddUlasan}
        onBookNow={(h) => {
          setSelectedHomestayForBooking(h);
          setBookNamaTamu('');
          setBookKontak('');
        }}
      />

      {/* BAGIAN ULASAN NYATA & FORM PENILAIAN RATING BINTANG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-slate-200">
        {/* Kolom Kiri: Ulasan Nyata Wisatawan */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#004C6D] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Star className="w-3 h-3 text-emerald-600" />
              <span>Ulasan Nyata Wisatawan Cirebon</span>
            </div>
            <h3 className="text-2xl font-black text-[#002B36]">Cerita Pengalaman Menginap di Hotel &amp; Homestay</h3>
            <p className="text-xs text-slate-500 mt-1">
              Testimoni jujur dari para pelancong dan keluarga yang telah menginap langsung di penginapan Cirebon.
            </p>
          </div>

          <div className="space-y-4">
            {ulasanList.map((u) => (
              <div key={u.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#002B36]">{u.nama_pengulas}</h4>
                    <span className="text-[11px] text-slate-400">
                      Menginap di <strong>{u.nama_homestay}</strong> &bull; {u.created_at}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: u.rating_bintang }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{u.komentar}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Form Beri Ulasan */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <h3 className="text-lg font-black text-[#002B36]">Beri Ulasan Penginapan</h3>
            <p className="text-xs text-slate-500 mt-1">
              Bantu wisatawan lain dan pengelola penginapan Cirebon untuk terus meningkatkan mutu pelayanan mereka.
            </p>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Penginapan</label>
              <select
                value={reviewHomestayId}
                onChange={(e) => setReviewHomestayId(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              >
                {homestayList.map((h) => (
                  <option key={h.id} value={h.id}>{h.nama_homestay} ({h.kategori || 'Penginapan'})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Beri Penilaian Bintang</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(reviewRating)}
                      onClick={() => {
                        setReviewRating(star);
                        setHoverRating(star);
                      }}
                      className="p-1 hover:scale-110 transition cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoverRating || reviewRating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {starFeedback[hoverRating || reviewRating]}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Anda</label>
              <input
                type="text"
                required
                placeholder="Masukkan nama lengkap"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#014B35]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ulasan &amp; Pengalaman</label>
              <textarea
                required
                rows={4}
                placeholder="Ceritakan kebersihan kamar, keramahan pengelola, makanan, atau lokasi..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#014B35]"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-[#014B35] hover:bg-[#003827] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Penilaian Sekarang</span>
            </button>

            {reviewSuccessToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Terima kasih! Ulasan Anda berhasil diterbitkan.</span>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* MODAL SUCCESS BUKTI RESERVASI (E-VOUCHER) */}
      {bookingSuccessModal && (() => {
        const bookedHomestay = homestayList.find(h => h.id === bookingSuccessModal.homestay_id);
        const cleanPhone = bookedHomestay ? bookedHomestay.kontak_pemilik.replace(/\D/g, '').replace(/^0/, '') : '83155853722';
        const waText = encodeURIComponent(
          `Halo ${bookedHomestay?.nama_pemilik || 'Pengelola'}, saya telah melakukan reservasi melalui CirebonKita:\n\n` +
          `• Kode Booking: ${bookingSuccessModal.booking_code}\n` +
          `• Penginapan: ${bookingSuccessModal.nama_homestay} (${bookingSuccessModal.tipe_kamar})\n` +
          `• Nama Tamu: ${bookingSuccessModal.nama_tamu}\n` +
          `• WhatsApp: ${bookingSuccessModal.kontak}\n` +
          `• Check-In: ${bookingSuccessModal.tgl_checkin}\n` +
          `• Check-Out: ${bookingSuccessModal.tgl_checkout} (${bookingSuccessModal.durasi_malam} Malam)\n` +
          `• Total Biaya: Rp ${bookingSuccessModal.total_biaya.toLocaleString('id-ID')}\n\n` +
          `Mohon konfirmasi kesiapan kamar. Terima kasih!`
        );
        const waUrl = `https://wa.me/62${cleanPhone}?text=${waText}`;

        const handleCopyCode = () => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(bookingSuccessModal.booking_code);
            setCopiedBookingCode(true);
            setTimeout(() => setCopiedBookingCode(false), 2000);
          }
        };

        return (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 my-auto">
              {/* Header Tanda Terima Resmi */}
              <div className="bg-[#002B36] p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Bukti Konfirmasi Reservasi</h3>
                    <p className="text-[11px] text-emerald-300">E-Voucher Resmi Desa Wisata CirebonKita</p>
                  </div>
                </div>
                <button
                  onClick={() => setBookingSuccessModal(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                  title="Tutup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-4 text-xs">
                {/* Kode Booking Banner */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-emerald-800 uppercase font-bold tracking-wider block">
                      Kode Reservasi Resmi
                    </span>
                    <span className="font-mono text-base font-black text-[#014B35]">
                      {bookingSuccessModal.booking_code}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100/70 border border-emerald-300 text-[#014B35] font-bold text-xs flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                  >
                    {copiedBookingCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Kode</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Info Penginapan */}
                {bookedHomestay && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center gap-3">
                    <img
                      src={bookedHomestay.foto}
                      alt={bookedHomestay.nama_homestay}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-[#024B35] text-white text-[9.5px] font-bold uppercase">
                          {bookedHomestay.kategori || 'Akomodasi'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9.5px] font-bold">
                          ✓ Terverifikasi
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm truncate mt-1">
                        {bookingSuccessModal.nama_homestay}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                        <span className="truncate">{bookedHomestay.alamat_lengkap || bookedHomestay.lokasi}</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Tabel Rincian Reservasi */}
                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs">
                  <div className="p-2.5 flex justify-between bg-slate-50/50">
                    <span className="text-slate-500">Nama Tamu Penanggung Jawab:</span>
                    <span className="font-bold text-slate-900">{bookingSuccessModal.nama_tamu}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-slate-500">Nomor WhatsApp / HP:</span>
                    <span className="font-semibold text-slate-800">{bookingSuccessModal.kontak}</span>
                  </div>
                  <div className="p-2.5 flex justify-between bg-slate-50/50">
                    <span className="text-slate-500">Kota Asal Domisili:</span>
                    <span className="font-semibold text-slate-800">{bookingSuccessModal.asal_kota}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-slate-500">Tipe Kamar yang Dipesan:</span>
                    <span className="font-bold text-slate-900">{bookingSuccessModal.tipe_kamar}</span>
                  </div>
                  <div className="p-2.5 flex justify-between bg-slate-50/50">
                    <span className="text-slate-500">Jadwal Menginap:</span>
                    <span className="font-semibold text-slate-800">
                      {bookingSuccessModal.tgl_checkin} s.d {bookingSuccessModal.tgl_checkout} ({bookingSuccessModal.durasi_malam} Malam)
                    </span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-slate-500">Jumlah Tamu Inap:</span>
                    <span className="font-semibold text-slate-800">{bookingSuccessModal.jumlah_tamu} Tamu Dewasa</span>
                  </div>
                  <div className="p-3 flex justify-between items-center bg-emerald-50/60 border-t border-emerald-200 text-sm font-black text-[#014B35]">
                    <span>Total Tarif Menginap:</span>
                    <span className="text-base">Rp {bookingSuccessModal.total_biaya.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {/* Catatan Check-in */}
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
                  ⓘ <strong>Ketentuan Check-in:</strong> Tunjukkan kode booking ini kepada pihak pengelola saat tiba di lokasi. Waktu check-in standar pukul 14:00 WIB dan check-out pukul 12:00 WIB.
                </div>

                {/* Tombol Aksi Lengkap */}
                <div className="space-y-2 pt-1">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Kirim Bukti ke WhatsApp Pengelola ({bookedHomestay?.nama_pemilik || 'Resmi'})</span>
                  </a>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Bukti</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingSuccessModal(null)}
                      className="py-2.5 px-3 rounded-xl bg-[#014B35] hover:bg-[#003827] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                    >
                      <span>Selesai &amp; Tutup</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL FORM RESERVASI / BOOKING */}
      {selectedHomestayForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#002B36] p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Reservasi Kamar Inap</h3>
                <p className="text-xs text-emerald-200">{selectedHomestayForBooking.nama_homestay}</p>
              </div>
              <button
                onClick={() => setSelectedHomestayForBooking(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="p-5 sm:p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                <img
                  src={selectedHomestayForBooking.foto}
                  alt={selectedHomestayForBooking.nama_homestay}
                  className="w-16 h-14 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-800 text-sm truncate">{selectedHomestayForBooking.nama_homestay}</h4>
                  <p className="text-slate-500 text-[11px]">{selectedHomestayForBooking.tipe_kamar}</p>
                  <div className="font-bold text-[#014B35] text-xs">
                    Rp {selectedHomestayForBooking.harga_per_malam.toLocaleString('id-ID')} / malam
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Check-In</label>
                  <input
                    type="date"
                    required
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Check-Out</label>
                  <input
                    type="date"
                    required
                    value={checkOutDate}
                    min={checkInDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Tamu Penanggung Jawab *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama lengkap sesuai KTP"
                  value={bookNamaTamu}
                  onChange={(e) => setBookNamaTamu(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#014B35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kota Asal Domisili</label>
                  <input
                    type="text"
                    required
                    placeholder="Cth: DKI Jakarta, Bandung"
                    value={bookAsalKota}
                    onChange={(e) => setBookAsalKota(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. WhatsApp / HP *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={bookKontak}
                    onChange={(e) => setBookKontak(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#014B35]"
                  />
                </div>
              </div>

              {/* Rincian Biaya */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span>Durasi Menginap:</span>
                  <span className="font-bold">{bookingNights} Malam</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Tarif per malam:</span>
                  <span>Rp {selectedHomestayForBooking.harga_per_malam.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-emerald-200 text-sm font-black text-[#014B35]">
                  <span>Total Biaya:</span>
                  <span>Rp {(bookingNights * selectedHomestayForBooking.harga_per_malam).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedHomestayForBooking(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#014B35] hover:bg-[#003827] text-white font-bold shadow-xs transition"
                >
                  Konfirmasi Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
