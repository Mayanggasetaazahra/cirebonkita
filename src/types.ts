export interface WisataItem {
  id: number;
  nama_wisata: string;
  kategori: 'Keraton & Sejarah' | 'Situs Cagar Budaya' | 'Wisata Religi' | 'Wisata Alam & Rekreasi';
  harga_tiket: number;
  deskripsi: string;
  kuota_harian: number;
  kuota_terisi: number;
  foto: string;
  lokasi: string;
  jam_buka: string;
  fasilitas: string;
  status_operasional: 'Buka (Aktif)' | 'Tutup Sementara' | 'Pemeliharaan Spot';
  rating: number;
  ulasan_count: number;
}

export interface UmkmItem {
  id: number;
  kode_sku: string;
  nama_produk: string;
  kategori: 'Batik Cirebon' | 'Kuliner Khas' | 'Kerajinan Tangan' | 'Aksesoris';
  harga: number;
  stok: number;
  deskripsi: string;
  mitra_pengrajin: string;
  desa_asal: string;
  foto: string;
  status_stok: 'Tersedia' | 'Stok Menipis' | 'Kritis' | 'Habis';
  terjual: number;
  rating: number;
}

export interface HomestayItem {
  id: number;
  nama_homestay: string;
  tipe_kamar: string;
  kapasitas_tamu: number;
  harga_per_malam: number;
  fasilitas: string;
  lokasi: string;
  jarak_pusat: string;
  foto: string;
  nama_pemilik: string;
  kontak_pemilik: string;
  status_kamar: 'Tersedia' | 'Penuh' | 'Renovasi';
  avg_rating: number;
  total_ulasan: number;
  kategori?: 'Hotel' | 'Homestay' | 'Guest House';
  bintang?: number;
  deskripsi?: string;
  alamat_lengkap?: string;
  kebijakan?: string[];
  fasilitas_lengkap?: string[];
  checkin_info?: string;
}

export interface BookingItem {
  id: number;
  booking_code: string;
  homestay_id: number;
  nama_homestay: string;
  tipe_kamar: string;
  nama_tamu: string;
  asal_kota: string;
  kontak: string;
  tgl_checkin: string;
  tgl_checkout: string;
  durasi_malam: number;
  jumlah_tamu: number;
  total_biaya: number;
  status_transaksi: 'Terkonfirmasi' | 'Menunggu Pembayaran' | 'Selesai' | 'Batal';
  created_at: string;
}

export interface UlasanItem {
  id: number;
  homestay_id?: number;
  wisata_id?: number;
  nama_homestay?: string;
  nama_wisata?: string;
  target_type?: 'homestay' | 'wisata';
  nama_pengulas: string;
  asal_kota?: string;
  rating_bintang: number;
  komentar: string;
  created_at: string;
  status_moderasi: 'Disetujui' | 'Menunggu Moderasi' | 'Ditolak';
}

export interface CartItem {
  product: UmkmItem;
  quantity: number;
}

export interface UserItem {
  id: number;
  nama_lengkap: string;
  username: string;
  email: string;
  no_wa: string;
  role: 'admin' | 'pengelola_wisata' | 'pengelola_umkm' | 'pengelola_homestay' | 'wisatawan';
  status: 'Aktif' | 'Non-aktif' | 'Ditangguhkan';
  avatar?: string;
  created_at: string;
}

export interface PortalSettings {
  nama_portal: string;
  slogan: string;
  deskripsi: string;
  email_kontak: string;
  telepon_kontak: string;
  alamat_kantor: string;
  jam_operasional: string;
  nama_bank: string;
  no_rekening: string;
  atas_nama: string;
  nmid_qris: string;
  notifikasi_wa: boolean;
  mode_pemeliharaan: boolean;
  maks_tiket_per_transaksi: number;
}
