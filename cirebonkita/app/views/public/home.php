<?php
/**
 * ====================================================================
 * VIEW: BERANDA UTAMA (home.php)
 * ====================================================================
 * Proyek  : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Kelompok: 5 (Smart Tourism Sektor Pariwisata Daerah)
 * ====================================================================
 */
?>

<!-- HERO SECTION -->
<section class="hero-section" style="background-image: linear-gradient(rgba(0, 43, 54, 0.75), rgba(0, 43, 54, 0.85)), url('<?= BASEURL; ?>/assets/img/hero_keraton.jpg');">
    <div class="container hero-container">
        <div class="hero-content">
            <h1 class="hero-title">
                Selamat Datang di <span class="highlight-accent">CirebonKita</span>
            </h1>
            <p class="hero-lead">
                Jelajahi pesona budaya Cirebon, temukan produk UMKM lokal autentik, pesan homestay hangat khas keraton, dan nikmati pengalaman wisata pesisir yang tak terlupakan.
            </p>
            <div class="hero-buttons">
                <a href="<?= BASEURL; ?>/umkm" class="btn btn-primary-hero">
                    Jelajahi Sekarang <i class="fa-solid fa-arrow-right"></i>
                </a>
                <a href="<?= BASEURL; ?>/wisata" class="btn btn-outline-hero">
                    <i class="fa-solid fa-compass"></i> Destinasi Wisata
                </a>
            </div>
            
            <!-- Quick Stat Counters -->
            <div class="hero-stats-row">
                <div class="stat-item">
                    <span class="stat-number">150+</span>
                    <span class="stat-label">Pengrajin UMKM</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">18</span>
                    <span class="stat-label">Situs Bersejarah</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">45+</span>
                    <span class="stat-label">Homestay Ramah</span>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- 4 FEATURE QUICK CARDS -->
<section class="quick-features-section">
    <div class="container features-grid-4">
        <a href="<?= BASEURL; ?>/umkm" class="feature-card">
            <div class="feature-icon bg-emerald">
                <i class="fa-solid fa-store"></i>
            </div>
            <div>
                <h4 class="feature-title">Produk UMKM</h4>
                <p class="feature-sub">Kerajinan & Kuliner</p>
            </div>
        </a>

        <a href="<?= BASEURL; ?>/wisata" class="feature-card">
            <div class="feature-icon bg-blue">
                <i class="fa-solid fa-landmark"></i>
            </div>
            <div>
                <h4 class="feature-title">Destinasi Wisata</h4>
                <p class="feature-sub">Budaya, Keraton & Alam</p>
            </div>
        </a>

        <a href="<?= BASEURL; ?>/homestay" class="feature-card">
            <div class="feature-icon bg-amber">
                <i class="fa-solid fa-house-chimney-user"></i>
            </div>
            <div>
                <h4 class="feature-title">Homestay</h4>
                <p class="feature-sub">Akomodasi Warga Lokal</p>
            </div>
        </a>

        <div class="feature-card">
            <div class="feature-icon bg-coral">
                <i class="fa-solid fa-ticket"></i>
            </div>
            <div>
                <h4 class="feature-title">Promo & Tiket</h4>
                <p class="feature-sub">Paket Bundling Hemat</p>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 1: PRODUK UNGGULAN UMKM -->
