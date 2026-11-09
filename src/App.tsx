import React, { useState, useEffect } from 'react';
import { 
  initialWisataData, 
  initialUmkmData, 
  initialHomestayData, 
  initialBookingData, 
  initialUlasanData,
  initialUserData,
  initialSettingsData
} from './data/initialData';
import { 
  WisataItem, 
  UmkmItem, 
  HomestayItem, 
  BookingItem, 
  UlasanItem, 
  CartItem, 
  UserItem, 
  PortalSettings 
} from './types';
import { exportCirebonKitaZip } from './utils/zipExport';
import { STORAGE_KEYS, loadStoredData, saveStoredData } from './utils/storage';
import { syncInitWithServer, saveModuleToServer, startServerSyncWatcher } from './utils/apiSync';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PublicHome } from './components/PublicHome';
import { PublicWisata } from './components/PublicWisata';
import { PublicUmkm } from './components/PublicUmkm';
import { ProductDetail } from './components/ProductDetail';
import { PublicHomestay } from './components/PublicHomestay';

import { AdminLayout } from './components/AdminLayout';
import { AdminOverview } from './components/AdminOverview';
import { AdminWisata } from './components/AdminWisata';
import { AdminUmkm } from './components/AdminUmkm';
import { AdminKategori } from './components/AdminKategori';
import { AdminHomestay } from './components/AdminHomestay';
import { AdminPengguna } from './components/AdminPengguna';
import { AdminPengaturan } from './components/AdminPengaturan';

import { CartDrawer } from './components/CartDrawer';
import { LoginModal } from './components/LoginModal';
import { TentangModal } from './components/TentangModal';

