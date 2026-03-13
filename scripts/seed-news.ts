import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedAll() {
  console.log('🌱 Starting seed process...\n');

  // 1. Tags
  console.log('🏷️ Creating Tags...');
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'akreditasi' },
      update: {},
      create: { name: 'Akreditasi', slug: 'akreditasi' }
    }),
    prisma.tag.upsert({
      where: { slug: 'spmi' },
      update: {},
      create: { name: 'SPMI', slug: 'spmi' }
    }),
    prisma.tag.upsert({
      where: { slug: 'audit-internal' },
      update: {},
      create: { name: 'Audit Internal', slug: 'audit-internal' }
    }),
    prisma.tag.upsert({
      where: { slug: 'workshop' },
      update: {},
      create: { name: 'Workshop', slug: 'workshop' }
    }),
    prisma.tag.upsert({
      where: { slug: 'mbkm' },
      update: {},
      create: { name: 'MBKM', slug: 'mbkm' }
    }),
    prisma.tag.upsert({
      where: { slug: 'prestasi' },
      update: {},
      create: { name: 'Prestasi', slug: 'prestasi' }
    }),
    prisma.tag.upsert({
      where: { slug: 'bpm-usni' },
      update: {},
      create: { name: 'BPM USNI', slug: 'bpm-usni' }
    }),
    prisma.tag.upsert({
      where: { slug: 'pengumuman' },
      update: {},
      create: { name: 'Pengumuman', slug: 'pengumuman' }
    }),
  ]);
  console.log(`✅ Created ${tags.length} tags\n`);

  // 2. News
  console.log('📰 Creating News...');
  const newsData = [
    { 
      title: 'USNI Raih Akreditasi Institusi B dari BAN-PT', 
      slug: 'usni-raih-akreditasi-institusi-b-dari-ban-pt',
      excerpt: 'Universitas Satya Negara Indonesia berhasil meraih akreditasi institusi B dari BAN-PT, menandai komitmen tinggi dalam penjaminan mutu pendidikan.',
      content: '<p>Universitas Satya Negara Indonesia (USNI) berhasil meraih Akreditasi Institusi dengan predikat B dari Badan Akreditasi Nasional Pendidikan Tinggi (BAN-PT). Pencapaian ini merupakan bukti komitmen USNI dalam menjaga dan meningkatkan mutu pendidikan tinggi.</p><p>Rektor USNI menyampaikan apresiasi kepada seluruh civitas akademika yang telah berkontribusi dalam proses akreditasi ini. "Capaian ini memotivasi kita untuk terus meningkatkan kualitas pendidikan di USNI," ujar Rektor.</p><p>Badan Penjaminan Mutu (BPM) USNI terus berupaya meningkatkan standar mutu internal untuk mendukung visi USNI sebagai universitas unggulan.</p>',
      published: true,
      tagSlugs: ['akreditasi', 'prestasi', 'bpm-usni']
    },
    { 
      title: 'Workshop SPMI untuk Dosen dan Tenaga Kependidikan', 
      slug: 'workshop-spmi-untuk-dosen-dan-tenaga-kependidikan',
      excerpt: 'BPM USNI menyelenggarakan workshop Sistem Penjaminan Mutu Internal (SPMI) untuk meningkatkan pemahaman civitas akademika.',
      content: '<p>Badan Penjaminan Mutu (BPM) USNI menyelenggarakan Workshop Sistem Penjaminan Mutu Internal (SPMI) yang diikuti oleh dosen dan tenaga kependidikan. Workshop ini bertujuan untuk meningkatkan pemahaman dan implementasi SPMI di lingkungan universitas.</p><p>Kegiatan ini menghadirkan narasumber ahli di bidang penjaminan mutu pendidikan tinggi. Peserta mendapatkan materi tentang standar mutu, audit internal, dan mekanisme penjaminan mutu yang efektif.</p>',
      published: true,
      tagSlugs: ['spmi', 'workshop', 'bpm-usni']
    },
    { 
      title: 'Program Studi Teknik Informatika Raih Akreditasi LAM Infokom', 
      slug: 'prodi-teknik-informatika-raih-akreditasi-lam-infokom',
      excerpt: 'Program Studi Teknik Informatika berhasil meraih akreditasi Baik Sekali dari LAM Infokom.',
      content: '<p>Program Studi Teknik Informatika Universitas Satya Negara Indonesia berhasil meraih akreditasi dengan predikat Baik Sekali dari Lembaga Akreditasi Mandiri Informatika dan Komputer (LAM Infokom).</p><p>Capaian ini menunjukkan kualitas kurikulum, tenaga pengajar, fasilitas, dan lulusan Program Studi Teknik Informatika USNI yang telah memenuhi standar nasional pendidikan tinggi.</p>',
      published: true,
      tagSlugs: ['akreditasi', 'prestasi']
    },
    { 
      title: 'BPM USNI Gelar Audit Internal Tahun 2025', 
      slug: 'bpm-usni-gelar-audit-internal-tahun-2025',
      excerpt: 'Kegiatan audit internal tahunan dilaksanakan untuk memastikan implementasi SPMI di seluruh unit.',
      content: '<p>Badan Penjaminan Mutu (BPM) USNI melaksanakan kegiatan Audit Internal tahun 2025. Audit ini dilakukan untuk memastikan implementasi Sistem Penjaminan Mutu Internal (SPMI) di seluruh unit di lingkungan universitas.</p><p>Hasil audit akan digunakan sebagai dasar untuk penyusunan rencana perbaikan dan peningkatan mutu di setiap unit.</p>',
      published: true,
      tagSlugs: ['audit-internal', 'spmi', 'bpm-usni']
    },
    { 
      title: 'Sosialisasi Kurikulum Merdeka Belajar Kampus Merdeka', 
      slug: 'sosialisasi-kurikulum-mbkm',
      excerpt: 'USNI mengadakan sosialisasi implementasi Kurikulum Merdeka Belajar Kampus Merdeka.',
      content: '<p>Universitas Satya Negara Indonesia mengadakan sosialisasi implementasi Kurikulum Merdeka Belajar Kampus Merdeka (MBKM). Kegiatan ini diikuti oleh pimpinan fakultas, ketua program studi, dan dosen.</p><p>Implementasi MBKM diharapkan dapat meningkatkan kompetensi lulusan yang sesuai dengan kebutuhan industri dan masyarakat.</p>',
      published: true,
      tagSlugs: ['mbkm', 'workshop', 'bpm-usni']
    },
    { 
      title: 'Pelatihan Penyusunan Dokumen Akreditasi Prodi', 
      slug: 'pelatihan-penyusunan-dokumen-akreditasi-prodi',
      excerpt: 'BPM USNI mengadakan pelatihan penyusunan dokumen akreditasi untuk program studi yang akan akreditasi.',
      content: '<p>Badan Penjaminan Mutu (BPM) USNI menyelenggarakan Pelatihan Penyusunan Dokumen Akreditasi Program Studi. Kegiatan ini diikuti oleh tim penyusun borang akreditasi dari berbagai program studi.</p><p>Pelatihan ini membekali peserta dengan pengetahuan tentang instrumen akreditasi terbaru dan teknik penyusunan dokumen yang efektif.</p>',
      published: true,
      tagSlugs: ['akreditasi', 'workshop', 'bpm-usni']
    },
    { 
      title: 'Prodi Akuntansi Raih Akreditasi Baik Sekali dari LAMEMBA', 
      slug: 'prodi-akuntansi-raih-akreditasi-baik-sekali-lamemba',
      excerpt: 'Program Studi Akuntansi berhasil meraih akreditasi Baik Sekali dari LAMEMBA.',
      content: '<p>Program Studi Akuntansi Fakultas Ekonomi dan Bisnis Universitas Satya Negara Indonesia berhasil meraih akreditasi dengan predikat Baik Sekali dari Lembaga Akreditasi Mandiri Ekonomi, Manajemen, Bisnis, dan Akuntansi (LAMEMBA).</p><p>Pencapaian ini merupakan bukti komitmen program studi dalam menjaga kualitas pendidikan dan meningkatkan daya saing lulusan.</p>',
      published: true,
      tagSlugs: ['akreditasi', 'prestasi']
    },
    { 
      title: 'Sosialisasi Standar Mutu Internal USNI 2025', 
      slug: 'sosialisasi-standar-mutu-internal-usni-2025',
      excerpt: 'BPM USNI menyelenggarakan sosialisasi standar mutu internal untuk seluruh unit di lingkungan USNI.',
      content: '<p>Badan Penjaminan Mutu (BPM) USNI menyelenggarakan Sosialisasi Standar Mutu Internal USNI tahun 2025. Kegiatan ini bertujuan untuk menyamakan persepsi tentang standar mutu yang harus dicapai oleh setiap unit.</p><p>Standar mutu yang disosialisasikan meliputi standar kompetensi lulusan, standar isi pembelajaran, standar proses pembelajaran, standar penilaian, standar pendidik, standar sarana prasarana, standar pengelolaan, dan standar pembiayaan.</p>',
      published: true,
      tagSlugs: ['spmi', 'bpm-usni']
    },
  ];

  for (const n of newsData) {
    const newsTags = tags.filter(t => n.tagSlugs.includes(t.slug));
    await prisma.news.upsert({
      where: { slug: n.slug },
      update: {
        title: n.title,
        excerpt: n.excerpt,
        content: n.content,
        published: n.published,
      },
      create: {
        title: n.title,
        slug: n.slug,
        excerpt: n.excerpt,
        content: n.content,
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
        published: n.published,
        publishedAt: new Date(),
        tags: {
          create: newsTags.map(tag => ({
            tag: { connect: { id: tag.id } }
          }))
        }
      }
    });
  }
  console.log(`✅ Created ${newsData.length} news articles\n`);

  console.log('🎉 Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Tags: ${tags.length}`);
  console.log(`   - News: ${newsData.length}`);
}

seedAll()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
