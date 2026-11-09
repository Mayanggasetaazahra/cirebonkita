import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Heart, 
  Eye, 
  ChevronRight, 
  ChevronLeft,
  Check
} from 'lucide-react';
import { UmkmItem } from '../types';

interface PublicUmkmProps {
  umkmList: UmkmItem[];
  onAddToCart: (item: UmkmItem) => void;
  onSelectProduct: (item: UmkmItem) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const PublicUmkm: React.FC<PublicUmkmProps> = ({
  umkmList,
  onAddToCart,
  onSelectProduct,
  searchQuery,
  setSearchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Kategori');
  const [sortOption, setSortOption] = useState<string>('termurah');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [favorites, setFavorites] = useState<number[]>([]);

  const categories = [
    'Semua Kategori',
    'Kerajinan Tangan',
    'Kuliner Khas',
    'Batik Cirebon',
    'Aksesoris',
  ];

  const getCategoryCount = (cat: string) => {
    if (cat === 'Semua Kategori') return umkmList.length;
    return umkmList.filter(item => item.kategori?.trim().toLowerCase() === cat.trim().toLowerCase()).length;
  };

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // Filter and sort items
  const filteredProducts = useMemo(() => {
    let result = umkmList.filter((item) => {
      const matchSearch = item.nama_produk.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.mitra_pengrajin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.desa_asal.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCat = (selectedCategory === 'Semua Kategori') || 
                       (item.kategori?.trim().toLowerCase() === selectedCategory.trim().toLowerCase());
      return matchSearch && matchCat;
    });

    if (sortOption === 'termurah') {
      result.sort((a, b) => a.harga - b.harga);
    } else if (sortOption === 'termahal') {
      result.sort((a, b) => b.harga - a.harga);
    }

    return result;
  }, [umkmList, searchQuery, selectedCategory, sortOption]);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 2 Columns: Filter Sidebar on Left, Products Catalog on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SIDEBAR: FILTER KATEGORI & URUTKAN HARGA */}
        <aside className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-7">
          {/* Filter Kategori */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Filter Kategori
              </h3>
              {selectedCategory !== 'Semua Kategori' && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('Semua Kategori');
                    setCurrentPage(1);
                  }}
                  className="text-[11px] text-[#014B35] font-semibold hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="space-y-2">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count = getCategoryCount(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition cursor-pointer select-none group ${
                      isSelected
                        ? 'bg-emerald-50 text-[#014B35] font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors shrink-0 ${
                          isSelected
                            ? 'bg-[#014B35] border-[#014B35] text-white'
                            : 'border-slate-300 bg-white group-hover:border-slate-400'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-3" />}
                      </div>
                      <span className="truncate">
                        {cat}
                      </span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                      isSelected
                        ? 'bg-[#014B35] text-white'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Urutkan Harga */}
          <div className="space-y-3 pt-5 border-t border-slate-100">
            <label className="text-sm font-bold text-slate-900 block tracking-tight">
              Urutkan Harga
            </label>
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full py-2.5 px-3.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:border-[#014B35] focus:ring-1 focus:ring-[#014B35] cursor-pointer"
              >
                <option value="termurah">Termurah - Termahal</option>
                <option value="termahal">Termahal - Termurah</option>
              </select>
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN AREA: HEADER, SEARCH, PRODUCTS GRID, PAGINATION */}
        <main className="lg:col-span-9 space-y-6">
          {/* Header Row: Title on Left, Search Input on Right */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Produk UMKM
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Temukan berbagai produk kerajinan dan kuliner khas Cirebon ({filteredProducts.length} produk)
              </p>
            </div>

            {/* Action: Search Input Only (Report export is restricted to Admin panel) */}
            <div className="w-full sm:w-72">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama produk, desa, pengrajin..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#014B35] focus:ring-1 focus:ring-[#014B35] outline-none shadow-2xs transition"
                />
              </div>
            </div>
          </div>

          {/* Product Cards Grid */}
          {paginatedItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <p className="text-sm font-semibold text-slate-800">
                Tidak ada produk ditemukan
              </p>
              <p className="text-xs text-slate-500">
                Coba pilih kategori lain atau ubah kata kunci pencarian Anda.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('Semua Kategori');
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-[#014B35] hover:underline cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {paginatedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col group"
                >
                  {/* Photo with heart button */}
                  <div 
                    onClick={() => onSelectProduct(item)}
                    className="relative aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.foto}
                      alt={item.nama_produk}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(item.id, e)}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-rose-600 flex items-center justify-center shadow-2xs transition"
                      title="Favorit"
                    >
                      <Heart className={`w-3.5 h-3.5 ${favorites.includes(item.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Body: Title, Price, Category, Button */}
                  <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <div 
                      onClick={() => onSelectProduct(item)}
                      className="cursor-pointer space-y-1"
                    >
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#014B35] transition line-clamp-1">
                        {item.nama_produk}
                      </h3>
                      <div className="text-xs sm:text-sm font-black text-slate-900">
                        Rp {item.harga.toLocaleString('id-ID')}
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        {item.kategori}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectProduct(item)}
                      className="w-full bg-[#014B35] hover:bg-[#003827] text-white py-2 px-3 rounded-lg text-xs font-semibold text-center transition cursor-pointer"
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination (1, 2, 3, ->) matching Figma */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-6">
              {currentPage > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 flex items-center justify-center text-xs font-semibold transition cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-[#014B35] text-white shadow-2xs font-bold'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {currentPage < totalPages && (
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 flex items-center justify-center text-xs font-semibold transition cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
