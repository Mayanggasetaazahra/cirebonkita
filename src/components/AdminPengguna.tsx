import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  ShieldCheck, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  X, 
  Mail, 
  Phone, 
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { UserItem } from '../types';

interface AdminPenggunaProps {
  usersList: UserItem[];
  onAddUser: (user: Omit<UserItem, 'id' | 'created_at'>) => void;
  onUpdateUser: (user: UserItem) => void;
  onDeleteUser: (id: number) => void;
  onToast: (msg: string) => void;
}

export const AdminPengguna: React.FC<AdminPenggunaProps> = ({
  usersList,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    username: '',
    email: '',
    no_wa: '',
    role: 'wisatawan' as UserItem['role'],
    status: 'Aktif' as UserItem['status'],
  });

  // KPI Metrics
  const totalUsers = usersList.length;
  const adminCount = usersList.filter(u => u.role === 'admin').length;
  const mitraCount = usersList.filter(u => u.role.startsWith('pengelola_')).length;
  const touristCount = usersList.filter(u => u.role === 'wisatawan').length;

  const filteredUsers = usersList.filter(user => {
    const matchSearch = user.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'all' || user.role === roleFilter;
    return matchSearch && matchRole;
  });

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      nama_lengkap: '',
      username: '',
      email: '',
      no_wa: '',
      role: 'wisatawan',
      status: 'Aktif',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserItem) => {
    setEditingUser(user);
    setFormData({
      nama_lengkap: user.nama_lengkap,
      username: user.username,
      email: user.email,
      no_wa: user.no_wa,
      role: user.role,
      status: user.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_lengkap.trim() || !formData.username.trim() || !formData.email.trim()) {
      return;
    }

    if (editingUser) {
      onUpdateUser({
        ...editingUser,
        ...formData,
      });
      onToast(`Data pengguna "${formData.nama_lengkap}" berhasil diperbarui!`);
    } else {
      onAddUser({
        ...formData,
      });
      onToast(`Pengguna baru "${formData.nama_lengkap}" berhasil ditambahkan!`);
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleToggleStatus = (user: UserItem) => {
    const newStatus: UserItem['status'] = user.status === 'Aktif' ? 'Non-aktif' : 'Aktif';
    onUpdateUser({
      ...user,
      status: newStatus,
    });
    onToast(`Status akun "${user.username}" diubah menjadi ${newStatus}.`);
  };

  const getRoleBadge = (role: UserItem['role']) => {
    switch (role) {
      case 'admin':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Administrator</span>;
      case 'pengelola_umkm':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Mitra UMKM</span>;
      case 'pengelola_wisata':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Pengelola Wisata</span>;
      case 'pengelola_homestay':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Mitra Homestay</span>;
      case 'wisatawan':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Wisatawan</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Total Pengguna</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{totalUsers}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#014B35] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Administrator</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{adminCount}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Mitra Desa</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{mitraCount}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Wisatawan Terdaftar</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{touristCount}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Table Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Daftar Pengguna &amp; Hak Akses
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola kredensial akun, peranan mitra, dan status aktif wisatawan.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#014B35] hover:bg-[#003827] text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pengguna</span>
          </button>
        </div>

        {/* Toolbar: Search and Filter */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, username, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-[#014B35]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs py-1.5 px-3 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#014B35] cursor-pointer"
            >
              <option value="all">Semua Peran</option>
              <option value="admin">Administrator</option>
              <option value="pengelola_umkm">Mitra UMKM</option>
              <option value="pengelola_wisata">Pengelola Wisata</option>
              <option value="pengelola_homestay">Mitra Homestay</option>
              <option value="wisatawan">Wisatawan</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-4">Username &amp; Kontak</th>
                <th className="py-3 px-4">Peran (Role)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Terdaftar</th>
                <th className="py-3 px-4 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user, idx) => (
                <tr key={user.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 text-center text-slate-500 font-medium">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">
                        {user.nama_lengkap.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{user.nama_lengkap}</div>
                        <div className="text-[11px] text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-mono text-slate-800">@{user.username}</div>
                    <div className="text-[11px] text-slate-400">{user.no_wa}</div>
                  </td>
                  <td className="py-3 px-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(user)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                        user.status === 'Aktif'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                      }`}
                      title="Klik untuk ubah status"
                    >
                      {user.status}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {user.created_at}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(user)}
                        className="w-7 h-7 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition cursor-pointer"
                        title="Edit Data"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={user.role === 'admin'}
                        onClick={() => setDeleteConfirmId(user.id)}
                        className="w-7 h-7 rounded-md bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Hapus Pengguna"
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

      {/* MODAL TAMBAH / EDIT PENGGUNA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-4">
              {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Hendra Wijaya"
                  value={formData.nama_lengkap}
                  onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="hendra_w"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    No. WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0812-XXXX-XXXX"
                    value={formData.no_wa}
                    onChange={(e) => setFormData({ ...formData, no_wa: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Alamat Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="hendra@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Peran (Role)
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35] bg-white cursor-pointer"
                  >
                    <option value="wisatawan">Wisatawan</option>
                    <option value="pengelola_umkm">Mitra UMKM</option>
                    <option value="pengelola_wisata">Pengelola Wisata</option>
                    <option value="pengelola_homestay">Mitra Homestay</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Akun
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#014B35] bg-white cursor-pointer"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Non-aktif">Non-aktif</option>
                    <option value="Ditangguhkan">Ditangguhkan</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#014B35] hover:bg-[#003827] text-white font-bold shadow-xs transition cursor-pointer"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full p-6 text-center space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Konfirmasi Hapus</h4>
            <p className="text-xs text-slate-500">
              Apakah Anda yakin ingin menghapus akun pengguna ini? Tindakan ini tidak dapat dibatalkan.
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
                  onDeleteUser(deleteConfirmId);
                  setDeleteConfirmId(null);
                  onToast('Pengguna berhasil dihapus dari sistem.');
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
