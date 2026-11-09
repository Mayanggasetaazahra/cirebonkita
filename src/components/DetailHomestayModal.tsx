import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Check, 
  Calendar, 
  Users, 
  ShieldCheck, 
  Clock, 
  Share2, 
  Heart, 
  Building2, 
  Bed, 
  ExternalLink,
  MessageCircle,
  Phone,
  Sparkles,
  ArrowRight,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Info,
  Send,
  Edit3,
  Plus
} from 'lucide-react';
import { HomestayItem, UlasanItem } from '../types';

interface DetailHomestayModalProps {
  homestay: HomestayItem | null;
  ulasanList: UlasanItem[];
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (homestay: HomestayItem) => void;
  bookingNights?: number;
  onAddUlasan?: (ulasan: UlasanItem) => void;
}

export const DetailHomestayModal: React.FC<DetailHomestayModalProps> = ({
  homestay,
  ulasanList,
  isOpen,
  onClose,
  onBookNow,
  bookingNights = 1,
  onAddUlasan,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'fasilitas' | 'kebijakan' | 'ulasan'>('info');
  const [isLiked, setIsLiked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // State Form Tambah Ulasan
  const [showAddReview, setShowAddReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewName, setReviewName] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewToast, setReviewToast] = useState(false);

  const starLabels: Record<number, string> = {
    5: 'Sangat Sempurna & Direkomendasikan',
    4: 'Bagus & Sangat Nyaman',
    3: 'Cukup Baik & Layak',
    2: 'Kurang Memuaskan',
    1: 'Perlu Banyak Pembenahan'
  };

  // Close or toggle fullscreen with ESC key
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

  if (!isOpen || !homestay) return null;

  // Filter ulasan specific to this homestay
  const relatedUlasan = ulasanList.filter(u => u.homestay_id === homestay.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const totalEstimate = homestay.harga_per_malam * (bookingNights > 0 ? bookingNights : 1);

  const cleanPhone = homestay.kontak_pemilik.replace(/\D/g, '').replace(/^0/, '');
  const waUrl = `https://wa.me/62${cleanPhone}?text=Halo%20${encodeURIComponent(homestay.nama_pemilik)},%20saya%20tertarik%20reservasi%20kamar%20di%20${encodeURIComponent(homestay.nama_homestay)}%20via%20CirebonKita`;

  const facilitiesArray = homestay.fasilitas_lengkap && homestay.fasilitas_lengkap.length > 0 
    ? homestay.fasilitas_lengkap 
    : homestay.fasilitas.split(',').map(f => f.trim()).filter(Boolean);

  const policiesArray = homestay.kebijakan && homestay.kebijakan.length > 0 ? homestay.kebijakan : [
    'Waktu Check-in: 14:00 WIB | Check-out: 12:00 WIB',
    'Wajib menunjukkan kartu identitas (KTP/Paspor) saat proses registrasi check-in',
    'Menjaga ketenangan, kesopanan, dan kebersihan lingkungan penginapan',
    'Kamar bebas asap rokok (Non-smoking area)'
  ];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim() || !homestay) return;

    const newUlasan: UlasanItem = {
      id: Date.now(),
      homestay_id: homestay.id,
      nama_homestay: homestay.nama_homestay,
      target_type: 'homestay',
      nama_pengulas: reviewName.trim(),
      asal_kota: reviewCity.trim() || 'DKI Jakarta',
      rating_bintang: reviewRating,
      komentar: reviewComment.trim(),
      created_at: 'Baru saja',
      status_moderasi: 'Disetujui',
    };

    if (onAddUlasan) {
      onAddUlasan(newUlasan);
    }
    setReviewName('');
    setReviewCity('');
    setReviewComment('');
    setShowAddReview(false);
    setReviewToast(true);
    setTimeout(() => setReviewToast(false), 5000);
  };

  const renderUlasanContent = (isFull: boolean) => (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h4 className={`${isFull ? 'text-sm' : 'text-xs'} font-bold text-slate-800 flex items-center gap-2`}>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Ulasan Nyata dari Wisatawan</span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Skor Kepuasan: <strong className="text-slate-800 font-bold">{homestay.avg_rating} / 5.0</strong> ({relatedUlasan.length > 0 ? relatedUlasan.length : homestay.total_ulasan} ulasan terverifikasi)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddReview(!showAddReview)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-xs ${
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
              <span>Tulis Ulasan</span>
            </>
          )}
        </button>
      </div>

      {/* Success Notification */}
      {reviewToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Terima kasih! Ulasan Anda untuk {homestay.nama_homestay} berhasil dikirim dan langsung diterbitkan.</span>
        </div>
      )}

      {/* FORM TAMBAH ULASAN */}
      {showAddReview && (
        <form onSubmit={handleSubmitReview} className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
            <div>
              <h5 className="text-xs font-bold text-[#002B36] flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Formulir Beri Ulasan Penginapan</span>
              </h5>
              <p className="text-[10px] text-slate-500">
                Pengalaman menginap Anda di <strong>{homestay.nama_homestay}</strong>
              </p>
            </div>
          </div>

          {/* Rating Stars */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Beri Nilai Bintang:
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

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Nama Lengkap Anda *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#024B35]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Asal Kota / Domisili
              </label>
              <input
                type="text"
                placeholder="Contoh: DKI Jakarta / Bandung"
                value={reviewCity}
                onChange={(e) => setReviewCity(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#024B35]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Ulasan &amp; Pengalaman Menginap *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Ceritakan kebersihan kamar, kenyamanan fasilitas, keramahan staf/tuan rumah, atau lokasi..."
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

      {/* Reviews List */}
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
          <p className="font-medium text-slate-700">Belum ada ulasan untuk penginapan ini secara langsung.</p>
          <p className="text-[11px] text-slate-400">Jadilah tamu pertama yang memberikan pengalaman berharga Anda!</p>
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
  );

  return (
    <div className={`fixed inset-0 z-50 ${
      isFullscreen 
        ? 'bg-[#F8F9FA] flex flex-col overflow-hidden w-screen h-screen' 
        : 'flex items-center justify-center p-2 sm:p-4 overflow-y-auto'
    }`}>
      {/* Backdrop (Only in normal modal mode) */}
      {!isFullscreen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-[#001D24]/75 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Main Container */}
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
                <Building2 className="w-3 h-3 text-emerald-300" />
                <span>{homestay.kategori || 'Akomodasi'}</span>
              </span>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-bold text-white truncate">
                  {homestay.nama_homestay}
                </h1>
                <p className="text-[11px] text-slate-300 truncate flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">{homestay.lokasi}</span>
                  <span className="text-amber-400 font-bold flex items-center gap-0.5 ml-2">
                    <Star className="w-3 h-3 fill-current" />
                    {homestay.avg_rating}
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
                onClick={() => setIsFullscreen(false)}
                className="sm:hidden w-9 h-9 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
                title="Keluar dari layar penuh (Esc)"
              >
                <Minimize2 className="w-4 h-4" />
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
              title="Perbesar Layar Penuh (Fullscreen) agar tidak terpotong"
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

        {/* Share notification toast */}
        {copiedLink && (
          <div className="bg-emerald-600 text-white text-xs py-1.5 px-4 text-center font-semibold animate-in fade-in shrink-0 z-40">
            ✓ Tautan penginapan berhasil disalin ke clipboard!
          </div>
        )}

        {/* Content Body Layout */}
        <div className={`flex-1 overflow-y-auto ${
          isFullscreen 
            ? 'p-4 sm:p-6 lg:p-8 bg-slate-50/60' 
            : 'flex flex-col'
        }`}>
          {isFullscreen ? (
            /* FULLSCREEN 2-COLUMN LUXURY EXPANSIVE LAYOUT */
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (5 Cols): Big Photo, Quick Specs, Contact */}
              <div className="lg:col-span-5 space-y-5">
                <div className="relative aspect-16/10 sm:aspect-16/11 w-full bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 group">
                  <img
                    src={homestay.foto}
                    alt={homestay.nama_homestay}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Badges on Hero */}
                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#024B35] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Building2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>{homestay.kategori || 'Akomodasi'}</span>
                      </span>

                      {homestay.bintang && (
                        <div className="flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-amber-400 text-slate-900 text-xs font-black shadow-sm">
                          <Star className="w-3.5 h-3.5 fill-slate-900" />
                          <span>Bintang {homestay.bintang}</span>
                        </div>
                      )}

                      <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium text-emerald-200">
                        {homestay.status_kamar === 'Tersedia' ? '🟢 Siap Reservasi' : homestay.status_kamar}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
                      {homestay.nama_homestay}
                    </h2>
                  </div>
                </div>

                {/* Quick 4-box Specs */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Tipe Kamar</span>
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Bed className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">{homestay.tipe_kamar}</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Kapasitas</span>
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Hingga {homestay.kapasitas_tamu} Tamu</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Waktu Inap</span>
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">{homestay.checkin_info || 'In 14:00 | Out 12:00'}</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Jarak Strategis</span>
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">{homestay.jarak_pusat}</span>
                    </div>
                  </div>
                </div>

                {/* Pengelola / WhatsApp Box */}
                <div className="p-4.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Pengelola &amp; Kontak Resmi</span>
                    <div className="font-bold text-slate-800 text-sm mt-0.5">{homestay.nama_pemilik}</div>
                    <div className="text-slate-500 text-[11px] flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{homestay.kontak_pemilik}</span>
                    </div>
                  </div>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#024B35] hover:bg-[#013726] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Pengelola</span>
                  </a>
                </div>
              </div>

              {/* Right Column (7 Cols): Tabs and Rich Details */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
                {/* Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('info')}
                    className={`pb-2 px-4 border-b-2 transition whitespace-nowrap cursor-pointer text-xs sm:text-sm ${
                      activeTab === 'info'
                        ? 'border-[#014B35] text-[#014B35] font-black'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Tentang Penginapan
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('fasilitas')}
                    className={`pb-2 px-4 border-b-2 transition whitespace-nowrap cursor-pointer text-xs sm:text-sm ${
                      activeTab === 'fasilitas'
                        ? 'border-[#014B35] text-[#014B35] font-black'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Fasilitas Lengkap ({facilitiesArray.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('kebijakan')}
                    className={`pb-2 px-4 border-b-2 transition whitespace-nowrap cursor-pointer text-xs sm:text-sm ${
                      activeTab === 'kebijakan'
                        ? 'border-[#014B35] text-[#014B35] font-black'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Kebijakan &amp; Lokasi
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('ulasan')}
                    className={`pb-2 px-4 border-b-2 transition whitespace-nowrap cursor-pointer text-xs sm:text-sm ${
                      activeTab === 'ulasan'
                        ? 'border-[#014B35] text-[#014B35] font-black'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Ulasan Tamu ({relatedUlasan.length > 0 ? relatedUlasan.length : homestay.total_ulasan})
                  </button>
                </div>

                {/* Tab 1: Info Deskripsi */}
                {activeTab === 'info' && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    <div className="space-y-3">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-emerald-700" />
                        <span>Karakteristik &amp; Keunggulan Hunian</span>
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line text-justify">
                        {homestay.deskripsi || `${homestay.nama_homestay} merupakan akomodasi pilihan terpercaya di Cirebon yang menghadirkan suasana menginap nyaman, fasilitas terawat, serta akses prima menuju beragam destinasi wisata budaya, sentra batik Trusmi, dan kuliner khas Cirebon.`}
                      </p>
                    </div>

                    <div className="p-4.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-900 space-y-1.5">
                      <div className="font-bold flex items-center gap-1.5 text-sm text-[#014B35]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Jaminan Kualitas Pelayanan Desa Wisata</span>
                      </div>
                      <p className="text-emerald-800/90 leading-relaxed text-xs">
                        Penginapan ini terdaftar resmi dalam jaringan kemitraan CirebonKita, mematuhi standar kebersihan, sanitasi, serta keterbukaan tarif tanpa biaya tersembunyi bagi wisatawan.
                      </p>
                    </div>

                    {/* Ringkasan Fasilitas Utama */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 mb-3">Ringkasan Fasilitas Kamar &amp; Area:</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {facilitiesArray.slice(0, 6).map((f, i) => (
                          <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-medium">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Fasilitas Lengkap */}
                {activeTab === 'fasilitas' && (
                  <div className="space-y-5 animate-in fade-in duration-150">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                        <Check className="w-5 h-5 text-emerald-700" />
                        <span>Daftar Fasilitas &amp; Layanan Lengkap</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Seluruh fasilitas dapat dinikmati tamu selama masa inap berlangsung.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {facilitiesArray.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 text-xs text-slate-800">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4 font-bold" />
                          </div>
                          <span className="font-semibold">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
                      <span>Seluruh fasilitas terjamin higienis, terawat secara berkala, dan sesuai dengan standar sanitasi perhotelan Cirebon.</span>
                    </div>
                  </div>
                )}

                {/* Tab 3: Kebijakan & Lokasi */}
                {activeTab === 'kebijakan' && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-700" />
                        <span>Alamat Lengkap &amp; Navigasi Peta</span>
                      </h4>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                        <p className="text-slate-800 font-bold text-sm">
                          {homestay.alamat_lengkap || homestay.lokasi}
                        </p>
                        <p className="text-slate-500">
                          Patokan Lokasi: <strong>{homestay.jarak_pusat}</strong>
                        </p>
                        <div className="pt-2">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(homestay.nama_homestay + ' ' + (homestay.alamat_lengkap || homestay.lokasi))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#024B35] text-white text-xs font-bold hover:bg-[#013726] transition shadow-xs"
                          >
                            <span>Buka di Google Maps</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-700" />
                        <span>Ketentuan Menginap &amp; Waktu Check-in</span>
                      </h4>
                      <ul className="space-y-2.5 text-xs text-slate-600">
                        {policiesArray.map((rule, idx) => (
                          <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50/60 border border-slate-100">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="font-medium text-slate-700">{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Tab 4: Ulasan */}
                {activeTab === 'ulasan' && renderUlasanContent(true)}
              </div>
            </div>
          ) : (
            /* STANDARD MODAL MODE (Compact, Clean, Never Cramped) */
            <>
              {/* Hero Image Header with Compact Height */}
              <div className="relative h-44 sm:h-52 md:h-56 w-full bg-slate-900 overflow-hidden shrink-0">
                <img
                  src={homestay.foto}
                  alt={homestay.nama_homestay}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Badges on Image */}
                <div className="absolute bottom-3 left-4 right-4 text-white space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#024B35] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <Building2 className="w-3 h-3 text-emerald-300" />
                      <span>{homestay.kategori || 'Akomodasi'}</span>
                    </span>

                    {homestay.bintang && (
                      <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black shadow-sm">
                        <Star className="w-2.5 h-2.5 fill-slate-900" />
                        <span>Bintang {homestay.bintang}</span>
                      </div>
                    )}

                    <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-medium text-emerald-200">
                      {homestay.status_kamar === 'Tersedia' ? '🟢 Siap Reservasi' : homestay.status_kamar}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight drop-shadow-md">
                    {homestay.nama_homestay}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-200 pt-0.5">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="line-clamp-1">{homestay.lokasi}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-300 font-bold">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{homestay.avg_rating}</span>
                      <span className="text-slate-300 font-normal">({homestay.total_ulasan} ulasan)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable Modal Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
                {/* Quick Specifications Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Tipe Kamar</span>
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Bed className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">{homestay.tipe_kamar}</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Kapasitas</span>
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Hingga {homestay.kapasitas_tamu} Tamu</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Waktu Inap</span>
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">{homestay.checkin_info || 'In 14:00 | Out 12:00'}</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Jarak Strategis</span>
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">{homestay.jarak_pusat}</span>
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('info')}
                    className={`pb-2 px-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
                      activeTab === 'info'
                        ? 'border-[#014B35] text-[#014B35]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Tentang Penginapan
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
                    Fasilitas Lengkap
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('kebijakan')}
                    className={`pb-2 px-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
                      activeTab === 'kebijakan'
                        ? 'border-[#014B35] text-[#014B35]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Kebijakan &amp; Lokasi
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('ulasan')}
                    className={`pb-2 px-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
                      activeTab === 'ulasan'
                        ? 'border-[#014B35] text-[#014B35]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Ulasan Tamu ({relatedUlasan.length > 0 ? relatedUlasan.length : homestay.total_ulasan})
                  </button>
                </div>

                {/* Tab 1: Info Deskripsi */}
                {activeTab === 'info' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-700" />
                        <span>Deskripsi &amp; Daya Tarik Penginapan</span>
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed text-justify">
                        {homestay.deskripsi || `${homestay.nama_homestay} merupakan akomodasi pilihan terpercaya di Cirebon yang menghadirkan suasana menginap nyaman, fasilitas terawat, serta akses prima menuju beragam destinasi wisata budaya, sentra batik Trusmi, dan kuliner khas Cirebon.`}
                      </p>
                    </div>

                    {/* Host Contact Box */}
                    <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-teal-800 font-bold uppercase tracking-wider block">Pengelola / Reservasi Resmi</span>
                        <div className="font-bold text-slate-800 text-xs sm:text-sm mt-0.5">{homestay.nama_pemilik}</div>
                        <div className="text-slate-500 text-[11px] flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 text-teal-700" />
                          <span>{homestay.kontak_pemilik}</span>
                        </div>
                      </div>

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-[#024B35] hover:bg-[#013726] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp</span>
                      </a>
                    </div>

                    {/* Fasilitas Snippet */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 mb-2">Fasilitas Utama:</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {facilitiesArray.slice(0, 6).map((f, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Fasilitas Lengkap */}
                {activeTab === 'fasilitas' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-700" />
                      <span>Seluruh Fasilitas &amp; Layanan Kenyamanan</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {facilitiesArray.map((item, index) => (
                        <div key={index} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs text-slate-700">
                          <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 font-bold" />
                          </div>
                          <span className="font-medium">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Seluruh fasilitas terjamin higienis, terawat berkala, dan sesuai standar sanitasi Cirebon.</span>
                    </div>
                  </div>
                )}

                {/* Tab 3: Kebijakan & Lokasi */}
                {activeTab === 'kebijakan' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Alamat Lengkap &amp; Navigasi</span>
                      </h4>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                        <p className="text-slate-700 font-medium">
                          {homestay.alamat_lengkap || homestay.lokasi}
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          Patokan: <strong>{homestay.jarak_pusat}</strong>
                        </p>
                        <div className="pt-1">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(homestay.nama_homestay + ' ' + (homestay.alamat_lengkap || homestay.lokasi))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-100 transition"
                          >
                            <span>Buka di Google Maps</span>
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Kebijakan Menginap &amp; Check-in</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {policiesArray.map((rule, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Tab 4: Ulasan */}
                {activeTab === 'ulasan' && renderUlasanContent(false)}
              </div>
            </>
          )}
        </div>

        {/* Modal Bottom Sticky CTA Bar */}
        <div className="p-3.5 sm:p-5 bg-white border-t border-slate-200 flex items-center justify-between gap-4 shrink-0 shadow-lg z-30">
          <div>
            <span className="text-[10.5px] sm:text-xs text-slate-500 block">Tarif Estimasi</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-2xl font-black text-[#014B35]">
                Rp {homestay.harga_per_malam.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium">/ malam</span>
            </div>
            {bookingNights > 1 && (
              <span className="text-[10px] text-emerald-700 font-semibold block">
                Total {bookingNights} malam: Rp {totalEstimate.toLocaleString('id-ID')}
              </span>
            )}
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
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBookNow(homestay);
              }}
              className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-[#014B35] hover:bg-[#003827] text-white text-xs font-bold flex items-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <span>Pesan Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
