<?php
/**
 * ====================================================================
 * VIEW: KATALOG PRODUK UMKM (katalog_umkm.php)
 * ====================================================================
 * Proyek      : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Pengembang  : Divisi UMKM & Ekonomi Kreatif
 * Modul       : CRUD Produk Kerajinan & Kuliner UMKM Lokal
 * ====================================================================
 */
?>

<div class="container mt-20">
    <!-- Breadcrumb & Status -->
    <div class="catalog-top-meta">
        <nav class="breadcrumb-nav">
            <a href="<?= BASEURL; ?>/">Beranda</a> &raquo; <span>Katalog Produk UMKM</span>
        </nav>
        <span class="status-verified-badge"><i class="fa-solid fa-circle"></i> Modul Terverifikasi UMKM Mandiri</span>
    </div>

    <!-- Header Banner Katalog -->
    <div class="catalog-header-banner">
        <div>
            <span class="section-badge-pill"><i class="fa-solid fa-store"></i> PEMBERDAYAAN DESA WISATA</span>
            <h1 class="catalog-main-title">Katalog Produk UMKM Cirebon</h1>
            <p class="catalog-lead-text">
                Temukan berbagai kerajinan otentik, batik pesisir Keraton Kasepuhan, dan ragam kuliner khas Cirebon langsung dari tangan pengrajin lokal.
            </p>
        </div>

        <!-- Live Search Bar -->
        <div class="umkm-search-box">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" id="liveSearchInput" placeholder="Cari kerajinan atau kuliner..." value="<?= htmlspecialchars($_GET['cari'] ?? ''); ?>" autocomplete="off">
            <span class="spinner-border spinner-border-sm search-loader" id="searchLoader" style="display:none;"></span>
        </div>
    </div>

    <!-- Main Content Layout with Sidebar -->
    <div class="catalog-sidebar-layout">
        <!-- Sidebar Filter -->
        <aside class="catalog-sidebar">
            <div class="filter-card">
                <div class="filter-header">
                    <h4><i class="fa-solid fa-sliders"></i> Filter Produk</h4>
                    <a href="<?= BASEURL; ?>/umkm" class="reset-filter-link">Reset</a>
                </div>

                <!-- Filter Kategori -->
                <div class="filter-group">
                    <label class="filter-title">Kategori Produk</label>
                    <div class="filter-radio-list">
                        <label class="radio-item">
                            <input type="radio" name="kategoriFilter" value="Semua" <?= ($kategoriAktif === 'Semua' || $kategoriAktif === 'Semua Kategori') ? 'checked' : ''; ?>>
                            <span>Semua Kategori</span>
                            <span class="count-pill">21</span>
                        </label>
                        <label class="radio-item">
                            <input type="radio" name="kategoriFilter" value="Kerajinan Tangan" <?= ($kategoriAktif === 'Kerajinan Tangan') ? 'checked' : ''; ?>>
                            <span>Kerajinan Tangan</span>
                            <span class="count-pill">4</span>
                        </label>
                        <label class="radio-item">
                            <input type="radio" name="kategoriFilter" value="Kuliner Khas" <?= ($kategoriAktif === 'Kuliner Khas') ? 'checked' : ''; ?>>
                            <span>Kuliner Khas</span>
                            <span class="count-pill">9</span>
                        </label>
                        <label class="radio-item">
                            <input type="radio" name="kategoriFilter" value="Batik Cirebon" <?= ($kategoriAktif === 'Batik Cirebon') ? 'checked' : ''; ?>>
                            <span>Batik Cirebon</span>
                            <span class="count-pill">5</span>
                        </label>
                        <label class="radio-item">
                            <input type="radio" name="kategoriFilter" value="Aksesoris" <?= ($kategoriAktif === 'Aksesoris') ? 'checked' : ''; ?>>
                            <span>Aksesoris</span>
                            <span class="count-pill">3</span>
                        </label>
                    </div>
                </div>

                <!-- Filter Rentang Harga (Bebas / Tanpa Batas) -->
                <div class="filter-group">
                    <div class="price-range-label" style="display:flex; justify-content:space-between; align-items:center;">
                        <label class="filter-title">Maksimum Harga</label>
                        <span class="price-val-display" id="priceDisplay" style="font-weight:bold; color:var(--primary-teal);">
                            <?= $maxPriceAktif > 0 ? 'Rp ' . number_format($maxPriceAktif, 0, ',', '.') : 'Bebas'; ?>
                        </span>
                    </div>
                    <div style="margin: 8px 0;">
                        <input type="number" id="customPriceInput" placeholder="Masukkan batas harga bebas (Rp)" class="form-control" style="font-size:12px; padding:6px 10px;" value="<?= $maxPriceAktif > 0 ? $maxPriceAktif : ''; ?>">
                    </div>
                    <input type="range" id="priceRange" min="10000" max="1000000" step="10000" value="<?= $maxPriceAktif > 0 ? $maxPriceAktif : 1000000; ?>" class="form-range">
                    <div class="range-min-max" style="display:flex; justify-content:space-between; font-size:11px; color:#64748B;">
                        <small>Rp 10 rb</small>
                        <small>Bebas / Fleksibel</small>
                    </div>
                </div>

                <!-- Sorting Dropdown -->
                <div class="filter-group">
                    <label class="filter-title">Urutkan Harga</label>
                    <select id="sortDropdown" class="form-select">
                        <option value="terbaru" <?= ($sortAktif === 'terbaru') ? 'selected' : ''; ?>>Paling Sesuai</option>
                        <option value="termurah" <?= ($sortAktif === 'termurah') ? 'selected' : ''; ?>>Harga Terendah</option>
                        <option value="termahal" <?= ($sortAktif === 'termahal') ? 'selected' : ''; ?>>Harga Tertinggi</option>
                        <option value="terlaris" <?= ($sortAktif === 'terlaris') ? 'selected' : ''; ?>>Paling Laris</option>
                    </select>
                </div>

                <!-- Info Box 100% Produk Lokal -->
                <div class="local-support-box">
                    <div class="support-icon"><i class="fa-solid fa-shield-heart"></i></div>
                    <div>
                        <h5>100% Produk Lokal</h5>
                        <p>Setiap transaksi mendukung langsung pendapatan keluarga pengrajin di 12 Desa Wisata Cirebon.</p>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Main Product Grid & Results -->
        <main class="catalog-main-content">
            <div class="results-header-bar">
                <span class="results-count-text">
                    Menampilkan <strong id="totalResultsCount"><?= count($umkmList); ?> Produk</strong> dari Desa Binaan
                </span>
                <span class="stock-ready-tag"><i class="fa-solid fa-circle"></i> Status: Stok Siap Kirim</span>
            </div>

            <!-- Grid Kartu Produk -->
            <div class="catalog-products-grid" id="umkmGridContainer">
                <?php if (empty($umkmList)): ?>
                    <div class="empty-state-card col-span-full">
                        <i class="fa-solid fa-box-open empty-icon"></i>
                        <h4>Produk Tidak Ditemukan</h4>
                        <p>Silakan sesuaikan kata kunci atau filter pencarian Anda.</p>
                    </div>
                <?php else: ?>
                    <?php foreach ($umkmList as $item): ?>
                        <div class="umkm-catalog-card" data-category="<?= htmlspecialchars($item['kategori']); ?>" data-price="<?= $item['harga']; ?>">
                            <div class="card-thumb-wrapper">
                                <span class="origin-village-pill"><?= htmlspecialchars($item['desa_asal']); ?></span>
                                <img src="<?= BASEURL; ?>/assets/img/<?= htmlspecialchars($item['foto']); ?>" alt="<?= htmlspecialchars($item['nama_produk']); ?>" onerror="this.src='https://picsum.photos/seed/umkm_item_<?= $item['id']; ?>/500/400'">
                                <button class="wishlist-float-btn" title="Simpan Produk"><i class="fa-regular fa-heart"></i></button>
                            </div>

                            <div class="card-body-content">
                                <span class="category-meta-text"><?= htmlspecialchars($item['kategori']); ?></span>
                                <h4 class="product-item-title"><?= htmlspecialchars($item['nama_produk']); ?></h4>
                                <div class="product-item-price">Rp <?= number_format($item['harga'], 0, ',', '.'); ?></div>
                                
                                <div class="rating-sold-row">
                                    <i class="fa-solid fa-star text-gold"></i>
                                    <span class="rating-score"><?= $item['rating'] ?? '4.8'; ?></span>
                                    <span class="sold-count">(<?= $item['terjual'] ?? rand(50, 400); ?> terjual)</span>
                                </div>

                                <div class="card-action-buttons">
                                    <a href="<?= BASEURL; ?>/umkm/detail/<?= $item['id']; ?>" class="btn btn-outline-teal btn-sm">
                                        <i class="fa-regular fa-eye"></i> Lihat Detail
                                    </a>
                                    <button type="button" class="btn btn-teal-solid btn-sm add-to-cart-btn" data-id="<?= $item['id']; ?>" data-name="<?= htmlspecialchars($item['nama_produk']); ?>" data-price="<?= $item['harga']; ?>">
                                        <i class="fa-solid fa-cart-plus"></i> + Keranjang
                                    </button>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>

            <!-- Pagination Bar -->
            <div class="catalog-pagination-row">
                <span class="pagination-info">Menampilkan halaman 1 dari 3</span>
                <div class="pagination-nav">
                    <button class="page-btn disabled">&laquo;</button>
                    <button class="page-btn active">1</button>
                    <button class="page-btn">2</button>
                    <button class="page-btn">3</button>
                    <button class="page-btn">&raquo;</button>
                </div>
            </div>
        </main>
    </div>
</div>
