import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedAll() {
  console.log('🌱 Starting seed process...\n');

  // 1. Document Categories
  console.log('📁 Creating Document Categories...');
  const docCategories = await Promise.all([
    prisma.documentCategory.upsert({
      where: { slug: 'publik' },
      update: {},
      create: { name: 'Dokumen Publik', slug: 'publik', description: 'Dokumen yang dapat diakses publik', orderIndex: 1, isActive: true }
    }),
    prisma.documentCategory.upsert({
      where: { slug: 'universitas' },
      update: {},
      create: { name: 'Dokumen Universitas', slug: 'universitas', description: 'Dokumen internal universitas', orderIndex: 2, isActive: true }
    }),
    prisma.documentCategory.upsert({
      where: { slug: 'akreditasi' },
      update: {},
      create: { name: 'Dokumen Akreditasi', slug: 'akreditasi', description: 'Dokumen terkait akreditasi', orderIndex: 3, isActive: true }
    }),
    prisma.documentCategory.upsert({
      where: { slug: 'spmi' },
      update: {},
      create: { name: 'Dokumen SPMI', slug: 'spmi', description: 'Dokumen Sistem Penjaminan Mutu Internal', orderIndex: 4, isActive: true }
    }),
    prisma.documentCategory.upsert({
      where: { slug: 'sop' },
      update: {},
      create: { name: 'Dokumen SOP', slug: 'sop', description: 'Standar Operasional Prosedur', orderIndex: 5, isActive: true }
    }),
    prisma.documentCategory.upsert({
      where: { slug: 'bpm' },
      update: {},
      create: { name: 'Dokumen BPM', slug: 'bpm', description: 'Dokumen Badan Penjaminan Mutu', orderIndex: 6, isActive: true }
    }),
    prisma.documentCategory.upsert({
      where: { slug: 'formulir' },
      update: {},
      create: { name: 'Formulir', slug: 'formulir', description: 'Formulir-formulir yang tersedia', orderIndex: 7, isActive: true }
    }),
    prisma.documentCategory.upsert({
      where: { slug: 'sk-rektor' },
      update: {},
      create: { name: 'SK Rektor', slug: 'sk-rektor', description: 'Surat Keputusan Rektor', orderIndex: 8, isActive: true }
    }),
  ]);
  console.log(`✅ Created ${docCategories.length} document categories\n`);

  // 2. Documents
  console.log('📄 Creating Documents...');
  const documents = [
    { title: 'SK Rektor Pembentukan BPM USNI', description: 'Surat Keputusan Rektor tentang Pembentukan Badan Penjaminan Mutu Universitas Satya Negara Indonesia', category: 'sk-rektor', fileUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf' },
    { title: 'SK Rektor Struktur Organisasi BPM', description: 'Surat Keputusan Rektor tentang Struktur Organisasi Badan Penjaminan Mutu', category: 'sk-rektor', fileUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf' },
    { title: 'Profil BPM USNI', description: 'Profil lengkap Badan Penjaminan Mutu Universitas Satya Negara Indonesia', category: 'publik', fileUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf' },
    { title: 'Struktur Organisasi BPM USNI', description: 'Bagan struktur organisasi Badan Penjaminan Mutu', category: 'publik', fileUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf' },
    { title: 'Instrumen Akreditasi BAN-PT 4.0', description: 'Instrumen akreditasi program studi versi BAN-PT 4.0', category: 'akreditasi', fileUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf' },
    { title: 'Instrumen Akreditasi Institusi', description: 'Instrumen akreditasi institusi perguruan tinggi', category: 'akreditasi', fileUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf' },
    { title: 'Panduan Penyusunan Borang Akreditasi', description: 'Panduan lengkap penyusunan borang akreditasi program studi', category: 'akreditasi', fileUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf' },
    { title: 'Peta Kebutuhan Data Akreditasi', description: 'Daftar kebutuhan data untuk penyusunan borang akreditasi', category: 'akreditasi', fileUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf' },
    { title: 'Buku Saku SPMI', description: 'Panduan ringkas Sistem Penjaminan Mutu Internal', category: 'spmi', fileUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf' },
    { title: 'Kebijakan SPMI USNI', description: 'Dokumen kebijakan Sistem Penjaminan Mutu Internal USNI', category: 'spmi', fileUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf' },
    { title: 'Standar Mutu USNI', description: 'Dokumen standar mutu pendidikan tinggi USNI', category: 'spmi', fileUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf' },
    { title: 'Manual SPMI USNI', description: 'Manual lengkap Sistem Penjaminan Mutu Internal', category: 'spmi', fileUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf' },
    { title: 'SOP Audit Internal', description: 'Standar Operasional Prosedur pelaksanaan audit internal', category: 'sop', fileUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf' },
    { title: 'SOP Penanganan Keluhan', description: 'Standar Operasional Prosedur penanganan keluhan mahasiswa', category: 'sop', fileUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf' },
    { title: 'SOP Pengelolaan Dokumen Mutu', description: 'Standar Operasional Prosedur pengelolaan dokumen mutu', category: 'sop', fileUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf' },
    { title: 'SOP Monitoring dan Evaluasi', description: 'Standar Operasional Prosedur monitoring dan evaluasi mutu', category: 'sop', fileUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf' },
    { title: 'Laporan Tahunan BPM 2024', description: 'Laporan kegiatan Badan Penjaminan Mutu tahun 2024', category: 'bpm', fileUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf' },
    { title: 'Program Kerja BPM 2025', description: 'Program kerja Badan Penjaminan Mutu tahun 2025', category: 'bpm', fileUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf' },
    { title: 'Jadwal Audit Internal 2025', description: 'Jadwal pelaksanaan audit internal tahun 2025', category: 'bpm', fileUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf' },
    { title: 'Formulir Usulan Perbaikan', description: 'Formulir untuk mengusulkan perbaikan mutu', category: 'formulir', fileUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf' },
    { title: 'Formulir Laporan Audit Internal', description: 'Formulir laporan hasil audit internal', category: 'formulir', fileUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf' },
    { title: 'Formulir Tindak Lanjut Audit', description: 'Formulir tindak lanjut hasil audit', category: 'formulir', fileUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf' },
    { title: 'Pedoman Pendidikan USNI', description: 'Pedoman pelaksanaan pendidikan di Universitas Satya Negara Indonesia', category: 'universitas', fileUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf' },
    { title: 'Kalender Akademik 2024/2025', description: 'Kalender akademik tahun ajaran 2024/2025', category: 'universitas', fileUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf' },
  ];

  for (const doc of documents) {
    await prisma.document.create({
      data: {
        title: doc.title,
        description: doc.description,
        category: doc.category,
        fileUrl: doc.fileUrl,
        published: true,
      }
    });
  }
  console.log(`✅ Created ${documents.length} documents\n`);

  // 3. Faculties
  console.log('🏛️ Creating Faculties...');
  const faculties = await Promise.all([
    prisma.faculty.create({
      data: { name: 'Fakultas Hukum', code: 'FH', description: 'Fakultas Hukum Universitas Satya Negara Indonesia', isActive: true }
    }),
    prisma.faculty.create({
      data: { name: 'Fakultas Ekonomi dan Bisnis', code: 'FEB', description: 'Fakultas Ekonomi dan Bisnis Universitas Satya Negara Indonesia', isActive: true }
    }),
    prisma.faculty.create({
      data: { name: 'Fakultas Ilmu Sosial dan Ilmu Politik', code: 'FISIP', description: 'Fakultas Ilmu Sosial dan Ilmu Politik Universitas Satya Negara Indonesia', isActive: true }
    }),
    prisma.faculty.create({
      data: { name: 'Fakultas Teknik', code: 'FT', description: 'Fakultas Teknik Universitas Satya Negara Indonesia', isActive: true }
    }),
    prisma.faculty.create({
      data: { name: 'Fakultas Perikanan dan Pertanian', code: 'FPP', description: 'Fakultas Perikanan dan Pertanian Universitas Satya Negara Indonesia', isActive: true }
    }),
  ]);
  console.log(`✅ Created ${faculties.length} faculties\n`);

  // 4. Study Programs
  console.log('🎓 Creating Study Programs...');
  const studyPrograms = [
    { name: 'Ilmu Hukum', code: 'IH', degreeLevel: 's1', facultyCode: 'FH' },
    { name: 'Manajemen', code: 'MNJ', degreeLevel: 's1', facultyCode: 'FEB' },
    { name: 'Akuntansi', code: 'AKT', degreeLevel: 's1', facultyCode: 'FEB' },
    { name: 'Magister Manajemen', code: 'MM', degreeLevel: 's2', facultyCode: 'FEB' },
    { name: 'Ilmu Hubungan Internasional', code: 'HI', degreeLevel: 's1', facultyCode: 'FISIP' },
    { name: 'Ilmu Komunikasi', code: 'IK', degreeLevel: 's1', facultyCode: 'FISIP' },
    { name: 'Teknik Sipil', code: 'TS', degreeLevel: 's1', facultyCode: 'FT' },
    { name: 'Teknik Lingkungan', code: 'TL', degreeLevel: 's1', facultyCode: 'FT' },
    { name: 'Teknik Informatika', code: 'TI', degreeLevel: 's1', facultyCode: 'FT' },
    { name: 'Sistem Informasi', code: 'SI', degreeLevel: 's1', facultyCode: 'FT' },
    { name: 'Pemanfaatan Sumberdaya Perikanan', code: 'PSP', degreeLevel: 's1', facultyCode: 'FPP' },
  ];

  for (const sp of studyPrograms) {
    const faculty = faculties.find(f => f.code === sp.facultyCode);
    if (faculty) {
      await prisma.studyProgram.create({
        data: {
          name: sp.name,
          code: sp.code,
          degreeLevel: sp.degreeLevel,
          facultyId: faculty.id,
          isActive: true,
        }
      });
    }
  }
  console.log(`✅ Created ${studyPrograms.length} study programs\n`);

  // 5. Accreditations
  console.log('🏆 Creating Accreditations...');
  const accreditations = [
    // BAN-PT - Institusi
    { title: 'Akreditasi Institusi Universitas Satya Negara Indonesia', accreditationBody: 'ban-pt', status: 'B', validUntil: '2029-01-15', category: 'nasional' },
    // BAN-PT - Program Studi
    { title: 'Program Studi Ilmu Hukum', accreditationBody: 'ban-pt', status: 'Baik', validUntil: '2027-12-31', category: 'nasional' },
    { title: 'Program Studi Manajemen', accreditationBody: 'ban-pt', status: 'Baik', validUntil: '2027-06-30', category: 'nasional' },
    { title: 'Program Studi Ilmu Komunikasi', accreditationBody: 'ban-pt', status: 'B', validUntil: '2027-11-30', category: 'nasional' },
    { title: 'Program Studi Ilmu Hubungan Internasional', accreditationBody: 'ban-pt', status: 'B', validUntil: '2028-06-30', category: 'nasional' },
    { title: 'Program Studi Pemanfaatan Sumberdaya Perikanan', accreditationBody: 'ban-pt', status: 'B', validUntil: '2028-03-15', category: 'nasional' },
    // LAMEMBA
    { title: 'Program Studi Akuntansi', accreditationBody: 'lamemba', status: 'Baik Sekali', validUntil: '2028-08-20', category: 'nasional' },
    { title: 'Program Studi Magister Manajemen', accreditationBody: 'lamemba', status: 'Baik Sekali', validUntil: '2029-02-28', category: 'nasional' },
    // LAM Teknik
    { title: 'Program Studi Teknik Sipil', accreditationBody: 'lam-teknik', status: 'Baik Sekali', validUntil: '2028-12-28', category: 'nasional' },
    { title: 'Program Studi Teknik Lingkungan', accreditationBody: 'lam-teknik', status: 'Baik Sekali', validUntil: '2028-01-20', category: 'nasional' },
    // LAM Infokom
    { title: 'Program Studi Teknik Informatika', accreditationBody: 'lam-infokom', status: 'Baik Sekali', validUntil: '2028-09-30', category: 'nasional' },
    { title: 'Program Studi Sistem Informasi', accreditationBody: 'lam-infokom', status: 'Baik Sekali', validUntil: '2028-05-20', category: 'nasional' },
  ];

  for (const acc of accreditations) {
    await prisma.accreditationData.create({
      data: {
        title: acc.title,
        description: `Akreditasi ${acc.title}`,
        accreditationBody: acc.accreditationBody,
        accreditationStatus: acc.status,
        category: acc.category,
        validUntil: new Date(acc.validUntil),
        published: true,
        certificateUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf',
      }
    });
  }
  console.log(`✅ Created ${accreditations.length} accreditations\n`);

  // 6. News
  console.log('📰 Creating News...');
  const news = [
    { 
      title: 'USNI Raih Akreditasi Institusi B dari BAN-PT', 
      slug: 'usni-raih-akreditasi-institusi-b-dari-ban-pt',
      excerpt: 'Universitas Satya Negara Indonesia berhasil meraih akreditasi institusi B dari BAN-PT, menandai komitmen tinggi dalam penjaminan mutu pendidikan.',
      content: '<p>Universitas Satya Negara Indonesia (USNI) berhasil meraih Akreditasi Institusi dengan predikat B dari Badan Akreditasi Nasional Pendidikan Tinggi (BAN-PT). Pencapaian ini merupakan bukti komitmen USNI dalam menjaga dan meningkatkan mutu pendidikan tinggi.</p><p>Rektor USNI menyampaikan apresiasi kepada seluruh civitas akademika yang telah berkontribusi dalam proses akreditasi ini. "Capaian ini memotivasi kita untuk terus meningkatkan kualitas pendidikan di USNI," ujar Rektor.</p><p>Badan Penjaminan Mutu (BPM) USNI terus berupaya meningkatkan standar mutu internal untuk mendukung visi USNI sebagai universitas unggulan.</p>',
      published: true 
    },
    { 
      title: 'Workshop SPMI untuk Dosen dan Tenaga Kependidikan', 
      slug: 'workshop-spmi-untuk-dosen-dan-tenaga-kependidikan',
      excerpt: 'BPM USNI menyelenggarakan workshop Sistem Penjaminan Mutu Internal (SPMI) untuk meningkatkan pemahaman civitas akademika.',
      content: '<p>Badan Penjaminan Mutu (BPM) USNI menyelenggarakan Workshop Sistem Penjaminan Mutu Internal (SPMI) yang diikuti oleh dosen dan tenaga kependidikan. Workshop ini bertujuan untuk meningkatkan pemahaman dan implementasi SPMI di lingkungan universitas.</p><p>Kegiatan ini menghadirkan narasumber ahli di bidang penjaminan mutu pendidikan tinggi. Peserta mendapatkan materi tentang standar mutu, audit internal, dan mekanisme penjaminan mutu yang efektif.</p>',
      published: true 
    },
    { 
      title: 'Program Studi Teknik Informatika Raih Akreditasi LAM Infokom', 
      slug: 'prodi-teknik-informatika-raih-akreditasi-lam-infokom',
      excerpt: 'Program Studi Teknik Informatika berhasil meraih akreditasi Baik Sekali dari LAM Infokom.',
      content: '<p>Program Studi Teknik Informatika Universitas Satya Negara Indonesia berhasil meraih akreditasi dengan predikat Baik Sekali dari Lembaga Akreditasi Mandiri Informatika dan Komputer (LAM Infokom).</p><p>Capaian ini menunjukkan kualitas kurikulum, tenaga pengajar, fasilitas, dan lulusan Program Studi Teknik Informatika USNI yang telah memenuhi standar nasional pendidikan tinggi.</p>',
      published: true 
    },
    { 
      title: 'BPM USNI Gelar Audit Internal Tahun 2025', 
      slug: 'bpm-usni-gelar-audit-internal-tahun-2025',
      excerpt: 'Kegiatan audit internal tahunan dilaksanakan untuk memastikan implementasi SPMI di seluruh unit.',
      content: '<p>Badan Penjaminan Mutu (BPM) USNI melaksanakan kegiatan Audit Internal tahun 2025. Audit ini dilakukan untuk memastikan implementasi Sistem Penjaminan Mutu Internal (SPMI) di seluruh unit di lingkungan universitas.</p><p>Hasil audit akan digunakan sebagai dasar untuk penyusunan rencana perbaikan dan peningkatan mutu di setiap unit.</p>',
      published: true 
    },
    { 
      title: 'Sosialisasi Kurikulum Merdeka Belajar Kampus Merdeka', 
      slug: 'sosialisasi-kurikulum-mbkm',
      excerpt: 'USNI mengadakan sosialisasi implementasi Kurikulum Merdeka Belajar Kampus Merdeka.',
      content: '<p>Universitas Satya Negara Indonesia mengadakan sosialisasi implementasi Kurikulum Merdeka Belajar Kampus Merdeka (MBKM). Kegiatan ini diikuti oleh pimpinan fakultas, ketua program studi, dan dosen.</p><p>Implementasi MBKM diharapkan dapat meningkatkan kompetensi lulusan yang sesuai dengan kebutuhan industri dan masyarakat.</p>',
      published: true 
    },
  ];

  for (const n of news) {
    await prisma.news.create({
      data: {
        title: n.title,
        slug: n.slug,
        excerpt: n.excerpt,
        content: n.content,
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
        published: n.published,
        publishedAt: new Date(),
      }
    });
  }
  console.log(`✅ Created ${news.length} news articles\n`);

  // 7. Announcements
  console.log('📢 Creating Announcements...');
  const announcements = [
    {
      title: 'Jadwal Audit Internal Semester Genap 2024/2025',
      content: '<p>Diberitahukan kepada seluruh unit di lingkungan USNI bahwa akan dilaksanakan Audit Internal pada periode:</p><ul><li>Tanggal: 15-30 April 2025</li><li>Waktu: 08.00 - 16.00 WIB</li></ul><p>Dimohon kepada seluruh unit untuk mempersiapkan dokumen pendukung yang diperlukan.</p>',
      priority: 'high',
      published: true,
    },
    {
      title: 'Pengumpulan Dokumen Akreditasi Program Studi',
      content: '<p>Kepada seluruh Program Studi yang akan menjalani akreditasi tahun 2025, dimohon untuk mengumpulkan dokumen pendukung paling lambat tanggal 28 Februari 2025.</p><p>Dokumen dapat diserahkan ke sekretariat BPM USNI.</p>',
      priority: 'high',
      published: true,
    },
    {
      title: 'Workshop Penyusunan Borang Akreditasi',
      content: '<p>BPM USNI akan menyelenggarakan Workshop Penyusunan Borang Akreditasi yang akan dilaksanakan pada:</p><ul><li>Hari/Tanggal: Senin, 10 Maret 2025</li><li>Waktu: 09.00 - 15.00 WIB</li><li>Tempat: Aula USNI</li></ul><p>Peserta wajib mendaftar melalui website BPM.</p>',
      priority: 'medium',
      published: true,
    },
    {
      title: 'Pembukaan Pendaftaran Program Magang MBKM',
      content: '<p>Diumumkan kepada mahasiswa USNI bahwa pendaftaran Program Magang MBKM Semester Genap 2024/2025 telah dibuka.</p><p>Pendaftaran dapat dilakukan melalui portal akademik hingga tanggal 15 Maret 2025.</p>',
      priority: 'medium',
      published: true,
    },
    {
      title: 'Libur Hari Raya Idul Fitri 1446 H',
      content: '<p>Diberitahukan bahwa libur Hari Raya Idul Fitri 1446 H akan dilaksanakan pada tanggal 30 Maret - 7 April 2025.</p><p>Kegiatan perkuliahan akan dimulai kembali pada tanggal 8 April 2025.</p>',
      priority: 'low',
      published: true,
    },
  ];

  for (const ann of announcements) {
    await prisma.announcement.create({
      data: {
        title: ann.title,
        content: ann.content,
        priority: ann.priority,
        published: ann.published,
        publishedAt: new Date(),
      }
    });
  }
  console.log(`✅ Created ${announcements.length} announcements\n`);

  // 8. Slideshows
  console.log('🖼️ Creating Slideshows...');
  const slideshows = [
    { title: 'Selamat Datang di BPM USNI', subtitle: 'Badan Penjaminan Mutu Universitas Satya Negara Indonesia', imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200', linkUrl: '/tentang-kami', orderIndex: 1 },
    { title: 'Akreditasi Institusi B', subtitle: 'USNI Terakreditasi B dari BAN-PT', imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200', linkUrl: '/akreditasi', orderIndex: 2 },
    { title: 'SPMI USNI', subtitle: 'Sistem Penjaminan Mutu Internal yang Terintegrasi', imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200', linkUrl: '/dokumen', orderIndex: 3 },
    { title: 'Program Studi Unggulan', subtitle: 'Berbagai Program Studi dengan Akreditasi Baik', imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200', linkUrl: '/akreditasi', orderIndex: 4 },
  ];

  for (const slide of slideshows) {
    await prisma.slideshow.create({
      data: {
        title: slide.title,
        subtitle: slide.subtitle,
        imageUrl: slide.imageUrl,
        linkUrl: slide.linkUrl,
        orderIndex: slide.orderIndex,
        isActive: true,
      }
    });
  }
  console.log(`✅ Created ${slideshows.length} slideshows\n`);

  console.log('🎉 Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Document Categories: ${docCategories.length}`);
  console.log(`   - Documents: ${documents.length}`);
  console.log(`   - Faculties: ${faculties.length}`);
  console.log(`   - Study Programs: ${studyPrograms.length}`);
  console.log(`   - Accreditations: ${accreditations.length}`);
  console.log(`   - News: ${news.length}`);
  console.log(`   - Announcements: ${announcements.length}`);
  console.log(`   - Slideshows: ${slideshows.length}`);
}

seedAll()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
