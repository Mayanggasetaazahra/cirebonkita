<?php
/**
 * ====================================================================
 * VIEW ADMIN: MANAJEMEN HOMESTAY & ULASAN (index.php)
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
    <!-- SIDEBAR ADMIN -->
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

            <div class="sidebar-section-title">DIVISI PENGELOLA</div>
            <a href="<?= BASEURL; ?>/wisata/admin" class="sidebar-nav-item">
                <i class="fa-solid fa-monument"></i>
                <div class="nav-label-box">
                    <span class="nav-title">Wisata & Tiket</span>
                    <small class="nav-dev">Divisi Wisata & Tiket</small>
                </div>
            </a>

            <a href="<?= BASEURL; ?>/umkm/admin" class="sidebar-nav-item">
                <i class="fa-solid fa-store"></i>
                <div class="nav-label-box">
                    <span class="nav-title">Produk UMKM</span>
                    <small class="nav-dev">Divisi UMKM & Ekonomi Kreatif</small>
                </div>
            </a>

            <!-- Modul Homestay (Active) -->
            <a href="<?= BASEURL; ?>/homestay/admin" class="sidebar-nav-item active">
                <i class="fa-solid fa-house-chimney-user"></i>
                <div class="nav-label-box">
                    <span class="nav-title">Homestay & Ulasan</span>
                    <small class="nav-dev">Divisi Homestay & Akomodasi</small>
                </div>
            </a>

            <div class="sidebar-section-title">KONFIGURASI</div>
            <a href="<?= BASEURL; ?>/homestay" target="_blank" class="sidebar-nav-item">
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
                <a href="<?= BASEURL; ?>/admin">CirebonKita</a> / <span>Smart Tourism Desa Wisata</span>
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
                    <div class="profile-avatar">AD</div>
                    <span class="profile-name">Pengelola Homestay</span>
                </div>
            </div>
        </header>

        <div class="admin-content-pad">
            <?php Auth::flash(); ?>

            <div class="content-header-title">
                <div>
                    <span class="breadcrumb-sub">Admin Panel / Homestay &amp; Ulasan</span>
                    <h1 class="main-page-title">Manajemen Reservasi Homestay &amp; Moderasi Ulasan</h1>
                </div>
                <div class="header-action-group">
                    <button type="button" class="btn btn-outline-teal" onclick="window.print()">
                        <i class="fa-solid fa-download"></i> Ekspor Data
                    </button>
                    <a href="<?= BASEURL; ?>/homestay/create" class="btn btn-teal-solid">
                        <i class="fa-solid fa-plus"></i> Tambah Mitra Homestay
                    </a>
                </div>
            </div>

            <!-- 4 KPI Cards Homestay -->
            <div class="kpi-cards-grid-4 mt-20">
                <div class="kpi-card">
                    <div class="kpi-info">
                        <span class="kpi-label">TOTAL HOMESTAY MITRA</span>
                        <h2 class="kpi-val"><?= $kpi['total_unit']; ?> Unit</h2>
                        <span class="kpi-trend text-success"><i class="fa-solid fa-plus"></i> +2 mitra bulan ini</span>
                    </div>
                    <div class="kpi-icon-box bg-blue-light">
                        <i class="fa-solid fa-house-chimney"></i>
                    </div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-info">
                        <span class="kpi-label">BOOKING AKTIF PEKAN INI</span>
                        <h2 class="kpi-val"><?= $kpi['booking_aktif']; ?> Reservasi</h2>
                        <span class="kpi-trend text-amber"><i class="fa-regular fa-calendar-check"></i> 8 check-in hari ini</span>
                    </div>
                    <div class="kpi-icon-box bg-amber-light">
                        <i class="fa-regular fa-calendar-days text-amber"></i>
                    </div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-info">
                        <span class="kpi-label">OKUPANSI KAMAR RATA-RATA</span>
                        <h2 class="kpi-val"><?= $kpi['okupansi']; ?>%</h2>
                        <span class="kpi-trend text-success"><i class="fa-solid fa-arrow-trend-up"></i> &plus; 14% vs bulan lalu</span>
                    </div>
                    <div class="kpi-icon-box bg-teal-light">
                        <i class="fa-solid fa-arrow-trend-up text-teal"></i>
                    </div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-info">
                        <span class="kpi-label">RATA-RATA RATING WISATAWAN</span>
                        <h2 class="kpi-val"><?= $kpi['avg_rating']; ?> / 5.0</h2>
                        <span class="kpi-trend text-gold"><i class="fa-solid fa-star"></i> Total <?= $kpi['total_ulasan']; ?> Ulasan Publik</span>
                    </div>
                    <div class="kpi-icon-box bg-gold-light">
                        <i class="fa-solid fa-star text-gold"></i>
                    </div>
                </div>
            </div>

            <!-- Tab Sub-Modul Homestay -->
            <div class="subnav-tabs-row mt-30">
                <button class="subnav-pill active" id="tabBookingBtn">
                    <i class="fa-solid fa-bed"></i> Daftar Reservasi & Booking Tamu <span class="badge-count-pill"><?= count($bookingList); ?></span>
                </button>
                <button class="subnav-pill" id="tabMasterHomestayBtn">
                    <i class="fa-solid fa-house-laptop"></i> Master Data Homestay Desa <span class="badge-count-pill"><?= count($homestayList); ?></span>
                </button>
                <button class="subnav-pill" id="tabModerasiUlasanBtn">
                    <i class="fa-regular fa-comment-dots"></i> Moderasi Ulasan & Rating Bintang <span class="badge-count-pill"><?= count($ulasanList); ?></span>
                </button>
            </div>

            <!-- TAB 1: DAFTAR RESERVASI TAMU -->
            <div class="admin-table-card mt-20" id="tabContentBooking">
                <div class="table-card-header">
                    <div>
                        <h3 class="table-card-title"><i class="fa-regular fa-calendar-check"></i> Data Reservasi Tamu Desa Wisata</h3>
                        <p class="table-card-sub">Manajemen kedatangan, status pembayaran, dan durasi penginapan.</p>
                    </div>
                </div>

                <div class="table-toolbar">
                    <div class="search-input-wrap">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input type="text" id="bookingSearchTable" placeholder="Cari ID, nama tamu, atau homestay...">
                    </div>

                    <div class="filter-dropdown-wrap">
                        <select id="filterBookingStatus" class="form-select-sm">
                            <option value="">Semua Status Booking</option>
                            <option value="Terkonfirmasi">Terkonfirmasi</option>
                            <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                            <option value="Batal">Batal</option>
                        </select>

                        <div class="date-filter-box">
                            <i class="fa-regular fa-calendar"></i>
                            <span>10 Nov - 24 Nov 2025</span>
                        </div>

                        <a href="<?= BASEURL; ?>/homestay" target="_blank" class="btn btn-teal-solid btn-sm">
                            <i class="fa-solid fa-plus"></i> Input Reservasi Manual
                        </a>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="data-table" id="tableBooking">
                        <thead>
                            <tr>
                                <th>ID Booking</th>
                                <th>Nama Tamu & Asal</th>
                                <th>Homestay Pilihan</th>
                                <th>Periode In / Out</th>
                                <th>Durasi & Pax</th>
                                <th>Total Biaya</th>
                                <th>Status Transaksi</th>
                                <th style="text-align: center;">Aksi Cepat</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($bookingList as $b): ?>
                                <tr>
                                    <td><strong><?= htmlspecialchars($b['booking_code']); ?></strong></td>
                                    <td>
                                        <strong><?= htmlspecialchars($b['nama_tamu']); ?></strong>
                                        <small class="table-sub-info"><?= htmlspecialchars($b['asal_kota'] ?? 'DKI Jakarta'); ?> &bull; <?= htmlspecialchars($b['kontak']); ?></small>
                                    </td>
                                    <td>
                                        <strong class="text-teal"><?= htmlspecialchars($b['nama_homestay']); ?></strong>
                                        <small class="table-sub-info"><?= htmlspecialchars($b['tipe_kamar']); ?></small>
                                    </td>
                                    <td>
                                        <div class="date-cell">
                                            <span><?= date('d M Y', strtotime($b['tgl_checkin'])); ?></span>
                                            <small class="text-muted">s/d <?= date('d M Y', strtotime($b['tgl_checkout'])); ?></small>
                                        </div>
                                    </td>
                                    <td>
                                        <strong><?= $b['durasi_malam']; ?> Malam</strong>
                                        <small class="table-sub-info"><?= $b['jumlah_tamu']; ?> Tamu</small>
                                    </td>
                                    <td>
                                        <strong class="price-val-table">Rp <?= number_format($b['total_biaya'], 0, ',', '.'); ?></strong>
                                    </td>
                                    <td>
                                        <?php if ($b['status_transaksi'] === 'Terkonfirmasi'): ?>
                                            <span class="status-badge status-active"><span class="dot"></span> Terkonfirmasi</span>
                                        <?php elseif ($b['status_transaksi'] === 'Menunggu Pembayaran'): ?>
                                            <span class="status-badge status-warning"><span class="dot"></span> Menunggu Pembayaran</span>
                                        <?php else: ?>
                                            <span class="status-badge status-danger"><span class="dot"></span> <?= htmlspecialchars($b['status_transaksi']); ?></span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <div class="action-btn-row">
                                            <?php if ($b['status_transaksi'] === 'Menunggu Pembayaran'): ?>
                                                <a href="<?= BASEURL; ?>/homestay/updateStatusBooking/<?= $b['id']; ?>/Terkonfirmasi" class="btn-action-confirm" title="Konfirmasi Pembayaran">
                                                    <i class="fa-solid fa-circle-check"></i>
                                                </a>
                                            <?php endif; ?>
                                            <a href="#" class="btn-action-view" title="Lihat"><i class="fa-regular fa-eye"></i></a>
                                            <a href="#" class="btn-action-edit" title="Edit"><i class="fa-regular fa-pen-to-square"></i></a>
                                            <a href="<?= BASEURL; ?>/homestay/updateStatusBooking/<?= $b['id']; ?>/Batal" class="btn-action-delete" title="Batalkan"><i class="fa-regular fa-circle-xmark"></i></a>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>

                <div class="table-footer-pagination">
                    <span class="table-entry-info">Halaman 1 dari 10 (Total <?= count($bookingList); ?> data)</span>
                    <div class="pagination-buttons">
                        <button class="page-link-btn disabled">Sebelumnya</button>
                        <button class="page-link-btn active">1</button>
                        <button class="page-link-btn">2</button>
                        <button class="page-link-btn">3</button>
                        <button class="page-link-btn">Berikutnya</button>
                    </div>
                </div>
            </div>

            <!-- TAB 2: MASTER DATA HOMESTAY -->
            <div class="admin-table-card mt-20" id="tabContentMasterHomestay" style="display:none;">
                <div class="table-card-header">
                    <div>
                        <h3 class="table-card-title"><i class="fa-solid fa-house-chimney"></i> Master Data Homestay Desa</h3>
                        <p class="table-card-sub">Daftar seluruh unit hunian mitra warga lokal Cirebon.</p>
                    </div>
                    <a href="<?= BASEURL; ?>/homestay/create" class="btn btn-teal-solid btn-sm">
                        <i class="fa-solid fa-plus"></i> Tambah Mitra Homestay
                    </a>
                </div>

                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Foto</th>
                                <th>Nama Homestay</th>
                                <th>Tipe Kamar</th>
                                <th>Tarif / Malam</th>
                                <th>Nama Pemilik & Kontak</th>
                                <th>Status</th>
                                <th style="text-align:center;">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php $no = 1; foreach ($homestayList as $h): ?>
                                <tr>
                                    <td><?= $no++; ?></td>
                                    <td>
                                        <img src="<?= BASEURL; ?>/assets/img/<?= htmlspecialchars($h['foto']); ?>" alt="" class="table-thumb" onerror="this.src='https://picsum.photos/seed/h_<?= $h['id']; ?>/100/100'">
                                    </td>
                                    <td>
                                        <strong><?= htmlspecialchars($h['nama_homestay']); ?></strong>
                                        <small class="table-sub-info"><?= htmlspecialchars($h['lokasi']); ?></small>
                                    </td>
                                    <td><?= htmlspecialchars($h['tipe_kamar']); ?></td>
                                    <td><strong>Rp <?= number_format($h['harga_per_malam'], 0, ',', '.'); ?></strong></td>
                                    <td>
                                        <span><?= htmlspecialchars($h['nama_pemilik']); ?></span>
                                        <small class="table-sub-info"><?= htmlspecialchars($h['kontak_pemilik']); ?></small>
                                    </td>
                                    <td><span class="badge-status-green">Tersedia</span></td>
                                    <td>
                                        <div class="action-btn-row">
                                            <a href="<?= BASEURL; ?>/homestay/detail/<?= $h['id']; ?>" target="_blank" class="btn-action-view" title="Lihat Detail"><i class="fa-regular fa-eye"></i></a>
                                            <a href="<?= BASEURL; ?>/homestay/edit/<?= $h['id']; ?>" class="btn-action-edit" title="Edit Data Homestay"><i class="fa-regular fa-pen-to-square"></i></a>
                                            <a href="<?= BASEURL; ?>/homestay/hapus/<?= $h['id']; ?>" class="btn-action-delete trigger-delete-modal" data-url="<?= BASEURL; ?>/homestay/hapus/<?= $h['id']; ?>" data-name="<?= htmlspecialchars($h['nama_homestay']); ?>" title="Hapus Data"><i class="fa-regular fa-trash-can"></i></a>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB 3: MODERASI ULASAN -->
            <div class="admin-table-card mt-20" id="tabContentModerasiUlasan" style="display:none;">
                <div class="table-card-header">
                    <div>
                        <h3 class="table-card-title"><i class="fa-solid fa-star text-gold"></i> Moderasi Ulasan & Rating Bintang</h3>
                        <p class="table-card-sub">Pemeriksaan ulasan wisatawan sebelum dipublikasikan ke portal publik.</p>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama Pengulas</th>
                                <th>Homestay</th>
                                <th>Rating Bintang</th>
                                <th>Komentar Pengalaman</th>
                                <th>Status Moderasi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php $no = 1; foreach ($ulasanList as $u): ?>
                                <tr>
                                    <td><?= $no++; ?></td>
                                    <td><strong><?= htmlspecialchars($u['nama_pengulas']); ?></strong></td>
                                    <td><?= htmlspecialchars($u['nama_homestay']); ?></td>
                                    <td>
                                        <div class="star-rating-display">
                                            <?php for($i=1;$i<=5;$i++): ?>
                                                <i class="fa-solid fa-star <?= ($i <= $u['rating_bintang']) ? 'text-gold' : 'text-gray'; ?>"></i>
                                            <?php endfor; ?>
                                            <span class="ml-5 font-bold"><?= $u['rating_bintang']; ?>.0</span>
                                        </div>
                                    </td>
                                    <td><em>"<?= htmlspecialchars($u['komentar']); ?>"</em></td>
                                    <td><span class="status-badge status-active"><span class="dot"></span> Disetujui</span></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
</div>

<script src="<?= BASEURL; ?>/assets/js/script.js"></script>
</body>
</html>
