import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.galleryImage.deleteMany({});
  await prisma.album.deleteMany({});
  
  console.log('Creating albums...');
  
  // Create albums
  const albums = await Promise.all([
    prisma.album.create({
      data: {
        id: 'album-wisuda',
        title: 'Wisuda 2024',
        description: 'Dokumentasi acara wisuda tahun akademik 2024',
        coverImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
        orderIndex: 1,
        isActive: true,
      },
    }),
    prisma.album.create({
      data: {
        id: 'album-workshop',
        title: 'Workshop SPMI',
        description: 'Kegiatan workshop Sistem Penjaminan Mutu Internal',
        coverImageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
        orderIndex: 2,
        isActive: true,
      },
    }),
    prisma.album.create({
      data: {
        id: 'album-audit',
        title: 'Audit Internal',
        description: 'Kegiatan audit mutu internal tahun 2024',
        coverImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
        orderIndex: 3,
        isActive: true,
      },
    }),
    prisma.album.create({
      data: {
        id: 'album-pelatihan',
        title: 'Pelatihan Auditor',
        description: 'Pelatihan sertifikasi auditor internal',
        coverImageUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800',
        orderIndex: 4,
        isActive: true,
      },
    }),
    prisma.album.create({
      data: {
        id: 'album-seminar',
        title: 'Seminar Nasional',
        description: 'Seminar nasional penjaminan mutu pendidikan tinggi',
        coverImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        orderIndex: 5,
        isActive: true,
      },
    }),
    prisma.album.create({
      data: {
        id: 'album-visitasi',
        title: 'Visitasi BAN-PT',
        description: 'Kunjungan asesor BAN-PT untuk akreditasi',
        coverImageUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800',
        orderIndex: 6,
        isActive: true,
      },
    }),
  ]);
  
  console.log(`Created ${albums.length} albums`);
  
  // Create gallery images
  console.log('Creating gallery images...');
  
  const images = [
    // Wisuda
    { title: 'Prosesi Wisuda', description: 'Prosesi pawai wisuda', imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', category: 'Wisuda', albumId: 'album-wisuda' },
    { title: 'Penyerahan Ijazah', description: 'Rektor menyerahkan ijazah', imageUrl: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800', category: 'Wisuda', albumId: 'album-wisuda' },
    { title: 'Foto Bersama', description: 'Foto bersama wisudawan', imageUrl: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800', category: 'Wisuda', albumId: 'album-wisuda' },
    // Workshop
    { title: 'Workshop SPMI', description: 'Pembukaan workshop SPMI', imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800', category: 'Workshop', albumId: 'album-workshop' },
    { title: 'Diskusi Kelompok', description: 'Diskusi kelompok peserta', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', category: 'Workshop', albumId: 'album-workshop' },
    { title: 'Presentasi Materi', description: 'Presentasi narasumber', imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', category: 'Workshop', albumId: 'album-workshop' },
    // Audit
    { title: 'Rapat Audit', description: 'Pembukaan audit internal', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', category: 'Audit', albumId: 'album-audit' },
    { title: 'Verifikasi Dokumen', description: 'Verifikasi dokumen mutu', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800', category: 'Audit', albumId: 'album-audit' },
    { title: 'Wawancara', description: 'Wawancara stakeholder', imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800', category: 'Audit', albumId: 'album-audit' },
    // Pelatihan
    { title: 'Pelatihan Auditor', description: 'Pelatihan auditor internal', imageUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800', category: 'Pelatihan', albumId: 'album-pelatihan' },
    { title: 'Simulasi Audit', description: 'Simulasi audit', imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800', category: 'Pelatihan', albumId: 'album-pelatihan' },
    { title: 'Sertifikasi', description: 'Penyerahan sertifikat', imageUrl: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800', category: 'Pelatihan', albumId: 'album-pelatihan' },
    // Seminar
    { title: 'Seminar Nasional', description: 'Seminar nasional BPM', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', category: 'Seminar', albumId: 'album-seminar' },
    { title: 'Keynote Speaker', description: 'Presentasi keynote', imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', category: 'Seminar', albumId: 'album-seminar' },
    { title: 'Panel Discussion', description: 'Diskusi panel', imageUrl: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800', category: 'Seminar', albumId: 'album-seminar' },
    // Visitasi
    { title: 'Kedatangan Asesor', description: 'Penyambutan asesor', imageUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800', category: 'Visitasi', albumId: 'album-visitasi' },
    { title: 'Tinjauan Lapangan', description: 'Tinjauan fasilitas', imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800', category: 'Visitasi', albumId: 'album-visitasi' },
    { title: 'Penutupan', description: 'Penutupan visitasi', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', category: 'Visitasi', albumId: 'album-visitasi' },
    // Kegiatan Umum
    { title: 'Rapat Koordinasi', description: 'Rapat bulanan BPM', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800', category: 'Kegiatan' },
    { title: 'Konsultasi Prodi', description: 'Konsultasi dokumen mutu', imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800', category: 'Kegiatan' },
    { title: 'Monitoring', description: 'Monitoring evaluasi', imageUrl: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800', category: 'Kegiatan' },
  ];
  
  for (let i = 0; i < images.length; i++) {
    await prisma.galleryImage.create({
      data: {
        ...images[i],
        orderIndex: (i % 3) + 1,
        isActive: true,
      },
    });
  }
  
  console.log(`Created ${images.length} gallery images`);
  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
