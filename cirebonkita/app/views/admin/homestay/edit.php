<?php
/**
 * View: Admin Edit Homestay Desa
 * Divisi: Homestay & Akomodasi
 * Arsitektur Pure Native PHP MVC - CirebonKita
 */
$homestay = $data['homestay'] ?? [];
$pesanError = $data['error'] ?? '';
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Data Homestay - CirebonKita Admin</title>
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body class="bg-light text-navy">
    <div class="admin-wrapper d-flex">
        <aside class="admin-sidebar p-4 bg-navy text-white">
            <h2 class="font-bold text-lg mb-4 text-emerald">CirebonKita Admin</h2>
            <ul class="admin-nav list-unstyled space-y-2">
                <li><a href="/admin/dashboard" class="nav-link text-white">📊 Dashboard</a></li>
                <li><a href="/admin/wisata" class="nav-link text-white">🏛️ Wisata & Tiket</a></li>
                <li><a href="/admin/umkm" class="nav-link text-white">🛍️ Produk UMKM</a></li>
                <li><a href="/admin/homestay" class="nav-link text-emerald font-bold">🏡 Homestay & Ulasan</a></li>
            </ul>
        </aside>

        <main class="admin-content flex-grow-1 p-5">
            <div class="d-flex justify-between items-center mb-4">
                <div>
                    <span class="badge bg-amber text-dark">Divisi Homestay & Akomodasi</span>
                    <h1 class="text-2xl font-bold mt-1">Edit Mitra Homestay Desa</h1>
                </div>
                <a href="/admin/homestay" class="btn btn-outline">← Kembali ke Daftar</a>
            </div>

            <?php if (!empty($pesanError)): ?>
                <div class="alert alert-danger mb-4 p-3 rounded">
                    <?= htmlspecialchars($pesanError, ENT_QUOTES, 'UTF-8'); ?>
                </div>
            <?php endif; ?>

            <div class="card p-4 shadow-sm bg-white rounded-xl">
                <form action="/admin/homestay/edit/<?= (int)($homestay['id'] ?? 0); ?>" method="POST" enctype="multipart/form-data" class="space-y-4">
                    <div class="form-group">
                        <label class="form-label font-bold">Nama Homestay Desa</label>
                        <input type="text" name="nama_homestay" class="form-control" value="<?= htmlspecialchars($homestay['nama_homestay'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" required>
                    </div>

                    <div class="row d-flex gap-3">
                        <div class="col flex-1">
                            <label class="form-label font-bold">Tipe Kamar / Unit</label>
                            <input type="text" name="tipe_kamar" class="form-control" value="<?= htmlspecialchars($homestay['tipe_kamar'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" required>
                        </div>
                        <div class="col flex-1">
                            <label class="form-label font-bold">Kapasitas Tamu (Orang)</label>
                            <input type="number" name="kapasitas_tamu" min="1" class="form-control" value="<?= (int)($homestay['kapasitas_tamu'] ?? 2); ?>" required>
                        </div>
                        <div class="col flex-1">
                            <label class="form-label font-bold">Harga per Malam (Rp)</label>
                            <input type="number" name="harga_per_malam" min="0" step="5000" class="form-control" value="<?= (float)($homestay['harga_per_malam'] ?? 0); ?>" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label font-bold">Fasilitas Kamar (Pisahkan Koma)</label>
                        <input type="text" name="fasilitas" class="form-control" value="<?= htmlspecialchars($homestay['fasilitas'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label font-bold">Alamat Lengkap</label>
                        <textarea name="lokasi" rows="2" class="form-control" required><?= htmlspecialchars($homestay['lokasi'] ?? '', ENT_QUOTES, 'UTF-8'); ?></textarea>
                    </div>

                    <div class="row d-flex gap-3">
                        <div class="col flex-1">
                            <label class="form-label font-bold">Nama Pemilik / Mitra</label>
                            <input type="text" name="nama_pemilik" class="form-control" value="<?= htmlspecialchars($homestay['nama_pemilik'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" required>
                        </div>
                        <div class="col flex-1">
                            <label class="form-label font-bold">Nomor Kontak / WhatsApp</label>
                            <input type="text" name="kontak_pemilik" class="form-control" value="<?= htmlspecialchars($homestay['kontak_pemilik'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" required>
                        </div>
                        <div class="col flex-1">
                            <label class="form-label font-bold">Status Kamar</label>
                            <select name="status_kamar" class="form-control">
                                <option value="Tersedia" <?= ($homestay['status_kamar'] ?? '') === 'Tersedia' ? 'selected' : ''; ?>>Tersedia</option>
                                <option value="Penuh" <?= ($homestay['status_kamar'] ?? '') === 'Penuh' ? 'selected' : ''; ?>>Penuh / Terisi</option>
                                <option value="Renovasi" <?= ($homestay['status_kamar'] ?? '') === 'Renovasi' ? 'selected' : ''; ?>>Renovasi</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label font-bold">Ganti Foto Homestay (Opsional)</label>
                        <?php if (!empty($homestay['foto'])): ?>
                            <div class="mb-2">
                                <img src="<?= htmlspecialchars($homestay['foto'], ENT_QUOTES, 'UTF-8'); ?>" alt="Foto" style="max-height: 120px; border-radius: 8px;">
                            </div>
                        <?php endif; ?>
                        <input type="file" name="foto" class="form-control" accept="image/jpeg,image/png,image/webp">
                        <small class="text-muted">Maksimal 2MB (JPG, PNG, WEBP). Biarkan kosong jika tidak ingin mengubah foto.</small>
                    </div>

                    <div class="d-flex gap-2 pt-3">
                        <button type="submit" class="btn btn-primary bg-teal text-white px-4 py-2 rounded-lg font-bold">
                            Simpan Perubahan
                        </button>
                        <a href="/admin/homestay" class="btn btn-secondary px-4 py-2 rounded-lg">Batal</a>
                    </div>
                </form>
            </div>
        </main>
    </div>
</body>
</html>
