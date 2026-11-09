import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { CirebonLogo } from './CirebonLogo';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isAdminLoggedIn: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTentang: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isAdminLoggedIn,
  onOpenLogin,
  onLogout,
  cartCount,
  onOpenCart,
  onOpenTentang,
  searchQuery,
  setSearchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (currentView !== 'umkm') {
        onNavigate('umkm');
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo matching Figma */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center text-left focus:outline-none cursor-pointer group"
        >
          <CirebonLogo size="md" showTagline={true} />
        </button>

        {/* Center Navigation Links (Clean Text, No Pill Overuse) */}
        <nav className="hidden md:flex items-center gap-7">
          <button
            onClick={() => onNavigate('home')}
            className={`text-sm font-semibold transition cursor-pointer ${
              currentView === 'home'
                ? 'text-[#014B35] font-bold'
                : 'text-slate-600 hover:text-[#014B35]'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => onNavigate('umkm')}
            className={`text-sm font-semibold transition cursor-pointer ${
              currentView === 'umkm' || currentView === 'detail-produk'
                ? 'text-[#014B35] font-bold'
                : 'text-slate-600 hover:text-[#014B35]'
            }`}
          >
            Produk
          </button>
          <button
            onClick={() => onNavigate('wisata')}
            className={`text-sm font-semibold transition cursor-pointer ${
              currentView === 'wisata'
                ? 'text-[#014B35] font-bold'
                : 'text-slate-600 hover:text-[#014B35]'
            }`}
          >
            Wisata
          </button>
          <button
            onClick={() => onNavigate('homestay')}
            className={`text-sm font-semibold transition cursor-pointer ${
              currentView === 'homestay'
                ? 'text-[#014B35] font-bold'
                : 'text-slate-600 hover:text-[#014B35]'
            }`}
          >
            Penginapan &amp; Hotel
          </button>
          <button
            onClick={onOpenTentang}
            className="text-sm font-semibold text-slate-600 hover:text-[#014B35] transition cursor-pointer"
          >
            Tentang
          </button>
        </nav>

        {/* Right Search Bar & Actions */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="hidden lg:flex relative w-56 xl:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-full bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#014B35] focus:ring-1 focus:ring-[#014B35] outline-none transition"
            />
          </div>

          {/* User Account Button / Dropdown */}
          <div className="relative">
            {isAdminLoggedIn ? (
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
                title="Akun Admin"
              >
                <div className="w-8 h-8 rounded-full bg-[#002B36] text-white flex items-center justify-center font-bold text-xs">
                  AD
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 mr-1 hidden sm:block" />
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="w-9 h-9 rounded-full border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-[#014B35] flex items-center justify-center transition cursor-pointer"
                title="Masuk Pengelola"
              >
                <User className="w-4 h-4" />
              </button>
            )}

            {/* Dropdown for Logged in admin */}
            {userDropdownOpen && isAdminLoggedIn && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100 font-semibold text-slate-800">
                  <div className="text-[11px] text-slate-400">Masuk sebagai</div>
                  <div className="font-bold">admin (Administrator)</div>
                </div>
                <button
                  onClick={() => {
                    onNavigate('admin-overview');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                >
                  <ShieldCheck className="w-4 h-4 text-[#014B35]" />
                  <span>Dashboard Admin</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-rose-50 flex items-center gap-2 text-rose-600 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </button>
              </div>
            )}
          </div>

          {/* Cart Icon with Counter Badge */}
          <button
            onClick={onOpenCart}
            className="relative w-9 h-9 rounded-full border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-[#014B35] flex items-center justify-center transition cursor-pointer"
            title="Keranjang Belanja"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#014B35] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 outline-none"
            />
          </div>
          <div className="space-y-1 pt-1">
            <button
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-lg font-semibold text-xs hover:bg-slate-50"
            >
              Beranda
            </button>
            <button
              onClick={() => { onNavigate('umkm'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-lg font-semibold text-xs hover:bg-slate-50"
            >
              Produk UMKM
            </button>
            <button
              onClick={() => { onNavigate('wisata'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-lg font-semibold text-xs hover:bg-slate-50"
            >
              Destinasi Wisata
            </button>
            <button
              onClick={() => { onNavigate('homestay'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-lg font-semibold text-xs hover:bg-slate-50"
            >
              Penginapan &amp; Hotel
            </button>
            <button
              onClick={() => { onOpenTentang(); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-lg font-semibold text-xs hover:bg-slate-50"
            >
              Tentang CirebonKita
            </button>
            {isAdminLoggedIn && (
              <button
                onClick={() => { onNavigate('admin-overview'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-lg font-bold text-xs bg-emerald-50 text-[#014B35]"
              >
                Dashboard Admin
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
