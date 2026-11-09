import React, { useState } from 'react';
import { 
  Landmark, 
  Ticket, 
  Download, 
  Plus, 
  Search, 
  RotateCw, 
  Eye, 
  PenSquare, 
  Trash2, 
  X, 
  TrendingUp, 
  PieChart, 
  QrCode,
  MapPin,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { WisataItem } from '../types';
import { ReportExportButton } from './ReportExportButton';
import { exportWisataReport } from '../utils/reportExport';
import { ImageUploadSelector } from './ImageUploadSelector';
import defaultWisataImg from '../assets/images/keraton_kasepuhan_1793582503627.jpg';

interface AdminWisataProps {
  wisataList: WisataItem[];
  onAddWisata: (item: Omit<WisataItem, 'id' | 'rating' | 'ulasan_count'>) => void;
  onUpdateWisata: (item: WisataItem) => void;
  onDeleteWisata: (id: number) => void;
}

export const AdminWisata: React.FC<AdminWisataProps> = ({
  wisataList,
  onAddWisata,
  onUpdateWisata,
  onDeleteWisata,
}) => {
  const [searchTable, setSearchTable] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingWisata, setEditingWisata] = useState<WisataItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Add/Edit Form State
  const [formData, setFormData] = useState({
    nama_wisata: '',
    kategori: 'Keraton & Sejarah' as WisataItem['kategori'],
    harga_tiket: 20000,
    deskripsi: '',
    kuota_harian: 500,
    kuota_terisi: 120,
    foto: defaultWisataImg,
    lokasi: 'Jl. Kasepuhan No. 43, Lemahwungkuk',
    jam_buka: '08:00 - 17:00 WIB',
    fasilitas: 'Pemandu Lokal, Museum Pusaka, Parkir Luas, Musholla, Spot Foto',
    status_operasional: 'Buka (Aktif)' as WisataItem['status_operasional'],
  });

  const filteredWisata = wisataList.filter((w) => {
    const matchSearch = w.nama_wisata.toLowerCase().includes(searchTable.toLowerCase()) ||
                        w.deskripsi.toLowerCase().includes(searchTable.toLowerCase()) ||
                        w.lokasi.toLowerCase().includes(searchTable.toLowerCase());
    const matchCat = !filterKategori || w.kategori === filterKategori;
    const matchStatus = !filterStatus || w.status_operasional === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const openAddModal = () => {
    setFormData({
      nama_wisata: '',
      kategori: 'Keraton & Sejarah',
      harga_tiket: 20000,
      deskripsi: '',
      kuota_harian: 500,
      kuota_terisi: 0,
      foto: defaultWisataImg,
      lokasi: 'Cirebon, Jawa Barat',
      jam_buka: '08:00 - 17:00 WIB',
      fasilitas: 'Pemandu Lokal, Parkir, Musholla, Spot Foto',
      status_operasional: 'Buka (Aktif)',
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (w: WisataItem) => {
    setEditingWisata(w);
    setFormData({
      nama_wisata: w.nama_wisata,
      kategori: w.kategori,
      harga_tiket: w.harga_tiket,
      deskripsi: w.deskripsi,
      kuota_harian: w.kuota_harian,
      kuota_terisi: w.kuota_terisi,
      foto: w.foto,
      lokasi: w.lokasi,
      jam_buka: w.jam_buka,
      fasilitas: w.fasilitas,
      status_operasional: w.status_operasional,
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWisata) {
      onUpdateWisata({
        ...editingWisata,
        ...formData,
      });
      setEditingWisata(null);
    } else {
      onAddWisata(formData);
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-400">Admin Portal / Wisata &amp; Tiket Spot Rekreasi</span>
          <h1 className="text-2xl font-black text-[#002B36] tracking-tight">
            Manajemen Destinasi Wisata &amp; Tiket Rekreasi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pusat kendali master inventaris daya tarik kebudayaan, kuota pengunjung real-time, dan tata kelola e-ticketing Cirebon.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ReportExportButton
            label="Unduh Laporan Wisata"
            onExport={(format) => exportWisataReport(wisataList, format)}
          />
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#024B35] hover:bg-[#013726] text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Destinasi Baru</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards Wisata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Destinasi Wisata</span>
            <div className="text-2xl font-black text-[#002B36] mt-0.5">
              18 <span className="text-xs font-semibold text-slate-500">Spot Budaya</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +2 spot baru bulan ini
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#004C6D] flex items-center justify-center">
            <Landmark className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tiket Terjual Hari Ini</span>
            <div className="text-2xl font-black text-[#002B36] mt-0.5">
              142 <span className="text-xs font-semibold text-slate-500">Tiket Terverifikasi</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Update gerbang: 8 menit lalu
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pendapatan Tiket (Bulan Ini)</span>
            <div className="text-2xl font-black text-[#002B36] mt-0.5">
              Rp 28.450.000
            </div>
            <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12.8% dari target bulanan
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kapasitas Kuota Harian</span>
            <div className="text-2xl font-black text-[#002B36] mt-0.5">
              85% <span className="text-xs font-semibold text-slate-500">Rata-rata Terisi</span>
            </div>
            <span className="text-[11px] font-bold text-[#004C6D] mt-1 block">
              Terpantau Lancar &amp; Aman
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <PieChart className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#002B36] flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#004C6D]" />
              <span>Katalog Master Daya Tarik Wisata &amp; Loket Masuk</span>
            </h3>
            <p className="text-xs text-slate-500">
              Pembaruan status operasional, harga tiket masuk (HTM), dan kontrol kuota pintu gerbang.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-[#024B35] hover:bg-[#013726] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Destinasi Baru</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama destinasi, sejarah, atau wilayah cagar budaya..."
              value={searchTable}
              onChange={(e) => setSearchTable(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white text-xs rounded-lg border border-slate-200 outline-none focus:border-[#004C6D]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="">Semua Kategori</option>
              <option value="Keraton & Sejarah">Keraton &amp; Sejarah</option>
              <option value="Situs Cagar Budaya">Situs Cagar Budaya</option>
              <option value="Wisata Religi">Wisata Religi</option>
              <option value="Wisata Alam & Rekreasi">Wisata Alam &amp; Rekreasi</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="">Semua Status</option>
              <option value="Buka (Aktif)">Buka (Aktif)</option>
              <option value="Pemeliharaan Spot">Pemeliharaan Spot</option>
              <option value="Tutup Sementara">Tutup Sementara</option>
            </select>

            <button
              onClick={() => { setSearchTable(''); setFilterKategori(''); setFilterStatus(''); }}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-[#004C6D] transition"
              title="Refresh"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/60 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">NO</th>
                <th className="py-3 px-4 w-20">FOTO SPOT</th>
                <th className="py-3 px-4">NAMA DESTINASI WISATA</th>
                <th className="py-3 px-4">KATEGORI KEBUDAYAAN</th>
                <th className="py-3 px-4">HARGA TIKET (HTM)</th>
                <th className="py-3 px-4 w-44">KUOTA HARIAN</th>
                <th className="py-3 px-4">STATUS OPERASIONAL</th>
                <th className="py-3 px-4 text-center w-28">AKSI CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWisata.map((row, index) => {
                const percent = Math.round((row.kuota_terisi / row.kuota_harian) * 100);
                return (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 text-center font-bold text-slate-400">{index + 1}</td>
                    <td className="py-3 px-4">
                      <img src={row.foto} alt="" className="w-12 h-9 rounded-md object-cover shadow-2xs" />
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-slate-900 block font-bold text-xs">{row.nama_wisata}</strong>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5" /> {row.lokasi}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-[#004C6D]">
                        {row.kategori}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {row.harga_tiket > 0 ? (
                        <div>
                          <strong className="text-slate-900 font-black">
                            Rp {row.harga_tiket.toLocaleString('id-ID')}
                          </strong>
                          <span className="text-[10px] text-slate-400 block">/ orang (Domestik)</span>
                        </div>
                      ) : (
                        <div>
                          <strong className="text-emerald-700 font-black">Infaq Sukarela</strong>
                          <span className="text-[10px] text-slate-400 block">Bebas HTM Resmi</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <strong>{row.kuota_terisi} / {row.kuota_harian}</strong>
                          <span className="text-slate-500 font-semibold">{percent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${percent > 80 ? 'bg-amber-500' : 'bg-[#004C6D]'}`}
                            style={{ width: `${Math.min(100, percent)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {row.status_operasional === 'Buka (Aktif)' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Buka (Aktif)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          {row.status_operasional}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(row)}
                          className="w-7 h-7 rounded-lg border border-slate-200 hover:border-amber-500 text-slate-600 hover:text-amber-600 flex items-center justify-center transition"
                          title="Edit Data"
                        >
                          <PenSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(row.id)}
                          className="w-7 h-7 rounded-lg border border-slate-200 hover:border-red-500 text-slate-600 hover:text-red-600 flex items-center justify-center transition"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer pagination */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan 1 - {filteredWisata.length} dari {wisataList.length} destinasi cagar budaya Cirebon</span>
          <div className="flex gap-1.5">
            <button className="px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-400">&laquo; Sebelumnya</button>
            <button className="px-2.5 py-1 rounded-md bg-[#024B35] text-white font-bold">1</button>
            <button className="px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-600">2</button>
            <button className="px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-600">Selanjutnya &raquo;</button>
          </div>
        </div>
      </div>

      {/* Bottom Widgets (Ticket Scan Logs & Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Validasi Tiket Real-Time */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#004C6D] flex items-center justify-center">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#002B36]">Validasi Tiket Pintu Masuk Real-Time</h4>
                <p className="text-[10px] text-slate-400">Aktivitas pemindaian e-tiket gerbang masuk destinasi</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-teal-50 text-[#004C6D] px-2 py-0.5 rounded-full">
              5 Scan Terakhir
            </span>
          </div>

          <div className="space-y-2">
            {[
              { code: 'TKT-CRB-202505-0912', spot: 'Keraton Kasepuhan', pax: '2 Tiket Dewasa', price: 'Rp 40.000', time: '13:42 WIB', active: true },
              { code: 'TKT-CRB-202505-0911', spot: 'Taman Air Gua Sunyaragi', pax: '4 Tiket Terusan', price: 'Rp 60.000', time: '13:38 WIB', active: true },
              { code: 'TKT-CRB-202505-0910', spot: 'Keraton Kanoman', pax: '1 Tiket Pelajar', price: 'Rp 10.000', time: '13:25 WIB', active: false },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${log.active ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <div>
                    <strong className="text-slate-800 font-mono block text-xs">{log.code}</strong>
                    <span className="text-[10px] text-slate-400">{log.spot} &bull; {log.pax}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#002B36]">{log.price}</div>
                  <span className="text-[10px] text-slate-400">{log.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
            <span>Sistem terintegrasi gerbang turnstile otomatis IoT</span>
            <span className="text-[#004C6D] font-bold cursor-pointer hover:underline">Lihat Semua Log Transaksi &rarr;</span>
          </div>
        </div>

        {/* Proporsi Kunjungan Chart */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#002B36]">Proporsi Kunjungan</h4>
              <p className="text-[10px] text-slate-400">Berdasarkan kategori wisata</p>
            </div>
          </div>

          <div className="flex items-center gap-6 py-2">
            {/* Mock CSS Conic Donut */}
            <div className="relative w-28 h-28 rounded-full bg-[conic-gradient(#004C6D_0%_52%,#D97706_52%_80%,#059669_80%_100%)] flex items-center justify-center shrink-0 shadow-inner">
              <div className="w-16 h-16 rounded-full bg-white flex flex-col items-center justify-center shadow-xs">
                <span className="text-xs font-black text-[#002B36]">1.6k</span>
                <span className="text-[8px] text-slate-400">Wisatawan</span>
              </div>
            </div>

            <div className="space-y-2 flex-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-[#004C6D]"></span> Keraton &amp; Sejarah</span>
                <strong>52%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-[#D97706]"></span> Situs Cagar Budaya</span>
                <strong>28%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-[#059669]"></span> Wisata Religi &amp; Alam</span>
                <strong>20%</strong>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800 font-semibold flex items-center justify-between">
            <span>Retribusi PAD Cirebon</span>
            <strong className="text-emerald-950 font-black">Tercapai 94.2%</strong>
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH / EDIT DESTINASI */}
      {(isAddModalOpen || editingWisata) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setIsAddModalOpen(false); setEditingWisata(null); }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-[#002B36] mb-1">
              {editingWisata ? 'Edit Destinasi Wisata' : 'Tambah Destinasi Wisata Baru'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Kelola Master Objek Cagar Budaya &bull; Sistem Inventaris Destinasi Pariwisata Cirebon
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Destinasi</label>
                  <input
                    type="text"
                    value={formData.nama_wisata}
                    onChange={(e) => setFormData({ ...formData, nama_wisata: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="Keraton & Sejarah">Keraton &amp; Sejarah</option>
                    <option value="Situs Cagar Budaya">Situs Cagar Budaya</option>
                    <option value="Wisata Religi">Wisata Religi</option>
                    <option value="Wisata Alam & Rekreasi">Wisata Alam &amp; Rekreasi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    HTM Tiket (Rp) <span className="text-[10px] text-slate-400 font-normal">(isi manual)</span>
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
                      value={formData.harga_tiket === 0 ? '' : formData.harga_tiket.toLocaleString('id-ID')}
                      onChange={(e) => {
                        const rawDigits = e.target.value.replace(/[^0-9]/g, '');
                        const parsed = rawDigits === '' ? 0 : Math.max(0, parseInt(rawDigits, 10));
                        setFormData({ ...formData, harga_tiket: parsed });
                      }}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-[#014B35] bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kuota Harian <span className="text-[10px] text-slate-400 font-normal">(orang)</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="100"
                    value={formData.kuota_harian === 0 ? '' : formData.kuota_harian.toLocaleString('id-ID')}
                    onChange={(e) => {
                      const rawDigits = e.target.value.replace(/[^0-9]/g, '');
                      const parsed = rawDigits === '' ? 0 : Math.max(0, parseInt(rawDigits, 10));
                      setFormData({ ...formData, kuota_harian: parsed });
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-[#014B35] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Operasional</label>
                  <select
                    value={formData.status_operasional}
                    onChange={(e) => setFormData({ ...formData, status_operasional: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="Buka (Aktif)">Buka (Aktif)</option>
                    <option value="Pemeliharaan Spot">Pemeliharaan Spot</option>
                    <option value="Tutup Sementara">Tutup Sementara</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat / Lokasi Lengkap</label>
                <input
                  type="text"
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Sejarah &amp; Daya Tarik</label>
                <textarea
                  rows={3}
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <ImageUploadSelector
                label="Foto Objek Wisata"
                value={formData.foto}
                onChange={(url) => setFormData({ ...formData, foto: url })}
                placeholder="URL foto atau /assets/aistudio/..."
                required
              />

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingWisata(null); }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#024B35] hover:bg-[#013726] text-white py-2.5 rounded-xl text-xs font-bold shadow-xs"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#002B36]">Konfirmasi Hapus</h4>
            <p className="text-xs text-slate-500">
              Apakah Anda yakin ingin menghapus destinasi wisata ini? Data yang terhapus tidak dapat dipulihkan.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeleteWisata(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl text-xs font-bold"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
