<?php
/**
 * ====================================================================
 * VIEW ADMIN: DASHBOARD OVERVIEW (dashboard.php)
 * ====================================================================
 * Proyek  : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Sistem  : Smart Tourism Sektor Pariwisata Daerah Cirebon
 * ====================================================================
 */
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($judul ?? 'Dashboard Administrator - CirebonKita'); ?></title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= BASEURL; ?>/assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="admin-body">

<div class="admin-wrapper">
    <!-- SIDEBAR ADMIN -->
    <aside class="admin-sidebar">
        <div class="sidebar-brand">
            <div class="sidebar-brand-icon">
                <i class="fa-solid fa-mountain-sun"></i>
            </div>
            <div>
                <h4 class="sidebar-title">CirebonKita</h4>
                <span class="sidebar-subtitle">PANEL ADMINISTRATOR</span>
            </div>
        </div>

        <div class="sidebar-menu-wrapper">
            <div class="sidebar-section-title">RINGKASAN SISTEM</div>
            <a href="<?= BASEURL; ?>/admin" class="sidebar-nav-item active">
                <i class="fa-solid fa-table-cells-large"></i>
                <span>Overview Portal</span>
            </a>

            <div class="sidebar-section-title">DIVISI PENGELOLA</div>
            
            <!-- Modul 1: Wisata & Tiket -->
            <a href="<?= BASEURL; ?>/wisata/admin" class="sidebar-nav-item">
                <i class="fa-solid fa-monument"></i>
                <div class="nav-label-box">
                    <span class="nav-title">Wisata & Tiket</span>
                    <small class="nav-dev">Divisi Wisata & Tiket</small>
                </div>
            </a>

            <!-- Modul 2: Produk UMKM -->
            <a href="<?= BASEURL; ?>/umkm/admin" class="sidebar-nav-item">
                <i class="fa-solid fa-store"></i>
                <div class="nav-label-box">
                    <span class="nav-title">Produk UMKM</span>
                    <small class="nav-dev">Divisi UMKM & Ekonomi Kreatif</small>
                </div>
            </a>

            <!-- Modul 3: Homestay & Ulasan -->
            <a href="<?= BASEURL; ?>/homestay/admin" class="sidebar-nav-item">
                <i class="fa-solid fa-house-chimney-user"></i>
                <div class="nav-label-box">
                    <span class="nav-title">Homestay & Ulasan</span>
                    <small class="nav-dev">Divisi Homestay & Akomodasi</small>
                </div>
            </a>

            <div class="sidebar-section-title">KONFIGURASI</div>
            <a href="<?= BASEURL; ?>/" target="_blank" class="sidebar-nav-item">
                <i class="fa-solid fa-globe"></i>
                <span>Lihat Portal Publik</span>
            </a>
            <a href="#" class="sidebar-nav-item">
                <i class="fa-solid fa-sliders"></i>
                <span>Pengaturan Portal</span>
            </a>
        </div>

        <div class="sidebar-bottom-box">
            <div class="live-pill-tag">
                <span class="live-dot"></span> Desa Wisata Live <span class="version-badge">v1.4.0</span>
            </div>
            <a href="<?= BASEURL; ?>/auth/logout" class="sidebar-logout-btn">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> Keluar Sistem
            </a>
        </div>
    </aside>

    <!-- MAIN ADMIN CONTENT -->
    <main class="admin-main">
        <!-- TOPBAR -->
        <header class="admin-topbar">
            <div class="topbar-breadcrumbs">
                <a href="#">CirebonKita</a> / <span>Smart Tourism Desa Wisata</span>
            </div>

            <div class="topbar-search">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" placeholder="Cari tiket, produk UMKM, homestay...">
            </div>

            <div class="topbar-right">
                <div class="notif-box">
                    <i class="fa-regular fa-bell"></i>
                    <span class="notif-dot"></span>
                </div>
                <div class="admin-profile-pill">
                    <div class="profile-avatar">A</div>
                    <span class="profile-name">Administrator</span>
                </div>
            </div>
        </header>

        <div class="admin-content-pad">
            <!-- Alert Flash -->
            <?php Auth::flash(); ?>

            <div class="content-header-title">
                <div>
                    <span class="breadcrumb-sub">Admin Panel / Ringkasan</span>
                    <h1 class="main-page-title">Overview Portal Desa Wisata Mandiri</h1>
                </div>
                <div class="header-action-group">
                    <a href="<?= BASEURL; ?>/" target="_blank" class="btn btn-outline-teal">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i> Kunjungi Portal
                    </a>
                </div>
            </div>

            <!-- Consolidated 4 KPI Cards -->
            <div class="kpi-cards-grid-4 mt-20">
                <div class="kpi-card">
                    <div class="kpi-info">
                        <span class="kpi-label">TOTAL DESTINASI WISATA</span>
                        <h2 class="kpi-val"><?= $kpiWisata['total_spot'] ?? '18'; ?> Spot</h2>
                        <span class="kpi-trend text-success"><i class="fa-solid fa-arrow-up"></i> +2 spot baru bulan ini</span>
                    </div>
                    <div class="kpi-icon-box bg-teal-light">
                        <i class="fa-solid fa-landmark"></i>
                    </div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-info">
                        <span class="kpi-label">TOTAL PRODUK UMKM</span>
                        <h2 class="kpi-val"><?= $kpiUmkm['total_produk'] ?? '36'; ?> Produk</h2>
                        <span class="kpi-trend text-warning"><i class="fa-solid fa-triangle-exclamation"></i> <?= $kpiUmkm['stok_menipis'] ?? '4'; ?> perlu restok</span>
                    </div>
                    <div class="kpi-icon-box bg-amber-light">
                        <i class="fa-solid fa-store"></i>
                    </div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-info">
                        <span class="kpi-label">BOOKING HOMESTAY AKTIF</span>
                        <h2 class="kpi-val"><?= $kpiHomestay['booking_aktif'] ?? '29'; ?> Tamu</h2>
                        <span class="kpi-trend text-success"><i class="fa-solid fa-arrow-up"></i> Okupansi 78%</span>
                    </div>
                    <div class="kpi-icon-box bg-blue-light">
                        <i class="fa-solid fa-calendar-check"></i>
                    </div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-info">
                        <span class="kpi-label">KEPUASAN WISATAWAN</span>
                        <h2 class="kpi-val"><?= $kpiHomestay['avg_rating'] ?? '4.8'; ?> / 5.0</h2>
                        <span class="kpi-trend text-gold"><i class="fa-solid fa-star"></i> Dari 94 Ulasan Publik</span>
                    </div>
                    <div class="kpi-icon-box bg-gold-light">
                        <i class="fa-solid fa-star"></i>
                    </div>
                </div>
            </div>

            <!-- Modul Navigation Hub Cards -->
            <div class="module-dev-cards-grid mt-30">
                <div class="module-card">
                    <div class="module-card-header">
                        <span class="badge-modul">MODUL 1</span>
                        <h3 class="module-title">Wisata & E-Tiket Spot</h3>
                        <p class="module-author"><i class="fa-solid fa-layer-group"></i> Divisi: <strong>Wisata & Tiket</strong></p>
                    </div>
                    <p class="module-summary">Kelola master destinasi budaya, pemantauan kuota harian pengunjung, validasi e-tiket loket masuk, dan retribusi kas desa.</p>
                    <a href="<?= BASEURL; ?>/wisata/admin" class="btn btn-teal-solid btn-sm mt-15">
                        Buka Modul Wisata <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>

                <div class="module-card">
                    <div class="module-card-header">
                        <span class="badge-modul">MODUL 2</span>
                        <h3 class="module-title">Inventori Produk UMKM</h3>
                        <p class="module-author"><i class="fa-solid fa-layer-group"></i> Divisi: <strong>UMKM & Ekonomi Kreatif</strong></p>
                    </div>
                    <p class="module-summary">Kelola etalase komoditas kriya, batik tulis megamendung, kuliner khas, peringatan stok menipis, dan ekspor data CSV inventori.</p>
                    <a href="<?= BASEURL; ?>/umkm/admin" class="btn btn-teal-solid btn-sm mt-15">
                        Buka Modul UMKM <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>

                <div class="module-card">
                    <div class="module-card-header">
                        <span class="badge-modul">MODUL 3</span>
                        <h3 class="module-title">Homestay & Ulasan Tamu</h3>
                        <p class="module-author"><i class="fa-solid fa-layer-group"></i> Divisi: <strong>Homestay & Akomodasi</strong></p>
                    </div>
                    <p class="module-summary">Manajemen kemitraan penginapan warga, kontrol reservasi tamu masuk/keluar, kalkulasi tarif menginap, serta moderasi rating ulasan.</p>
                    <a href="<?= BASEURL; ?>/homestay/admin" class="btn btn-teal-solid btn-sm mt-15">
                        Buka Modul Homestay <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>
    </main>
</div>

<script src="<?= BASEURL; ?>/assets/js/script.js"></script>
</body>
</html>
