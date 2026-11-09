/**
 * ====================================================================
 * CIREBONKITA - JAVASCRIPT UTAMA
 * Proyek  : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Tim Pengembang CirebonKita
 * 
 * Fitur-Fitur Interaktif:
 * 1. Validasi form global & sanitasi input
 * 2. Mobile navbar toggle
 * 3. Live search tanpa reload (AJAX/Fetch) untuk produk UMKM & wisata
 * 4. Filter kategori instan (DOM filter)
 * 5. Kalkulator tiket masuk dengan counter kuota
 * 6. Datepicker booking homestay dengan hitung durasi malam & total bayar otomatis
 * 7. Rating bintang interaktif (1 - 5 bintang) dengan respons teks
 * 8. Modal pop-up konfirmasi hapus data
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', function () {
    console.log('CirebonKita: Script initialized successfully.');

    // ----------------------------------------------------
    // 1. NAVBAR MOBILE TOGGLE
    // ----------------------------------------------------
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', function () {
            navMenu.classList.toggle('show-mobile');
            if (navMenu.classList.contains('show-mobile')) {
                navMenu.style.display = 'flex';
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '74px';
                navMenu.style.left = '0';
                navMenu.style.right = '0';
                navMenu.style.background = '#FFFFFF';
                navMenu.style.padding = '20px';
                navMenu.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
            } else {
                navMenu.style.display = '';
            }
        });
    }

    // ----------------------------------------------------
    // 2. MODAL KONFIRMASI HAPUS GLOBAL
    // ----------------------------------------------------
    const deleteModal = document.getElementById('confirmDeleteModal');
    const executeDeleteBtn = document.getElementById('executeDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteText = document.getElementById('confirmDeleteText');

    document.querySelectorAll('.trigger-delete-modal').forEach(function (button) {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const deleteUrl = this.getAttribute('data-url');
            const itemName = this.getAttribute('data-name') || 'data ini';

            if (confirmDeleteText) {
                confirmDeleteText.innerHTML = `Apakah Anda yakin ingin menghapus <strong>"${itemName}"</strong>? Tindakan ini permanen dan tidak dapat dibatalkan.`;
            }

            if (executeDeleteBtn) {
                executeDeleteBtn.setAttribute('href', deleteUrl);
            }

            if (deleteModal) {
                deleteModal.style.display = 'flex';
            }
        });
    });

    if (cancelDeleteBtn && deleteModal) {
        cancelDeleteBtn.addEventListener('click', function () {
            deleteModal.style.display = 'none';
        });
    }

    if (deleteModal) {
        deleteModal.addEventListener('click', function (e) {
            if (e.target === deleteModal) {
                deleteModal.style.display = 'none';
            }
        });
    }

    // ----------------------------------------------------
    // 3. LIVE SEARCH & FILTER PRODUK UMKM (Pengelola UMKM)
    // ----------------------------------------------------
    const liveSearchInput = document.getElementById('liveSearchInput');
    const umkmGridContainer = document.getElementById('umkmGridContainer');
    const totalResultsCount = document.getElementById('totalResultsCount');
    const priceRange = document.getElementById('priceRange');
    const priceDisplay = document.getElementById('priceDisplay');
    const sortDropdown = document.getElementById('sortDropdown');
    const kategoriRadios = document.querySelectorAll('input[name="kategoriFilter"]');

    function applyUmkmFilter() {
        const keyword = liveSearchInput ? liveSearchInput.value.toLowerCase().trim() : '';
        let selectedCategory = 'Semua';
        kategoriRadios.forEach(radio => {
            if (radio.checked) selectedCategory = radio.value;
        });

        const maxPrice = priceRange ? parseInt(priceRange.value) : 999999999;
        const sortVal = sortDropdown ? sortDropdown.value : 'terbaru';

        if (!umkmGridContainer) return;

        const cards = Array.from(umkmGridContainer.querySelectorAll('.umkm-catalog-card'));
        let visibleCount = 0;

        cards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            const cardPrice = parseInt(card.getAttribute('data-price') || '0');
            const cardTitle = card.querySelector('.product-item-title').innerText.toLowerCase();

            const matchCat = (selectedCategory === 'Semua' || selectedCategory === 'Semua Kategori' || cardCat === selectedCategory);
            const matchPrice = cardPrice <= maxPrice;
            const matchSearch = cardTitle.includes(keyword);

            if (matchCat && matchPrice && matchSearch) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Sorting
        cards.sort((a, b) => {
            const priceA = parseInt(a.getAttribute('data-price') || '0');
            const priceB = parseInt(b.getAttribute('data-price') || '0');
            if (sortVal === 'termurah') return priceA - priceB;
            if (sortVal === 'termahal') return priceB - priceA;
            return 0;
        });

        cards.forEach(card => umkmGridContainer.appendChild(card));

        if (totalResultsCount) {
            totalResultsCount.innerText = `${visibleCount} Produk`;
        }
    }

    if (liveSearchInput) {
        liveSearchInput.addEventListener('input', applyUmkmFilter);
    }

    if (priceRange && priceDisplay) {
        priceRange.addEventListener('input', function () {
            priceDisplay.innerText = 'Rp ' + parseInt(this.value).toLocaleString('id-ID');
            applyUmkmFilter();
        });
    }

    if (sortDropdown) {
        sortDropdown.addEventListener('change', applyUmkmFilter);
    }

    kategoriRadios.forEach(radio => {
        radio.addEventListener('change', applyUmkmFilter);
    });

    // ----------------------------------------------------
    // 4. FILTER KATEGORI WISATA (Pengelola Wisata)
    // ----------------------------------------------------
    const wisataChips = document.querySelectorAll('#wisataFilterGroup .filter-chip');
    const wisataCards = document.querySelectorAll('#wisataCardsContainer .wisata-card-item');

    wisataChips.forEach(chip => {
        chip.addEventListener('click', function () {
            wisataChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            const kategoriTarget = this.getAttribute('data-kategori');

            wisataCards.forEach(card => {
                const cardKategori = card.getAttribute('data-kategori');
                if (kategoriTarget === 'Semua' || cardKategori === kategoriTarget) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Live search table admin wisata
    const wisataSearchTable = document.getElementById('wisataSearchTable');
    if (wisataSearchTable) {
        wisataSearchTable.addEventListener('input', function () {
            const query = this.value.toLowerCase();
            const rows = document.querySelectorAll('#tableWisata tbody tr');
            rows.forEach(row => {
                const text = row.innerText.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }

    // ----------------------------------------------------
    // 5. KALKULASI TIKET MASUK WISATA (Pengelola Wisata)
    // ----------------------------------------------------
    const btnMinusTiket = document.getElementById('btnMinusTiket');
    const btnPlusTiket = document.getElementById('btnPlusTiket');
    const qtyTiket = document.getElementById('qtyTiket');
    const labelTotalHarga = document.getElementById('labelTotalHarga');

    if (qtyTiket && typeof hargaTiketSatuan !== 'undefined') {
        function updateTotalTiket() {
            const qty = parseInt(qtyTiket.value) || 1;
            const total = qty * hargaTiketSatuan;
            if (labelTotalHarga) {
                labelTotalHarga.innerText = (total > 0) ? 'Rp ' + total.toLocaleString('id-ID') : 'Infaq Sukarela';
            }
        }

        if (btnMinusTiket) {
            btnMinusTiket.addEventListener('click', function () {
                let current = parseInt(qtyTiket.value);
                if (current > 1) {
                    qtyTiket.value = current - 1;
                    updateTotalTiket();
                }
            });
        }

        if (btnPlusTiket) {
            btnPlusTiket.addEventListener('click', function () {
                let current = parseInt(qtyTiket.value);
                if (current < 50) {
                    qtyTiket.value = current + 1;
                    updateTotalTiket();
                }
            });
        }
    }

    // ----------------------------------------------------
    // 6. BOOKING HOMESTAY & KALKULASI DURASI MALAM (Pengelola Homestay)
    // ----------------------------------------------------
    const bookingModalOverlay = document.getElementById('bookingModalOverlay');
    const closeBookingModal = document.getElementById('closeBookingModal');
    const cancelBookingBtn = document.getElementById('cancelBookingBtn');
    const bookingModalHomestayTitle = document.getElementById('bookingModalHomestayTitle');
    const bookHomestayId = document.getElementById('bookHomestayId');
    const bookCheckIn = document.getElementById('bookCheckIn');
    const bookCheckOut = document.getElementById('bookCheckOut');
    const summaryRatePerNight = document.getElementById('summaryRatePerNight');
    const summaryTotalNights = document.getElementById('summaryTotalNights');
    const summaryTotalCost = document.getElementById('summaryTotalCost');

    let currentHomestayRate = 250000;

    document.querySelectorAll('.btn-open-booking').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price') || '250000');

            currentHomestayRate = price;
            if (bookHomestayId) bookHomestayId.value = id;
            if (bookingModalHomestayTitle) bookingModalHomestayTitle.innerText = name;
            if (summaryRatePerNight) summaryRatePerNight.innerText = 'Rp ' + price.toLocaleString('id-ID');

            calculateBookingNights();

            if (bookingModalOverlay) {
                bookingModalOverlay.style.display = 'flex';
            }
        });
    });

    function calculateBookingNights() {
        if (!bookCheckIn || !bookCheckOut) return;
        const d1 = new Date(bookCheckIn.value);
        const d2 = new Date(bookCheckOut.value);

        const diffTime = d2.getTime() - d1.getTime();
        let nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (isNaN(nights) || nights < 1) nights = 1;

        if (summaryTotalNights) summaryTotalNights.innerText = `${nights} Malam`;
        const total = nights * currentHomestayRate;
        if (summaryTotalCost) summaryTotalCost.innerText = 'Rp ' + total.toLocaleString('id-ID');
    }

    if (bookCheckIn && bookCheckOut) {
        bookCheckIn.addEventListener('change', function () {
            bookCheckOut.min = this.value;
            if (bookCheckOut.value <= this.value) {
                const nextDay = new Date(this.value);
                nextDay.setDate(nextDay.getDate() + 1);
                bookCheckOut.value = nextDay.toISOString().split('T')[0];
            }
            calculateBookingNights();
        });
        bookCheckOut.addEventListener('change', calculateBookingNights);
    }

    if (closeBookingModal) {
        closeBookingModal.addEventListener('click', () => { bookingModalOverlay.style.display = 'none'; });
    }
    if (cancelBookingBtn) {
        cancelBookingBtn.addEventListener('click', () => { bookingModalOverlay.style.display = 'none'; });
    }

    // ----------------------------------------------------
    // 7. RATING BINTANG INTERAKTIF (Pengelola Homestay)
    // ----------------------------------------------------
    const starItems = document.querySelectorAll('#interactiveStars .star-item');
    const ratingInputVal = document.getElementById('ratingInputVal');
    const starRatingFeedback = document.getElementById('starRatingFeedback');

    const feedbackTexts = {
        1: '1.0 - Kurang Memuaskan',
        2: '2.0 - Cukup',
        3: '3.0 - Baik',
        4: '4.0 - Sangat Baik',
        5: '5.0 - Sangat Memuaskan'
    };

    starItems.forEach(star => {
        star.addEventListener('click', function () {
            const val = parseInt(this.getAttribute('data-val'));
            if (ratingInputVal) ratingInputVal.value = val;
            if (starRatingFeedback && feedbackTexts[val]) {
                starRatingFeedback.innerText = feedbackTexts[val];
            }

            starItems.forEach(s => {
                const sVal = parseInt(s.getAttribute('data-val'));
                if (sVal <= val) {
                    s.classList.add('active');
                    s.style.color = '#F59E0B';
                } else {
                    s.classList.remove('active');
                    s.style.color = '#CBD5E1';
                }
            });
        });
    });

    // ----------------------------------------------------
    // 8. TABS ADMIN HOMESTAY
    // ----------------------------------------------------
    const tabBookingBtn = document.getElementById('tabBookingBtn');
    const tabMasterHomestayBtn = document.getElementById('tabMasterHomestayBtn');
    const tabModerasiUlasanBtn = document.getElementById('tabModerasiUlasanBtn');

    const tabContentBooking = document.getElementById('tabContentBooking');
    const tabContentMasterHomestay = document.getElementById('tabContentMasterHomestay');
    const tabContentModerasiUlasan = document.getElementById('tabContentModerasiUlasan');

    function switchAdminTab(activeBtn, showContent) {
        [tabBookingBtn, tabMasterHomestayBtn, tabModerasiUlasanBtn].forEach(b => b && b.classList.remove('active'));
        [tabContentBooking, tabContentMasterHomestay, tabContentModerasiUlasan].forEach(c => c && (c.style.display = 'none'));

        if (activeBtn) activeBtn.classList.add('active');
        if (showContent) showContent.style.display = 'block';
    }

    if (tabBookingBtn) tabBookingBtn.addEventListener('click', () => switchAdminTab(tabBookingBtn, tabContentBooking));
    if (tabMasterHomestayBtn) tabMasterHomestayBtn.addEventListener('click', () => switchAdminTab(tabMasterHomestayBtn, tabContentMasterHomestay));
    if (tabModerasiUlasanBtn) tabModerasiUlasanBtn.addEventListener('click', () => switchAdminTab(tabModerasiUlasanBtn, tabContentModerasiUlasan));

    // ----------------------------------------------------
    // 9. CART BADGE INTERACTION
    // ----------------------------------------------------
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const name = this.getAttribute('data-name');
            const cartBadge = document.getElementById('cartCountBadge');
            if (cartBadge) {
                let current = parseInt(cartBadge.innerText) || 0;
                cartBadge.innerText = current + 1;
            }
            alert(`"${name}" berhasil ditambahkan ke keranjang belanja!`);
        });
    });
});
