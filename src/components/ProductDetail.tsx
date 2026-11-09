import React, { useState } from 'react';
import { 
  Heart, 
  Share2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Check, 
  ChevronRight, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { UmkmItem } from '../types';

interface ProductDetailProps {
  product: UmkmItem;
  allProducts: UmkmItem[];
  onNavigate: (view: string) => void;
  onAddToCart: (product: UmkmItem, quantity: number) => void;
  onSelectProduct: (product: UmkmItem) => void;
  onToast: (msg: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  allProducts,
  onNavigate,
  onAddToCart,
  onSelectProduct,
  onToast,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Related products (Produk Serupa)
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id)
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    onToast('Tautan produk berhasil disalin!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    onToast(!isFavorited ? 'Produk ditambahkan ke Favorit Anda.' : 'Produk dihapus dari Favorit.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={() => onNavigate('home')}
          className="hover:text-[#014B35] font-medium transition cursor-pointer"
        >
          Beranda
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <button
          onClick={() => onNavigate('umkm')}
          className="hover:text-[#014B35] font-medium transition cursor-pointer"
        >
          Produk
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
          {product.nama_produk}
        </span>
      </div>

      {/* Top Product Showcase (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Single Main Product Image */}
        <div className="lg:col-span-7">
          <div className="relative aspect-4/3 sm:aspect-16/11 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <img
              src={product.foto}
              alt={product.nama_produk}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right: Product Purchase Controls */}
        <div className="lg:col-span-5 space-y-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <span className="inline-block px-3 py-1 bg-emerald-50 text-[#014B35] text-xs font-semibold rounded-md mb-2">
              {product.kategori}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.nama_produk}
            </h1>
            <div className="text-2xl font-black text-[#014B35] mt-2">
              Rp {product.harga.toLocaleString('id-ID')}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {product.deskripsi}
          </p>

          {/* Specification Table */}
          <div className="border-t border-b border-slate-100 py-3 text-xs space-y-2">
            <div className="grid grid-cols-12 py-1">
              <span className="col-span-4 text-slate-500 font-medium">Stok</span>
              <span className="col-span-8 text-slate-800 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Tersedia ({product.stok} pcs)
              </span>
            </div>
            <div className="grid grid-cols-12 py-1">
              <span className="col-span-4 text-slate-500 font-medium">Mitra Perajin</span>
              <span className="col-span-8 text-slate-800 font-semibold">
                {product.mitra_pengrajin} &bull; {product.desa_asal}
              </span>
            </div>
            <div className="grid grid-cols-12 py-1">
              <span className="col-span-4 text-slate-500 font-medium">Ukuran / Berat</span>
              <span className="col-span-8 text-slate-800 font-semibold">
                Standar Desa Wisata &bull; 250 gram
              </span>
            </div>
            <div className="grid grid-cols-12 py-1">
              <span className="col-span-4 text-slate-500 font-medium">Pengiriman</span>
              <span className="col-span-8 text-slate-800 font-semibold">
                Seluruh Indonesia (Kurir Reguler &amp; Wisata)
              </span>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-md bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center text-xs font-bold text-slate-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stok, quantity + 1))}
                  className="w-8 h-8 rounded-md bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                type="button"
                onClick={() => onAddToCart(product, quantity)}
                className="flex-1 bg-[#014B35] hover:bg-[#003827] text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Tambah ke Keranjang</span>
              </button>
            </div>

            {/* Favorite & Share buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleToggleFavorite}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                  isFavorited
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-500' : ''}`} />
                <span>{isFavorited ? 'Tersimpan' : 'Favorit'}</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Tersalin' : 'Bagikan'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Deskripsi Lengkap + Tips Perawatan + Produk Serupa */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
        {/* Left: Detailed Description & Tips */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Deskripsi Produk
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.nama_produk} dibuat dengan teknik otentik tradisional oleh pengrajin lokal Cirebon. Menggunakan bahan berkualitas tinggi, setiap lekuk dan detail mencerminkan filosofi kearifan lokal keraton dan nilai kesabaran yang tinggi.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Dengan berbelanja produk ini, Anda langsung mendukung ekonomi keluarga pengrajin di {product.desa_asal} serta turut menjaga warisan pusaka nusantara agar tetap lestari.
            </p>

            {/* Tips Perawatan Box */}
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#014B35]" />
                <span>Tips Perawatan &amp; Penyimpanan</span>
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Cuci menggunakan air bersuhu ruangan dan usahakan cuci dengan tangan.</li>
                <li>Gunakan deterjen khusus batik (lerak) atau sabun lembut tanpa pemutih.</li>
                <li>Hindari memeras kain terlalu kencang untuk menjaga kerapatan serat.</li>
                <li>Jangan dijemur langsung di bawah terik matahari terik; cukup diangin-anginkan di tempat teduh.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Produk Serupa */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Produk Serupa</h3>
            <button
              onClick={() => onNavigate('umkm')}
              className="text-xs font-semibold text-[#014B35] hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  onSelectProduct(rel);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer group"
              >
                <img
                  src={rel.foto}
                  alt={rel.nama_produk}
                  className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#014B35] truncate transition">
                    {rel.nama_produk}
                  </h4>
                  <div className="text-xs font-black text-[#014B35] mt-0.5">
                    Rp {rel.harga.toLocaleString('id-ID')}
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {rel.mitra_pengrajin}
                  </span>
                </div>
                <button
                  type="button"
                  className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-rose-50 text-slate-400 group-hover:text-rose-500 flex items-center justify-center transition"
                  title="Favorit"
                >
                  <Heart className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Back button */}
          <button
            onClick={() => onNavigate('umkm')}
            className="w-full mt-2 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Katalog UMKM</span>
          </button>
        </div>
      </div>
    </div>
  );
};
