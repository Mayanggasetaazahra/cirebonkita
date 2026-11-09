<?php
/**
 * ====================================================================
 * VIEW ADMIN: MANAJEMEN PRODUK UMKM (index.php)
 * ====================================================================
 * Proyek      : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Pengembang  : Divisi UMKM & Ekonomi Kreatif
 * Modul       : CRUD Produk Kerajinan & Kuliner UMKM Lokal
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
    <!-- SIDEBAR ADMIN KELOMPOK 5 -->
    <aside class="admin-sidebar">
        <div class="sidebar-brand">
            <div class="sidebar-brand-icon"><i class="fa-solid fa-mountain-sun"></i></div>
            <div>
                <h4 class="sidebar-title">CirebonKita</h4>
                <span class="sidebar-subtitle">PANEL ADMINISTRATOR</span>
            </div>
        </div>

        <div class="sidebar-menu-wrapper">
            <div class="sidebar-section-title">RINGKASAN SISTEM</div>
            <a href="<?= BASEURL; ?>/admin" class="sidebar-nav-item">
                <i class="fa-solid fa-table-cells-large"></i>
                <span>Overview Portal</span>
            </a>

            <div class="sidebar-section-title">TANGGUNG JAWAB MODUL</div>
            <a href="<?= BASEURL; ?>/wisata/admin" class="sidebar-nav-item">
                <i class="fa-solid fa-monument"></i>
                <div class="nav-label-box">
                    <span class="nav-title">Wisata & Tiket</span>
                    <small class="nav-dev">Divisi Wisata & Tiket</small>
                </div>
            </a>

            <!-- Modul 2: Produk UMKM (Active) -->
            <a href="<?= BASEURL; ?>/umkm/admin" class="sidebar-nav-item active">
                <i class="fa-solid fa-store"></i>
                <div class="nav-label-box">
                    <span class="nav-title">Produk UMKM</span>
                    <small class="nav-dev">Divisi UMKM & Ekonomi Kreatif</small>
                </div>
            </a>

            <a href="<?= BASEURL; ?>/homestay/admin" class="sidebar-nav-item">
                <i class="fa-solid fa-house-chimney-user"></i>
                <div class="nav-label-box">
                    <span class="nav-title">Homestay & Ulasan</span>
                    <small class="nav-dev">Divisi Homestay & Akomodasi</small>
                </div>
            </a>

            <div class="sidebar-section-title">KONFIGURASI</div>
            <a href="<?= BASEURL; ?>/umkm" target="_blank" class="sidebar-nav-item">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                <span>Lihat Katalog Publik</span>
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
        <header class="admin-topbar">
            <div class="topbar-breadcrumbs">
                <a href="<?= BASEURL; ?>/admin">Admin</a> / <span>Produk UMKM</span>
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
                    <div class="profile-avatar">NM</div>
                    <span class="profile-name">Pengelola UMKM</span>
                </div>
            </div>
        </header>

        <div class="admin-content-pad">
            <?php Auth::flash(); ?>

            <div class="content-header-title">
                <div>
                    <span class="breadcrumb-sub">Admin / Produk UMKM</span>
                    <h1 class="main-page-title">Manajemen Inventori & Produk UMKM Cirebon</h1>
                    <p class="main-page-sub">Kelola etalase digital komoditas kriya, batik megamendung, dan kuliner otentik desa wisata Cirebon.</p>
                </div>
                <div class="header-action-group">
                    <a href="<?= BASEURL; ?>/umkm/exportCsv" class="btn btn-outline-teal">
                        <i class="fa-solid fa-file-csv"></i> Export CSV / Cetak Rekap
                    </a>
                    <a href="<?= BASEURL; ?>/umkm/create" class="btn btn-teal-solid">
                        <i class="fa-solid fa-plus"></i> Tambah Produk UMKM
                    </a>
                </div>
            </div>

            <!-- 4 KPI Cards UMKM -->
            <div class="kpi-cards-grid-4 mt-20">
                <div class="kpi-card">
                    <div class="kpi-info">
                        <span class="kpi-label">TOTAL PRODUK TERDAFTAR</span>
                        <h2 class="kpi-val"><?= $kpi['total_produk']; ?> <span class="kpi-sub-unit">Produk</span></h2>
                        <span class="kpi-trend text-success"><i class="fa-solid fa-circle-check"></i> 24 Aktif di Etalase</span>
                    </div>
                    <div class="kpi-icon-box bg-teal-light">
                        <i class="fa-solid fa-box-archive"></i>
                    </div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-info">
                        <span class="kpi-label">STOK MENIPIS (&le; 10 PCS)</span>
                        <h2 class="kpi-val"><?= $kpi['stok_menipis']; ?> <span class="kpi-sub-unit">Perlu Restok</span></h2>
                        <span class="kpi-trend text-danger"><i class="fa-solid fa-triangle-exclamation"></i> 4 Alert Segera</span>
                    </div>
                    <div class="kpi-icon-box bg-amber-light">
                        <i class="fa-solid fa-triangle-exclamation text-amber"></i>
                    </div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-info">
                        <span class="kpi-label">KATEGORI UMKM AKTIF</span>
                        <h2 class="kpi-val"><?= $kpi['kategori_aktif']; ?> <span class="kpi-sub-unit">Klaster Budaya</span></h2>
                        <span class="kpi-trend text-teal"><i class="fa-solid fa-shapes"></i> 5 Sektor Terhubung</span>
                    </div>
                    <div class="kpi-icon-box bg-blue-light">
                        <i class="fa-solid fa-cubes-stacked"></i>
                    </div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-info">
                        <span class="kpi-label">TOTAL PENJUALAN UMKM</span>
                        <h2 class="kpi-val"><?= $kpi['total_penjualan']; ?> <span class="kpi-sub-unit">Trx</span></h2>
                        <span class="kpi-trend text-success"><i class="fa-solid fa-arrow-trend-up"></i> Rp <?= $kpi['omset_penjualan']; ?> Terdistribusi</span>
                    </div>
                    <div class="kpi-icon-box bg-gold-light">
                        <i class="fa-solid fa-basket-shopping"></i>
                    </div>
                </div>
            </div>

            <!-- Tabel Daftar Produk & Komoditas -->
            <div class="admin-table-card mt-30">
                <div class="table-card-header">
                    <div>
                        <h3 class="table-card-title"><i class="fa-solid fa-boxes-stacked"></i> Daftar Produk & Komoditas</h3>
                        <p class="table-card-sub">Basis data inventori aktif dengan sinkronisasi etalase wisatawan.</p>
                    </div>
                    <a href="<?= BASEURL; ?>/umkm/create" class="btn btn-teal-solid btn-sm">
                        <i class="fa-solid fa-plus"></i> Tambah Produk UMKM
                    </a>
                </div>

                <div class="table-toolbar">
                    <div class="search-input-wrap">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input type="text" id="umkmSearchTable" placeholder="Cari produk kerajinan atau kuliner...">
                    </div>

                    <div class="filter-dropdown-wrap">
                        <select id="filterKategoriUmkm" class="form-select-sm">
                            <option value="">Semua Kategori</option>
                            <option value="Batik Cirebon">Batik Cirebon</option>
                            <option value="Kuliner Khas">Kuliner Khas</option>
                            <option value="Kerajinan Tangan">Kerajinan Tangan</option>
                            <option value="Aksesoris">Aksesoris</option>
                        </select>

                        <select id="filterSortUmkm" class="form-select-sm">
                            <option value="terbaru">Urutkan: Terbaru</option>
                            <option value="termurah">Harga Terendah</option>
                            <option value="termahal">Harga Tertinggi</option>
                            <option value="terlaris">Paling Laris</option>
                        </select>

                        <button type="button" class="btn btn-sm btn-outline-secondary" onclick="location.reload()">
                            <i class="fa-solid fa-rotate-left"></i> Reset Filter
                        </button>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="data-table" id="tableUmkm">
                        <thead>
                            <tr>
                                <th style="width: 45px;">No</th>
                                <th style="width: 80px;">Gambar</th>
                                <th>Nama Produk</th>
                                <th>Kategori UMKM</th>
                                <th>Mitra Pengrajin / Desa</th>
                                <th>Harga Satuan</th>
                                <th>Sisa Stok</th>
                                <th>Status Stok</th>
                                <th style="width: 120px; text-align: center;">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php $no = 1; foreach ($umkmList as $item): ?>
                                <tr>
                                    <td class="text-center"><?= $no++; ?></td>
                                    <td>
                                        <img src="<?= BASEURL; ?>/assets/img/<?= htmlspecialchars($item['foto']); ?>" alt="" class="table-thumb" onerror="this.src='https://picsum.photos/seed/u_<?= $item['id']; ?>/100/100'">
                                    </td>
                                    <td>
                                        <strong class="item-title-link"><?= htmlspecialchars($item['nama_produk']); ?></strong>
                                        <small class="table-sku">SKU: <?= htmlspecialchars($item['kode_sku']); ?></small>
                                    </td>
                                    <td>
                                        <span class="pill-badge pill-<?= strtolower(explode(' ', $item['kategori'])[0]); ?>">
                                            <?= htmlspecialchars($item['kategori']); ?>
                                        </span>
                                    </td>
                                    <td>
                                        <div class="mitra-cell">
                                            <i class="fa-solid fa-location-dot"></i>
                                            <div>
                                                <span><?= htmlspecialchars($item['mitra_pengrajin']); ?></span>
                                                <small><?= htmlspecialchars($item['desa_asal']); ?></small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <strong class="price-val-table">Rp <?= number_format($item['harga'], 0, ',', '.'); ?></strong>
                                    </td>
                                    <td>
                                        <strong><?= $item['stok']; ?></strong> pcs
                                    </td>
                                    <td>
                                        <?php if ($item['stok'] > 10): ?>
                                            <span class="badge-status-green">Tersedia</span>
                                        <?php elseif ($item['stok'] > 4): ?>
                                            <span class="badge-status-yellow">Stok Menipis</span>
                                        <?php else: ?>
                                            <span class="badge-status-red">Kritis</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <div class="action-btn-row">
                                            <a href="<?= BASEURL; ?>/umkm/edit/<?= $item['id']; ?>" class="btn-action-edit" title="Edit Data">
                                                <i class="fa-regular fa-pen-to-square"></i>
                                            </a>
                                            <a href="<?= BASEURL; ?>/umkm/detail/<?= $item['id']; ?>" class="btn-action-view" target="_blank" title="Lihat">
                                                <i class="fa-regular fa-eye"></i>
                                            </a>
                                            <button type="button" class="btn-action-delete trigger-delete-modal" data-url="<?= BASEURL; ?>/umkm/hapus/<?= $item['id']; ?>" data-name="<?= htmlspecialchars($item['nama_produk']); ?>" title="Hapus">
                                                <i class="fa-regular fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>

                <div class="table-footer-pagination">
                    <span class="table-entry-info">Menampilkan 1 - <?= count($umkmList); ?> dari <?= count($umkmList); ?> data produk UMKM terdaftar</span>
                    <div class="pagination-buttons">
                        <button class="page-link-btn disabled">&laquo;</button>
                        <button class="page-link-btn active">1</button>
                        <button class="page-link-btn">2</button>
                        <button class="page-link-btn">3</button>
                        <button class="page-link-btn">&raquo;</button>
                    </div>
                </div>
            </div>

            <!-- Bottom 3 Highlight Cards -->
            <div class="widgets-grid-3 mt-30">
                <div class="summary-stat-box">
                    <div class="summary-stat-head">
                        <div class="summary-icon bg-emerald-light"><i class="fa-solid fa-vest-patches"></i></div>
                        <div>
                            <h4>Klaster Batik Trusmi</h4>
                            <small>14 Varian Motif Tersedia</small>
                        </div>
                        <span class="pct-badge-teal ml-auto">88% Terjual</span>
                    </div>
                    <div class="summary-stat-bar mt-10">
                        <div class="bar-fill bg-teal" style="width: 88%;"></div>
                    </div>
                    <p class="summary-note mt-10">Motif klasik Megamendung Merah-Biru mencatat perputaran stok tercepat selama festival budaya Keraton Kasepuhan.</p>
                </div>

                <div class="summary-stat-box">
                    <div class="summary-stat-head">
                        <div class="summary-icon bg-amber-light"><i class="fa-solid fa-utensils"></i></div>
                        <div>
                            <h4>Klaster Kuliner Khas</h4>
                            <small>16 Produk Kemasan Siap Saji</small>
                        </div>
                        <span class="pct-badge-amber ml-auto">64% Terjual</span>
                    </div>
                    <div class="summary-stat-bar mt-10">
                        <div class="bar-fill bg-amber" style="width: 64%;"></div>
                    </div>
                    <p class="summary-note mt-10">Terasi Udang Rebon dan Empal Gentong Kaleng menjadi oleh-oleh terpopuler pesanan pelancong luar kota.</p>
                </div>

                <div class="summary-stat-box">
                    <div class="summary-stat-head">
                        <div class="summary-icon bg-blue-light"><i class="fa-solid fa-circle-check"></i></div>
                        <div>
                            <h4>Status Kurasi Dinas</h4>
                            <small>Standar Mutu Desa Wisata</small>
                        </div>
                        <span class="pct-badge-green ml-auto">100% Lolos</span>
                    </div>
                    <div class="summary-stat-bar mt-10">
                        <div class="bar-fill bg-green" style="width: 100%;"></div>
                    </div>
                    <p class="summary-note mt-10">Seluruh produk telah melewati verifikasi higienitas PIRT dan sertifikasi orisinalitas perajin kriya Cirebon.</p>
                </div>
            </div>
        </div>
    </main>
</div>

<script src="<?= BASEURL; ?>/assets/js/script.js"></script>
</body>
</html>
