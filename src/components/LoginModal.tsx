import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  User, 
  AlertCircle, 
  KeyRound, 
  UserPlus, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Store,
  Compass,
  Home as HomeIcon,
  Globe
} from 'lucide-react';
import { UserItem } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userRole?: string) => void;
  onRegisterUser?: (newUser: UserItem) => void;
  usersList: UserItem[];
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onRegisterUser,
  usersList,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login Form States (Empty by default for production security)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Register Form States
  const [regNama, setRegNama] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserItem['role']>('wisatawan');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [regSuccessMsg, setRegSuccessMsg] = useState('');

  // Clear credentials whenever modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setLoginIdentifier('');
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      // Check admin default
      if (loginIdentifier.trim() === 'admin' && password === 'admin123') {
        onLoginSuccess('admin');
        onClose();
        return;
      }

      // Check against registered users list
      const matchedUser = usersList.find(
        u => (u.username.toLowerCase() === loginIdentifier.trim().toLowerCase() ||
              u.email.toLowerCase() === loginIdentifier.trim().toLowerCase())
      );

      if (matchedUser) {
        if (matchedUser.status === 'Non-aktif' || matchedUser.status === 'Ditangguhkan') {
          setError(`Akun status "${matchedUser.status}". Silakan hubungi admin pengelola.`);
          return;
        }
        onLoginSuccess(matchedUser.role);
        onClose();
      } else {
        setError('Kredensial tidak valid. Silakan periksa kembali username/email dan kata sandi Anda.');
      }
    }, 350);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!regNama.trim() || !regUsername.trim() || !regEmail.trim() || !regPassword) {
      setError('Mohon lengkapi seluruh kolom formulir wajib.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Kata sandi minimal harus terdiri dari 6 karakter.');
      return;
    }

    if (regPassword !== regPasswordConfirm) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    // Check if username or email already exists
    const exists = usersList.some(
      u => u.username.toLowerCase() === regUsername.trim().toLowerCase() ||
           u.email.toLowerCase() === regEmail.trim().toLowerCase()
    );

    if (exists) {
      setError('Username atau email tersebut sudah terdaftar.');
      return;
    }

    const newUser: UserItem = {
      id: Date.now(),
      nama_lengkap: regNama.trim(),
      username: regUsername.trim().toLowerCase(),
      email: regEmail.trim().toLowerCase(),
      no_wa: regPhone.trim() || '0812-3456-7890',
      role: regRole,
      status: 'Aktif',
      created_at: new Date().toISOString().slice(0, 10),
    };

    if (onRegisterUser) {
      onRegisterUser(newUser);
    }

    setRegSuccessMsg(`Akun "${newUser.nama_lengkap}" berhasil didaftarkan!`);
    setTimeout(() => {
      setRegSuccessMsg('');
      setActiveTab('login');
      setLoginIdentifier(newUser.username);
      setPassword(regPassword);
    }, 1200);
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#002B36] p-6 text-white relative">
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-2.5 backdrop-blur-xs">
            {activeTab === 'login' ? (
              <Lock className="w-5 h-5 text-emerald-300" />
            ) : (
              <UserPlus className="w-5 h-5 text-emerald-300" />
            )}
          </div>
          <h2 className="text-xl font-bold">
            {activeTab === 'login' ? 'Masuk ke CirebonKita' : 'Daftar Akun Baru'}
          </h2>
          <p className="text-xs text-white/80 mt-1">
            {activeTab === 'login' 
              ? 'Akses portal pengelola desa wisata, mitra UMKM, dan wisatawan' 
              : 'Bergabung bersama komunitas dan ekosistem Desa Wisata Cirebon'}
          </p>

          {/* Tab Selector */}
          <div className="flex bg-white/10 p-1 rounded-lg mt-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setError(''); }}
              className={`flex-1 py-1.5 rounded-md transition cursor-pointer ${
                activeTab === 'login' 
                  ? 'bg-white text-[#002B36] shadow-xs' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Masuk (Sign In)
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setError(''); }}
              className={`flex-1 py-1.5 rounded-md transition cursor-pointer ${
                activeTab === 'register' 
                  ? 'bg-white text-[#002B36] shadow-xs' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Daftar (Register)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {regSuccessMsg && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{regSuccessMsg}</span>
            </div>
          )}

          {/* TAB 1: LOGIN (SIGN IN) */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username atau Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Masukkan username atau email Anda"
                    autoComplete="username"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#014B35]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi Anda"
                    autoComplete="current-password"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#014B35]"
                  />
                </div>
              </div>



              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#014B35] hover:bg-[#003827] text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Memverifikasi...' : 'Masuk ke Sistem'}
                </button>
              </div>
            </form>
          ) : (
            /* TAB 2: REGISTER (DAFTAR AKUN BARU) */
            <form onSubmit={handleRegisterSubmit} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ahmad Fadilah"
                    value={regNama}
                    onChange={(e) => setRegNama(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#014B35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ahmad99"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#014B35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    No. WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="0812-XXXX-XXXX"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full text-xs pl-8 pr-2.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#014B35]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#014B35]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kategori Peran / Akun
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#014B35] bg-white cursor-pointer"
                >
                  <option value="wisatawan">Wisatawan / Pengunjung Umum</option>
                  <option value="pengelola_umkm">Mitra Usaha UMKM &amp; Kuliner</option>
                  <option value="pengelola_homestay">Mitra Pemilik Homestay</option>
                  <option value="pengelola_wisata">Staf Loket / Pemandu Wisata</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kata Sandi *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 karakter"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#014B35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ulangi Sandi *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Ketik ulang"
                    value={regPasswordConfirm}
                    onChange={(e) => setRegPasswordConfirm(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#014B35]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#014B35] hover:bg-[#003827] text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftar Akun Baru</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
