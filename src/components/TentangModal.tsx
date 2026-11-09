import { X, Landmark, Store, Home as HomeIcon, CheckCircle2, ShieldCheck, MapPin, Phone } from 'lucide-react';
import { CirebonLogo } from './CirebonLogo';

interface TentangModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TentangModal: React.FC<TentangModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="flex justify-start">
            <CirebonLogo size="md" showTagline={true} />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Tentang CirebonKita
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Portal Smart Tourism &amp; Integrasi Desa Wisata Mandiri Cirebon
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            <strong>CirebonKita</strong> adalah platform digital terpadu yang dirancang untuk mempertemukan wisatawan dengan kekayaan budaya, kriya UMKM lokal, dan keramahan warga Cirebon. Melalui digitalisasi desa wisata, kami berkomitmen menjaga kelestarian warisan leluhur sekaligus memutar roda ekonomi perajin dan pemilik homestay lokal secara mandiri.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#014B35] flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Etalase UMKM</h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                Batik Trusmi, terasi rebon asli, empal gentong, dan aneka kerajinan tangan.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#014B35] flex items-center justify-center">
                <Landmark className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Wisata &amp; Tiket</h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                Eksplorasi Keraton Kasepuhan, Kanoman, Gua Sunyaragi, dan situs religi.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#014B35] flex items-center justify-center">
                <HomeIcon className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Homestay Asri</h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                Penginapan nyaman milik warga dengan suasana kekeluargaan yang hangat.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-100 text-xs text-emerald-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#014B35]" />
              <span>Komitmen &amp; Standar Layanan</span>
            </div>
            <ul className="space-y-1 text-[11px] text-emerald-950/80">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#014B35] shrink-0" />
                <span>100% Produk Langsung dari Tangan Pengrajin Lokal Cirebon</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#014B35] shrink-0" />
                <span>Harga Resmi Tiket Destinasi Tanpa Tambahan Biaya Liar</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#014B35] shrink-0" />
                <span>Transparansi Transaksi &amp; Moderasi Ulasan Asli Pengunjung</span>
              </li>
            </ul>
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-3">
            <div className="flex items-start gap-2 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-[#014B35] shrink-0 mt-0.5" />
              <span className="font-medium">
                Jl. Perjuangan No.10B, Karyamulya, Kec. Kesambi, Kota Cirebon, Jawa Barat
              </span>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Kontak Layanan Informasi (3 Saluran Telepon / WhatsApp):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <a
                  href="tel:083155853722"
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-[#014B35]" />
                  <span className="text-xs font-mono font-bold">083155853722</span>
                </a>
                <a
                  href="tel:081949684163"
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-[#014B35]" />
                  <span className="text-xs font-mono font-bold">081949684163</span>
                </a>
                <a
                  href="tel:085717412815"
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-[#014B35]" />
                  <span className="text-xs font-mono font-bold">085717412815</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
