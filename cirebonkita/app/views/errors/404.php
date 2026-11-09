<?php
/**
 * ====================================================================
 * VIEW: ERROR 404 NOT FOUND (404.php)
 * ====================================================================
 * Proyek  : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Kelompok: 5 (Smart Tourism Sektor Pariwisata Daerah)
 * ====================================================================
 */
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 Halaman Tidak Ditemukan - CirebonKita</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= BASEURL; ?>/assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="auth-body">

<div class="auth-card-wrapper">
    <div class="auth-card text-center" style="max-width: 500px;">
        <div style="font-size: 72px; color: #004C6D; margin-bottom: 10px;">
            <i class="fa-solid fa-map-location-dot"></i>
        </div>
        <h1 style="font-size: 32px; font-weight: 800; color: #002B36; margin-bottom: 10px;">404 - Tersesat?</h1>
        <p style="color: #6c757d; font-size: 15px; margin-bottom: 25px;">
            Halaman atau data destinasi yang Anda cari tidak ditemukan atau telah dipindahkan dalam portal CirebonKita.
        </p>
        <a href="<?= BASEURL; ?>/" class="btn btn-teal-solid">
            <i class="fa-solid fa-house"></i> Kembali ke Beranda Utama
        </a>
    </div>
</div>

</body>
</html>
