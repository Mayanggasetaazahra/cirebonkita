<?php
/**
 * ====================================================================
 * VIEW LAYOUT: FOOTER PUBLIK (footer.php)
 * ====================================================================
 * Proyek  : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Sistem  : Smart Tourism Sektor Pariwisata Daerah Cirebon
 * ====================================================================
 */
?>
    </main>

    <!-- FOOTER KONSISTEN CIREBONKITA -->
    <footer class="site-footer">
        <div class="container footer-content-grid">
            <!-- Kolom 1: Profil CirebonKita -->
            <div class="footer-brand-col">
                <div class="footer-brand-logo">
                    <img src="<?= BASEURL; ?>/assets/cirebon-emblem-white.png" alt="CirebonKita" style="height: 38px; width: auto; object-fit: contain;">
                    <div>
                        <h4 class="footer-logo-title">CirebonKita</h4>
                        <span class="footer-logo-sub">Jelajah Budaya, Cirebon Kita</span>
                    </div>
                </div>
                <p class="footer-desc">
                    Jelajah Budaya, Dukung Lokal. Platform integrasi desa wisata mandiri pesisir Keraton Cirebon menghadirkan pengalaman autentik, kerajinan tangan, dan homestay ramah masyarakat.
                </p>

            </div>

            <!-- Kolom 2: Jelajah Portal -->
            <div class="footer-links-col">
                <h5 class="footer-heading">Jelajah Portal</h5>
                <ul class="footer-links-list">
                    <li><a href="<?= BASEURL; ?>/">Beranda Utama</a></li>
                    <li><a href="<?= BASEURL; ?>/umkm">Katalog UMKM</a></li>
                    <li><a href="<?= BASEURL; ?>/wisata">Destinasi & Tiket</a></li>
                    <li><a href="<?= BASEURL; ?>/homestay">Reservasi Homestay</a></li>
                </ul>
            </div>

            <!-- Kolom 3: Kategori UMKM -->
            <div class="footer-links-col">
                <h5 class="footer-heading">Kategori UMKM</h5>
                <ul class="footer-links-list">
                    <li><a href="<?= BASEURL; ?>/umkm?kategori=Batik+Cirebon">Batik Mega Mendung</a></li>
                    <li><a href="<?= BASEURL; ?>/umkm?kategori=Kuliner+Khas">Kuliner Empal Gentong</a></li>
                    <li><a href="<?= BASEURL; ?>/umkm?kategori=Kerajinan+Tangan">Kerajinan Rotan Sintetis</a></li>
                    <li><a href="<?= BASEURL; ?>/umkm?kategori=Kuliner+Khas">Oleh-oleh Sirup Tjampolay</a></li>
                </ul>
            </div>

            <!-- Kolom 4: Hubungi Kami -->
            <div class="footer-links-col">
                <h5 class="footer-heading">KONTAK</h5>
                <div class="contact-info-item">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>Jl. Perjuangan No.10B, Karyamulya, Kec. Kesambi, Kota Cirebon, Jawa Barat</span>
                </div>
                <div class="contact-info-item">
                    <i class="fa-solid fa-phone"></i>
                    <span>083155853722 | 081949684163 | 085717412815</span>
                </div>
            </div>
        </div>

        <div class="container footer-bottom-bar">
            <p>&copy; 2025 CirebonKita - Desa Wisata Mandiri. Hak Cipta Dilindungi.</p>
            <div class="footer-bottom-links">
                <a href="#">Kebijakan Privasi</a>
                <a href="#">Syarat Layanan</a>
                <a href="#">Peta Situs</a>
            </div>
        </div>
    </footer>

    <!-- Modal Konfirmasi Hapus Global -->
    <div class="custom-modal-overlay" id="confirmDeleteModal">
        <div class="custom-modal-box">
            <div class="modal-icon-warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h3 class="modal-title">Konfirmasi Penghapusan</h3>
            <p class="modal-desc" id="confirmDeleteText">Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.</p>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" id="cancelDeleteBtn">Batal</button>
                <a href="#" class="btn btn-danger" id="executeDeleteBtn">Ya, Hapus</a>
            </div>
        </div>
    </div>

    <!-- JS Utama CirebonKita -->
    <script src="<?= BASEURL; ?>/assets/js/script.js"></script>
</body>
</html>
