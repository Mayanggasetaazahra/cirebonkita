import JSZip from 'jszip';
import { phpProjectFiles } from '../data/phpCodeFiles';

export async function downloadPhpProjectZip() {
  const zip = new JSZip();
  const rootFolder = zip.folder('cirebonkita');

  if (!rootFolder) return;

  // Add all files
  phpProjectFiles.forEach(file => {
    if (file.path === 'database.sql' || file.path === 'README.md') {
      zip.file(file.path, file.code);
    } else {
      rootFolder.file(file.path, file.code);
    }
  });

  // Generate binary
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cirebonkita_kelompok5_${new Date().toISOString().slice(0, 10)}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const exportCirebonKitaZip = downloadPhpProjectZip;
