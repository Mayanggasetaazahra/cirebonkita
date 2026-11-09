import React, { useState } from 'react';
import { 
  Home as HomeIcon, 
  Download, 
  Plus, 
  Search, 
  Calendar, 
  Star, 
  CheckCircle2, 
  PenSquare, 
  X, 
  RotateCcw,
  Check, 
  MessageSquare,
  Bed,
  TrendingUp,
  MapPin,
  Clock,
  Eye,
  XCircle,
  Trash2
} from 'lucide-react';
import { HomestayItem, BookingItem, UlasanItem } from '../types';
import { ReportExportButton } from './ReportExportButton';
import { exportHomestayReport } from '../utils/reportExport';
import { ImageUploadSelector } from './ImageUploadSelector';
import defaultHomestayImg from '../assets/images/homestay_joglo_cirebon_1793582564522.jpg';

interface AdminHomestayProps {
  homestayList: HomestayItem[];
  bookingList: BookingItem[];
  ulasanList: UlasanItem[];
  onAddHomestay: (item: Omit<HomestayItem, 'id' | 'avg_rating' | 'total_ulasan'>) => void;
  onUpdateHomestay: (item: HomestayItem) => void;
  onUpdateBookingStatus: (id: number, status: BookingItem['status_transaksi']) => void;
  onUpdateUlasanStatus: (id: number, status: UlasanItem['status_moderasi']) => void;
  onDeleteHomestay: (id: number) => void;
  onDeleteBooking?: (id: number) => void;
  onAddBooking?: (booking: BookingItem) => void;
  onToast?: (msg: string) => void;
}

