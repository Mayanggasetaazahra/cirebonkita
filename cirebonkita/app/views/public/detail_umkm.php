<?php
/**
 * ====================================================================
 * VIEW: DETAIL PRODUK UMKM (detail_umkm.php)
 * ====================================================================
 * Proyek      : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Pengembang  : Divisi UMKM & Ekonomi Kreatif
 * Modul       : CRUD Produk Kerajinan & Kuliner UMKM Lokal
 * ====================================================================
 */
?>

<div class="container mt-30 mb-60">
    <nav class="breadcrumb-nav">
        <a href="<?= BASEURL; ?>/">Beranda</a> &raquo;
        <a href="<?= BASEURL; ?>/umkm">Katalog UMKM</a> &raquo;
        <span><?= htmlspecialchars($produk['nama_produk']); ?></span>
    </nav>

    <div class="product-detail-layout mt-20">
        <!-- Foto Produk -->
        <div class="product-gallery-side">
            <div class="main-photo-frame">
                <img src="<?= BASEURL; ?>/assets/img/<?= htmlspecialchars($produk['foto']); ?>" alt="<?= htmlspecialchars($produk['nama_produk']); ?>" onerror="this.src='https://picsum.photos/seed/umkm_d_<?= $produk['id']; ?>/600/500'">
            </div>
            <div class="mitra-badge-card mt-20">
                <div class="mitra-icon"><i class="fa-solid fa-hands-holding-child"></i></div>
                <div>
                    <span class="mitra-sub">Diproduksi Oleh:</span>
                    <h5 class="mitra-name"><?= htmlspecialchars($produk['mitra_pengrajin']); ?></h5>
                    <small class="mitra-village"><i class="fa-solid fa-location-dot"></i> <?= htmlspecialchars($produk['desa_asal']); ?>, Cirebon</small>
                </div>
            </div>
        </div>

        <!-- Spesifikasi & Form Pembelian -->
        <div class="product-order-side">
            <span class="category-badge-pill"><?= htmlspecialchars($produk['kategori']); ?></span>
            <h1 class="detail-product-title"><?= htmlspecialchars($produk['nama_produk']); ?></h1>
            
            <div class="product-price-large">
                Rp <?= number_format($produk['harga'], 0, ',', '.'); ?>
                <span class="stock-status-pill badge-<?= strtolower(str_replace(' ', '-', $produk['status_stok'])); ?>">
                    <?= htmlspecialchars($produk['status_stok']); ?> (Stok: <?= $produk['stok']; ?> pcs)
                </span>
            </div>

            <div class="product-meta-specs">
                <div class="spec-row">
                    <span class="spec-label">Kode SKU:</span>
                    <span class="spec-val"><code><?= htmlspecialchars($produk['kode_sku']); ?></code></span>
                </div>
                <div class="spec-row">
                    <span class="spec-label">Standar Mutu:</span>
                    <span class="spec-val"><i class="fa-solid fa-certificate text-success"></i> Terkurasi Dinas Pariwisata & PIRT Lolos</span>
                </div>
                <div class="spec-row">
                    <span class="spec-label">Pengiriman:</span>
                    <span class="spec-val">Langsung dari Galeri Desa Binaan (Bisa COD / Ekspedisi)</span>
                </div>
            </div>

            <div class="product-description-box mt-20">
                <h4 class="desc-heading">Deskripsi Produk</h4>
                <p class="desc-body"><?= nl2br(htmlspecialchars($produk['deskripsi'])); ?></p>
            </div>

            <!-- Tombol Pesan Langsung / Tambah Keranjang -->
            <div class="order-action-box mt-30">
                <div class="qty-select-wrapper">
                    <label for="orderQty">Jumlah:</label>
                    <div class="qty-counter-input">
                        <button type="button" class="btn-qty" onclick="changeQty(-1)">-</button>
                        <input type="number" id="orderQty" value="1" min="1" max="<?= $produk['stok']; ?>" readonly class="input-qty">
                        <button type="button" class="btn-qty" onclick="changeQty(1)">+</button>
                    </div>
                </div>

                <div class="order-buttons-row">
                    <button type="button" class="btn btn-outline-teal btn-lg add-to-cart-btn" data-id="<?= $produk['id']; ?>" data-name="<?= htmlspecialchars($produk['nama_produk']); ?>" data-price="<?= $produk['harga']; ?>">
                        <i class="fa-solid fa-basket-shopping"></i> Tambah ke Keranjang
                    </button>
                    <a href="https://wa.me/6281299881209?text=Halo%20Admin%20CirebonKita,%20saya%20tertarik%20membeli%20produk%20<?= urlencode($produk['nama_produk']); ?>" target="_blank" class="btn btn-teal-solid btn-lg">
                        <i class="fa-brands fa-whatsapp"></i> Pesan via WhatsApp
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function changeQty(delta) {
    const input = document.getElementById('orderQty');
    let val = parseInt(input.value) + delta;
    if (val < 1) val = 1;
    if (val > <?= (int)$produk['stok']; ?>) val = <?= (int)$produk['stok']; ?>;
    input.value = val;
}
</script>
