import JSZip from 'jszip';
import { UmkmItem, WisataItem, HomestayItem } from '../types';

/**
 * Escapes text for XML inline string
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Converts 0-indexed column number to Excel column letters (0 -> A, 27 -> AB)
 */
function getColumnLetter(colIndex: number): string {
  let letter = '';
  let temp = colIndex;
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

/**
 * Triggers a client-side file download for a Blob
 */
function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Generates and downloads a CSV report with UTF-8 BOM
 */
export function downloadCsvReport(
  filename: string,
  title: string,
  headers: string[],
  rows: (string | number)[][],
  summaryInfo?: [string, string | number][]
) {
  const lines: string[] = [];

  // Title & Metadata
  lines.push(`"${title.replace(/"/g, '""')}"`);
  lines.push(`"Tanggal Unduh: ${new Date().toLocaleString('id-ID')}"`);
  lines.push(`"Portal: CirebonKita - Portal Desa Wisata Mandiri Cirebon"`);
  lines.push(`"Alamat: Jl. Perjuangan No.10B, Karyamulya, Kec. Kesambi, Kota Cirebon, Jawa Barat"`);
  lines.push(`"Kontak: 083155853722 | 081949684163 | 085717412815"`);

  if (summaryInfo && summaryInfo.length > 0) {
    lines.push('');
    summaryInfo.forEach(([k, v]) => {
      lines.push(`"${k}","${String(v).replace(/"/g, '""')}"`);
    });
  }

  lines.push(''); // Empty line before table
  
  // Headers
  lines.push(headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(','));

  // Rows
  rows.forEach(row => {
    const formatted = row.map(val => {
      if (typeof val === 'number') return val.toString();
      return `"${String(val ?? '').replace(/"/g, '""')}"`;
    });
    lines.push(formatted.join(','));
  });

  // UTF-8 BOM \uFEFF ensures Excel automatically recognizes Indonesian characters and separators
  const csvContent = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
}

/**
 * Generates and downloads an authentic OpenXML .xlsx spreadsheet using JSZip
 */
export async function downloadXlsxReport(
  filename: string,
  sheetTitle: string,
  headers: string[],
  rows: (string | number)[][],
  summaryInfo?: [string, string | number][]
) {
  const zip = new JSZip();

  // 1. [Content_Types].xml
  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`
  );

  // 2. _rels/.rels
  zip.folder('_rels')?.file(
    '.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`
  );

  // 3. xl/_rels/workbook.xml.rels
  zip.folder('xl')?.folder('_rels')?.file(
    'workbook.xml.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`
  );

  // 4. xl/workbook.xml
  const safeSheetName = sheetTitle.slice(0, 30).replace(/[:\\/?*[\]]/g, ' ');
  zip.folder('xl')?.file(
    'workbook.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="${escapeXml(safeSheetName)}" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`
  );

  // 5. xl/styles.xml
  zip.folder('xl')?.file(
    'styles.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="3">
    <font><name val="Arial"/><sz val="10"/></font>
    <font><b/><name val="Arial"/><sz val="11"/><color rgb="FFFFFFFF"/></font>
    <font><b/><name val="Arial"/><sz val="13"/><color rgb="FF014B35"/></font>
  </fonts>
  <fills count="3">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF014B35"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/></border>
    <border>
      <left style="thin"><color rgb="FFD1D5DB"/></left>
      <right style="thin"><color rgb="FFD1D5DB"/></right>
      <top style="thin"><color rgb="FFD1D5DB"/></top>
      <bottom style="thin"><color rgb="FFD1D5DB"/></bottom>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="3">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>
    <xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>
  </cellXfs>
</styleSheet>`
  );

  // 6. Build xl/worksheets/sheet1.xml
  let rowIndex = 1;
  const rowsXml: string[] = [];

  // Title Row
  rowsXml.push(
    `<row r="${rowIndex}">` +
      `<c r="A${rowIndex}" t="inlineStr" s="2"><is><t>${escapeXml(sheetTitle)}</t></is></c>` +
    `</row>`
  );
  rowIndex++;

  // Metadata Subtitle
  const dateStr = `Diunduh pada: ${new Date().toLocaleString('id-ID')} | Portal CirebonKita | Jl. Perjuangan No.10B, Kesambi, Cirebon`;
  rowsXml.push(
    `<row r="${rowIndex}">` +
      `<c r="A${rowIndex}" t="inlineStr"><is><t>${escapeXml(dateStr)}</t></is></c>` +
    `</row>`
  );
  rowIndex++;

  const phoneStr = `Kontak Pengelola: 083155853722 | 081949684163 | 085717412815`;
  rowsXml.push(
    `<row r="${rowIndex}">` +
      `<c r="A${rowIndex}" t="inlineStr"><is><t>${escapeXml(phoneStr)}</t></is></c>` +
    `</row>`
  );
  rowIndex++;

  if (summaryInfo && summaryInfo.length > 0) {
    rowIndex++;
    summaryInfo.forEach(([k, v]) => {
      rowsXml.push(
        `<row r="${rowIndex}">` +
          `<c r="A${rowIndex}" t="inlineStr"><is><t>${escapeXml(k)}</t></is></c>` +
          `<c r="B${rowIndex}" t="inlineStr"><is><t>${escapeXml(String(v))}</t></is></c>` +
        `</row>`
      );
      rowIndex++;
    });
  }

  // Blank row before table
  rowIndex++;

  // Table Header Row (style 1 = dark green fill with white bold text)
  const headerCells = headers.map((h, i) => {
    const col = getColumnLetter(i);
    return `<c r="${col}${rowIndex}" t="inlineStr" s="1"><is><t>${escapeXml(h)}</t></is></c>`;
  });
  rowsXml.push(`<row r="${rowIndex}">${headerCells.join('')}</row>`);
  rowIndex++;

  // Table Data Rows
  rows.forEach(row => {
    const cells = row.map((val, i) => {
      const col = getColumnLetter(i);
      if (typeof val === 'number') {
        return `<c r="${col}${rowIndex}" s="0"><v>${val}</v></c>`;
      }
      return `<c r="${col}${rowIndex}" t="inlineStr" s="0"><is><t>${escapeXml(String(val ?? ''))}</t></is></c>`;
    });
    rowsXml.push(`<row r="${rowIndex}">${cells.join('')}</row>`);
    rowIndex++;
  });

  const sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>
    ${rowsXml.join('\n    ')}
  </sheetData>
</worksheet>`;

  zip.folder('xl')?.folder('worksheets')?.file('sheet1.xml', sheetXml);

  const content = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  triggerDownload(content, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

/**
 * Report helper for UMKM Products
 */
export async function exportUmkmReport(items: UmkmItem[], format: 'xlsx' | 'csv') {
  const filename = `Laporan_Produk_UMKM_CirebonKita_${new Date().toISOString().slice(0, 10)}`;
  const title = 'Laporan Katalog Produk UMKM Desa Wisata Cirebon';
  const headers = [
    'No',
    'Kode SKU',
    'Nama Produk',
    'Kategori',
    'Harga (Rp)',
    'Stok',
    'Status Stok',
    'Terjual (Pcs)',
    'Rating',
    'Mitra Pengrajin',
    'Desa Asal',
    'Deskripsi'
  ];

  const rows = items.map((item, idx) => [
    idx + 1,
    item.kode_sku,
    item.nama_produk,
    item.kategori,
    item.harga,
    item.stok,
    item.status_stok,
    item.terjual,
    item.rating,
    item.mitra_pengrajin,
    item.desa_asal,
    item.deskripsi
  ]);

  const totalNilaiStok = items.reduce((acc, i) => acc + i.harga * i.stok, 0);
  const totalTerjual = items.reduce((acc, i) => acc + i.terjual, 0);

  const summary: [string, string | number][] = [
    ['Total Variasi Produk', `${items.length} Produk`],
    ['Total Akumulasi Terjual', `${totalTerjual} Unit`],
    ['Estimasi Nilai Inventaris Stok', `Rp ${totalNilaiStok.toLocaleString('id-ID')}`]
  ];

  if (format === 'csv') {
    downloadCsvReport(filename, title, headers, rows, summary);
  } else {
    await downloadXlsxReport(filename, 'Katalog UMKM', headers, rows, summary);
  }
}

/**
 * Report helper for Wisata / Tourism Attractions
 */
export async function exportWisataReport(items: WisataItem[], format: 'xlsx' | 'csv') {
  const filename = `Laporan_Destinasi_Wisata_CirebonKita_${new Date().toISOString().slice(0, 10)}`;
  const title = 'Laporan Daya Tarik Wisata & Tiket CirebonKita';
  const headers = [
    'No',
    'Nama Destinasi',
    'Kategori Wisata',
    'Harga Tiket (Rp)',
    'Kuota Harian (Orang)',
    'Kuota Terisi',
    'Status Operasional',
    'Lokasi',
    'Jam Buka',
    'Fasilitas',
    'Rating',
    'Total Ulasan'
  ];

  const rows = items.map((w, idx) => [
    idx + 1,
    w.nama_wisata,
    w.kategori,
    w.harga_tiket,
    w.kuota_harian,
    w.kuota_terisi,
    w.status_operasional,
    w.lokasi,
    w.jam_buka,
    w.fasilitas,
    w.rating,
    w.ulasan_count
  ]);

  const totalKuota = items.reduce((acc, w) => acc + w.kuota_harian, 0);
  const totalTerisi = items.reduce((acc, w) => acc + w.kuota_terisi, 0);

  const summary: [string, string | number][] = [
    ['Total Destinasi Terdaftar', `${items.length} Lokasi`],
    ['Total Kapasitas Harian', `${totalKuota} Wisatawan/hari`],
    ['Kunjungan Terisi Hari Ini', `${totalTerisi} Tiket`]
  ];

  if (format === 'csv') {
    downloadCsvReport(filename, title, headers, rows, summary);
  } else {
    await downloadXlsxReport(filename, 'Destinasi Wisata', headers, rows, summary);
  }
}

/**
 * Report helper for Homestay & Accommodations
 */
export async function exportHomestayReport(items: HomestayItem[], format: 'xlsx' | 'csv') {
  const filename = `Laporan_Homestay_Penginapan_CirebonKita_${new Date().toISOString().slice(0, 10)}`;
  const title = 'Laporan Mitra Homestay & Penginapan Warga CirebonKita';
  const headers = [
    'No',
    'Nama Homestay / Penginapan',
    'Kategori Akomodasi',
    'Tipe Kamar',
    'Harga per Malam (Rp)',
    'Kapasitas Tamu (Orang)',
    'Alamat / Lokasi',
    'Rating Rata-rata',
    'Total Ulasan',
    'Status Kamar',
    'Nama Pemilik',
    'Kontak Pemilik',
    'Fasilitas Unggulan'
  ];

  const rows = items.map((h, idx) => [
    idx + 1,
    h.nama_homestay,
    h.kategori || 'Homestay',
    h.tipe_kamar,
    h.harga_per_malam,
    h.kapasitas_tamu,
    h.alamat_lengkap || h.lokasi,
    h.avg_rating,
    h.total_ulasan,
    h.status_kamar,
    h.nama_pemilik,
    h.kontak_pemilik,
    h.fasilitas
  ]);

  const totalTersedia = items.filter(h => h.status_kamar === 'Tersedia').length;

  const summary: [string, string | number][] = [
    ['Total Properti Mitra', `${items.length} Properti`],
    ['Properti Siap Dipesan', `${totalTersedia} dari ${items.length} Penginapan`]
  ];

  if (format === 'csv') {
    downloadCsvReport(filename, title, headers, rows, summary);
  } else {
    await downloadXlsxReport(filename, 'Homestay Cirebon', headers, rows, summary);
  }
}