export default function App() {
  // Main Data States with LocalStorage Persistence
  const [wisataList, setWisataList] = useState<WisataItem[]>(() => 
    loadStoredData(STORAGE_KEYS.WISATA, initialWisataData)
  );
  const [umkmList, setUmkmList] = useState<UmkmItem[]>(() => 
    loadStoredData(STORAGE_KEYS.UMKM, initialUmkmData)
  );
  const [homestayList, setHomestayList] = useState<HomestayItem[]>(() => 
    loadStoredData(STORAGE_KEYS.HOMESTAY, initialHomestayData)
  );
  const [bookingList, setBookingList] = useState<BookingItem[]>(() => 
    loadStoredData(STORAGE_KEYS.BOOKING, initialBookingData)
  );
  const [ulasanList, setUlasanList] = useState<UlasanItem[]>(() => 
    loadStoredData(STORAGE_KEYS.ULASAN, initialUlasanData)
  );
  const [usersList, setUsersList] = useState<UserItem[]>(() => 
    loadStoredData(STORAGE_KEYS.USERS, initialUserData)
  );
  const [portalSettings, setPortalSettings] = useState<PortalSettings>(() => 
    loadStoredData(STORAGE_KEYS.SETTINGS, initialSettingsData)
  );

  // Selected item states
  const [selectedProduct, setSelectedProduct] = useState<UmkmItem>(() => {
    const list = loadStoredData(STORAGE_KEYS.UMKM, initialUmkmData);
    return list[0] || initialUmkmData[0];
  });
  const [selectedWisataModal, setSelectedWisataModal] = useState<WisataItem | null>(null);

  // Cart & Search State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Authentication & Unified View Navigation with LocalStorage Persistence
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => 
    loadStoredData(STORAGE_KEYS.AUTH, false)
  );
  const [activeUserRole, setActiveUserRole] = useState<string>('admin');
  const [currentView, setCurrentView] = useState<string>('home');

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isTentangModalOpen, setIsTentangModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Cart Handlers
  const handleAddToCart = (product: UmkmItem, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + qty;
        if (newQty > product.stok) {
          showToast(`Stok maksimal untuk ${product.nama_produk} telah tercapai!`);
          return prev;
        }
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: newQty } 
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    showToast(`"${product.nama_produk}" (${qty} pcs) ditambahkan ke keranjang!`);
  };

  const handleUpdateCartQuantity = (id: number, delta: number) => {
    setCartItems(prev => 
      prev.map(item => {
        if (item.product.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const handleRemoveCartItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== id));
    showToast('Produk dihapus dari keranjang.');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Booking & Review Public Handlers
  const handleAddBooking = (booking: BookingItem) => {
    setBookingList(prev => {
      const next = [booking, ...prev];
      saveStoredData(STORAGE_KEYS.BOOKING, next);
      saveModuleToServer('booking', next);
      return next;
    });
    showToast(`Reservasi ${booking.booking_code} berhasil diajukan untuk ${booking.nama_tamu}!`);
  };

  const handleAddUlasan = (ulasan: UlasanItem) => {
    setUlasanList(prev => {
      const next = [ulasan, ...prev];
      saveStoredData(STORAGE_KEYS.ULASAN, next);
      saveModuleToServer('ulasan', next);
      return next;
    });
    showToast('Terima kasih! Ulasan Anda telah dikirim dan menunggu moderasi admin desa.');
  };

  // Load & Hydrate from Centralized Server, and start real-time sync watcher
  useEffect(() => {
    let isMounted = true;

    syncInitWithServer({
      wisata: initialWisataData,
      umkm: initialUmkmData,
      homestay: initialHomestayData,
      booking: initialBookingData,
      ulasan: initialUlasanData,
      users: initialUserData,
      settings: initialSettingsData,
    }).then(({ data }) => {
      if (!isMounted) return;
      if (data.wisata && data.wisata.length > 0) setWisataList(data.wisata);
      if (data.umkm && data.umkm.length > 0) setUmkmList(data.umkm);
      if (data.homestay && data.homestay.length > 0) setHomestayList(data.homestay);
      if (data.booking && data.booking.length > 0) setBookingList(data.booking);
      if (data.ulasan && data.ulasan.length > 0) setUlasanList(data.ulasan);
      if (data.users && data.users.length > 0) setUsersList(data.users);
      if (data.settings) setPortalSettings(data.settings);
    });

    const stopWatcher = startServerSyncWatcher((freshData) => {
      if (!isMounted) return;
      if (freshData.wisata) setWisataList(freshData.wisata);
      if (freshData.umkm) setUmkmList(freshData.umkm);
      if (freshData.homestay) setHomestayList(freshData.homestay);
      if (freshData.booking) setBookingList(freshData.booking);
      if (freshData.ulasan) setUlasanList(freshData.ulasan);
      if (freshData.users) setUsersList(freshData.users);
      if (freshData.settings) setPortalSettings(freshData.settings);
    }, 4000);

    return () => {
      isMounted = false;
      stopWatcher();
    };
  }, []);

  // Auto-persist reactive hooks to guarantee persistence across any reload or tab close
  useEffect(() => {
    saveStoredData(STORAGE_KEYS.WISATA, wisataList);
  }, [wisataList]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.UMKM, umkmList);
  }, [umkmList]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.HOMESTAY, homestayList);
  }, [homestayList]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.BOOKING, bookingList);
  }, [bookingList]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.ULASAN, ulasanList);
  }, [ulasanList]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.USERS, usersList);
  }, [usersList]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.SETTINGS, portalSettings);
  }, [portalSettings]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.AUTH, isAdminLoggedIn);
  }, [isAdminLoggedIn]);

  // Admin CRUD Handlers: Wisata
  const handleAddWisata = (item: Omit<WisataItem, 'id' | 'rating' | 'ulasan_count'>) => {
    const newItem: WisataItem = {
      ...item,
      id: Date.now(),
      rating: 5.0,
      ulasan_count: 1
    };
    setWisataList(prev => {
      const next = [newItem, ...prev];
      saveStoredData(STORAGE_KEYS.WISATA, next);
      saveModuleToServer('wisata', next);
      return next;
    });
    showToast('Destinasi wisata baru berhasil ditambahkan!');
  };

  const handleUpdateWisata = (updated: WisataItem) => {
    setWisataList(prev => {
      const next = prev.map(w => Number(w.id) === Number(updated.id) ? updated : w);
      saveStoredData(STORAGE_KEYS.WISATA, next);
      saveModuleToServer('wisata', next);
      return next;
    });
    setSelectedWisataModal(prev => prev && Number(prev.id) === Number(updated.id) ? updated : prev);
    showToast(`Data destinasi wisata "${updated.nama_wisata}" berhasil diperbarui di seluruh website!`);
  };

  const handleDeleteWisata = (id: number) => {
    setWisataList(prev => {
      const next = prev.filter(w => Number(w.id) !== Number(id));
      saveStoredData(STORAGE_KEYS.WISATA, next);
      saveModuleToServer('wisata', next);
      return next;
    });
    showToast('Destinasi wisata berhasil dihapus dari basis data.');
  };

  // Admin CRUD Handlers: UMKM
  const handleAddUmkm = (item: Omit<UmkmItem, 'id' | 'terjual' | 'rating'>) => {
    const newItem: UmkmItem = {
      ...item,
      id: Date.now(),
      terjual: 0,
      rating: 5.0
    };
    setUmkmList(prev => {
      const next = [newItem, ...prev];
      saveStoredData(STORAGE_KEYS.UMKM, next);
      saveModuleToServer('umkm', next);
      return next;
    });
    showToast('Produk UMKM baru berhasil didaftarkan ke etalase!');
  };

  const handleUpdateUmkm = (updated: UmkmItem) => {
    setUmkmList(prev => {
      const next = prev.map(u => Number(u.id) === Number(updated.id) ? updated : u);
      saveStoredData(STORAGE_KEYS.UMKM, next);
      saveModuleToServer('umkm', next);
      return next;
    });
    setSelectedProduct(prev => prev && Number(prev.id) === Number(updated.id) ? updated : prev);
    setCartItems(prev => prev.map(item => Number(item.product.id) === Number(updated.id) ? { ...item, product: updated } : item));
    showToast(`Data produk UMKM "${updated.nama_produk}" berhasil diperbarui di seluruh website!`);
  };

  const handleDeleteUmkm = (id: number) => {
    setUmkmList(prev => {
      const next = prev.filter(u => Number(u.id) !== Number(id));
      saveStoredData(STORAGE_KEYS.UMKM, next);
      saveModuleToServer('umkm', next);
      return next;
    });
    showToast('Produk UMKM berhasil dihapus.');
  };

  // Admin CRUD Handlers: Homestay
  const handleAddHomestay = (item: Omit<HomestayItem, 'id' | 'avg_rating' | 'total_ulasan'>) => {
    const newItem: HomestayItem = {
      ...item,
      id: Date.now(),
      avg_rating: 5.0,
      total_ulasan: 0
    };
    setHomestayList(prev => {
      const next = [newItem, ...prev];
      saveStoredData(STORAGE_KEYS.HOMESTAY, next);
      saveModuleToServer('homestay', next);
      return next;
    });
    showToast('Mitra homestay baru berhasil ditambahkan!');
  };

  const handleUpdateHomestay = (updated: HomestayItem) => {
    setHomestayList(prev => {
      const next = prev.map(h => Number(h.id) === Number(updated.id) ? updated : h);
      saveStoredData(STORAGE_KEYS.HOMESTAY, next);
      saveModuleToServer('homestay', next);
      return next;
    });
    showToast(`Data homestay "${updated.nama_homestay}" berhasil diperbarui di seluruh website!`);
  };

  const handleDeleteHomestay = (id: number) => {
    setHomestayList(prev => {
      const next = prev.filter(h => Number(h.id) !== Number(id));
      saveStoredData(STORAGE_KEYS.HOMESTAY, next);
      saveModuleToServer('homestay', next);
      return next;
    });
    showToast('Data homestay berhasil dihapus.');
  };

  const handleUpdateBookingStatus = (id: number, status: BookingItem['status_transaksi']) => {
    setBookingList(prev => {
      const next = prev.map(b => Number(b.id) === Number(id) ? { ...b, status_transaksi: status } : b);
      saveStoredData(STORAGE_KEYS.BOOKING, next);
      saveModuleToServer('booking', next);
      return next;
    });
    showToast(`Status reservasi diperbarui menjadi: ${status}`);
  };

  const handleDeleteBooking = (id: number) => {
    setBookingList(prev => {
      const next = prev.filter(b => Number(b.id) !== Number(id));
      saveStoredData(STORAGE_KEYS.BOOKING, next);
      saveModuleToServer('booking', next);
      return next;
    });
    showToast('Data reservasi tamu berhasil dihapus dari sistem.');
  };

  const handleUpdateUlasanStatus = (id: number, status: UlasanItem['status_moderasi']) => {
    setUlasanList(prev => {
      const next = prev.map(u => Number(u.id) === Number(id) ? { ...u, status_moderasi: status } : u);
      saveStoredData(STORAGE_KEYS.ULASAN, next);
      saveModuleToServer('ulasan', next);
      return next;
    });
    showToast(`Status moderasi ulasan diperbarui menjadi: ${status}`);
  };

  // User Management Handlers (Pengguna)
  const handleAddUser = (user: Omit<UserItem, 'id' | 'created_at'>) => {
    const newUser: UserItem = {
      ...user,
      id: Date.now(),
      created_at: new Date().toISOString().slice(0, 10),
    };
    setUsersList(prev => {
      const next = [newUser, ...prev];
      saveStoredData(STORAGE_KEYS.USERS, next);
      saveModuleToServer('users', next);
      return next;
    });
  };

  const handleUpdateUser = (updated: UserItem) => {
    setUsersList(prev => {
      const next = prev.map(u => Number(u.id) === Number(updated.id) ? updated : u);
      saveStoredData(STORAGE_KEYS.USERS, next);
      saveModuleToServer('users', next);
      return next;
    });
  };

  const handleDeleteUser = (id: number) => {
    setUsersList(prev => {
      const next = prev.filter(u => Number(u.id) !== Number(id));
      saveStoredData(STORAGE_KEYS.USERS, next);
      saveModuleToServer('users', next);
      return next;
    });
  };

  const handleRegisterUser = (newUser: UserItem) => {
    setUsersList(prev => {
      const next = [newUser, ...prev];
      saveStoredData(STORAGE_KEYS.USERS, next);
      saveModuleToServer('users', next);
      return next;
    });
    showToast(`Pendaftaran berhasil! Akun "${newUser.nama_lengkap}" siap digunakan.`);
  };

  // Settings Handlers (Pengaturan)
  const handleUpdateSettings = (newSettings: PortalSettings) => {
    setPortalSettings(newSettings);
    saveStoredData(STORAGE_KEYS.SETTINGS, newSettings);
    saveModuleToServer('settings', newSettings);
  };

  // ZIP Download Handler
  const handleDownloadZip = async () => {
    showToast('Sedang membuat arsip cirebonkita.zip...');
    try {
      await exportCirebonKitaZip();
      showToast('Arsip cirebonkita.zip berhasil diunduh!');
    } catch {
      showToast('Gagal membuat file zip. Anda dapat melihat kode di panel penjelajah.');
    }
  };

  // Navigation handlers
  const handleNavigate = (view: string) => {
    if (view.startsWith('admin') && !isAdminLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    saveStoredData(STORAGE_KEYS.AUTH, false);
    setCurrentView('home');
    showToast('Anda telah keluar dari konsol admin.');
  };

  const handleLoginSuccess = (role = 'admin') => {
    setIsAdminLoggedIn(true);
    setActiveUserRole(role);
    if (role === 'wisatawan') {
      setCurrentView('home');
      showToast('Selamat datang kembali di CirebonKita!');
    } else {
      setCurrentView('admin-overview');
      showToast(`Selamat datang di Konsol Pengelola Desa Wisata CirebonKita (${role})!`);
    }
  };

  const isAdminView = currentView.startsWith('admin');

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0B192C] flex flex-col font-sans selection:bg-[#014B35] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#002B36] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-white/20 animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin or Public Screens */}
      {isAdminView && isAdminLoggedIn ? (
        <AdminLayout
          currentView={currentView}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        >
          {currentView === 'admin-overview' && (
            <AdminOverview
              wisataList={wisataList}
              umkmList={umkmList}
              homestayList={homestayList}
              bookingList={bookingList}
              onNavigateTab={(tab) => setCurrentView(`admin-${tab}`)}
              onDownloadZip={handleDownloadZip}
            />
          )}

          {(currentView === 'admin-umkm' || currentView === 'admin-tambah-umkm') && (
            <AdminUmkm
              umkmList={umkmList}
              onAddUmkm={handleAddUmkm}
              onUpdateUmkm={handleUpdateUmkm}
              onDeleteUmkm={handleDeleteUmkm}
            />
          )}

          {currentView === 'admin-kategori' && (
            <AdminKategori
              umkmList={umkmList}
              wisataList={wisataList}
              homestayList={homestayList}
              onNavigate={handleNavigate}
              onToast={showToast}
            />
          )}

          {currentView === 'admin-wisata' && (
            <AdminWisata
              wisataList={wisataList}
              onAddWisata={handleAddWisata}
              onUpdateWisata={handleUpdateWisata}
              onDeleteWisata={handleDeleteWisata}
            />
          )}

          {currentView === 'admin-homestay' && (
            <AdminHomestay
              homestayList={homestayList}
              bookingList={bookingList}
              ulasanList={ulasanList}
              onAddHomestay={handleAddHomestay}
              onUpdateHomestay={handleUpdateHomestay}
              onDeleteHomestay={handleDeleteHomestay}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onDeleteBooking={handleDeleteBooking}
              onUpdateUlasanStatus={handleUpdateUlasanStatus}
              onAddBooking={handleAddBooking}
              onToast={showToast}
            />
          )}

          {currentView === 'admin-pengguna' && (
            <AdminPengguna
              usersList={usersList}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              onToast={showToast}
            />
          )}

          {currentView === 'admin-pengaturan' && (
            <AdminPengaturan
              settings={portalSettings}
              onUpdateSettings={handleUpdateSettings}
              onToast={showToast}
            />
          )}
        </AdminLayout>
      ) : (
        <div className="flex-1 flex flex-col">
          <Navbar
            currentView={currentView}
            onNavigate={handleNavigate}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onLogout={handleLogout}
            cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenTentang={() => setIsTentangModalOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <main className="flex-1">
            {currentView === 'home' && (
              <PublicHome
                wisataList={wisataList}
                umkmList={umkmList}
                homestayList={homestayList}
                onNavigate={handleNavigate}
                onAddToCart={(item) => handleAddToCart(item, 1)}
                onSelectProduct={(item) => {
                  setSelectedProduct(item);
                  setCurrentView('detail-produk');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentView === 'umkm' && (
              <PublicUmkm
                umkmList={umkmList}
                onAddToCart={(item) => handleAddToCart(item, 1)}
                onSelectProduct={(item) => {
                  setSelectedProduct(item);
                  setCurrentView('detail-produk');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}

            {currentView === 'detail-produk' && (
              <ProductDetail
                product={selectedProduct}
                allProducts={umkmList}
                onNavigate={handleNavigate}
                onAddToCart={(prod, qty) => {
                  handleAddToCart(prod, qty);
                  setIsCartOpen(true);
                }}
                onSelectProduct={(prod) => {
                  setSelectedProduct(prod);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onToast={showToast}
              />
            )}

            {currentView === 'wisata' && (
              <PublicWisata
                wisataList={wisataList}
                onNavigate={handleNavigate}
                selectedWisataModal={selectedWisataModal}
                setSelectedWisataModal={setSelectedWisataModal}
              />
            )}

            {currentView === 'homestay' && (
              <PublicHomestay
                homestayList={homestayList}
                ulasanList={ulasanList}
                onNavigate={handleNavigate}
                onAddUlasan={handleAddUlasan}
                onAddBooking={handleAddBooking}
              />
            )}
          </main>

          <Footer
            onNavigate={handleNavigate}
            onOpenTentang={() => setIsTentangModalOpen(true)}
          />
        </div>
      )}

      {/* Cart Drawer Modal */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Login & Register Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterUser={handleRegisterUser}
        usersList={usersList}
      />

      {/* Tentang Modal */}
      <TentangModal
        isOpen={isTentangModalOpen}
        onClose={() => setIsTentangModalOpen(false)}
      />
    </div>
  );
}
