<?php
/**
 * ====================================================================
 * VIEW LAYOUT: HEADER & NAVBAR PUBLIK (header.php)
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
    <title><?= htmlspecialchars($judul ?? 'CirebonKita - Portal Desa Wisata Mandiri'); ?></title>
    <meta name="description" content="Portal Smart Tourism & Desa Wisata Mandiri Cirebon: Daya Tarik Wisata, UMKM Lokal, dan Homestay.">
    
    <!-- Google Fonts Bricolage Grotesque & Plus Jakarta Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- CSS Utama CirebonKita -->
    <link rel="stylesheet" href="<?= BASEURL; ?>/assets/css/style.css">
    
    <!-- Font Awesome / Icon -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

    <!-- NAVBAR UTAMA -->
    <header class="navbar-wrapper">
        <div class="container navbar-container">
            <a href="<?= BASEURL; ?>/" class="navbar-brand">
                <img src="<?= BASEURL; ?>/assets/cirebon-emblem.png" alt="CirebonKita" class="brand-logo-img" style="height: 38px; width: auto; object-fit: contain;">
                <div class="brand-text">
                    <span class="brand-title">CirebonKita</span>
                    <span class="brand-subtitle">Jelajah Budaya, Cirebon Kita</span>
                </div>
            </a>

            <!-- Form Pencarian Global Cepat -->
            <form action="<?= BASEURL; ?>/umkm" method="GET" class="navbar-search">
                <i class="fa-solid fa-magnifying-glass search-icon"></i>
                <input type="text" name="cari" placeholder="Cari batik, homestay, kuliner..." autocomplete="off">
            </form>

            <!-- Navigasi Menu -->
            <nav class="navbar-menu" id="navMenu">
                <a href="<?= BASEURL; ?>/" class="nav-link <?= (empty($_GET['url']) || $_GET['url'] === 'home') ? 'active' : ''; ?>">Beranda</a>
                <a href="<?= BASEURL; ?>/umkm" class="nav-link <?= (isset($_GET['url']) && strpos($_GET['url'], 'umkm') !== false) ? 'active' : ''; ?>">Produk UMKM</a>
                <a href="<?= BASEURL; ?>/wisata" class="nav-link <?= (isset($_GET['url']) && strpos($_GET['url'], 'wisata') !== false) ? 'active' : ''; ?>">Destinasi Wisata</a>
                <a href="<?= BASEURL; ?>/homestay" class="nav-link <?= (isset($_GET['url']) && strpos($_GET['url'], 'homestay') !== false) ? 'active' : ''; ?>">Homestay</a>
                <a href="<?= BASEURL; ?>/admin" class="nav-link admin-pill">Dashboard Admin</a>
            </nav>

            <!-- Aksi Pengguna (Cart & Login) -->
            <div class="navbar-actions">
                <div class="cart-badge-trigger" title="Keranjang Belanja UMKM">
                    <i class="fa-solid fa-basket-shopping"></i>
                    <span class="badge-count" id="cartCountBadge">3</span>
                </div>
                <div class="notif-badge-trigger" title="Pemberitahuan">
                    <i class="fa-regular fa-bell"></i>
                </div>

                <?php if (isset($_SESSION['user_id'])): ?>
                    <div class="user-logged-box">
                        <span class="user-name-text"><?= htmlspecialchars($_SESSION['username']); ?></span>
                        <a href="<?= BASEURL; ?>/auth/logout" class="btn btn-outline-danger btn-sm">Keluar</a>
                    </div>
                <?php else: ?>
                    <a href="<?= BASEURL; ?>/auth/login" class="btn btn-teal-solid">Masuk</a>
                <?php endif; ?>

                <!-- Tombol Hamburger Mobile -->
                <button class="hamburger-btn" id="hamburgerBtn" aria-label="Toggle navigation">
                    <i class="fa-solid fa-bars"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content Container -->
    <main class="main-content-wrapper">
