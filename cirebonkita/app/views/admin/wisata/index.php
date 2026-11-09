<?php
/**
 * ====================================================================
 * VIEW ADMIN: MANAJEMEN WISATA & TIKET (index.php)
 * ====================================================================
 * Proyek      : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Pengembang  : Divisi Wisata & Tiket
 * Modul       : CRUD Master Daya Tarik Wisata & Tiket Spot Rekreasi
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
            <a href="<?= BASEURL; ?>/admin" class="sidebar-nav-item">
                <i class="fa-solid fa-table-cells-large"></i>
                <span>Overview Portal</span>
            </a>

            <div class="sidebar-section-title">TANGGUNG JAWAB MODUL</div>
            
            <!-- Modul 1: Wisata & Tiket (Active) -->
            <a href="<?= BASEURL; ?>/wisata/admin" class="sidebar-nav-item active">
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
            <a href="<?= BASEURL; ?>/wisata" target="_blank" class="sidebar-nav-item">
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
                    <div class="profile-avatar">IH</div>
                    <span class="profile-name">Pengelola Wisata</span>
                </div>
            </div>
        </header>

        <div class="admin-content-pad">
            <?php Auth::flash(); ?>

            <div class="content-header-title">
                <div>
                    <span class="breadcrumb-sub">Admin Portal / Wisata & Tiket Spot Rekreasi</span>
                    <h1 class="main-page-title">Manajemen Destinasi Wisata & Tiket Rekreasi</h1>
                    <p class="main-page-sub">Pusat kendali master inventaris daya tarik kebudayaan, kuota pengunjung real-time, dan tata kelola e-ticketing Cirebon.</p>
                </div>
                <div class="header-action-group">
                    <button type="button" class="btn btn-outline-teal" onclick="window.print()">
                        <i class="fa-solid fa-download"></i> Unduh Laporan
                    </button>
                    <a href="<?= BASEURL; ?>/wisata/create" class="btn btn-teal-solid">
                        <i class="fa-solid fa-plus"></i> Tambah Destinasi Baru
                    </a>
                </div>
            </div>

            <!-- 4 KPI Cards Wisata -->
            <div class="kpi-cards-grid-4 mt-20">
                <div class="kpi-card">
                    <div class="kpi-info">
                        <span class="kpi-label">TOTAL DESTINASI WISATA</span>
                        <h2 class="kpi-val"><?= $kpi['total_spot']; ?> <span class="kpi-sub-unit">Spot Budaya</span></h2>
                        <span class="kpi-trend text-success"><i class="fa-solid fa-arrow-up"></i> +2 spot baru bulan ini</span>
                    </div>
                    <div class="kpi-icon-box bg-teal-light">
                        <i class="fa-solid fa-landmark-dome"></i>
                    </div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-info">
                        <span class="kpi-label">TIKET TERJUAL HARI INI</span>
                        <h2 class="kpi-val"><?= $kpi['tiket_terjual']; ?> <span class="kpi-sub-unit">Tiket Terverifikasi</span></h2>
                        <span class="kpi-trend text-muted"><i class="fa-regular fa-clock"></i> Update gerbang: 8 menit lalu</span>
                    </div>
                    <div class="kpi-icon-box bg-amber-light">
                        <i class="fa-solid fa-ticket-simple"></i>
                    </div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-info">
                        <span class="kpi-label">PENDAPATAN TIKET (BULAN INI)</span>
                        <h2 class="kpi-val">Rp <?= number_format($kpi['total_pendapatan'], 0, ',', '.'); ?></h2>
                        <span class="kpi-trend text-success"><i class="fa-solid fa-arrow-trend-up"></i> +12.8% dari target bulanan</span>
                    </div>
                    <div class="kpi-icon-box bg-blue-light">
                        <i class="fa-solid fa-money-bill-wave"></i>
                    </div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-info">
                        <span class="kpi-label">KAPASITAS KUOTA HARIAN</span>
                        <h2 class="kpi-val"><?= $kpi['okupansi_kuota']; ?>% <span class="kpi-sub-unit">Rata-rata Terisi</span></h2>
                        <span class="kpi-trend text-teal"><i class="fa-solid fa-chart-pie"></i> Terpantau Aman</span>
                    </div>
                    <div class="kpi-icon-box bg-gold-light">
                        <i class="fa-solid fa-chart-pie"></i>
                    </div>
                </div>
            </div>

            <!-- Tabel Master Wisata -->
            <div class="admin-table-card mt-30">
                <div class="table-card-header">
                    <div>
                        <h3 class="table-card-title"><i class="fa-regular fa-newspaper"></i> Katalog Master Daya Tarik Wisata & Loket Masuk</h3>
                        <p class="table-card-sub">Pembaruan status operasional, harga tiket masuk (HTM), dan kontrol kuota pintu gerbang.</p>
                    </div>
                    <a href="<?= BASEURL; ?>/wisata/create" class="btn btn-teal-solid btn-sm">
                        <i class="fa-solid fa-plus"></i> Tambah Destinasi Baru
                    </a>
                </div>

                <!-- Filter & Search Toolbar -->
                <div class="table-toolbar">
                    <div class="search-input-wrap">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input type="text" id="wisataSearchTable" placeholder="Cari nama destinasi, sejarah, atau wilayah cagar budaya...">
                    </div>

                    <div class="filter-dropdown-wrap">
                        <select id="filterKategoriTable" class="form-select-sm">
                            <option value="">Semua Kategori</option>
                            <option value="Keraton & Sejarah">Keraton & Sejarah</option>
                            <option value="Situs Cagar Budaya">Situs Cagar Budaya</option>
                            <option value="Wisata Religi">Wisata Religi</option>
                            <option value="Wisata Alam & Rekreasi">Wisata Alam & Rekreasi</option>
                        </select>

                        <select id="filterStatusTable" class="form-select-sm">
                            <option value="">Semua Status</option>
                            <option value="Buka (Aktif)">Buka (Aktif)</option>
                            <option value="Pemeliharaan Spot">Pemeliharaan Spot</option>
                            <option value="Tutup Sementara">Tutup Sementara</option>
                        </select>

                        <button type="button" class="btn-icon-reload" onclick="location.reload()" title="Refresh Data">
                            <i class="fa-solid fa-rotate-right"></i>
                        </button>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="data-table" id="tableWisata">
                        <thead>
                            <tr>
                                <th style="width: 50px;">NO</th>
                                <th style="width: 90px;">FOTO SPOT</th>
                                <th>NAMA DESTINASI WISATA</th>
                                <th>KATEGORI KEBUDAYAAN</th>
                                <th>HARGA TIKET (HTM)</th>
                                <th style="width: 170px;">KUOTA HARIAN</th>
                                <th>STATUS OPERASIONAL</th>
                                <th style="width: 130px; text-align: center;">AKSI CRUD</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php $no = 1; foreach ($wisataList as $row): 
                                $kuotaPersen = ($row['kuota_harian'] > 0) ? round(($row['kuota_terisi'] / $row['kuota_harian']) * 100) : 0;
                            ?>
                                <tr>
                                    <td class="text-center"><?= $no++; ?></td>
                                    <td>
                                        <img src="<?= BASEURL; ?>/assets/img/<?= htmlspecialchars($row['foto']); ?>" alt="" class="table-thumb" onerror="this.src='https://picsum.photos/seed/thumb_w_<?= $row['id']; ?>/120/90'">
                                    </td>
                                    <td>
                                        <strong class="item-title-link"><?= htmlspecialchars($row['nama_wisata']); ?></strong>
                                        <small class="table-sub-info"><i class="fa-solid fa-location-dot"></i> <?= htmlspecialchars($row['lokasi']); ?></small>
                                    </td>
                                    <td>
                                        <span class="pill-badge pill-teal"><?= htmlspecialchars($row['kategori']); ?></span>
                                    </td>
                                    <td>
                                        <?php if ($row['harga_tiket'] > 0): ?>
                                            <strong class="price-val-table">Rp <?= number_format($row['harga_tiket'], 0, ',', '.'); ?></strong>
                                            <small class="table-sub-info">/ orang (Domestik)</small>
                                        <?php else: ?>
                                            <span class="text-infaq font-bold">Infaq Sukarela</span>
                                            <small class="table-sub-info">Bebas HTM Resmi</small>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <div class="kuota-progress-box">
                                            <div class="kuota-num-text">
                                                <strong><?= $row['kuota_terisi']; ?></strong> / <?= $row['kuota_harian']; ?>
                                                <span class="kuota-pct"><?= $kuotaPersen; ?>%</span>
                                            </div>
                                            <div class="progress-bar-track">
                                                <div class="progress-bar-fill" style="width: <?= min(100, $kuotaPersen); ?>%;"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <?php if ($row['status_operasional'] === 'Buka (Aktif)'): ?>
                                            <span class="status-badge status-active"><span class="dot"></span> Buka (Aktif)</span>
                                        <?php else: ?>
                                            <span class="status-badge status-warning"><span class="dot"></span> <?= htmlspecialchars($row['status_operasional']); ?></span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <div class="action-btn-row">
                                            <a href="<?= BASEURL; ?>/wisata/detail/<?= $row['id']; ?>" class="btn-action-view" title="Lihat di Portal Publik" target="_blank">
                                                <i class="fa-regular fa-eye"></i>
                                            </a>
                                            <a href="<?= BASEURL; ?>/wisata/edit/<?= $row['id']; ?>" class="btn-action-edit" title="Edit Data">
                                                <i class="fa-regular fa-pen-to-square"></i>
                                            </a>
                                            <button type="button" class="btn-action-delete trigger-delete-modal" data-url="<?= BASEURL; ?>/wisata/hapus/<?= $row['id']; ?>" data-name="<?= htmlspecialchars($row['nama_wisata']); ?>" title="Hapus Data">
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
                    <span class="table-entry-info">Menampilkan 1 - <?= count($wisataList); ?> dari <?= count($wisataList); ?> destinasi cagar budaya Cirebon</span>
                    <div class="pagination-buttons">
                        <button class="page-link-btn disabled">&laquo; Sebelumnya</button>
                        <button class="page-link-btn active">1</button>
                        <button class="page-link-btn">2</button>
                        <button class="page-link-btn">Selanjutnya &raquo;</button>
                    </div>
                </div>
            </div>

            <!-- Bottom Widgets: Validasi Tiket Real-Time & Proporsi Kunjungan -->
            <div class="widgets-grid-2 mt-30">
                <div class="widget-card">
                    <div class="widget-header">
                        <div class="widget-title-box">
                            <i class="fa-solid fa-qrcode text-teal"></i>
                            <div>
                                <h4 class="widget-title">Validasi Tiket Pintu Masuk Real-Time</h4>
                                <small class="widget-sub">Aktivitas pemindaian e-tiket gerbang masuk destinasi</small>
                            </div>
                        </div>
                        <span class="badge-mini-teal">5 Scan Terakhir</span>
                    </div>

                    <div class="ticket-logs-list mt-15">
                        <div class="ticket-log-item">
                            <span class="log-indicator dot-green"></span>
                            <div class="log-info">
                                <strong>TKT-CRB-202505-0912</strong>
                                <small>Keraton Kasepuhan &bull; 2 Tiket Dewasa</small>
                            </div>
                            <div class="log-price">Rp 40.000</div>
                            <span class="log-time">13:42 WIB</span>
                        </div>

                        <div class="ticket-log-item">
                            <span class="log-indicator dot-green"></span>
                            <div class="log-info">
                                <strong>TKT-CRB-202505-0911</strong>
                                <small>Taman Air Gua Sunyaragi &bull; 4 Tiket Terusan</small>
                            </div>
                            <div class="log-price">Rp 60.000</div>
                            <span class="log-time">13:38 WIB</span>
                        </div>

                        <div class="ticket-log-item">
                            <span class="log-indicator dot-amber"></span>
                            <div class="log-info">
                                <strong>TKT-CRB-202505-0910</strong>
                                <small>Keraton Kanoman &bull; 1 Tiket Pelajar</small>
                            </div>
                            <div class="log-price">Rp 10.000</div>
                            <span class="log-time">13:25 WIB</span>
                        </div>
                    </div>

                    <div class="widget-footer-link mt-15">
                        <small>Sistem terintegrasi gerbang turnstile otomatis IoT</small>
                        <a href="#">Lihat Semua Log Transaksi &rarr;</a>
                    </div>
                </div>

                <div class="widget-card">
                    <div class="widget-header">
                        <div class="widget-title-box">
                            <i class="fa-solid fa-chart-pie text-coral"></i>
                            <div>
                                <h4 class="widget-title">Proporsi Kunjungan</h4>
                                <small class="widget-sub">Berdasarkan kategori wisata</small>
                            </div>
                        </div>
                    </div>

                    <div class="chart-donut-mock mt-20">
                        <div class="donut-circle">
                            <div class="donut-center-text">
                                <span class="donut-big-val">1.6k</span>
                                <small>Wisatawan</small>
                            </div>
                        </div>
                        <div class="donut-legend-list">
                            <div class="legend-row">
                                <span class="legend-color dot-keraton"></span>
                                <span>Keraton & Sejarah</span>
                                <strong class="ml-auto">52%</strong>
                            </div>
                            <div class="legend-row">
                                <span class="legend-color dot-cagar"></span>
                                <span>Situs Cagar Budaya</span>
                                <strong class="ml-auto">28%</strong>
                            </div>
                            <div class="legend-row">
                                <span class="legend-color dot-religi"></span>
                                <span>Wisata Religi & Alam</span>
                                <strong class="ml-auto">20%</strong>
                            </div>
                            <div class="legend-pad-badge mt-10">
                                Retribusi PAD Cirebon <strong>Tercapai 94.2%</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

<script src="<?= BASEURL; ?>/assets/js/script.js"></script>
</body>
</html>
