import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Menu, 
  X, 
  Globe,
  Home as HomeIcon,
  Landmark
} from 'lucide-react';
import { CirebonLogo } from './CirebonLogo';

interface AdminLayoutProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentView,
  onNavigate,
  onLogout,
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getPageTitle = () => {
    switch (currentView) {
      case 'admin-overview':
        return 'Dashboard Overview';
      case 'admin-umkm':
      case 'admin-tambah-umkm':
        return 'Kelola & Tambah Produk';
      case 'admin-kategori':
        return 'Manajemen Kategori Portal';
      case 'admin-wisata':
        return 'Wisata & Tiket';
      case 'admin-homestay':
        return 'Hotel, Homestay & Penginapan';
      case 'admin-pengguna':
        return 'Kelola Pengguna';
      case 'admin-pengaturan':
        return 'Pengaturan Sistem';
      default:
        return 'Dashboard Admin';
    }
  };

  const getCorrespondingPublicView = () => {
    switch (currentView) {
      case 'admin-homestay':
        return 'homestay';
      case 'admin-wisata':
        return 'wisata';
      case 'admin-umkm':
      case 'admin-tambah-umkm':
      case 'admin-kategori':
        return 'umkm';
      default:
        return 'home';
    }
  };

  const getCorrespondingPublicLabel = () => {
    switch (currentView) {
      case 'admin-homestay':
        return 'Halaman Penginapan & Hotel';
      case 'admin-wisata':
        return 'Halaman Wisata';
      case 'admin-umkm':
      case 'admin-tambah-umkm':
      case 'admin-kategori':
        return 'Katalog Produk UMKM';
      default:
        return 'Beranda Publik';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row font-sans text-slate-800">
      {/* SIDEBAR ADMIN (Deep Teal #002B36 matching Image 1) */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#002B36] text-white flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <button 
              onClick={() => onNavigate('home')} 
              className="focus:outline-none cursor-pointer"
            >
              <CirebonLogo variant="light" size="sm" showTagline={false} />
            </button>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Badge matching Image 1 */}
          <div className="p-4 mx-3 my-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-200/20 border border-white/20 flex items-center justify-center font-bold text-white text-xs shrink-0">
              AD
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">admin</div>
              <div className="text-[11px] text-emerald-300/80 truncate">Administrator</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1 text-xs">
            {/* Dashboard Overview */}
            <button
              onClick={() => {
                onNavigate('admin-overview');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition cursor-pointer ${
                currentView === 'admin-overview'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Dashboard</span>
            </button>

            {/* Produk (Kelola & Tambah di Satu Halaman) */}
            <button
              onClick={() => {
                onNavigate('admin-umkm');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition cursor-pointer ${
                currentView === 'admin-umkm' || currentView === 'admin-tambah-umkm'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4 text-emerald-400" />
              <span>Produk</span>
            </button>

            {/* Kategori */}
            <button
              onClick={() => {
                onNavigate('admin-kategori');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition cursor-pointer ${
                currentView === 'admin-kategori'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FolderTree className="w-4 h-4 text-emerald-400" />
              <span>Kategori</span>
            </button>

            {/* Pesanan */}
            <button
              onClick={() => {
                onNavigate('admin-overview');
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium text-slate-300 hover:bg-white/5 hover:text-white transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-4 h-4 text-emerald-400" />
                <span>Pesanan</span>
              </div>
              <span className="bg-purple-500/30 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                12
              </span>
            </button>

            {/* Wisata & Tiket (Integrated Module) */}
            <button
              onClick={() => {
                onNavigate('admin-wisata');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition cursor-pointer ${
                currentView === 'admin-wisata'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Landmark className="w-4 h-4 text-emerald-400" />
              <span>Wisata &amp; Tiket</span>
            </button>

            {/* Penginapan & Hotel (Integrated Module) */}
            <button
              onClick={() => {
                onNavigate('admin-homestay');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition cursor-pointer ${
                currentView === 'admin-homestay'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <HomeIcon className="w-4 h-4 text-emerald-400" />
              <span>Penginapan &amp; Hotel</span>
            </button>

            {/* Pengguna */}
            <button
              onClick={() => {
                onNavigate('admin-pengguna');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition cursor-pointer ${
                currentView === 'admin-pengguna'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Pengguna</span>
            </button>

            {/* Pengaturan */}
            <button
              onClick={() => {
                onNavigate('admin-pengaturan');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition cursor-pointer ${
                currentView === 'admin-pengaturan'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              <span>Pengaturan</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer with Logout & Portal link */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-white/5 rounded-lg transition cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            <span>Lihat Portal Publik</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar matching Image 1 */}
        <header className="bg-white border-b border-slate-200 h-18 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Breadcrumb matching Image 1 right side */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <button 
                onClick={() => onNavigate('home')}
                className="hover:text-slate-600 flex items-center gap-1 cursor-pointer"
              >
                <span>🏠 Beranda</span>
              </button>
              <span>/</span>
              <span className="text-slate-600 font-medium">{getPageTitle()}</span>
            </div>

            {/* Notification bell */}
            <button 
              type="button"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              title="Notifikasi"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#002B36] text-white flex items-center justify-center font-bold text-xs select-none">
              AD
            </div>
          </div>
        </header>

        {/* Dynamic Main Body Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
