<?php
/**
 * ====================================================================
 * VIEW: DETAIL WISATA & PESAN TIKET (detail_wisata.php)
 * ====================================================================
 * Proyek      : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Pengembang  : Divisi Wisata & Tiket
 * Modul       : CRUD Master Daya Tarik Wisata & Tiket Spot Rekreasi
 * ====================================================================
 */
?>

<div class="container mt-30 mb-60">
    <!-- Breadcrumb -->
    <nav class="breadcrumb-nav">
        <a href="<?= BASEURL; ?>/">Beranda</a> &raquo;
        <a href="<?= BASEURL; ?>/wisata">Destinasi Wisata</a> &raquo;
        <span><?= htmlspecialchars($wisata['nama_wisata']); ?></span>
    </nav>

    <div class="detail-wisata-layout">
        <!-- Kolom Kiri: Galeri Foto & Informasi Lengkap -->
        <div class="wisata-detail-main">
            <div class="detail-header-block">
                <span class="category-badge-pill"><?= htmlspecialchars($wisata['kategori']); ?></span>
                <h1 class="detail-title"><?= htmlspecialchars($wisata['nama_wisata']); ?></h1>
                <p class="detail-location"><i class="fa-solid fa-location-dot"></i> <?= htmlspecialchars($wisata['lokasi']); ?></p>
            </div>

            <!-- Galeri Foto CSS Grid -->
            <div class="wisata-gallery-grid">
                <div class="gallery-main-photo">
                    <img src="<?= BASEURL; ?>/assets/img/<?= htmlspecialchars($wisata['foto']); ?>" alt="<?= htmlspecialchars($wisata['nama_wisata']); ?>" onerror="this.src='https://picsum.photos/seed/wisata_main/800/500'">
                </div>
                <div class="gallery-sub-photos">
                    <img src="https://picsum.photos/seed/sub1/400/300" alt="Spot Detail 1">
                    <img src="https://picsum.photos/seed/sub2/400/300" alt="Spot Detail 2">
                </div>
            </div>

            <!-- Deskripsi Sejarah & Budaya -->
            <div class="detail-section-card mt-30">
                <h3 class="section-card-title"><i class="fa-solid fa-scroll"></i> Sejarah & Nilai Warisan Kebudayaan</h3>
                <p class="detail-text-paragraph"><?= nl2br(htmlspecialchars($wisata['deskripsi'])); ?></p>
            </div>

            <!-- Fasilitas & Jam Operasional -->
            <div class="detail-info-cards-grid mt-20">
                <div class="info-mini-card">
                    <div class="mini-icon"><i class="fa-regular fa-clock"></i></div>
                    <div>
                        <span class="mini-label">Jam Operasional</span>
                        <h5 class="mini-val"><?= htmlspecialchars($wisata['jam_buka']); ?></h5>
                    </div>
                </div>

                <div class="info-mini-card">
                    <div class="mini-icon"><i class="fa-solid fa-users"></i></div>
                    <div>
                        <span class="mini-label">Kapasitas Kuota Harian</span>
                        <h5 class="mini-val"><?= htmlspecialchars($wisata['kuota_harian']); ?> Wisatawan / hari</h5>
                    </div>
                </div>

                <div class="info-mini-card">
                    <div class="mini-icon"><i class="fa-solid fa-circle-check"></i></div>
                    <div>
                        <span class="mini-label">Status Operasional</span>
                        <h5 class="mini-val text-success"><?= htmlspecialchars($wisata['status_operasional']); ?></h5>
                    </div>
                </div>
            </div>

            <div class="detail-section-card mt-20">
                <h3 class="section-card-title"><i class="fa-solid fa-list-check"></i> Fasilitas Tersedia</h3>
                <div class="features-badge-list">
                    <?php foreach (explode(',', $wisata['fasilitas']) as $fas): ?>
                        <span class="facility-badge-item"><i class="fa-solid fa-check"></i> <?= trim(htmlspecialchars($fas)); ?></span>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>

        <!-- Kolom Kanan: Card Pemesanan E-Tiket Interaktif -->
        <div class="wisata-booking-sidebar">
            <div class="ticket-order-card">
                <div class="ticket-card-header">
                    <span class="ticket-header-sub">Harga Tiket Masuk</span>
                    <div class="ticket-main-price">
                        <?= ($wisata['harga_tiket'] > 0) ? 'Rp ' . number_format($wisata['harga_tiket'], 0, ',', '.') : 'Infaq Sukarela'; ?>
                        <span class="unit-per">/ orang</span>
                    </div>
                </div>

                <form action="#" method="POST" class="ticket-calculator-form" id="ticketOrderForm">
                    <div class="form-group">
                        <label for="tanggalKunjungan">Pilih Tanggal Kunjungan</label>
                        <input type="date" id="tanggalKunjungan" class="form-control" value="<?= date('Y-m-d'); ?>" min="<?= date('Y-m-d'); ?>" required>
                    </div>

                    <div class="form-group">
                        <label for="qtyTiket">Jumlah Tiket (Pengunjung)</label>
                        <div class="qty-counter-input">
                            <button type="button" class="btn-qty" id="btnMinusTiket">-</button>
                            <input type="number" id="qtyTiket" value="1" min="1" max="50" class="input-qty" readonly>
                            <button type="button" class="btn-qty" id="btnPlusTiket">+</button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="namaLengkap">Nama Pemesan / Perwakilan</label>
                        <input type="text" id="namaLengkap" class="form-control" placeholder="Contoh: Hendrik Pratama" required>
                    </div>

                    <div class="form-group">
                        <label for="kontakWa">Nomor WhatsApp (Kirim E-Tiket)</label>
                        <input type="tel" id="kontakWa" class="form-control" placeholder="081234567890" required>
                    </div>

                    <hr class="divider-ticket">

                    <div class="calc-row">
                        <span>Harga Satuan:</span>
                        <span id="labelHargaSatuan">Rp <?= number_format($wisata['harga_tiket'], 0, ',', '.'); ?></span>
                    </div>
                    <div class="calc-row">
                        <span>Retribusi Desa & Asuransi:</span>
                        <span class="text-success">Gratis / Termasuk</span>
                    </div>
                    <div class="calc-row total-row">
                        <span>Total Pembayaran:</span>
                        <span class="total-price-text" id="labelTotalHarga">Rp <?= number_format($wisata['harga_tiket'], 0, ',', '.'); ?></span>
                    </div>

                    <button type="button" class="btn btn-teal-solid btn-block mt-20" id="btnBayarTiket">
                        <i class="fa-solid fa-qrcode"></i> Lanjut Pembayaran E-Tiket
                    </button>
                    
                    <p class="ticket-secure-note">
                        <i class="fa-solid fa-lock"></i> Transaksi langsung terverifikasi ke sistem loket pintu masuk desa.
                    </p>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    const hargaTiketSatuan = <?= (float)$wisata['harga_tiket']; ?>;
</script>