export const AdminHomestay: React.FC<AdminHomestayProps> = ({
  homestayList,
  bookingList,
  ulasanList,
  onAddHomestay,
  onUpdateHomestay,
  onUpdateBookingStatus,
  onUpdateUlasanStatus,
  onDeleteHomestay,
  onDeleteBooking,
  onAddBooking,
  onToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'booking' | 'master' | 'ulasan'>('booking');
  const [searchTable, setSearchTable] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Modals & CRUD State
  const [isAddHomestayModalOpen, setIsAddHomestayModalOpen] = useState(false);
  const [isManualBookingModalOpen, setIsManualBookingModalOpen] = useState(false);
  const [editingHomestay, setEditingHomestay] = useState<HomestayItem | null>(null);
  const [viewingHomestay, setViewingHomestay] = useState<HomestayItem | null>(null);
  const [viewingBooking, setViewingBooking] = useState<BookingItem | null>(null);
  const [deleteConfirmHomestayId, setDeleteConfirmHomestayId] = useState<number | null>(null);
  const [deleteConfirmBooking, setDeleteConfirmBooking] = useState<BookingItem | null>(null);

  // Add / Edit Homestay Form
  const [homestayForm, setHomestayForm] = useState({
    nama_homestay: '',
    kategori: 'Homestay' as HomestayItem['kategori'],
    bintang: 3,
    tipe_kamar: 'Deluxe Room',
    kapasitas_tamu: 2,
    harga_per_malam: 350000,
    fasilitas: 'WiFi Cepat, AC Dingin, Sarapan Khas Cirebon, Air Hangat, Parkir Luas',
    lokasi: 'Kejaksan, Kota Cirebon',
    alamat_lengkap: 'Jl. Dr. Wahidin Sudirohusodo, Kejaksan, Kota Cirebon',
    jarak_pusat: '5 menit dari Stasiun Cirebon',
    foto: '/assets/aistudio/hotel_santika_6375e40f.jpeg',
    nama_pemilik: 'Manajemen Penginapan Cirebon',
    kontak_pemilik: '0812-3456-7890',
    status_kamar: 'Tersedia' as HomestayItem['status_kamar'],
  });

  // Manual booking form state & handlers
  const defaultSelectedHomestay = homestayList[0];
  const [manualBookingForm, setManualBookingForm] = useState({
    homestay_id: defaultSelectedHomestay?.id || 1,
    nama_tamu: '',
    asal_kota: 'Cirebon (Walk-in)',
    kontak: '',
    tgl_checkin: new Date().toISOString().slice(0, 10),
    tgl_checkout: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    durasi_malam: 2,
    jumlah_tamu: 2,
    total_biaya: (defaultSelectedHomestay?.harga_per_malam || 250000) * 2,
    status_transaksi: 'Terkonfirmasi' as BookingItem['status_transaksi'],
  });

  const openManualBookingModal = () => {
    const selected = homestayList[0];
    const checkin = new Date().toISOString().slice(0, 10);
    const checkout = new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10);
    setManualBookingForm({
      homestay_id: selected?.id || 1,
      nama_tamu: '',
      asal_kota: 'Cirebon (Walk-in)',
      kontak: '',
      tgl_checkin: checkin,
      tgl_checkout: checkout,
      durasi_malam: 2,
      jumlah_tamu: 2,
      total_biaya: (selected?.harga_per_malam || 250000) * 2,
      status_transaksi: 'Terkonfirmasi',
    });
    setIsManualBookingModalOpen(true);
  };

  const handleHomestaySelectChange = (id: number) => {
    const selected = homestayList.find(h => h.id === Number(id)) || homestayList[0];
    const total = (selected?.harga_per_malam || 250000) * manualBookingForm.durasi_malam;
    setManualBookingForm(prev => ({
      ...prev,
      homestay_id: Number(id),
      total_biaya: total
    }));
  };

  const handleDateChange = (checkin: string, checkout: string, homestayId: number) => {
    const d1 = new Date(checkin);
    const d2 = new Date(checkout);
    const diff = d2.getTime() - d1.getTime();
    const nights = Math.max(1, Math.ceil(diff / (1000 * 3600 * 24)) || 1);
    const selected = homestayList.find(h => h.id === Number(homestayId)) || homestayList[0];
    const total = (selected?.harga_per_malam || 250000) * nights;
    setManualBookingForm(prev => ({
      ...prev,
      tgl_checkin: checkin,
      tgl_checkout: checkout,
      durasi_malam: nights,
      total_biaya: total
    }));
  };

  const handleSaveManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualBookingForm.nama_tamu.trim()) {
      if (onToast) onToast('Silakan isi nama lengkap tamu pemesan.');
      return;
    }

    const selectedHomestay = homestayList.find(h => h.id === Number(manualBookingForm.homestay_id)) || homestayList[0];
    const newBooking: BookingItem = {
      id: Date.now(),
      booking_code: `HS-CRB-${Math.floor(100000 + Math.random() * 900000)}`,
      homestay_id: selectedHomestay.id,
      nama_homestay: selectedHomestay.nama_homestay,
      tipe_kamar: selectedHomestay.tipe_kamar,
      nama_tamu: manualBookingForm.nama_tamu.trim(),
      asal_kota: manualBookingForm.asal_kota.trim() || 'Cirebon (Walk-in)',
      kontak: manualBookingForm.kontak.trim() || '-',
      tgl_checkin: manualBookingForm.tgl_checkin,
      tgl_checkout: manualBookingForm.tgl_checkout,
      durasi_malam: Number(manualBookingForm.durasi_malam) || 1,
      jumlah_tamu: Number(manualBookingForm.jumlah_tamu) || 1,
      total_biaya: Number(manualBookingForm.total_biaya) || selectedHomestay.harga_per_malam,
      status_transaksi: manualBookingForm.status_transaksi,
      created_at: new Date().toISOString().slice(0, 10),
    };

    if (onAddBooking) {
      onAddBooking(newBooking);
    }
    setActiveSubTab('booking');
    setIsManualBookingModalOpen(false);
    setManualBookingForm({
      homestay_id: homestayList[0]?.id || 1,
      nama_tamu: '',
      asal_kota: 'Cirebon (Walk-in)',
      kontak: '',
      tgl_checkin: new Date().toISOString().slice(0, 10),
      tgl_checkout: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      durasi_malam: 2,
      jumlah_tamu: 2,
      total_biaya: (homestayList[0]?.harga_per_malam || 250000) * 2,
      status_transaksi: 'Terkonfirmasi',
    });

    if (onToast) {
      onToast(`Reservasi manual #${newBooking.booking_code} atas nama ${newBooking.nama_tamu} berhasil dicatat!`);
    }
  };

  const filteredBookings = bookingList.filter((b) => {
    const matchSearch = b.booking_code.toLowerCase().includes(searchTable.toLowerCase()) ||
                        b.nama_tamu.toLowerCase().includes(searchTable.toLowerCase()) ||
                        b.nama_homestay.toLowerCase().includes(searchTable.toLowerCase());
    const matchStatus = !filterStatus || b.status_transaksi === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAddHomestayModal = () => {
    setEditingHomestay(null);
    setHomestayForm({
      nama_homestay: '',
      kategori: 'Homestay',
      bintang: 3,
      tipe_kamar: 'Standard / Deluxe Room',
      kapasitas_tamu: 2,
      harga_per_malam: 250000,
      fasilitas: 'WiFi Cepat, AC Dingin, Sarapan Pagi, Air Hangat, Parkir',
      lokasi: 'Kota Cirebon, Jawa Barat',
      alamat_lengkap: 'Jl. Siliwangi, Kota Cirebon, Jawa Barat',
      jarak_pusat: '10 menit dari Stasiun Cirebon',
      foto: defaultHomestayImg,
      nama_pemilik: 'Warga Mitra Cirebon',
      kontak_pemilik: '0812-3456-7890',
      status_kamar: 'Tersedia',
    });
    setIsAddHomestayModalOpen(true);
  };

  const openEditHomestayModal = (item: HomestayItem) => {
    setEditingHomestay(item);
    setHomestayForm({
      nama_homestay: item.nama_homestay,
      kategori: item.kategori || 'Homestay',
      bintang: item.bintang || 3,
      tipe_kamar: item.tipe_kamar,
      kapasitas_tamu: item.kapasitas_tamu,
      harga_per_malam: item.harga_per_malam,
      fasilitas: item.fasilitas,
      lokasi: item.lokasi,
      alamat_lengkap: item.alamat_lengkap || item.lokasi,
      jarak_pusat: item.jarak_pusat || '10 menit dari pusat kota',
      foto: item.foto,
      nama_pemilik: item.nama_pemilik,
      kontak_pemilik: item.kontak_pemilik,
      status_kamar: item.status_kamar,
    });
    setIsAddHomestayModalOpen(true);
  };

  const handleSaveHomestay = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHomestay) {
      onUpdateHomestay({
        ...editingHomestay,
        ...homestayForm,
      });
    } else {
      onAddHomestay(homestayForm);
    }
    setIsAddHomestayModalOpen(false);
    setEditingHomestay(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-400">Admin Panel / Homestay &amp; Ulasan</span>
          <h1 className="text-2xl font-black text-[#002B36] tracking-tight">
            Manajemen Reservasi Homestay &amp; Moderasi Ulasan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pusat tata kelola akomodasi kemitraan warga desa wisata, kedatangan tamu, dan reputasi ulasan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ReportExportButton
            label="Unduh Laporan Homestay"
            onExport={(format) => exportHomestayReport(homestayList, format)}
          />
          <button
            onClick={openManualBookingModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#004C6D] hover:bg-[#003850] text-white text-xs font-bold shadow-xs cursor-pointer transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Input Reservasi Manual</span>
          </button>
          <button
            onClick={openAddHomestayModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#024B35] hover:bg-[#013726] text-white text-xs font-bold shadow-xs cursor-pointer transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Penginapan / Hotel</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Hotel &amp; Penginapan</span>
            <div className="text-2xl font-black text-[#002B36] mt-0.5">
              {homestayList.length} <span className="text-xs font-semibold text-slate-500">Unit</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Akomodasi aktif terverifikasi
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <HomeIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Reservasi Terdata</span>
            <div className="text-2xl font-black text-[#002B36] mt-0.5">
              {bookingList.length} <span className="text-xs font-semibold text-slate-500">Reservasi</span>
            </div>
            <span className="text-[11px] font-bold text-amber-600 mt-1 inline-flex items-center gap-1">
              <Clock className="w-3 h-3" /> Termasuk booking manual &amp; web
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Okupansi Kamar Rata-Rata</span>
            <div className="text-2xl font-black text-[#002B36] mt-0.5">
              78%
            </div>
            <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> &plus; 14% vs bulan lalu
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#004C6D] flex items-center justify-center">
            <Bed className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rata-Rata Rating Wisatawan</span>
            <div className="text-2xl font-black text-[#002B36] mt-0.5">
              4.8 <span className="text-xs font-semibold text-slate-500">/ 5.0</span>
            </div>
            <span className="text-[11px] font-bold text-amber-600 mt-1 inline-flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-500" /> Total {ulasanList.length} Ulasan Publik
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
          </div>
        </div>
      </div>

      {/* 3 Sub-tabs Pill Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab('booking')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'booking'
              ? 'bg-[#024B35] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Bed className="w-3.5 h-3.5" />
          <span>Daftar Reservasi &amp; Booking Tamu</span>
          <span className="bg-white/20 text-[10px] px-1.5 py-0.2 rounded-full">{bookingList.length}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('master')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'master'
              ? 'bg-[#024B35] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <HomeIcon className="w-3.5 h-3.5" />
          <span>Master Data Penginapan &amp; Hotel Cirebon</span>
          <span className="bg-white/20 text-[10px] px-1.5 py-0.2 rounded-full">{homestayList.length}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ulasan')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'ulasan'
              ? 'bg-[#024B35] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Moderasi Ulasan &amp; Rating Bintang</span>
          <span className="bg-white/20 text-[10px] px-1.5 py-0.2 rounded-full">{ulasanList.length}</span>
        </button>
      </div>

      {/* SUB-TAB 1: DAFTAR RESERVASI TAMU */}
      {activeSubTab === 'booking' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#002B36] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#004C6D]" />
                <span>Data Reservasi Tamu Penginapan &amp; Hotel</span>
              </h3>
              <p className="text-xs text-slate-500">
                Menampilkan {filteredBookings.length} dari {bookingList.length} data reservasi tamu.
              </p>
            </div>
            <button
              onClick={openManualBookingModal}
              className="bg-[#024B35] hover:bg-[#013726] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Input Reservasi Manual</span>
            </button>
          </div>

          {/* Toolbar */}
          <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari ID, nama tamu, atau penginapan..."
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white text-xs rounded-lg border border-slate-200 outline-none focus:border-[#004C6D]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="">Semua Status Booking</option>
                <option value="Terkonfirmasi">Terkonfirmasi</option>
                <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                <option value="Batal">Batal</option>
              </select>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>10 Nov - 24 Nov 2025</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/60 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">ID Booking</th>
                  <th className="py-3 px-4">Nama Tamu &amp; Asal</th>
                  <th className="py-3 px-4">Penginapan / Hotel Pilihan</th>
                  <th className="py-3 px-4">Periode In / Out</th>
                  <th className="py-3 px-4">Durasi &amp; Pax</th>
                  <th className="py-3 px-4">Total Biaya</th>
                  <th className="py-3 px-4">Status Transaksi</th>
                  <th className="py-3 px-4 text-center w-32">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-mono font-black text-[#002B36]">
                      {b.booking_code}
                    </td>
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 block font-bold text-xs">{b.nama_tamu}</strong>
                      <span className="text-[11px] text-slate-400 block">{b.asal_kota} &bull; {b.kontak}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <strong className="text-[#004C6D] block font-bold text-xs">{b.nama_homestay}</strong>
                      <span className="text-[11px] text-slate-400 block">{b.tipe_kamar}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[11px]">
                      <div>
                        <span className="font-semibold text-slate-700">{b.tgl_checkin} (14:00)</span>
                        <span className="text-slate-400 block">{b.tgl_checkout} (12:00)</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-800 block">{b.durasi_malam} Malam</strong>
                      <span className="text-[10px] text-slate-400">{b.jumlah_tamu} Tamu Dewasa</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-400 text-[10px] block">Rp</span>
                      <strong className="text-slate-900 font-black text-xs">
                        {b.total_biaya.toLocaleString('id-ID')}
                      </strong>
                    </td>
                    <td className="py-3.5 px-4">
                      {b.status_transaksi === 'Terkonfirmasi' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Terkonfirmasi
                        </span>
                      ) : b.status_transaksi === 'Menunggu Pembayaran' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Menunggu Pembayaran
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          {b.status_transaksi}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {b.status_transaksi === 'Menunggu Pembayaran' && (
                          <button
                            type="button"
                            onClick={() => onUpdateBookingStatus(b.id, 'Terkonfirmasi')}
                            className="w-7 h-7 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 flex items-center justify-center cursor-pointer transition"
                            title="Konfirmasi Pembayaran"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setViewingBooking(b)}
                          className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:text-[#004C6D] hover:bg-slate-50 flex items-center justify-center cursor-pointer transition"
                          title="Lihat Rincian Reservasi"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateBookingStatus(b.id, 'Batal')}
                          className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:text-amber-600 hover:bg-amber-50 flex items-center justify-center cursor-pointer transition"
                          title="Batalkan Booking"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmBooking(b)}
                          className="w-7 h-7 rounded-lg border border-rose-200 text-rose-500 hover:text-white hover:bg-rose-600 hover:border-rose-600 flex items-center justify-center cursor-pointer transition shadow-2xs"
                          title="Hapus Data Reservasi"
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

          <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Menampilkan {filteredBookings.length} dari {bookingList.length} data reservasi</span>
            <div className="flex gap-1.5">
              <span className="px-2.5 py-1 rounded-md bg-[#024B35] text-white font-bold">1</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MASTER PENGINAPAN & HOTEL */}
      {activeSubTab === 'master' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#002B36]">Master Data Penginapan &amp; Hotel Cirebon</h3>
              <p className="text-xs text-slate-500">Daftar seluruh hotel berbintang, resort, homestay, dan guest house di Cirebon.</p>
            </div>
            <button
              onClick={() => setIsAddHomestayModalOpen(true)}
              className="bg-[#024B35] hover:bg-[#013726] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Penginapan / Hotel</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/60 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4 w-20">Foto</th>
                  <th className="py-3 px-4">Nama Penginapan / Hotel</th>
                  <th className="py-3 px-4">Tipe Kamar</th>
                  <th className="py-3 px-4">Tarif / Malam</th>
                  <th className="py-3 px-4">Nama Pemilik &amp; Kontak</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {homestayList.map((h, index) => (
                  <tr key={h.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 text-center font-bold text-slate-400">{index + 1}</td>
                    <td className="py-3 px-4">
                      <img src={h.foto} alt="" className="w-12 h-10 rounded-md object-cover shadow-2xs" />
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-slate-900 block font-bold text-xs">{h.nama_homestay}</strong>
                      <span className="text-[11px] text-slate-400">{h.lokasi}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{h.tipe_kamar}</td>
                    <td className="py-3 px-4 font-black text-slate-900">
                      Rp {h.harga_per_malam.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">{h.nama_pemilik}</span>
                      <span className="text-[10px] text-slate-400">{h.kontak_pemilik}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {h.status_kamar}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => openEditHomestayModal(h)}
                          className="w-7 h-7 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition cursor-pointer shadow-2xs"
                          title="Edit Data Homestay"
                        >
                          <PenSquare className="w-3.5 h-3.5" />
                        </button>

                        {/* View Detail Button */}
                        <button
                          type="button"
                          onClick={() => setViewingHomestay(h)}
                          className="w-7 h-7 rounded-md bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center transition cursor-pointer shadow-2xs"
                          title="Lihat Detail Homestay"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmHomestayId(h.id)}
                          className="w-7 h-7 rounded-md bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition cursor-pointer shadow-2xs"
                          title="Hapus Homestay"
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
      )}

      {/* SUB-TAB 3: MODERASI ULASAN */}
      {activeSubTab === 'ulasan' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h3 className="text-sm font-bold text-[#002B36] flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Moderasi Ulasan &amp; Rating Bintang</span>
            </h3>
            <p className="text-xs text-slate-500">Pemeriksaan ulasan wisatawan sebelum dipublikasikan ke portal publik.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/60 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Nama Pengulas</th>
                  <th className="py-3 px-4">Homestay</th>
                  <th className="py-3 px-4">Rating Bintang</th>
                  <th className="py-3 px-4">Komentar Pengalaman</th>
                  <th className="py-3 px-4">Status Moderasi</th>
                  <th className="py-3 px-4 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ulasanList.map((u, idx) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-[#002B36]">{u.nama_pengulas}</td>
                    <td className="py-3.5 px-4 text-[#004C6D] font-semibold">{u.nama_homestay}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= u.rating_bintang ? 'fill-amber-400' : 'text-slate-200'}`} />
                        ))}
                        <span className="font-bold ml-1 text-slate-700">{u.rating_bintang}.0</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 italic text-slate-600 max-w-sm">
                      "{u.komentar}"
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status_moderasi === 'Disetujui'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {u.status_moderasi}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onUpdateUlasanStatus(u.id, 'Disetujui')}
                          className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] hover:bg-emerald-100"
                        >
                          Setujui
                        </button>
                        <button
                          onClick={() => onUpdateUlasanStatus(u.id, 'Ditolak')}
                          className="px-2 py-1 rounded bg-rose-50 text-rose-700 font-bold text-[10px] hover:bg-rose-100"
                        >
                          Tolak
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT MITRA HOMESTAY */}
      {isAddHomestayModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsAddHomestayModalOpen(false);
                setEditingHomestay(null);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-[#002B36] mb-1">
              {editingHomestay ? `Edit Data: ${editingHomestay.nama_homestay}` : 'Tambah Unit Mitra Homestay Baru'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Kelola Kemitraan Hunian Ramah Wisatawan &bull; Sistem Reservasi Homestay Cirebon
            </p>

            <form onSubmit={handleSaveHomestay} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Homestay / Penginapan *</label>
                  <input
                    type="text"
                    value={homestayForm.nama_homestay}
                    onChange={(e) => setHomestayForm({ ...homestayForm, nama_homestay: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#024B35]"
                    placeholder="Contoh: De Hanami Homestay"
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Hunian *</label>
                  <select
                    value={homestayForm.kategori}
                    onChange={(e) => setHomestayForm({ ...homestayForm, kategori: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white outline-none focus:border-[#024B35]"
                  >
                    <option value="Hotel">Hotel</option>
                    <option value="Homestay">Homestay</option>
                    <option value="Guest House">Guest House</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipe Kamar *</label>
                  <input
                    type="text"
                    value={homestayForm.tipe_kamar}
                    onChange={(e) => setHomestayForm({ ...homestayForm, tipe_kamar: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#024B35]"
                    placeholder="Contoh: Deluxe Double"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Klasifikasi Bintang</label>
                  <select
                    value={homestayForm.bintang}
                    onChange={(e) => setHomestayForm({ ...homestayForm, bintang: parseInt(e.target.value) || 3 })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white outline-none focus:border-[#024B35]"
                  >
                    <option value={1}>⭐ Bintang 1</option>
                    <option value={2}>⭐⭐ Bintang 2</option>
                    <option value={3}>⭐⭐⭐ Bintang 3</option>
                    <option value={4}>⭐⭐⭐⭐ Bintang 4</option>
                    <option value={5}>⭐⭐⭐⭐⭐ Bintang 5</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tarif / Malam (Rp) * <span className="text-[10px] text-slate-400 font-normal">(isi manual)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 select-none">
                      Rp
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={homestayForm.harga_per_malam === 0 ? '' : homestayForm.harga_per_malam.toLocaleString('id-ID')}
                      onChange={(e) => {
                        const rawDigits = e.target.value.replace(/[^0-9]/g, '');
                        const parsed = rawDigits === '' ? 0 : Math.max(0, parseInt(rawDigits, 10));
                        setHomestayForm({ ...homestayForm, harga_per_malam: parsed });
                      }}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-[#024B35] bg-white"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kapasitas Tamu * <span className="text-[10px] text-slate-400 font-normal">(orang)</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={homestayForm.kapasitas_tamu === 0 ? '' : homestayForm.kapasitas_tamu.toLocaleString('id-ID')}
                    onChange={(e) => {
                      const rawDigits = e.target.value.replace(/[^0-9]/g, '');
                      const parsed = rawDigits === '' ? 0 : Math.max(0, parseInt(rawDigits, 10));
                      setHomestayForm({ ...homestayForm, kapasitas_tamu: parsed });
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-[#024B35] bg-white"
                    placeholder="2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Pemilik / Manajemen *</label>
                  <input
                    type="text"
                    value={homestayForm.nama_pemilik}
                    onChange={(e) => setHomestayForm({ ...homestayForm, nama_pemilik: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#024B35]"
                    placeholder="Contoh: Ibu Hanami"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kontak Pemilik (HP / WA) *</label>
                  <input
                    type="tel"
                    value={homestayForm.kontak_pemilik}
                    onChange={(e) => setHomestayForm({ ...homestayForm, kontak_pemilik: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#024B35]"
                    placeholder="Contoh: 0812-3488-9901"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Wilayah *</label>
                  <input
                    type="text"
                    value={homestayForm.lokasi}
                    onChange={(e) => setHomestayForm({ ...homestayForm, lokasi: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#024B35]"
                    placeholder="Contoh: Kejaksan, Kota Cirebon"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Kamar *</label>
                  <select
                    value={homestayForm.status_kamar}
                    onChange={(e) => setHomestayForm({ ...homestayForm, status_kamar: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white outline-none focus:border-[#024B35]"
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Penuh">Penuh</option>
                    <option value="Pemeliharaan">Pemeliharaan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Lengkap</label>
                <input
                  type="text"
                  value={homestayForm.alamat_lengkap}
                  onChange={(e) => setHomestayForm({ ...homestayForm, alamat_lengkap: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#024B35]"
                  placeholder="Contoh: Jl. Tuparev No. 88, Cirebon"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fasilitas Lengkap</label>
                <input
                  type="text"
                  value={homestayForm.fasilitas}
                  onChange={(e) => setHomestayForm({ ...homestayForm, fasilitas: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#024B35]"
                  placeholder="Contoh: WiFi Kencang, AC Dingin, Dapur Bersama, Garasi Luas"
                  required
                />
              </div>

              <ImageUploadSelector
                label="Foto Penginapan"
                value={homestayForm.foto}
                onChange={(url) => setHomestayForm({ ...homestayForm, foto: url })}
                placeholder="URL foto atau /assets/aistudio/..."
                required
              />

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddHomestayModalOpen(false);
                    setEditingHomestay(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#024B35] hover:bg-[#013726] text-white py-2.5 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  {editingHomestay ? 'Simpan Perubahan' : 'Simpan Mitra Homestay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VIEW DETAIL HOMESTAY (READ) */}
      {viewingHomestay && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="relative h-48 w-full bg-slate-900 shrink-0">
              <img
                src={viewingHomestay.foto}
                alt={viewingHomestay.nama_homestay}
                className="w-full h-full object-cover opacity-90"
              />
              <button
                type="button"
                onClick={() => setViewingHomestay(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-4 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#024B35] text-white">
                  {viewingHomestay.kategori || 'Homestay'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-900 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  {viewingHomestay.bintang ? `${viewingHomestay.bintang} Bintang` : 'Mitra'}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  viewingHomestay.status_kamar === 'Tersedia' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-rose-500 text-white'
                }`}>
                  {viewingHomestay.status_kamar}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs">
              <div>
                <h3 className="text-lg font-black text-[#002B36]">{viewingHomestay.nama_homestay}</h3>
                <p className="text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{viewingHomestay.lokasi}</span>
                </p>
                {viewingHomestay.alamat_lengkap && (
                  <p className="text-slate-400 text-[11px] mt-1 pl-4">
                    {viewingHomestay.alamat_lengkap}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Tipe Kamar</span>
                  <span className="font-bold text-slate-800">{viewingHomestay.tipe_kamar}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Tarif per Malam</span>
                  <span className="font-black text-[#024B35] text-sm">
                    Rp {viewingHomestay.harga_per_malam.toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Kapasitas Maksimal</span>
                  <span className="font-bold text-slate-800">{viewingHomestay.kapasitas_tamu} Orang Dewasa</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Jarak ke Pusat Kota</span>
                  <span className="font-bold text-slate-800">{viewingHomestay.jarak_pusat || '5-10 menit'}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-1.5">Fasilitas yang Tersedia:</span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingHomestay.fasilitas.split(',').map((f, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-100">
                      ✓ {f.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Pengelola / Pemilik</span>
                  <span className="font-bold text-slate-900">{viewingHomestay.nama_pemilik}</span>
                  <span className="text-[11px] text-slate-500 block">{viewingHomestay.kontak_pemilik}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setViewingHomestay(null);
                    openEditHomestayModal(viewingHomestay);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-2xs transition cursor-pointer flex items-center gap-1"
                >
                  <PenSquare className="w-3.5 h-3.5" />
                  <span>Edit Data</span>
                </button>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setViewingHomestay(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                >
                  Tutup Rincian
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS HOMESTAY (DELETE) */}
      {deleteConfirmHomestayId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Hapus Data Homestay?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Tindakan ini akan menghapus unit homestay dari daftar mitra dan katalog publik CirebonKita.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmHomestayId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteHomestay(deleteConfirmHomestayId);
                  setDeleteConfirmHomestayId(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS RESERVASI TAMU (DELETE BOOKING) */}
      {deleteConfirmBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Hapus Data Reservasi?</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Apakah Anda yakin ingin menghapus reservasi <strong className="text-slate-800 font-mono">{deleteConfirmBooking.booking_code}</strong> atas nama <strong className="text-slate-800">{deleteConfirmBooking.nama_tamu}</strong> ({deleteConfirmBooking.nama_homestay})?
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmBooking(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteBooking) {
                    onDeleteBooking(deleteConfirmBooking.id);
                  }
                  setDeleteConfirmBooking(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETAIL RESERVASI (VIEW BOOKING) */}
      {viewingBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setViewingBooking(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-11 h-11 rounded-2xl bg-teal-50 text-[#004C6D] flex items-center justify-center font-bold">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-[#002B36]">{viewingBooking.booking_code}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      viewingBooking.status_transaksi === 'Terkonfirmasi'
                        ? 'bg-emerald-50 text-emerald-800'
                        : viewingBooking.status_transaksi === 'Menunggu Pembayaran'
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-rose-50 text-rose-800'
                    }`}>
                      {viewingBooking.status_transaksi}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {viewingBooking.nama_tamu}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Homestay</span>
                  <span className="font-bold text-[#004C6D]">{viewingBooking.nama_homestay}</span>
                  <span className="text-[11px] text-slate-500 block">{viewingBooking.tipe_kamar}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Kontak / Domisili</span>
                  <span className="font-bold text-slate-800">{viewingBooking.kontak}</span>
                  <span className="text-[11px] text-slate-500 block">{viewingBooking.asal_kota}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Periode Menginap</span>
                  <span className="font-bold text-slate-800">{viewingBooking.tgl_checkin} s/d {viewingBooking.tgl_checkout}</span>
                  <span className="text-[11px] text-slate-500 block">({viewingBooking.durasi_malam} Malam, {viewingBooking.jumlah_tamu} Tamu)</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Biaya</span>
                  <span className="font-black text-emerald-700 text-sm">
                    Rp {viewingBooking.total_biaya.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Dibuat: {viewingBooking.created_at}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-slate-600 block">Ubah Status Reservasi:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateBookingStatus(viewingBooking.id, 'Terkonfirmasi');
                      setViewingBooking({ ...viewingBooking, status_transaksi: 'Terkonfirmasi' });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      viewingBooking.status_transaksi === 'Terkonfirmasi'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'border border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Terkonfirmasi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateBookingStatus(viewingBooking.id, 'Selesai');
                      setViewingBooking({ ...viewingBooking, status_transaksi: 'Selesai' });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      viewingBooking.status_transaksi === 'Selesai'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'border border-blue-200 text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Selesai (Check-Out)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateBookingStatus(viewingBooking.id, 'Batal');
                      setViewingBooking({ ...viewingBooking, status_transaksi: 'Batal' });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      viewingBooking.status_transaksi === 'Batal'
                        ? 'bg-rose-600 text-white shadow-2xs'
                        : 'border border-rose-200 text-rose-700 hover:bg-rose-50'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Batalkan</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const b = viewingBooking;
                    setViewingBooking(null);
                    setDeleteConfirmBooking(b);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Reservasi</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingBooking(null)}
                  className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INPUT RESERVASI MANUAL */}
      {isManualBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setIsManualBookingModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#014B35] flex items-center justify-center font-bold">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#002B36] tracking-tight">
                    Input Reservasi Manual
                  </h3>
                  <p className="text-xs text-slate-500">
                    Catat pemesanan langsung dari tamu (walk-in, telepon sekretariat, atau WhatsApp) ke sistem desa wisata.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveManualBooking} className="space-y-4 text-xs">
                {/* 1. Pilih Homestay */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Pilih Mitra Homestay / Penginapan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={manualBookingForm.homestay_id}
                    onChange={(e) => handleHomestaySelectChange(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#014B35] font-semibold text-slate-800 bg-white"
                  >
                    {homestayList.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.nama_homestay} — {h.tipe_kamar} (Rp {h.harga_per_malam.toLocaleString('id-ID')} / malam)
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Nama Tamu & Kontak */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nama Lengkap Tamu <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Cth: Ibu Dian Purnamasari"
                      value={manualBookingForm.nama_tamu}
                      onChange={(e) => setManualBookingForm({ ...manualBookingForm, nama_tamu: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#014B35]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nomor HP / WhatsApp <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Cth: 0812-3456-7890"
                      value={manualBookingForm.kontak}
                      onChange={(e) => setManualBookingForm({ ...manualBookingForm, kontak: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#014B35]"
                    />
                  </div>
                </div>

                {/* 3. Asal Kota & Jumlah Tamu */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Asal Kota / Domisili Tamu
                    </label>
                    <input
                      type="text"
                      placeholder="Cth: Jakarta Selatan"
                      value={manualBookingForm.asal_kota}
                      onChange={(e) => setManualBookingForm({ ...manualBookingForm, asal_kota: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#014B35]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Jumlah Tamu <span className="text-[10px] text-slate-400 font-normal">(orang)</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={manualBookingForm.jumlah_tamu === 0 ? '' : manualBookingForm.jumlah_tamu.toLocaleString('id-ID')}
                      onChange={(e) => {
                        const rawDigits = e.target.value.replace(/[^0-9]/g, '');
                        const parsed = rawDigits === '' ? 0 : Math.max(0, parseInt(rawDigits, 10));
                        setManualBookingForm({ ...manualBookingForm, jumlah_tamu: parsed });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#014B35] font-bold text-slate-800 bg-white"
                      placeholder="1"
                    />
                  </div>
                </div>

                {/* 4. Tanggal Check-In, Check-Out, & Durasi */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Tanggal Check-In <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={manualBookingForm.tgl_checkin}
                      onChange={(e) => handleDateChange(e.target.value, manualBookingForm.tgl_checkout, manualBookingForm.homestay_id)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-[#014B35]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Tanggal Check-Out <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      min={manualBookingForm.tgl_checkin}
                      value={manualBookingForm.tgl_checkout}
                      onChange={(e) => handleDateChange(manualBookingForm.tgl_checkin, e.target.value, manualBookingForm.homestay_id)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-[#014B35]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Durasi Menginap
                    </label>
                    <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700">
                      {manualBookingForm.durasi_malam} Malam
                    </div>
                  </div>
                </div>

                {/* 5. Status Transaksi & Total Biaya */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Status Transaksi
                    </label>
                    <select
                      value={manualBookingForm.status_transaksi}
                      onChange={(e) => setManualBookingForm({ ...manualBookingForm, status_transaksi: e.target.value as BookingItem['status_transaksi'] })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#014B35] font-semibold text-slate-800 bg-white"
                    >
                      <option value="Terkonfirmasi">Terkonfirmasi (Lunas / DP Diterima)</option>
                      <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                      <option value="Selesai">Selesai (Sudah Check-out)</option>
                      <option value="Batal">Batal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Total Biaya Sewa (Rp) <span className="text-[10px] text-slate-400 font-normal">(isi manual)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 select-none">
                        Rp
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={manualBookingForm.total_biaya === 0 ? '' : manualBookingForm.total_biaya.toLocaleString('id-ID')}
                        onChange={(e) => {
                          const rawDigits = e.target.value.replace(/[^0-9]/g, '');
                          const parsed = rawDigits === '' ? 0 : Math.max(0, parseInt(rawDigits, 10));
                          setManualBookingForm({ ...manualBookingForm, total_biaya: parsed });
                        }}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#014B35] font-bold text-emerald-800 bg-white text-xs"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Otomatis dihitung ({manualBookingForm.durasi_malam} malam x tarif). Dapat disesuaikan manual bila terdapat promo/diskon.
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsManualBookingModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#024B35] hover:bg-[#013726] text-white font-bold shadow-xs transition cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simpan Reservasi Manual</span>
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
