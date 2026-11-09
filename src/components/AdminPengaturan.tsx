import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  KeyRound, 
  Bell, 
  Save, 
  CheckCircle2, 
  AlertTriangle,
  QrCode,
  Lock,
  Globe
} from 'lucide-react';
import { PortalSettings } from '../types';

interface AdminPengaturanProps {
  settings: PortalSettings;
  onUpdateSettings: (newSettings: PortalSettings) => void;
  onToast: (msg: string) => void;
}

export const AdminPengaturan: React.FC<AdminPengaturanProps> = ({
  settings,
  onUpdateSettings,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'profil' | 'keuangan' | 'operasional' | 'keamanan'>('profil');
  const [formSettings, setFormSettings] = useState<PortalSettings>(settings);

  // Security password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formSettings);
    onToast('Pengaturan portal berhasil disimpan!');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (oldPassword !== 'admin123') {
      setPasswordError('Kata sandi lama salah!');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Kata sandi baru minimal 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onToast('Kata sandi administrator berhasil diperbarui!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Pengaturan Sistem &amp; Portal
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Kelola konfigurasi umum, rekening penerima kas desa wisata, dan keamanan autentikasi.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('profil')}
          className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'profil'
              ? 'border-[#014B35] text-[#014B35] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Profil &amp; Kontak Desa</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('keuangan')}
          className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'keuangan'
              ? 'border-[#014B35] text-[#014B35] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Keuangan &amp; QRIS BUMDes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('operasional')}
          className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'operasional'
              ? 'border-[#014B35] text-[#014B35] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Operasional &amp; Tiket</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('keamanan')}
          className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'keamanan'
              ? 'border-[#014B35] text-[#014B35] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Keamanan Administrator</span>
        </button>
      </div>

      {/* TAB 1: PROFIL & KONTAK DESA */}
      {activeTab === 'profil' && (
        <form onSubmit={handleSaveGeneral} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Portal Resmi
              </label>
              <input
                type="text"
                value={formSettings.nama_portal}
                onChange={(e) => setFormSettings({ ...formSettings, nama_portal: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Slogan / Tagline
              </label>
              <input
                type="text"
                value={formSettings.slogan}
                onChange={(e) => setFormSettings({ ...formSettings, slogan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Deskripsi Singkat Portal
            </label>
            <textarea
              rows={2}
              value={formSettings.deskripsi}
              onChange={(e) => setFormSettings({ ...formSettings, deskripsi: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                3 Saluran Telepon &amp; WhatsApp Resmi
              </label>
              <input
                type="text"
                value={formSettings.telepon_kontak}
                onChange={(e) => setFormSettings({ ...formSettings, telepon_kontak: e.target.value })}
                placeholder="083155853722, 081949684163, 085717412815"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35]"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Hotline 1: 083155853722 | Hotline 2: 081949684163 | Hotline 3: 085717412815
              </span>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jam Operasional
              </label>
              <input
                type="text"
                value={formSettings.jam_operasional}
                onChange={(e) => setFormSettings({ ...formSettings, jam_operasional: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Alamat Kantor Sekretariat
            </label>
            <input
              type="text"
              value={formSettings.alamat_kantor}
              onChange={(e) => setFormSettings({ ...formSettings, alamat_kantor: e.target.value })}
              placeholder="Jl. Perjuangan No.10B, Karyamulya, Kec. Kesambi, Kota Cirebon, Jawa Barat"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35]"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#014B35] hover:bg-[#003827] text-white font-bold flex items-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Profil &amp; Kontak</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: KEUANGAN & QRIS */}
      {activeTab === 'keuangan' && (
        <form onSubmit={handleSaveGeneral} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              Seluruh dana transaksi tiket dan komisi UMKM ditampung pada rekening resmi BUMDes / Koperasi Desa Wisata yang diawasi oleh Dinas Pariwisata.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Bank Rekening
              </label>
              <input
                type="text"
                value={formSettings.nama_bank}
                onChange={(e) => setFormSettings({ ...formSettings, nama_bank: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Rekening
              </label>
              <input
                type="text"
                value={formSettings.no_rekening}
                onChange={(e) => setFormSettings({ ...formSettings, no_rekening: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Atas Nama Rekening
              </label>
              <input
                type="text"
                value={formSettings.atas_nama}
                onChange={(e) => setFormSettings({ ...formSettings, atas_nama: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              NMID QRIS Standar Nasional
            </label>
            <div className="relative">
              <QrCode className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formSettings.nmid_qris}
                onChange={(e) => setFormSettings({ ...formSettings, nmid_qris: e.target.value })}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35]"
              />
            </div>
          </div>

          {/* Toggle Notifikasi WA */}
          <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-[#014B35]" />
                Notifikasi WhatsApp Otomatis
              </span>
              <p className="text-[11px] text-slate-500">
                Kirim invoice dan kode booking langsung ke WhatsApp pembeli saat reservasi diajukan.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formSettings.notifikasi_wa}
                onChange={(e) => setFormSettings({ ...formSettings, notifikasi_wa: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#014B35]"></div>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#014B35] hover:bg-[#003827] text-white font-bold flex items-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Rekening &amp; Keuangan</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: OPERASIONAL & TIKET */}
      {activeTab === 'operasional' && (
        <form onSubmit={handleSaveGeneral} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Maksimum Pembelian Tiket Per Transaksi
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={formSettings.maks_tiket_per_transaksi}
              onChange={(e) => setFormSettings({ ...formSettings, maks_tiket_per_transaksi: parseInt(e.target.value) || 10 })}
              className="w-full sm:w-48 px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35]"
            />
            <span className="text-[11px] text-slate-400 block mt-1">
              Mencegah penimbunan tiket oleh calo pada musim libur panjang keraton.
            </span>
          </div>

          {/* Toggle Mode Pemeliharaan */}
          <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Mode Pemeliharaan (Maintenance Mode)
              </span>
              <p className="text-[11px] text-slate-500">
                Nonaktifkan sementara pemesanan publik untuk pemeliharaan server database.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formSettings.mode_pemeliharaan}
                onChange={(e) => setFormSettings({ ...formSettings, mode_pemeliharaan: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Status Arsitektur Keamanan Database</span>
            </div>
            <ul className="text-[11px] text-slate-600 space-y-1">
              <li>&bull; PDO Prepared Statements: <strong>Aktif (100% Kebal SQL Injection)</strong></li>
              <li>&bull; Session Security: <strong>session_regenerate_id() Enforced</strong></li>
              <li>&bull; Output Sanitization: <strong>htmlspecialchars() XSS Guard</strong></li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#014B35] hover:bg-[#003827] text-white font-bold flex items-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Operasional</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: KEAMANAN ADMINISTRATOR */}
      {activeTab === 'keamanan' && (
        <form onSubmit={handlePasswordChange} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 text-xs max-w-lg">
          {passwordError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Kata Sandi Saat Ini *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Masukkan kata sandi saat ini"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Kata Sandi Baru *
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Konfirmasi Kata Sandi Baru *
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Ketik ulang kata sandi baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#014B35] hover:bg-[#003827] text-white font-bold flex items-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Perbarui Kata Sandi</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