<section class="section-padding">
    <div class="container">
        <div class="section-header-flex">
            <div>
                <span class="section-badge-pill"><i class="fa-solid fa-gem"></i> KOLEKSI KRIYA & KULINER</span>
                <h2 class="section-heading">Produk Unggulan UMKM</h2>
                <p class="section-subtext">Dibuat langsung oleh perajin dan dapur keluarga asli Cirebon dengan mutu terjaga.</p>
            </div>
            <!-- Filter Kategori Cepat -->
            <div class="category-filter-pills" id="homeProductFilter">
                <button class="pill-btn active" data-filter="all">Semua</button>
                <button class="pill-btn" data-filter="Batik Cirebon">Batik</button>
                <button class="pill-btn" data-filter="Kuliner Khas">Kuliner</button>
                <button class="pill-btn" data-filter="Kerajinan Tangan">Kerajinan</button>
            </div>
        </div>

        <div class="products-grid-5" id="homeProductList">
            <?php foreach (array_slice($umkmList, 0, 5) as $item): ?>
                <div class="product-card" data-category="<?= htmlspecialchars($item['kategori']); ?>">
                    <div class="product-thumb-box">
                        <span class="product-origin-badge"><?= htmlspecialchars($item['desa_asal']); ?></span>
                        <img src="<?= BASEURL; ?>/assets/img/<?= htmlspecialchars($item['foto']); ?>" alt="<?= htmlspecialchars($item['nama_produk']); ?>" onerror="this.src='https://picsum.photos/seed/<?= $item['id']; ?>/400/300'">
                        <button class="wishlist-btn" title="Simpan ke Favorit"><i class="fa-regular fa-heart"></i></button>
                    </div>
                    <div class="product-details">
                        <span class="product-category-text"><?= htmlspecialchars($item['kategori']); ?></span>
                        <h4 class="product-name">
                            <a href="<?= BASEURL; ?>/umkm/detail/<?= $item['id']; ?>"><?= htmlspecialchars($item['nama_produk']); ?></a>
                        </h4>
                        <div class="product-price">Rp <?= number_format($item['harga'], 0, ',', '.'); ?></div>
                        <div class="product-card-actions">
                            <a href="<?= BASEURL; ?>/umkm/detail/<?= $item['id']; ?>" class="btn btn-buy-solid">
                                <i class="fa-solid fa-bag-shopping"></i> Beli
                            </a>
                            <a href="<?= BASEURL; ?>/umkm/detail/<?= $item['id']; ?>" class="btn-icon-eye" title="Lihat Detail">
                                <i class="fa-regular fa-eye"></i>
                            </a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="text-center mt-30">
            <a href="<?= BASEURL; ?>/umkm" class="btn btn-outline-teal">
                Lihat Semua Produk <i class="fa-solid fa-arrow-right"></i>
            </a>
        </div>
    </div>
</section>

