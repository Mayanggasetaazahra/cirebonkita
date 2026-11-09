<?php
/**
 * View: Admin Moderasi Ulasan & Rating Bintang Homestay
 * Divisi: Homestay & Akomodasi
 * Arsitektur Pure Native PHP MVC - CirebonKita
 */
$ulasanList = $data['ulasan'] ?? [];
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moderasi Ulasan Homestay - CirebonKita Admin</title>
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
                    <h1 class="text-2xl font-bold mt-1">Moderasi Ulasan & Rating Bintang Wisatawan</h1>
                    <p class="text-muted text-sm">Validasi ulasan publik sebelum ditampilkan pada halaman detail homestay.</p>
                </div>
                <div class="d-flex gap-2">
                    <a href="/admin/homestay" class="btn btn-outline">← Kembali ke Homestay</a>
                </div>
            </div>

            <div class="card p-4 shadow-sm bg-white rounded-xl">
                <table class="table w-full text-sm">
                    <thead>
                        <tr class="border-b text-left text-muted">
                            <th class="py-2">No</th>
                            <th>Homestay</th>
                            <th>Pengulas</th>
                            <th>Rating</th>
                            <th>Komentar</th>
                            <th>Tanggal</th>
                            <th>Status Moderasi</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($ulasanList)): ?>
                            <tr>
                                <td colspan="8" class="text-center py-4 text-muted">Belum ada ulasan yang perlu dimoderasi.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($ulasanList as $idx => $u): ?>
                                <tr class="border-b">
                                    <td class="py-3"><?= $idx + 1; ?></td>
                                    <td class="font-bold"><?= htmlspecialchars($u['nama_homestay'] ?? '-', ENT_QUOTES, 'UTF-8'); ?></td>
                                    <td><?= htmlspecialchars($u['nama_pengulas'], ENT_QUOTES, 'UTF-8'); ?></td>
                                    <td>
                                        <span class="badge bg-warning text-dark font-bold">
                                            ⭐ <?= (int)$u['rating_bintang']; ?>/5
                                        </span>
                                    </td>
                                    <td class="max-w-xs text-xs text-muted"><?= htmlspecialchars($u['komentar'], ENT_QUOTES, 'UTF-8'); ?></td>
                                    <td class="text-xs"><?= htmlspecialchars($u['created_at'], ENT_QUOTES, 'UTF-8'); ?></td>
                                    <td>
                                        <?php if ($u['status_moderasi'] === 'Disetujui'): ?>
                                            <span class="badge bg-success text-white">Disetujui</span>
                                        <?php elseif ($u['status_moderasi'] === 'Ditolak'): ?>
                                            <span class="badge bg-danger text-white">Ditolak</span>
                                        <?php else: ?>
                                            <span class="badge bg-secondary text-white">Menunggu</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <div class="d-flex gap-1">
                                            <form action="/admin/homestay/moderasireview/<?= (int)$u['id']; ?>" method="POST" style="display:inline;">
                                                <input type="hidden" name="status" value="Disetujui">
                                                <button type="submit" class="btn btn-sm btn-success text-white" title="Setujui">✓</button>
                                            </form>
                                            <form action="/admin/homestay/moderasireview/<?= (int)$u['id']; ?>" method="POST" style="display:inline;">
                                                <input type="hidden" name="status" value="Ditolak">
                                                <button type="submit" class="btn btn-sm btn-danger text-white" title="Tolak">✕</button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </main>
    </div>
</body>
</html>
