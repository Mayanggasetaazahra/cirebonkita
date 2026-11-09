<?php
/**
 * ====================================================================
 * VIEW: KATALOG WISATA & TIKET (katalog_wisata.php)
 * ====================================================================
 * Proyek      : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Pengembang  : Divisi Wisata & Tiket
 * Modul       : CRUD Master Daya Tarik Wisata & Tiket Spot Rekreasi
 * ====================================================================
 */
?>

<!-- Tab Switcher Header -->
<div class="container mt-30">
    <div class="portal-tab-switch">
        <a href="<?= BASEURL; ?>/wisata" class="tab-pill active">
            <i class="fa-solid fa-landmark"></i> Destinasi Budaya & Wisata
        </a>
        <a href="<?= BASEURL; ?>/homestay" class="tab-pill">
            <i class="fa-solid fa-house-chimney-window"></i> Reservasi Homestay & Penginapan
        </a>
        <span class="live-status-pill ml-auto"><i class="fa-solid fa-circle"></i> Pusat Tiket & Reservasi Real-Time</span>
    </div>
</div>

<section class="section-padding">
    <div class="container">
        <!-- Hero Header Wisata -->
        <div class="wisata-catalog-header">
            <div class="header-text-box">
                <span class="section-badge-pill"><i class="fa-solid fa-monument"></i> WARISAN ARSITEKTUR & REKREASI BAHARI</span>
                <h1 class="catalog-main-title">Eksplorasi Jejak Kesultanan & Panorama Alam Cirebon</h1>
                <p class="catalog-lead-text">
                    Dari kemegahan bata merah Keraton Kasepuhan, labirin karang Gua Sunyaragi, hingga rimbunnya hutan lindung Plangon. Pesan e-tiket resmi secara langsung dengan retribusi kas desa transparan.
                </p>
            </div>
            
            <div class="visitor-stat-card">
                <span class="stat-head-label">Statistik Pengunjung Desa <span class="badge-time">Pekan Ini</span></span>
                <div class="visitor-count">14.820+ <span class="visitor-unit">Wisatawan Terverifikasi</span></div>
                <div class="visitor-sparkline">
                    <svg viewBox="0 0 100 25" class="sparkline-svg">
                        <path d="M0 20 Q25 5, 50 15 T100 5" fill="none" stroke="#004C6D" stroke-width="3" stroke-linecap="round"/>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Filter Kategori Wisata JS -->
        <div class="wisata-filter-bar">
            <div class="filter-btn-group" id="wisataFilterGroup">
                <button class="filter-chip <?= ($kategoriAktif === 'Semua') ? 'active' : ''; ?>" data-kategori="Semua">
                    Semua Spot (<?= count($wisataList); ?>)
                </button>
                <button class="filter-chip <?= ($kategoriAktif === 'Keraton & Sejarah') ? 'active' : ''; ?>" data-kategori="Keraton & Sejarah">
                    Keraton & Sejarah
                </button>
                <button class="filter-chip <?= ($kategoriAktif === 'Situs Cagar Budaya') ? 'active' : ''; ?>" data-kategori="Situs Cagar Budaya">
                    Situs Cagar Budaya
                </button>
                <button class="filter-chip <?= ($kategoriAktif === 'Wisata Religi') ? 'active' : ''; ?>" data-kategori="Wisata Religi">
                    Wisata Religi
                </button>
                <button class="filter-chip <?= ($kategoriAktif === 'Wisata Alam & Rekreasi') ? 'active' : ''; ?>" data-kategori="Wisata Alam & Rekreasi">
                    Alam & Rekreasi
                </button>
            </div>
            <div class="ticket-integration-info">
                <i class="fa-solid fa-circle-info"></i> Tiket digital terintegrasi QRIS & Cetak di Loket Resmi
            </div>
        </div>

        <!-- Grid Kartu Wisata -->
        <div class="wisata-cards-grid" id="wisataCardsContainer">
            <?php foreach ($wisataList as $w): ?>
                <div class="wisata-card-item" data-kategori="<?= htmlspecialchars($w['kategori']); ?>">
                    <div class="wisata-image-holder">
                        <span class="category-badge-pill"><?= htmlspecialchars($w['kategori']); ?></span>
                        <img src="<?= BASEURL; ?>/assets/img/<?= htmlspecialchars($w['foto']); ?>" alt="<?= htmlspecialchars($w['nama_wisata']); ?>" onerror="this.src='https://picsum.photos/seed/wisata_item_<?= $w['id']; ?>/600/400'">
                        <div class="rating-floating-badge">
                            <i class="fa-solid fa-star"></i> 4.9 (1.2k)
                        </div>
                    </div>
                    
                    <div class="wisata-body-content">
                        <div class="location-label">
                            <i class="fa-solid fa-location-dot"></i> <?= htmlspecialchars($w['lokasi']); ?>
                        </div>
                        <h3 class="wisata-card-title"><?= htmlspecialchars($w['nama_wisata']); ?></h3>
                        <p class="wisata-card-desc"><?= htmlspecialchars($w['deskripsi']); ?></p>
                        
                        <div class="wisata-footer-pricing">
                            <div>
                                <span class="price-label">Harga E-Tiket:</span>
                                <div class="price-val">
                                    <?= ($w['harga_tiket'] > 0) ? 'Rp ' . number_format($w['harga_tiket'], 0, ',', '.') : '<span class="text-free">Gratis / Donasi</span>'; ?>
                                </div>
                            </div>
                            <a href="<?= BASEURL; ?>/wisata/detail/<?= $w['id']; ?>" class="btn btn-teal-solid">
                                <i class="fa-solid fa-ticket"></i> Pesan Tiket Sekarang
                            </a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