<!-- SECTION 2: DESTINASI REKREASI POPULER -->
<section class="section-padding bg-cream">
    <div class="container">
        <div class="section-header-flex">
            <div>
                <span class="section-badge-pill"><i class="fa-solid fa-landmark"></i> WARISAN SEJARAH & BUDAYA</span>
                <h2 class="section-heading">Destinasi Rekreasi Populer</h2>
                <p class="section-subtext">Kunjungi jejak kebesaran kesultanan dan pesona arsitektur cagar budaya Cirebon.</p>
            </div>
            <span class="verified-tag"><i class="fa-solid fa-circle-check"></i> Pemesanan Tiket Online Langsung Terverifikasi</span>
        </div>

        <div class="wisata-grid-3">
            <?php foreach (array_slice($wisataList, 0, 3) as $w): ?>
                <div class="wisata-card">
                    <div class="wisata-thumb">
                        <span class="wisata-cat-tag"><?= htmlspecialchars($w['kategori']); ?></span>
                        <img src="<?= BASEURL; ?>/assets/img/<?= htmlspecialchars($w['foto']); ?>" alt="<?= htmlspecialchars($w['nama_wisata']); ?>" onerror="this.src='https://picsum.photos/seed/wisata<?= $w['id']; ?>/600/400'">
                        <div class="wisata-price-badge">
                            <?= ($w['harga_tiket'] > 0) ? 'Rp ' . number_format($w['harga_tiket'], 0, ',', '.') . ' / orang' : 'Infaq Sukarela'; ?>
                        </div>
                    </div>
                    <div class="wisata-info">
                        <div class="wisata-rating-row">
                            <i class="fa-solid fa-star text-gold"></i>
                            <span class="rating-num">4.9</span>
                            <span class="review-count">(1.420 ulasan)</span>
                        </div>
                        <h3 class="wisata-title">
                            <a href="<?= BASEURL; ?>/wisata/detail/<?= $w['id']; ?>"><?= htmlspecialchars($w['nama_wisata']); ?></a>
                        </h3>
                        <p class="wisata-snippet"><?= htmlspecialchars($w['deskripsi']); ?></p>
                        
                        <div class="wisata-features-pills">
                            <?php foreach (explode(',', $w['fasilitas']) as $fasi): ?>
                                <span class="feature-tag"><?= trim(htmlspecialchars($fasi)); ?></span>
                            <?php endforeach; ?>
                        </div>

                        <a href="<?= BASEURL; ?>/wisata/detail/<?= $w['id']; ?>" class="btn btn-teal-solid btn-block mt-15">
                            <i class="fa-solid fa-ticket"></i> Pesan Tiket Masuk
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- SECTION 3: HOMESTAY ASRI DESA WISATA CIREBON -->
<section class="section-padding">
    <div class="container homestay-highlight-card">
        <div class="homestay-highlight-info">
            <span class="section-badge-pill"><i class="fa-solid fa-house-chimney"></i> AKOMODASI WARGA MANDIRI</span>
            <h2 class="highlight-title">Homestay Asri Desa Wisata Cirebon</h2>
            <p class="highlight-desc">
                Rasakan kehangatan tinggal di rumah penduduk lokal yang nyaman, nikmati sarapan khas nasi bogana buatan tuan rumah, dan pelajari seni membatik dari halaman belakang.
            </p>
            <ul class="highlight-checks">
                <li><i class="fa-solid fa-circle-check"></i> Dekat dengan sentra kuliner dan kawasan keraton</li>
                <li><i class="fa-solid fa-circle-check"></i> Fasilitas AC, Wi-Fi gratis, dan ramah keluarga</li>
                <li><i class="fa-solid fa-circle-check"></i> Mendukung perekonomian langsung warga desa</li>
            </ul>
            <div class="homestay-cta-row">
                <a href="<?= BASEURL; ?>/homestay" class="btn btn-teal-solid">
                    <i class="fa-regular fa-calendar-days"></i> Cari Jadwal Menginap
                </a>
                <span class="price-start-text">Mulai <strong>Rp 180.000</strong> / malam</span>
            </div>
        </div>

        <!-- 4 Image Grid Display -->
        <div class="homestay-highlight-grid">
            <img src="<?= BASEURL; ?>/assets/img/homestay_1.jpg" alt="Interior Homestay" onerror="this.src='https://picsum.photos/seed/home1/400/300'">
            <img src="<?= BASEURL; ?>/assets/img/homestay_2.jpg" alt="Teh Poci Sarapan" onerror="this.src='https://picsum.photos/seed/home2/400/300'">
            <img src="<?= BASEURL; ?>/assets/img/homestay_3.jpg" alt="Pendopo Tradisional" onerror="this.src='https://picsum.photos/seed/home3/400/300'">
            <img src="<?= BASEURL; ?>/assets/img/homestay_4.jpg" alt="Wisatawan Homestay" onerror="this.src='https://picsum.photos/seed/home4/400/300'">
        </div>
    </div>
</section>

<!-- SECTION 4: CALL TO ACTION DUKUNG UMKM -->
<section class="container mb-60">
    <div class="cta-banner-green">
        <div class="cta-content">
            <span class="cta-badge"><i class="fa-solid fa-bullhorn"></i> GERAKAN BANGGA BUATAN LOKAL</span>
            <h2 class="cta-title">Dukung UMKM Cirebon Bersama Kita</h2>
            <p class="cta-desc">
                Setiap pembelian produk lokal adalah langkah nyata untuk melestarikan kebudayaan leluhur, memutar roda ekonomi keluarga nelayan dan perajin, serta meningkatkan kesejahteraan masyarakat mandiri Cirebon.
            </p>
            <div class="cta-actions">
                <a href="<?= BASEURL; ?>/umkm" class="btn btn-amber-solid">
                    Belanja Sekarang <i class="fa-solid fa-arrow-right"></i>
                </a>
                <span class="guarantee-text"><i class="fa-solid fa-shield-halved"></i> 100% Produk Langsung Dari Perajin</span>
            </div>
        </div>
    </div>
</section>
