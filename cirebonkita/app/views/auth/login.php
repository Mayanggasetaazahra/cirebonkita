<?php
/**
 * ====================================================================
 * VIEW: LOGIN ADMINISTRATOR (login.php)
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
    <title><?= htmlspecialchars($judul); ?></title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= BASEURL; ?>/assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="auth-body">

<div class="auth-card-wrapper">
    <div class="auth-card">
        <div class="auth-header">
            <div style="display: flex; justify-content: center; margin-bottom: 12px;">
                <img src="<?= BASEURL; ?>/assets/cirebon-emblem.png" alt="CirebonKita" style="height: 52px; width: auto; object-fit: contain;">
            </div>
            <h2>CirebonKita</h2>
            <p>Jelajah Budaya, Cirebon Kita</p>
        </div>

        <?php if (!empty($error)): ?>
            <div class="alert alert-danger" style="margin-bottom: 20px;">
                <i class="fa-solid fa-circle-exclamation"></i>
                <?= htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>

        <?php Auth::flash(); ?>

        <form action="<?= BASEURL; ?>/auth/login" method="POST" class="auth-form">
            <div class="form-group">
                <label for="username">Username Administrator</label>
                <div class="input-icon-box">
                    <i class="fa-solid fa-user"></i>
                    <input type="text" id="username" name="username" placeholder="Masukkan username" required autofocus>
                </div>
            </div>

            <div class="form-group">
                <label for="password">Kata Sandi</label>
                <div class="input-icon-box">
                    <i class="fa-solid fa-lock"></i>
                    <input type="password" id="password" name="password" placeholder="Masukkan kata sandi" required>
                </div>
            </div>

            <div class="form-extra-row">
                <label class="checkbox-label">
                    <input type="checkbox" name="remember"> Ingat Saya
                </label>
                <a href="#" class="forgot-link">Lupa Password?</a>
            </div>

            <button type="submit" class="btn btn-teal-solid btn-block">
                <i class="fa-solid fa-arrow-right-to-bracket"></i> Masuk ke Panel Admin
            </button>
        </form>

        <div class="auth-footer-notice">
            <a href="<?= BASEURL; ?>/" class="back-home-link"><i class="fa-solid fa-arrow-left"></i> Kembali ke Beranda Publik</a>
        </div>
    </div>
</div>

</body>
</html>
