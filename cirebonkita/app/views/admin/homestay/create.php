<?php
/**
 * ====================================================================
 * VIEW ADMIN: FORM TAMBAH MITRA HOMESTAY (create.php)
 * ====================================================================
 * Proyek      : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Divisi      : Homestay & Akomodasi
 * Modul       : CRUD Booking Homestay & Moderasi Ulasan
 * ====================================================================
 */
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($judul); ?></title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= BASEURL; ?>/assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="admin-body">

<div class="admin-wrapper">
    <aside class="admin-sidebar">
        <div class="sidebar-brand">
            <div class="sidebar-brand-icon"><i class="fa-solid fa-mountain-sun"></i></div>
            <div>
                <h4 class="sidebar-title">CirebonKita</h4>
                <span class="sidebar-subtitle">PANEL ADMINISTRATOR</span>
            </div>
        </div>
        <div class="sidebar-menu-wrapper">
            <a href="<?= BASEURL; ?>/admin" class="sidebar-nav-item"><i class="fa-solid fa-table-cells-large"></i> <span>Overview Portal</span></a>
            <a href="<?= BASEURL; ?>/wisata/admin" class="sidebar-nav-item"><i class="fa-solid fa-monument"></i> <span>Wisata & Tiket</span></a>
            <a href="<?= BASEURL; ?>/umkm/admin" class="sidebar-nav-item"><i class="fa-solid fa-store"></i> <span>Produk UMKM</span></a>
            <a href="<?= BASEURL; ?>/homestay/admin" class="sidebar-nav-item active"><i class="fa-solid fa-house-chimney-user"></i> <span>Homestay & Ulasan</span></a>
        </div>
    </aside>

    <main class="admin-main">
        <header class="admin-topbar">
            <div class="topbar-breadcrumbs">
                <a href="<?= BASEURL; ?>/homestay/admin">Homestay & Ulasan</a> / <span>Tambah Mitra Homestay</span>
            </div>
            <div class="topbar-right">
                <div class="admin-profile-pill"><div class="profile-avatar">AD</div><span>Pengelola Homestay</span></div>
            </div>
        </header>

        <div class="admin-content-pad">
            <div class="form-container-card">
                <div class="form-header-box">
                    <div>
                        <h2 class="form-main-title">Tambah Mitra Homestay Baru</h2>
                        <p class="form-sub-title">Divisi Homestay & Akomodasi &bull; Kemitraan Hunian Ramah Warga</p>
                    </div>
                    <a href="<?= BASEURL; ?>/homestay/admin" class="btn btn-outline-secondary"><i class="fa-solid fa-arrow-left"></i> Kembali</a>
                </div>

                <form action="<?= BASEURL; ?>/homestay/simpan" method="POST" enctype="multipart/form-data" class="admin-crud-form">
                    <div class="form-grid-2">
                        <div class="form-group">
                            <label for="nama_homestay">Nama Unit Homestay <span class="text-danger">*</span></label>
                            <input type="text" id="nama_homestay" name="nama_homestay" class="form-control" placeholder="Contoh: Homestay Keraton Asri" required>
                        </div>

                        <div class="form-group">
                            <label for="tipe_kamar">Tipe Kamar / Hunian <span class="text-danger">*</span></label>
                            <input type="text" id="tipe_kamar" name="tipe_kamar" class="form-control" placeholder="Contoh: Kamar Tradisional A1" required>
                        </div>
                    </div>

                    <div class="form-grid-2">
                        <div class="form-group">
                            <label for="harga_per_malam">Tarif Sewa per Malam (Rp) <span class="text-danger">*</span></label>
                            <input type="number" id="harga_per_malam" name="harga_per_malam" class="form-control" placeholder="Contoh: 250000" min="50000" required>
                        </div>

                        <div class="form-group">
                            <label for="kapasitas_tamu">Maksimal Kapasitas Tamu (Orang) <span class="text-danger">*</span></label>
                            <input type="number" id="kapasitas_tamu" name="kapasitas_tamu" class="form-control" value="2" min="1" required>
                        </div>
                    </div>

                    <div class="form-grid-2">
                        <div class="form-group">
                            <label for="lokasi">Alamat Lengkap <span class="text-danger">*</span></label>
                            <input type="text" id="lokasi" name="lokasi" class="form-control" placeholder="Jl. Kasepuhan Lemahwungkuk, Cirebon" required>
                        </div>

                        <div class="form-group">
                            <label for="jarak_pusat">Jarak dari Objek Wisata</label>
                            <input type="text" id="jarak_pusat" name="jarak_pusat" class="form-control" value="250m dari Keraton Kasepuhan" required>
                        </div>
                    </div>

                    <div class="form-grid-2">
                        <div class="form-group">
                            <label for="nama_pemilik">Nama Tuan Rumah / Pemilik <span class="text-danger">*</span></label>
                            <input type="text" id="nama_pemilik" name="nama_pemilik" class="form-control" placeholder="Contoh: Haji Syarif" required>
                        </div>

                        <div class="form-group">
                            <label for="kontak_pemilik">Kontak WhatsApp Pemilik <span class="text-danger">*</span></label>
                            <input type="tel" id="kontak_pemilik" name="kontak_pemilik" class="form-control" placeholder="0812-9988-1209" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="fasilitas">Fasilitas Homestay (Pisahkan koma)</label>
                        <input type="text" id="fasilitas" name="fasilitas" class="form-control" value="WiFi Kencang, AC Dingin, Sarapan Sega Jamblang, Air Panas, Parkir">
                    </div>

                    <div class="form-group">
                        <label for="foto">Upload Foto Homestay (Maks 2MB) <span class="text-danger">*</span></label>
                        <input type="file" id="foto" name="foto" class="form-control file-input" accept="image/*" required>
                    </div>

                    <div class="form-action-buttons mt-30">
                        <a href="<?= BASEURL; ?>/homestay/admin" class="btn btn-secondary">Batal</a>
                        <button type="submit" class="btn btn-teal-solid">
                            <i class="fa-solid fa-save"></i> Simpan Unit Homestay
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </main>
</div>

</body>
</html>
