import React, { useState } from 'react';
import { 
  Package, 
  ArrowDownCircle, 
  LayoutGrid, 
  ShoppingCart, 
  Plus, 
  Search, 
  Pencil, 
  Eye, 
  Trash2, 
  X,
  Upload,
  CheckCircle2
} from 'lucide-react';
import { UmkmItem } from '../types';
import { ReportExportButton } from './ReportExportButton';
import { exportUmkmReport } from '../utils/reportExport';
import { ImageUploadSelector } from './ImageUploadSelector';
const defaultUmkmImg = '/assets/aistudio/batik_mega_mendung_c3fe5b49.jpeg';

interface AdminUmkmProps {
  umkmList: UmkmItem[];
  onAddUmkm: (item: Omit<UmkmItem, 'id' | 'terjual' | 'rating'>) => void;
  onUpdateUmkm: (item: UmkmItem) => void;
  onDeleteUmkm: (id: number) => void;
}

export const AdminUmkm: React.FC<AdminUmkmProps> = ({
  umkmList,
  onAddUmkm,
  onUpdateUmkm,
  onDeleteUmkm,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UmkmItem | null>(null);
  const [viewingItem, setViewingItem] = useState<UmkmItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Form State matching Figma modal
  const [formData, setFormData] = useState({
    nama_produk: '',
    kategori: 'Kerajinan Tangan' as UmkmItem['kategori'],
    harga: 150000,
    stok: 10,
    deskripsi: '',
    foto: defaultUmkmImg,
    mitra_pengrajin: 'Sentra Pengrajin Lokal Cirebon',
    desa_asal: 'Desa Trusmi',
    kode_sku: 'CRB-PRD-01',
    status_stok: 'Tersedia' as UmkmItem['status_stok'],
  });

  // Calculate metrics
  const totalProducts = umkmList.length;
  const lowStockCount = umkmList.filter(p => p.stok <= 10).length;
  const categoriesCount = 5;
  const ordersCount = 12;

  const filteredList = umkmList.filter(item => 
    item.nama_produk.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddForm = () => {
    setFormData({
      nama_produk: '',
      kategori: 'Kerajinan Tangan',
      harga: 100000,
      stok: 10,
      deskripsi: '',
      foto: defaultUmkmImg,
      mitra_pengrajin: 'Pengrajin Lokal Cirebon',
      desa_asal: 'Desa Binaan Cirebon',
      kode_sku: `CRB-${Math.floor(100 + Math.random() * 900)}`,
      status_stok: 'Tersedia',
    });
    setEditingItem(null);
    setIsFormOpen(true);
    setTimeout(() => {
      document.getElementById('form-produk-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const openEditForm = (item: UmkmItem) => {
    setEditingItem(item);
    setFormData({
      nama_produk: item.nama_produk,
      kategori: item.kategori,
      harga: item.harga,
      stok: item.stok,
      deskripsi: item.deskripsi,
      foto: item.foto,
      mitra_pengrajin: item.mitra_pengrajin,
      desa_asal: item.desa_asal,
      kode_sku: item.kode_sku,
      status_stok: item.status_stok,
    });
    setIsFormOpen(true);
    setTimeout(() => {
      document.getElementById('form-produk-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_produk.trim()) return;

    let statusStok: UmkmItem['status_stok'] = 'Tersedia';
    if (formData.stok <= 0) statusStok = 'Habis';
    else if (formData.stok <= 4) statusStok = 'Kritis';
    else if (formData.stok <= 10) statusStok = 'Stok Menipis';

    if (editingItem) {
      onUpdateUmkm({
        ...editingItem,
        ...formData,
        status_stok: statusStok,
      });
    } else {
      onAddUmkm({
        ...formData,
        status_stok: statusStok,
      });
    }
    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards matching Image 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Produk */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Total Produk</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                {totalProducts}
              </div>
            </div>
          </div>
          <span className="w-7 h-7 rounded-full bg-cyan-600 text-white text-xs font-bold flex items-center justify-center">
            {totalProducts}
          </span>
        </div>

        {/* 2. Stok Menipis */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <ArrowDownCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Stok Menipis</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                {lowStockCount}
              </div>
            </div>
          </div>
          <span className="w-7 h-7 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center">
            {lowStockCount}
          </span>
        </div>

        {/* 3. Kategori */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Kategori</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                {categoriesCount}
              </div>
            </div>
          </div>
          <span className="w-7 h-7 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
            {categoriesCount}
          </span>
        </div>

        {/* 4. Pesanan */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Pesanan</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                {ordersCount}
              </div>
            </div>
          </div>
          <span className="w-7 h-7 rounded-full bg-indigo-700 text-white text-xs font-bold flex items-center justify-center">
            {ordersCount}
          </span>
        </div>
      </div>

      {/* FORMULIR TAMBAH / EDIT PRODUK (SATU HALAMAN TERPADU) */}
      {isFormOpen && (
        <div id="form-produk-section" className="bg-white rounded-xl border-2 border-[#014B35]/20 shadow-md p-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#014B35] flex items-center justify-center font-bold">
                {editingItem ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingItem ? `Edit Produk: ${editingItem.nama_produk}` : 'Formulir Tambah Produk Baru'}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingItem 
                    ? 'Perbarui rincian harga, stok, atau deskripsi produk ini langsung di halaman yang sama.' 
                    : 'Daftarkan produk kerajinan atau kuliner khas desa wisata ke katalog secara instan.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                setEditingItem(null);
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              title="Tutup Formulir"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Produk *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Batik Mega Mendung Trusmi"
                  value={formData.nama_produk}
                  onChange={(e) => setFormData({ ...formData, nama_produk: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35] text-xs bg-slate-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilih Kategori *
                </label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35] bg-white text-xs cursor-pointer"
                >
                  <option value="Kerajinan Tangan">Kerajinan Tangan</option>
                  <option value="Kuliner Khas">Kuliner Khas</option>
                  <option value="Batik Cirebon">Batik Cirebon</option>
                  <option value="Aksesoris">Aksesoris</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Harga Satuan (Rp) * <span className="text-[10px] text-slate-400 font-normal">(isi manual)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 select-none">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="0"
                    value={formData.harga === 0 ? '' : formData.harga.toLocaleString('id-ID')}
                    onChange={(e) => {
                      const rawDigits = e.target.value.replace(/[^0-9]/g, '');
                      const parsed = rawDigits === '' ? 0 : Math.max(0, parseInt(rawDigits, 10));
                      setFormData({ ...formData, harga: parsed });
                    }}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35] text-xs font-bold text-slate-800 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Stok Tersedia (Unit) * <span className="text-[10px] text-slate-400 font-normal">(isi manual)</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  placeholder="0"
                  value={formData.stok === 0 ? '' : formData.stok.toLocaleString('id-ID')}
                  onChange={(e) => {
                    const rawDigits = e.target.value.replace(/[^0-9]/g, '');
                    const parsed = rawDigits === '' ? 0 : Math.max(0, parseInt(rawDigits, 10));
                    setFormData({ ...formData, stok: parsed });
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35] text-xs font-bold text-slate-800 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mitra Pengrajin / Produsen
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Sentra Batik Trusmi"
                  value={formData.mitra_pengrajin}
                  onChange={(e) => setFormData({ ...formData, mitra_pengrajin: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35] text-xs bg-slate-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Desa Asal
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Desa Trusmi Kulon"
                  value={formData.desa_asal}
                  onChange={(e) => setFormData({ ...formData, desa_asal: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35] text-xs bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Deskripsi Lengkap Produk *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Jelaskan karakteristik motif, bahan, proses produksi atau sejarah kerajinan..."
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35] text-xs bg-slate-50/50 focus:bg-white"
              />
            </div>

            <ImageUploadSelector
              label="Foto / Gambar Produk"
              value={formData.foto}
              onChange={(url) => setFormData({ ...formData, foto: url })}
              placeholder="URL gambar atau /assets/aistudio/..."
              required
            />

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingItem(null);
                }}
                className="px-5 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-[#014B35] hover:bg-[#003827] text-white font-bold shadow-xs transition cursor-pointer inline-flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{editingItem ? 'Simpan Perubahan' : 'Simpan Produk Baru'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Table Card matching Image 1 */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Card Header with "Daftar & Kelola Produk" and "+ Tambah Produk" */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Daftar &amp; Kelola Produk
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola inventaris UMKM Cirebon dan tambahkan produk baru langsung di halaman ini.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <ReportExportButton
              label="Unduh Laporan UMKM"
              onExport={(format) => exportUmkmReport(umkmList, format)}
            />

            <button
              type="button"
              onClick={() => {
                if (isFormOpen && !editingItem) {
                  setIsFormOpen(false);
                } else {
                  openAddForm();
                }
              }}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold shadow-xs transition cursor-pointer shrink-0 ${
                isFormOpen && !editingItem
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  : 'bg-[#014B35] hover:bg-[#003827] text-white'
              }`}
            >
              {isFormOpen && !editingItem ? (
                <>
                  <X className="w-4 h-4" />
                  <span>Tutup Formulir</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Tambah Produk</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Toolbar */}
        <div className="px-5 py-3 border-b border-slate-100 flex justify-end">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-[#014B35]"
            />
            <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4 w-20">Gambar</th>
                <th className="py-3.5 px-4">Nama Produk</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Harga</th>
                <th className="py-3.5 px-4">Stok</th>
                <th className="py-3.5 px-4 text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 text-center text-slate-500 font-medium">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4">
                    <img
                      src={item.foto}
                      alt=""
                      className="w-10 h-10 rounded-md object-cover border border-slate-100"
                    />
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {item.nama_produk}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {item.kategori}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    Rp {item.harga.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">
                    {item.stok}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Green Edit Button */}
                      <button
                        type="button"
                        onClick={() => openEditForm(item)}
                        className="w-7 h-7 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition cursor-pointer"
                        title="Edit Produk"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {/* Blue View Button */}
                      <button
                        type="button"
                        onClick={() => setViewingItem(item)}
                        className="w-7 h-7 rounded-md bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center transition cursor-pointer"
                        title="Lihat Detail"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Red Delete Button */}
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="w-7 h-7 rounded-md bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition cursor-pointer"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL VIEW DETAIL PRODUK */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setViewingItem(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <img src={viewingItem.foto} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#014B35] block">
                {viewingItem.kategori} &bull; SKU: {viewingItem.kode_sku}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {viewingItem.nama_produk}
              </h3>
              <div className="text-lg font-black text-slate-900 mt-1">
                Rp {viewingItem.harga.toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {viewingItem.deskripsi}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 text-xs text-slate-600 space-y-1">
              <div>Sisa Stok: <strong className="text-slate-900">{viewingItem.stok} pcs</strong></div>
              <div>Mitra: <strong className="text-slate-900">{viewingItem.mitra_pengrajin}</strong> ({viewingItem.desa_asal})</div>
            </div>
            <button
              type="button"
              onClick={() => setViewingItem(null)}
              className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full p-6 text-center space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Hapus Produk</h4>
            <p className="text-xs text-slate-500">
              Apakah Anda yakin ingin menghapus produk ini dari daftar?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteUmkm(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-lg text-xs font-bold"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
