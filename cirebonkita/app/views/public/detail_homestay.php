<?php
/**
 * ====================================================================
 * VIEW: RESERVASI HOMESTAY & ULASAN (detail_homestay.php)
 * ====================================================================
 * Proyek      : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Pengembang  : Divisi Homestay & Akomodasi
 * Modul       : CRUD Booking Homestay & Moderasi Ulasan
 * ====================================================================
 */
?>

<!-- Tab Switcher Header -->
<div class="container mt-30">
    <div class="portal-tab-switch">
        <a href="<?= BASEURL; ?>/wisata" class="tab-pill">
            <i class="fa-solid fa-landmark"></i> Destinasi Budaya & Wisata
        </a>
        <a href="<?= BASEURL; ?>/homestay" class="tab-pill active">
            <i class="fa-solid fa-house-chimney-window"></i> Reservasi Homestay & Penginapan
        </a>
        <span class="live-status-pill ml-auto"><i class="fa-solid fa-circle"></i> Pusat Tiket & Reservasi Real-Time</span>
    </div>
</div>

<section class="section-padding">
    <div class="container">
        <!-- Hero Header Homestay -->
        <div class="homestay-section-header">
            <span class="section-badge-pill"><i class="fa-solid fa-hotel"></i> HOSPITALITI WARGA & AKOMODASI DESA MANDIRI</span>
            <h1 class="catalog-main-title">Tidur Nyaman di Rumah Tradisional Warga Pesisir</h1>
            <p class="catalog-lead-text">
                Merasakan langsung kehangatan teh poci hangat, sarapan Sega Jamblang autentik, dan tinggal dekat pengrajin batik Trusmi serta pelataran keraton.
            </p>
        </div>

        <!-- SEARCH BAR DENGAN DATEPICKER JS -->
        <div class="homestay-search-bar-card">
            <form action="<?= BASEURL; ?>/homestay" method="GET" class="homestay-search-form" id="homestayFilterForm">
                <div class="search-input-col">
                    <label><i class="fa-solid fa-location-dot"></i> Lokasi / Desa Wisata</label>
                    <input type="text" name="cari" placeholder="Kasepuhan & Trusmi, Cirebon" value="<?= htmlspecialchars($_GET['cari'] ?? ''); ?>">
                </div>

                <div class="search-input-col">
                    <label><i class="fa-regular fa-calendar-days"></i> Tanggal Check-in</label>
                    <input type="date" id="searchCheckIn" name="checkin" value="<?= date('Y-m-d'); ?>">
                </div>

                <div class="search-input-col">
                    <label><i class="fa-regular fa-calendar-check"></i> Tanggal Check-out</label>
                    <input type="date" id="searchCheckOut" name="checkout" value="<?= date('Y-m-d', strtotime('+2 days')); ?>">
                </div>

                <div class="search-input-col">
                    <label><i class="fa-solid fa-user-group"></i> Tamu</label>
                    <select name="tamu" class="select-tamu">
                        <option value="2">2 Tamu</option>
                        <option value="3">3 Tamu</option>
                        <option value="4">4 Tamu</option>
                        <option value="5">5+ Tamu (Keluarga)</option>
                    </select>
                </div>

                <div class="search-action-col">
                    <button type="submit" class="btn btn-teal-solid btn-search-homestay">
                        <i class="fa-solid fa-magnifying-glass"></i> Cari Homestay
                    </button>
                </div>
            </form>
        </div>

        <!-- LISTING KARTU HOMESTAY -->
        <div class="homestay-results-header mt-40">
            <div>
                <h3 class="results-subheading">Pilihan Homestay Mitra Masyarakat</h3>
                <p class="results-subtext">Standar kebersihan CHSE, air bersih sumur bor keraton, dan fasilitas ramah keluarga.</p>
            </div>
            <div class="sort-tag-group">
                <span class="sort-label">Urutan:</span>
                <span class="sort-pill-active">Rekomendasi Warga</span>
            </div>
        </div>

        <div class="homestay-cards-grid mt-20">
            <?php foreach ($homestayList as $h): ?>
                <div class="homestay-card">
                    <div class="homestay-card-thumb">
                        <span class="homestay-badge-top"><?= htmlspecialchars($h['tipe_kamar']); ?></span>
                        <img src="<?= BASEURL; ?>/assets/img/<?= htmlspecialchars($h['foto']); ?>" alt="<?= htmlspecialchars($h['nama_homestay']); ?>" onerror="this.src='https://picsum.photos/seed/homestay_<?= $h['id']; ?>/600/400'">
                        <button class="wishlist-float-btn" title="Simpan ke Favorit"><i class="fa-regular fa-heart"></i></button>
                    </div>

                    <div class="homestay-card-body">
                        <div class="meta-location-rating">
                            <span class="loc-text"><i class="fa-solid fa-location-dot"></i> <?= htmlspecialchars($h['jarak_pusat'] ?? 'Dekat Sentra'); ?></span>
                            <span class="rating-text"><i class="fa-solid fa-star text-gold"></i> <?= $h['avg_rating'] ?? '4.9'; ?> (<?= $h['total_ulasan'] ?? '32'; ?> ulasan)</span>
                        </div>

                        <h3 class="homestay-name"><?= htmlspecialchars($h['nama_homestay']); ?></h3>
                        <p class="homestay-tagline"><?= htmlspecialchars($h['lokasi']); ?></p>

                        <div class="homestay-amenities">
                            <?php foreach (explode(',', $h['fasilitas']) as $fas): ?>
                                <span class="amenity-item"><i class="fa-solid fa-check"></i> <?= trim(htmlspecialchars($fas)); ?></span>
                            <?php endforeach; ?>
                        </div>

                        <div class="homestay-card-footer">
                            <div>
                                <span class="rate-sub">Mulai dari</span>
                                <div class="rate-amount">Rp <?= number_format($h['harga_per_malam'], 0, ',', '.'); ?> <span class="per-night">/ malam</span></div>
                            </div>
                            <button type="button" class="btn btn-teal-solid btn-open-booking" data-id="<?= $h['id']; ?>" data-name="<?= htmlspecialchars($h['nama_homestay']); ?>" data-price="<?= $h['harga_per_malam']; ?>" data-room="<?= htmlspecialchars($h['tipe_kamar']); ?>">
                                Pesan Kamar <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

        <!-- BAGIAN ULASAN NYATA & FORM PENILAIAN RATING BINTANG -->
        <div class="reviews-section-layout mt-60">
            <!-- Kolom Kiri: Daftar Ulasan Terverifikasi -->
            <div class="reviews-list-col">
                <span class="section-badge-pill"><i class="fa-solid fa-comments"></i> ULASAN NYATA WISATAWAN</span>
                <h3 class="reviews-col-title">Cerita Pengalaman Menginap & Berkeliling</h3>
                <p class="reviews-col-sub">Semua ulasan diverifikasi dari pemesanan resmi desa wisata untuk menjamin kejujuran dan rasa aman.</p>

                <div class="testimonials-wrapper mt-30">
                    <?php if (empty($ulasanList)): ?>
                        <p class="text-muted">Belum ada ulasan yang ditampilkan.</p>
                    <?php else: ?>
                        <?php foreach ($ulasanList as $u): ?>
                            <div class="testimonial-card">
                                <div class="reviewer-meta">
                                    <div class="reviewer-avatar">
                                        <?= strtoupper(substr($u['nama_pengulas'], 0, 1)); ?>
                                    </div>
                                    <div>
                                        <h5 class="reviewer-name"><?= htmlspecialchars($u['nama_pengulas']); ?></h5>
                                        <span class="reviewer-stay">Menginap di <?= htmlspecialchars($u['nama_homestay']); ?> &bull; 3 hari lalu</span>
                                    </div>
                                    <div class="star-rating-display ml-auto">
                                        <?php for ($i = 1; $i <= 5; $i++): ?>
                                            <i class="fa-solid fa-star <?= ($i <= $u['rating_bintang']) ? 'text-gold' : 'text-gray'; ?>"></i>
                                        <?php endfor; ?>
                                    </div>
                                </div>
                                <p class="reviewer-quote">"<?= htmlspecialchars($u['komentar']); ?>"</p>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Kolom Kanan: Form Penilaian Rating Bintang Interaktif -->
            <div class="review-form-col">
                <div class="review-form-card">
                    <span class="section-badge-pill"><i class="fa-solid fa-pen-nib"></i> SUARAKAN PENGALAMAN ANDA</span>
                    <h3 class="review-form-title">Tulis Ulasan & Rating Bintang</h3>
                    <p class="review-form-sub">Bantu UMKM dan pengelola homestay desa untuk terus meningkatkan mutu pelayanan mereka.</p>

                    <form action="<?= BASEURL; ?>/homestay/submitUlasan" method="POST" class="star-review-form" id="starReviewForm">
                        <div class="form-group">
                            <label for="selectHomestay">Pilih Penginapan / Destinasi</label>
                            <select name="homestay_id" id="selectHomestay" class="form-control" required>
                                <?php foreach ($homestayList as $h): ?>
                                    <option value="<?= $h['id']; ?>"><?= htmlspecialchars($h['nama_homestay']); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>

                        <!-- Rating Bintang Interaktif JS -->
                        <div class="form-group">
                            <label>Beri Penilaian Bintang</label>
                            <div class="interactive-star-row">
                                <div class="stars-picker" id="interactiveStars">
                                    <i class="fa-solid fa-star star-item active" data-val="1"></i>
                                    <i class="fa-solid fa-star star-item active" data-val="2"></i>
                                    <i class="fa-solid fa-star star-item active" data-val="3"></i>
                                    <i class="fa-solid fa-star star-item active" data-val="4"></i>
                                    <i class="fa-solid fa-star star-item active" data-val="5"></i>
                                </div>
                                <span class="rating-feedback-label" id="starRatingFeedback">5.0 - Sangat Memuaskan</span>
                                <input type="hidden" name="rating_bintang" id="ratingInputVal" value="5">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="namaPengulas">Nama Lengkap Anda</label>
                            <input type="text" name="nama_pengulas" id="namaPengulas" class="form-control" placeholder="Contoh: Budi Santoso" required>
                        </div>

                        <div class="form-group">
                            <label for="komentarUlasan">Pengalaman Anda</label>
                            <textarea name="komentar" id="komentarUlasan" rows="4" class="form-control" placeholder="Ceritakan kenyamanan kamar, keramahan tuan rumah, atau keindahan tempat wisata..." required></textarea>
                        </div>

                        <button type="submit" class="btn btn-teal-solid btn-block mt-20">
                            <i class="fa-regular fa-paper-plane"></i> Kirimkan Ulasan Publik
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- MODAL RESERVASI BOOKING DENGAN KALKULASI MALAM OTOMATIS -->
<div class="custom-modal-overlay" id="bookingModalOverlay">
    <div class="custom-modal-box booking-modal-box">
        <div class="modal-header-with-close">
            <div>
                <span class="badge-pill-sub">Formulir Reservasi Tamu</span>
                <h3 class="modal-title" id="bookingModalHomestayTitle">Homestay Keraton Asri</h3>
            </div>
            <button type="button" class="btn-close-modal" id="closeBookingModal">&times;</button>
        </div>

        <form action="<?= BASEURL; ?>/homestay/booking" method="POST" id="bookingFormActual">
            <input type="hidden" name="homestay_id" id="bookHomestayId" value="1">

            <div class="form-grid-2">
                <div class="form-group">
                    <label for="bookNamaTamu">Nama Lengkap Tamu</label>
                    <input type="text" name="nama_tamu" id="bookNamaTamu" class="form-control" placeholder="Contoh: Budi Santoso" required>
                </div>

                <div class="form-group">
                    <label for="bookAsalKota">Asal Kota / Domisili</label>
                    <input type="text" name="asal_kota" id="bookAsalKota" class="form-control" placeholder="Contoh: DKI Jakarta" required>
                </div>
            </div>

            <div class="form-group">
                <label for="bookKontak">Nomor Kontak WhatsApp / HP</label>
                <input type="tel" name="kontak" id="bookKontak" class="form-control" placeholder="Contoh: 0812-9988-1209" required>
            </div>

            <div class="form-grid-2">
                <div class="form-group">
                    <label for="bookCheckIn">Tanggal Check-In</label>
                    <input type="date" name="tgl_checkin" id="bookCheckIn" class="form-control" value="<?= date('Y-m-d'); ?>" min="<?= date('Y-m-d'); ?>" required>
                </div>

                <div class="form-group">
                    <label for="bookCheckOut">Tanggal Check-Out</label>
                    <input type="date" name="tgl_checkout" id="bookCheckOut" class="form-control" value="<?= date('Y-m-d', strtotime('+2 days')); ?>" min="<?= date('Y-m-d', strtotime('+1 day')); ?>" required>
                </div>
            </div>

            <div class="form-group">
                <label for="bookJumlahTamu">Jumlah Tamu</label>
                <select name="jumlah_tamu" id="bookJumlahTamu" class="form-control">
                    <option value="1">1 Orang</option>
                    <option value="2" selected>2 Orang</option>
                    <option value="3">3 Orang</option>
                    <option value="4">4 Orang</option>
                    <option value="5">5+ Orang (Keluarga)</option>
                </select>
            </div>

            <!-- Kalkulasi Otomatis Durasi & Biaya -->
            <div class="booking-calc-summary-card">
                <div class="calc-row">
                    <span>Tarif per Malam:</span>
                    <strong id="summaryRatePerNight">Rp 250.000</strong>
                </div>
                <div class="calc-row">
                    <span>Durasi Menginap:</span>
                    <strong id="summaryTotalNights">2 Malam</strong>
                </div>
                <div class="calc-row text-success">
                    <span>Biaya Layanan & Pajak:</span>
                    <strong>Gratis</strong>
                </div>
                <hr>
                <div class="calc-row total-calc-row">
                    <span>Total Pembayaran:</span>
                    <strong class="text-teal" id="summaryTotalCost">Rp 500.000</strong>
                </div>
            </div>

            <div class="modal-actions mt-20">
                <button type="button" class="btn btn-secondary" id="cancelBookingBtn">Batal</button>
                <button type="submit" class="btn btn-teal-solid">
                    <i class="fa-solid fa-circle-check"></i> Konfirmasi Booking Kamar
                </button>
            </div>
        </form>
    </div>
</div>
