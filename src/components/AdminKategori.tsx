import React, { useState } from 'react';
import { 
  FolderTree, 
  Package, 
  Landmark, 
  Home as HomeIcon, 
  Plus, 
  Search, 
  ArrowRight, 
  Pencil, 
  Trash2, 
  X, 
  CheckCircle2, 
  ShoppingBag,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { UmkmItem, WisataItem, HomestayItem } from '../types';
import { STORAGE_KEYS, loadStoredData, saveStoredData } from '../utils/storage';
import { saveModuleToServer } from '../utils/apiSync';

interface CategoryData {
  id: string;
  nama: string;
  tipe: 'umkm' | 'wisata' | 'homestay';
  deskripsi: string;
  warna: string;
  ikon: string;
}

const initialCategories: CategoryData[] = [
  // UMKM Categories
  {
    id: 'cat-umkm-1',
    nama: 'Batik Cirebon',
    tipe: 'umkm',
    deskripsi: 'Motif batik khas pesisir Trusmi, motif legendaris Mega Mendung, Paksi Naga Liman, dan Singa Barong.',
    warna: 'bg-emerald-500',
    ikon: 'Package'
  },
  {
    id: 'cat-umkm-2',
    nama: 'Kuliner Khas',
    tipe: 'umkm',
    deskripsi: 'Olahan makanan dan santapan legendaris Cirebon: Empal Gentong, Nasi Jamblang, Tahu Gejrot, Docang, Mie Koclok, dan Kue Apem.',
    warna: 'bg-amber-500',
    ikon: 'ShoppingBag'
  },
  {
    id: 'cat-umkm-3',
    nama: 'Kerajinan Tangan',
    tipe: 'umkm',
    deskripsi: 'Karya seni ukir kayu klasik, topeng tari Cirebon karakter lima wanda, dan lukisan kaca tradisional.',
    warna: 'bg-teal-500',
    ikon: 'Package'
  },
  {
    id: 'cat-umkm-4',
    nama: 'Aksesoris',
    tipe: 'umkm',
    deskripsi: 'Cinderamata lokal, blangkon motif batik Cirebon, gantungan kunci topeng, dan pernak-pernik kerang pesisir.',
    warna: 'bg-indigo-500',
    ikon: 'Package'
  },

  // Wisata Categories
  {
    id: 'cat-wisata-1',
    nama: 'Keraton & Sejarah',
    tipe: 'wisata',
    deskripsi: 'Istana kesultanan Cirebon bersejarah: Keraton Kasepuhan, Keraton Kanoman, dan Keraton Kacirebonan.',
    warna: 'bg-blue-600',
    ikon: 'Landmark'
  },
  {
    id: 'cat-wisata-2',
    nama: 'Situs Cagar Budaya',
    tipe: 'wisata',
    deskripsi: 'Situs arsitektur cagar budaya seperti labirin Taman Air Gua Sunyaragi dan gerbang bata merah peninggalan purba.',
    warna: 'bg-amber-600',
    ikon: 'Landmark'
  },
  {
    id: 'cat-wisata-3',
    nama: 'Wisata Religi',
    tipe: 'wisata',
    deskripsi: 'Ziarah makam wali sanga Syekh Syarif Hidayatullah (Sunan Gunung Jati) dan masjid bata merah kuno Panjunan.',
    warna: 'bg-emerald-600',
    ikon: 'Landmark'
  },
  {
    id: 'cat-wisata-4',
    nama: 'Wisata Alam & Rekreasi',
    tipe: 'wisata',
    deskripsi: 'Keindahan alam hutan lindung kera Plangon, pesona Danau Setu Patok, dan rekreasi pesisir pantai.',
    warna: 'bg-cyan-600',
    ikon: 'Landmark'
  },

  // Homestay Categories
  {
    id: 'cat-home-1',
    nama: 'Hotel',
    tipe: 'homestay',
    deskripsi: 'Hotel berbintang dan resort modern dengan fasilitas kolam renang, restoran buffet, dan konvensi di Cirebon.',
    warna: 'bg-violet-600',
    ikon: 'HomeIcon'
  },
  {
    id: 'cat-home-2',
    nama: 'Homestay',
    tipe: 'homestay',
    deskripsi: 'Hunian ramah kemitraan warga desa wisata bernuansa kekeluargaan dan sarapan khas otentik.',
    warna: 'bg-emerald-600',
    ikon: 'HomeIcon'
  },
  {
    id: 'cat-home-3',
    nama: 'Guest House',
    tipe: 'homestay',
    deskripsi: 'Penginapan sewa rumah privat bagi rombongan wisatawan dan keluarga dekat kawasan keraton.',
    warna: 'bg-amber-600',
    ikon: 'HomeIcon'
  }
];

interface AdminKategoriProps {
  umkmList: UmkmItem[];
  wisataList: WisataItem[];
  homestayList: HomestayItem[];
  onNavigate: (view: string) => void;
  onToast: (msg: string) => void;
}

export const AdminKategori: React.FC<AdminKategoriProps> = ({
  umkmList,
  wisataList,
  homestayList,
  onNavigate,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'umkm' | 'wisata' | 'homestay'>('umkm');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<CategoryData[]>(() =>
    loadStoredData(STORAGE_KEYS.CATEGORIES, initialCategories)
  );

  // Auto-sync categories changes to local storage and server
  const persistCategories = (updated: CategoryData[]) => {
    setCategories(updated);
    saveStoredData(STORAGE_KEYS.CATEGORIES, updated);
    saveModuleToServer('categories', updated);
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [formNama, setFormNama] = useState('');
  const [formTipe, setFormTipe] = useState<'umkm' | 'wisata' | 'homestay'>('umkm');
  const [formDeskripsi, setFormDeskripsi] = useState('');
  const [formWarna, setFormWarna] = useState('bg-emerald-600');

  // Counts
  const getItemCount = (cat: CategoryData) => {
    if (cat.tipe === 'umkm') {
      return umkmList.filter(u => u.kategori?.trim().toLowerCase() === cat.nama.trim().toLowerCase()).length;
    }
    if (cat.tipe === 'wisata') {
      return wisataList.filter(w => w.kategori?.trim().toLowerCase() === cat.nama.trim().toLowerCase()).length;
    }
    if (cat.tipe === 'homestay') {
      return homestayList.filter(h => (h.kategori || 'Homestay').trim().toLowerCase() === cat.nama.trim().toLowerCase()).length;
    }
    return 0;
  };

  const getItemPreviews = (cat: CategoryData) => {
    if (cat.tipe === 'umkm') {
      return umkmList.filter(u => u.kategori?.trim().toLowerCase() === cat.nama.trim().toLowerCase()).slice(0, 3);
    }
    if (cat.tipe === 'wisata') {
      return wisataList.filter(w => w.kategori?.trim().toLowerCase() === cat.nama.trim().toLowerCase()).slice(0, 3);
    }
    if (cat.tipe === 'homestay') {
      return homestayList.filter(h => (h.kategori || 'Homestay').trim().toLowerCase() === cat.nama.trim().toLowerCase()).slice(0, 3);
    }
    return [];
  };

  const filteredCategories = categories
    .filter(c => c.tipe === activeTab)
    .filter(c => 
      c.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const openAddModal = () => {
    setEditingCategory(null);
    setFormNama('');
    setFormTipe(activeTab);
    setFormDeskripsi('');
    setFormWarna('bg-emerald-600');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryData) => {
    setEditingCategory(cat);
    setFormNama(cat.nama);
    setFormTipe(cat.tipe);
    setFormDeskripsi(cat.deskripsi);
    setFormWarna(cat.warna);
    setIsModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim()) {
      onToast('Silakan isi nama kategori.');
      return;
    }

    if (editingCategory) {
      const updated = categories.map(c => 
        c.id === editingCategory.id 
          ? { ...c, nama: formNama.trim(), tipe: formTipe, deskripsi: formDeskripsi.trim(), warna: formWarna }
          : c
      );
      persistCategories(updated);
      onToast(`Kategori "${formNama}" berhasil diperbarui!`);
    } else {
      const newCat: CategoryData = {
        id: `cat-${Date.now()}`,
        nama: formNama.trim(),
        tipe: formTipe,
        deskripsi: formDeskripsi.trim() || 'Kategori baru dalam portal CirebonKita.',
        warna: formWarna,
        ikon: formTipe === 'umkm' ? 'Package' : formTipe === 'wisata' ? 'Landmark' : 'HomeIcon'
      };
      const updated = [newCat, ...categories];
      persistCategories(updated);
      onToast(`Kategori baru "${formNama}" berhasil ditambahkan!`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteCategory = (id: string, nama: string) => {
    if (categories.filter(c => c.tipe === activeTab).length <= 1) {
      onToast('Setidaknya harus menyisakan 1 kategori aktif.');
      return;
    }
    const updated = categories.filter(c => c.id !== id);
    persistCategories(updated);
    onToast(`Kategori "${nama}" berhasil dihapus.`);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-400">Admin Panel / Master Data</span>
          <h1 className="text-2xl font-black text-[#002B36] tracking-tight flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-emerald-600" />
            <span>Manajemen Kategori Portal</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola klasifikasi etalase UMKM, zona destinasi cagar budaya, dan tipe penginapan desa Cirebon.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#014B35] hover:bg-[#003827] text-white text-xs font-bold shadow-xs cursor-pointer transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kategori Baru</span>
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setActiveTab('umkm')}
          className={`p-5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
            activeTab === 'umkm' 
              ? 'bg-emerald-50/60 border-emerald-300 shadow-xs' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kategori Produk UMKM</span>
            <div className="text-2xl font-black text-[#002B36] mt-0.5">
              {categories.filter(c => c.tipe === 'umkm').length} <span className="text-xs font-semibold text-slate-500">Klasifikasi</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-bold mt-1 block">
              Total {umkmList.length} Produk Terhubung
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100/70 text-[#014B35] flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('wisata')}
          className={`p-5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
            activeTab === 'wisata' 
              ? 'bg-blue-50/60 border-blue-300 shadow-xs' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kategori Destinasi Wisata</span>
            <div className="text-2xl font-black text-[#002B36] mt-0.5">
              {categories.filter(c => c.tipe === 'wisata').length} <span className="text-xs font-semibold text-slate-500">Zona Wisata</span>
            </div>
            <span className="text-[11px] text-blue-700 font-bold mt-1 block">
              Total {wisataList.length} Spot Terdaftar
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center font-bold">
            <Landmark className="w-6 h-6" />
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('homestay')}
          className={`p-5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
            activeTab === 'homestay' 
              ? 'bg-amber-50/60 border-amber-300 shadow-xs' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kategori Akomodasi</span>
            <div className="text-2xl font-black text-[#002B36] mt-0.5">
              {categories.filter(c => c.tipe === 'homestay').length} <span className="text-xs font-semibold text-slate-500">Tipe Akomodasi</span>
            </div>
            <span className="text-[11px] text-amber-700 font-bold mt-1 block">
              Total {homestayList.length} Mitra Unit
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center font-bold">
            <HomeIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Tabs and Search */}
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('umkm')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'umkm'
                  ? 'bg-[#014B35] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Produk UMKM ({categories.filter(c => c.tipe === 'umkm').length})</span>
            </button>

            <button
              onClick={() => setActiveTab('wisata')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'wisata'
                  ? 'bg-[#014B35] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Destinasi Wisata ({categories.filter(c => c.tipe === 'wisata').length})</span>
            </button>

            <button
              onClick={() => setActiveTab('homestay')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'homestay'
                  ? 'bg-[#014B35] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <HomeIcon className="w-3.5 h-3.5" />
              <span>Homestay &amp; Akomodasi ({categories.filter(c => c.tipe === 'homestay').length})</span>
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#014B35] focus:bg-white transition"
            />
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCategories.map((cat) => {
            const count = getItemCount(cat);
            const previews = getItemPreviews(cat);

            return (
              <div 
                key={cat.id} 
                className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition bg-white flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl ${cat.warna} text-white flex items-center justify-center font-bold text-xs shadow-2xs`}>
                        {cat.tipe === 'umkm' ? <Package className="w-4 h-4" /> : cat.tipe === 'wisata' ? <Landmark className="w-4 h-4" /> : <HomeIcon className="w-4 h-4" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                          {cat.nama}
                        </h3>
                        <span className="text-[11px] text-emerald-700 font-semibold">
                          {count} {cat.tipe === 'umkm' ? 'Produk' : cat.tipe === 'wisata' ? 'Destinasi' : 'Unit'} Terdaftar
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 text-slate-400 hover:text-[#014B35] hover:bg-slate-100 rounded-lg transition cursor-pointer"
                        title="Edit Kategori"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id, cat.nama)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                    {cat.deskripsi}
                  </p>

                  {/* Previews */}
                  {previews.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 tracking-wider">
                        Sampel Item Terkait:
                      </span>
                      <div className="flex items-center gap-2">
                        {previews.map((item: any) => (
                          <div 
                            key={item.id} 
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-medium truncate max-w-[140px]"
                            title={item.nama_produk || item.nama_wisata || item.nama_homestay}
                          >
                            <span className="truncate">
                              {item.nama_produk || item.nama_wisata || item.nama_homestay}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Aktif di katalog publik
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (cat.tipe === 'umkm') onNavigate('admin-umkm');
                      else if (cat.tipe === 'wisata') onNavigate('admin-wisata');
                      else onNavigate('admin-homestay');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#014B35] hover:underline cursor-pointer"
                  >
                    <span>Buka Data {cat.tipe.toUpperCase()}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Tambah / Edit Kategori */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#014B35] flex items-center justify-center font-bold">
                  <FolderTree className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sistem Klasifikasi Portal Desa Wisata CirebonKita
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Kategori *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kuliner Tradisional"
                    value={formNama}
                    onChange={(e) => setFormNama(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#014B35]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tipe Kategori
                  </label>
                  <select
                    value={formTipe}
                    onChange={(e) => setFormTipe(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#014B35] bg-white font-semibold text-slate-800"
                  >
                    <option value="umkm">Produk UMKM</option>
                    <option value="wisata">Destinasi Wisata</option>
                    <option value="homestay">Homestay &amp; Akomodasi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Deskripsi Kategori
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Jelaskan jenis produk, daya tarik budaya, atau akomodasi yang tergolong dalam kategori ini..."
                    value={formDeskripsi}
                    onChange={(e) => setFormDeskripsi(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#014B35]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#014B35] hover:bg-[#003827] text-white font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editingCategory ? 'Simpan Perubahan' : 'Tambahkan Kategori'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
