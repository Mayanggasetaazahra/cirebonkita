import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Check, 
  Clock, 
  Share2, 
  Heart, 
  Landmark, 
  Ticket, 
  ExternalLink,
  ShieldCheck,
  Compass,
  Users,
  Sparkles,
  Info,
  Calendar,
  ArrowRight,
  PhoneCall,
  Maximize2,
  Minimize2,
  Send,
  Edit3,
  Plus,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { WisataItem, UlasanItem } from '../types';

interface DetailWisataModalProps {
  wisata: WisataItem | null;
  isOpen: boolean;
  onClose: () => void;
  onBookTicket: (wisata: WisataItem) => void;
  ulasanList?: UlasanItem[];
  onAddUlasan?: (ulasan: UlasanItem) => void;
}

export const DetailWisataModal: React.FC<DetailWisataModalProps> = ({
  wisata,
  isOpen,
  onClose,
  onBookTicket,
  ulasanList = [],
  onAddUlasan,
}) => {
  const [activeTab, setActiveTab] = useState<'tentang' | 'fasilitas' | 'rute' | 'ketentuan' | 'ulasan'>('tentang');
  const [isLiked, setIsLiked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Form Tambah Ulasan Wisata
  const [showAddReview, setShowAddReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerCity, setReviewerCity] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewToast, setReviewToast] = useState(false);

  const starLabels: Record<number, string> = {
    5: 'Sangat Mempesona & Edukatif (Rekomendasi Utama)',
    4: 'Bagus & Sangat Menyenangkan',
    3: 'Cukup Baik & Menarik',
    2: 'Kurang Terawat / Memuaskan',
    1: 'Perlu Banyak Pembenahan Fasilitas'
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, onClose]);

  if (!isOpen || !wisata) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const relatedUlasan = (ulasanList || []).filter(
    (u) => u.wisata_id === wisata.id || u.nama_wisata === wisata.nama_wisata
  );

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim() || !wisata) return;

    const newUlasan: UlasanItem = {
      id: Date.now(),
      wisata_id: wisata.id,
      nama_wisata: wisata.nama_wisata,
      target_type: 'wisata',
      nama_pengulas: reviewerName.trim(),
      asal_kota: reviewerCity.trim() || 'DKI Jakarta',
      rating_bintang: reviewRating,
      komentar: reviewComment.trim(),
      created_at: 'Baru saja',
      status_moderasi: 'Disetujui',
    };

    if (onAddUlasan) {
      onAddUlasan(newUlasan);
    }
    setReviewerName('');
    setReviewerCity('');
    setReviewComment('');
    setShowAddReview(false);
    setReviewToast(true);
    setTimeout(() => setReviewToast(false), 5000);
  };

  const facilitiesList = wisata.fasilitas 
    ? wisata.fasilitas.split(',').map(f => f.trim()).filter(Boolean)
    : [
        'Pemandu Wisata Cagar Budaya',
        'Area Parkir Luas',
        'Musholla Bersih',
        'Toilet Wisatawan',
        'Spot Foto Bersejarah',
        'Sentra Kuliner Tradisional'
      ];

  const mapsQuery = encodeURIComponent(`${wisata.nama_wisata} ${wisata.lokasi}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <div className={`fixed inset-0 z-50 ${
      isFullscreen 
        ? 'bg-[#F8F9FA] flex flex-col overflow-hidden w-screen h-screen' 
        : 'flex items-center justify-center p-3 sm:p-4 overflow-y-auto'
    }`}>
      {/* Backdrop */}
      {!isFullscreen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-[#001D24]/75 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Modal Dialog */}
      <div className={`relative bg-white flex flex-col z-10 transition-all duration-200 ${
        isFullscreen
          ? 'w-full h-full rounded-none shadow-none flex-1 overflow-hidden'
          : 'w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh]'
      }`}>
        {/* Fullscreen Dedicated Top Bar */}
        {isFullscreen ? (
          <header className="h-16 px-4 sm:px-6 bg-[#002B36] text-white flex items-center justify-between shrink-0 shadow-md border-b border-white/10 z-30">
            <div className="flex items-center gap-3 min-w-0">
              <span className="px-2.5 py-1 rounded-full bg-[#024B35] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                <Landmark className="w-3 h-3 text-emerald-300" />
                <span>{wisata.kategori}</span>
              </span>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-bold text-white truncate">
                  {wisata.nama_wisata}
                </h1>
                <p className="text-[11px] text-slate-300 truncate flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">{wisata.lokasi}</span>
                  <span className="text-amber-400 font-bold flex items-center gap-0.5 ml-2">
                    <Star className="w-3 h-3 fill-current" />
                    {wisata.rating}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsLiked(!isLiked)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${
                  isLiked 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title="Simpan ke favorit"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
                title="Bagikan tautan"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-xs font-bold transition cursor-pointer"
                title="Keluar dari layar penuh (Esc)"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Kecilkan</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white flex items-center justify-center transition cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>
        ) : (
          /* Normal Modal Floating Control Bar */
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-800 text-xs font-bold backdrop-blur-md flex items-center gap-1.5 transition shadow-md cursor-pointer border border-slate-200/60"
              title="Perbesar Layar Penuh"
            >
              <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Layar Penuh</span>
            </button>

            <button
              type="button"
              onClick={() => setIsLiked(!isLiked)}
              className={`w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full backdrop-blur-md flex items-center justify-center transition shadow-md cursor-pointer ${
                isLiked 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-white/90 text-slate-700 hover:text-rose-500 hover:bg-white'
              }`}
              title="Simpan ke favorit"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            
            <button
              type="button"
              onClick={handleShare}
              className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-[#014B35] hover:bg-white flex items-center justify-center transition shadow-md cursor-pointer"
              title="Bagikan tautan"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition shadow-md cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Hero Image Header */}
        <div className="relative h-64 sm:h-76 w-full bg-slate-900 overflow-hidden shrink-0">
          <img
            src={wisata.foto}
            alt={wisata.nama_wisata}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/aistudio/sejarah_keraton_kasepuhan_1_8355da556d.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

          {/* Badges on Image */}
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#024B35] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Landmark className="w-3 h-3 text-emerald-300" />
                <span>{wisata.kategori}</span>
              </span>

              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
                wisata.status_operasional?.includes('Buka')
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-500 text-white'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>{wisata.status_operasional || 'Buka (Aktif)'}</span>
              </span>

              <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-medium text-emerald-200">
                Retribusi Resmi Kas Desa
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
              {wisata.nama_wisata}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200 pt-0.5">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="line-clamp-1">{wisata.lokasi}</span>
              </div>
              <div className="flex items-center gap-1 text-amber-300 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{wisata.rating}</span>
                <span className="text-slate-300 font-normal">({wisata.ulasan_count} ulasan terverifikasi)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Share notification toast */}
        {copiedLink && (
          <div className="bg-emerald-600 text-white text-xs py-1.5 px-4 text-center font-semibold animate-in fade-in">
            ✓ Tautan objek wisata berhasil disalin ke clipboard!
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Quick Specifications Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Tiket Masuk (HTM)</span>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate">
                  {wisata.harga_tiket > 0 
                    ? `Rp ${wisata.harga_tiket.toLocaleString('id-ID')}` 
                    : 'Gratis / Donasi'}
                </span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Jam Operasional</span>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate">{wisata.jam_buka || '08:00 - 17:00 WIB'}</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Kuota Kunjungan</span>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate">
                  {wisata.kuota_harian 
                    ? `${wisata.kuota_harian - (wisata.kuota_terisi || 0)} Kuota Tersedia`
                    : 'Kapasitas Normal'}
                </span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Sistem Tiket</span>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate">QR E-Tiket Digital</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('tentang')}
              className={`pb-2 px-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'tentang'
                  ? 'border-[#014B35] text-[#014B35]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Tentang &amp; Sejarah
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('fasilitas')}
              className={`pb-2 px-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'fasilitas'
                  ? 'border-[#014B35] text-[#014B35]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Fasilitas &amp; Daya Tarik
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rute')}
              className={`pb-2 px-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'rute'
                  ? 'border-[#014B35] text-[#014B35]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Lokasi &amp; Akses
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ketentuan')}
              className={`pb-2 px-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'ketentuan'
                  ? 'border-[#014B35] text-[#014B35]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Ketentuan Kunjungan
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ulasan')}
              className={`pb-2 px-3 border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ulasan'
                  ? 'border-[#014B35] text-[#014B35]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Ulasan &amp; Rating ({relatedUlasan.length > 0 ? relatedUlasan.length : wisata.ulasan_count})</span>
            </button>
          </div>

          {/* Tab Content 1: Tentang & Sejarah */}
          {activeTab === 'tentang' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>Daya Tarik Budaya &amp; Sejarah</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line text-justify">
                  {wisata.deskripsi}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <Landmark className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Keunikan Arsitektur &amp; Warisan Leluhur</span>
                </div>
                <p className="text-xs text-emerald-800/90 leading-relaxed">
                  Objek wisata ini merupakan bagian dari simpul sejarah peradaban Kesultanan Cirebon. Menyajikan perpaduan filosofi arsitektur Islam Jawa, ragam hias keramik dinasti Tiongkok, serta sentuhan bata merah klasik khas tanah Caruban Nagari.
                </p>
              </div>

              {/* Cultural Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-blue-600" />
                    <span>Waktu Terbaik Berkunjung</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Pagi hari (08:30 - 10:30 WIB) atau sore hari (15:00 - 17:00 WIB) saat cuaca teduh untuk mengabadikan momen foto terbaik.
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pemandu Wisata Budaya</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Tersedia abdi dalem / pemandu lokal bersertifikat di pintu loket masuk untuk mendampingi tur sejarah keluarga & rombongan.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 2: Fasilitas & Daya Tarik */}
          {activeTab === 'fasilitas' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Fasilitas Pendukung Wisatawan</h4>
                <p className="text-xs text-slate-500 mb-4">
                  Dikelola bersama pengelola cagar budaya dan aparatur desa wisata untuk kenyamanan pengunjung.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {facilitiesList.map((facility, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 text-[#014B35] flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-amber-800">
                  <Info className="w-4 h-4 text-amber-600" />
                  <span>Kenyamanan Wisatawan</span>
                </span>
                <p className="text-amber-800/90 leading-relaxed text-[11.5px]">
                  Bagi pengunjung lansia dan keluarga dengan anak-anak, rute dalam cagar budaya sebagian besar datar dan dilengkapi area duduk teduh di bawah pepohonan rindang.
                </p>
              </div>
            </div>
          )}

          {/* Tab Content 3: Lokasi & Akses */}
          {activeTab === 'rute' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Alamat Lengkap</span>
                    <h5 className="text-xs font-bold text-slate-800 mt-0.5">{wisata.lokasi}</h5>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Kota &amp; Kabupaten Cirebon, Jawa Barat
                    </p>
                  </div>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#024B35] hover:bg-[#013726] text-white text-xs font-bold shrink-0 transition"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-800">Petunjuk Akses Rute Transportasi:</h5>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span><strong>Dari Stasiun Cirebon (Kejaksan / Prujakan):</strong> Berjarak sekitar 10-15 menit berkendara menggunakan taksi, ojek daring, atau angkutan kota (D5 / D6).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span><strong>Dari Gerbang Tol (Plumbon / Ciperna):</strong> Akses langsung jalan arteri kota Cirebon, mudah dijangkau bus pariwisata maupun kendaraan pribadi.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span><strong>Lahan Parkir:</strong> Dikelola terpadu dengan tarif retribusi resmi desa wisata dan pengawasan juru parkir resmi.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab Content 4: Ketentuan & Tiket */}
          {activeTab === 'ketentuan' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-2.5">
                <h5 className="text-xs font-bold text-slate-800">Tata Tertib &amp; Etika Berkunjung:</h5>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Pakaian Sopan:</strong> Harap mengenakan pakaian yang menutup aurat/sopan saat memasuki kompleks keraton, museum pusaka, dan makam religi.</span>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Kelestarian Cagar Budaya:</strong> Dilarang memanjat batu karang purba, menyentuh benda pusaka tanpa izin, atau mencoret-coret area situs.</span>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Kebersihan Lingkungan:</strong> Buang sampah pada tempat yang disediakan untuk menjaga keasrian lingkungan desa wisata Cirebon.</span>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Validasi Tiket:</strong> Tunjukkan barcode e-tiket dari smartphone Anda di loket masuk saat tiba di lokasi.</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Butuh panduan reservasi rombongan / dinas?</span>
                <span className="font-bold text-[#014B35]">Hotline: 083155853722</span>
              </div>
            </div>
          )}

          {/* Tab Content 5: Ulasan & Penilaian */}
          {activeTab === 'ulasan' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Header Skor & Tombol Tulis Ulasan */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>Ulasan &amp; Penilaian Pengunjung</span>
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>Skor Rata-Rata:</span>
                    <span className="font-bold text-amber-500 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {wisata.rating} / 5.0
                    </span>
                    <span>&bull;</span>
                    <span>{relatedUlasan.length > 0 ? relatedUlasan.length : wisata.ulasan_count} ulasan terverifikasi</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddReview(!showAddReview)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-xs ${
                    showAddReview
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-[#024B35] hover:bg-[#013726] text-white'
                  }`}
                >
                  {showAddReview ? (
                    <>
                      <X className="w-3.5 h-3.5" />
                      <span>Tutup Form</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tulis Ulasan Baru</span>
                    </>
                  )}
                </button>
              </div>

              {/* Toast Sukses */}
              {reviewToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Terima kasih! Ulasan Anda untuk {wisata.nama_wisata} berhasil dikirim dan diterbitkan.</span>
                </div>
              )}

              {/* Form Tambah Ulasan */}
              {showAddReview && (
                <form onSubmit={handleSubmitReview} className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3.5 shadow-sm">
                  <div className="border-b border-emerald-100 pb-2">
                    <h5 className="text-xs font-bold text-[#002B36] flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Beri Ulasan Objek Wisata Ini</span>
                    </h5>
                    <p className="text-[10px] text-slate-500">
                      Bagikan pengalaman nyata Anda mengunjungi <strong>{wisata.nama_wisata}</strong>
                    </p>
                  </div>

                  {/* Bintang Rating */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Beri Nilai Rating:
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setReviewRating(star)}
                            className="p-1 hover:scale-110 transition cursor-pointer"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= (hoverRating || reviewRating)
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-700">
                        {starLabels[hoverRating || reviewRating]}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Nama Lengkap Anda *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Hendrik Pratama"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#024B35]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Asal Kota / Domisili
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Bandung / Yogyakarta"
                        value={reviewerCity}
                        onChange={(e) => setReviewerCity(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#024B35]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Cerita &amp; Ulasan Kunjungan Anda *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Ceritakan keindahan situs cagar budaya, pemanduan sejarah, akses fasilitas, tips untuk pengunjung lain..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#024B35]"
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddReview(false)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-600 cursor-pointer transition"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#024B35] hover:bg-[#013726] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Ulasan Sekarang</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Daftar Ulasan Pengunjung */}
              {relatedUlasan.length > 0 ? (
                <div className="space-y-3">
                  {relatedUlasan.map((u) => (
                    <div key={u.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-800">{u.nama_pengulas}</span>
                          {u.asal_kota && (
                            <span className="text-[10px] text-slate-400 ml-1.5">({u.asal_kota})</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: u.rating_bintang }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed italic">
                        "{u.komentar}"
                      </p>
                      <span className="text-[10px] text-slate-400 block pt-1">{u.created_at}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-2">
                  <Star className="w-8 h-8 text-amber-400 mx-auto opacity-50" />
                  <p className="font-medium text-slate-700">Belum ada ulasan untuk objek wisata ini secara langsung.</p>
                  <p className="text-[11px] text-slate-400">Bagikan kesan pertama dan cerita menarik dari kunjungan Anda!</p>
                  {!showAddReview && (
                    <button
                      type="button"
                      onClick={() => setShowAddReview(true)}
                      className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#024B35] hover:bg-[#013726] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tulis Ulasan Pertama</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Sticky CTA Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex items-center justify-between gap-4 shrink-0 shadow-lg">
          <div>
            <span className="text-[11px] text-slate-500 block">Harga E-Tiket Masuk</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-[#014B35]">
                {wisata.harga_tiket > 0 
                  ? `Rp ${wisata.harga_tiket.toLocaleString('id-ID')}` 
                  : 'Gratis / Donasi'}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ orang</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold block">
              ✓ Termasuk asuransi &amp; retribusi kas desa
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isFullscreen && (
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="hidden sm:flex px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition items-center gap-1.5 cursor-pointer"
                title="Buka dalam tampilan layar penuh"
              >
                <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Layar Penuh</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBookTicket(wisata);
              }}
              className="px-6 py-2.5 rounded-xl bg-[#024B35] hover:bg-[#013726] text-white text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Pesan E-Tiket</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
