import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Clear existing data in correct order (respecting relations)
    console.log('Clearing existing data...');
    
    // Child tables first
    await db.pageView.deleteMany();
    await db.uploadLog.deleteMany();
    await db.contactMessage.deleteMany();
    await db.adminSetting.deleteMany();
    await db.staticPage.deleteMany();
    await db.homepageQuote.deleteMany();
    await db.quickLink.deleteMany();
    await db.menuItem.deleteMany();
    await db.statistic.deleteMany();
    await db.organizationStructure.deleteMany();
    await db.aboutUs.deleteMany();
    await db.visionMission.deleteMany();
    await db.studyProgram.deleteMany();
    await db.faculty.deleteMany();
    await db.accreditationData.deleteMany();
    await db.accreditationCategory.deleteMany();
    await db.document.deleteMany();
    await db.documentCategory.deleteMany();
    await db.galleryImage.deleteMany();
    await db.album.deleteMany();
    await db.slideshow.deleteMany();
    await db.announcement.deleteMany();
    await db.news.deleteMany();
    await db.accreditation.deleteMany();
    
    // Parent tables
    await db.websiteIdentity.deleteMany();
    // Don't delete users - keep admin account

    console.log('Seeding new data...');

    // ==================== WEBSITE IDENTITY ====================
    const websiteIdentity = await db.websiteIdentity.create({
      data: {
        siteName: 'BPM USNI',
        siteTagline: 'Badan Penjaminan Mutu - Universitas Satya Negara Indonesia',
        contactEmail: 'bpm@usni.ac.id',
        contactPhone: '(021) 789-1234',
        contactAddress: 'Jl. Raya Bogor Km. 30, Cirendeu, Cimanggis, Depok, Jawa Barat 16953',
        operationalHours: 'Senin - Jumat: 08.00 - 16.00 WIB',
        facebookUrl: 'https://facebook.com/bpmusni',
        instagramUrl: 'https://instagram.com/bpmusni',
        twitterUrl: 'https://twitter.com/bpmusni',
        youtubeUrl: 'https://youtube.com/bpmusni',
        footerText: '© 2024 BPM USNI. All rights reserved.',
      }
    });

    // ==================== VISION & MISSION ====================
    const visionMission = await db.visionMission.create({
      data: {
        vision: 'Menjadi lembaga penjaminan mutu yang unggul dan terpercaya dalam mewujudkan budaya mutu di lingkungan Universitas Satya Negara Indonesia.',
        mission: `1. Menetapkan dan mengembangkan kebijakan, standar, dan prosedur penjaminan mutu pendidikan tinggi.
2. Melaksanakan monitoring, evaluasi, dan tindak lanjut pelaksanaan kebijakan, standar, dan prosedur penjaminan mutu.
3. Melaksanakan kegiatan audit mutu internal secara berkala.
4. Membina budaya mutu di lingkungan USNI.`,
        goals: `- Terwujudnya sistem penjaminan mutu internal yang efektif dan efisien.
- Terciptanya budaya mutu yang berkelanjutan di seluruh unit kerja.
- Meningkatnya kepuasan pemangku kepentingan terhadap layanan pendidikan.
- Tercapainya akreditasi institusi dan program studi yang baik.`,
      }
    });

    // ==================== ORGANIZATION STRUCTURE ====================
    const organizationStructures = await db.organizationStructure.createMany({
      data: [
        {
          name: 'Dr. Ir. Dwi Ernaningsih, M.Si.',
          position: 'Kepala Badan Penjaminan Mutu',
          photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
          orderIndex: 1,
        },
        {
          name: 'Dr. H. Ahmad Fauzi, M.Pd.',
          position: 'Sekretaris',
          photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
          orderIndex: 2,
        },
        {
          name: 'Ir. Bambang Suryanto, M.T.',
          position: 'Koordinator Bidang SPMI',
          photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
          orderIndex: 3,
        },
        {
          name: 'Dra. Siti Nurhaliza, M.M.',
          position: 'Koordinator Bidang Akreditasi',
          photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
          orderIndex: 4,
        },
        {
          name: 'Hendra Wijaya, S.Kom., M.Kom.',
          position: 'Koordinator Bidang Pelayanan & Informasi',
          photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
          orderIndex: 5,
        },
      ]
    });

    // ==================== STATISTICS ====================
    const statistics = await db.statistic.createMany({
      data: [
        { icon: 'users', value: '15+', label: 'Program Studi Terakreditasi', orderIndex: 1 },
        { icon: 'award', value: '3', label: 'Lembaga Akreditasi', orderIndex: 2 },
        { icon: 'file-check', value: '50+', label: 'Dokumen Standar', orderIndex: 3 },
        { icon: 'users-2', value: '25+', label: 'Auditor Internal', orderIndex: 4 },
      ]
    });

    // ==================== MENU ITEMS ====================
    const menuItems = await db.menuItem.createMany({
      data: [
        { title: 'Beranda', url: '/', orderIndex: 1 },
        { title: 'Profil', url: '#profil', orderIndex: 2 },
        { title: 'Akreditasi', url: '/akreditasi', orderIndex: 3 },
        { title: 'Dokumen', url: '/dokumen', orderIndex: 4 },
        { title: 'Layanan', url: '/layanan', orderIndex: 5 },
        { title: 'Hubungi Kami', url: '/hubungi-kami', orderIndex: 6 },
      ]
    });

    // ==================== QUICK LINKS ====================
    const quickLinks = await db.quickLink.createMany({
      data: [
        { title: 'Website USNI', url: 'https://usni.ac.id', icon: 'link', orderIndex: 1, isActive: true },
        { title: 'Portal Dosen', url: 'https://dosen.usni.ac.id', icon: 'link', orderIndex: 2, isActive: true },
        { title: 'Portal Mahasiswa', url: 'https://mahasiswa.usni.ac.id', icon: 'link', orderIndex: 3, isActive: true },
        { title: 'E-Learning', url: 'https://lms.usni.ac.id', icon: 'graduation-cap', orderIndex: 4, isActive: true },
        { title: 'Perpustakaan Digital', url: 'https://lib.usni.ac.id', icon: 'link', orderIndex: 5, isActive: true },
        { title: 'Rumah Jurnal', url: 'https://jurnal.usni.ac.id', icon: 'link', orderIndex: 6, isActive: true },
        { title: 'Tracer Study', url: '#', icon: 'link', orderIndex: 7, isActive: true },
        { title: 'PDDIKTI', url: 'https://pddikti.kemdiktisaintek.go.id', icon: 'graduation-cap', orderIndex: 8, isActive: true },
        { title: 'SPMI', url: 'https://spmi.kemdiktisaintek.go.id', icon: 'link', orderIndex: 9, isActive: true },
      ]
    });

    // ==================== SLIDESHOW ====================
    const slideshows = await db.slideshow.createMany({
      data: [
        {
          title: 'Selamat Datang di BPM USNI',
          subtitle: 'Badan Penjaminan Mutu Universitas Satya Negara Indonesia',
          imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80',
          linkUrl: '#profil',
          orderIndex: 1,
          isActive: true,
        },
        {
          title: 'Akreditasi Program Studi',
          subtitle: 'Menjaga standar mutu pendidikan tinggi',
          imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80',
          linkUrl: '/akreditasi',
          orderIndex: 2,
          isActive: true,
        },
        {
          title: 'Workshop SPMI 2024',
          subtitle: 'Meningkatkan budaya mutu bersama',
          imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80',
          linkUrl: '#berita',
          orderIndex: 3,
          isActive: true,
        },
      ]
    });

    // ==================== NEWS ====================
    const newsData = await db.news.createMany({
      data: [
        {
          title: 'Workshop Penyusunan Dokumen Akreditasi Program Studi',
          slug: 'workshop-penyusunan-dokumen-akreditasi-prodi',
          excerpt: 'BPM USNI menyelenggarakan workshop penyusunan dokumen akreditasi program studi.',
          content: `<p>BPM USNI menyelenggarakan workshop penyusunan dokumen akreditasi program studi yang diikuti oleh seluruh koordinator prodi.</p>`,
          imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
          published: true,
          publishedAt: new Date(),
          viewCount: 150,
        },
        {
          title: 'Pelatihan Auditor Internal SPMI Angkatan ke-5',
          slug: 'pelatihan-auditor-internal-spmi-angkatan-5',
          excerpt: 'BPM USNI mengadakan pelatihan auditor internal SPMI angkatan ke-5.',
          content: `<p>BPM USNI mengadakan pelatihan auditor internal SPMI angkatan ke-5 yang diikuti oleh 25 peserta dari berbagai unit kerja.</p>`,
          imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80',
          published: true,
          publishedAt: new Date(Date.now() - 86400000 * 2),
          viewCount: 120,
        },
        {
          title: 'Kunjungan Benchmarking ke Universitas Terkemuka',
          slug: 'kunjungan-benchmarking-universitas',
          excerpt: 'Tim BPM USNI melakukan kunjungan benchmarking ke universitas terkemuka.',
          content: `<p>Tim BPM USNI melakukan kunjungan benchmarking ke universitas terkemuka untuk mempelajari best practice dalam implementasi SPMI.</p>`,
          imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
          published: true,
          publishedAt: new Date(Date.now() - 86400000 * 5),
          viewCount: 95,
        },
        {
          title: 'Sosialisasi Standar Nasional Pendidikan Tinggi',
          slug: 'sosialisasi-standar-nasional-pendidikan-tinggi',
          excerpt: 'BPM USNI mengadakan sosialisasi SN-Dikti kepada seluruh pimpinan prodi.',
          content: `<p>BPM USNI mengadakan sosialisasi Standar Nasional Pendidikan Tinggi (SN-Dikti) kepada seluruh pimpinan program studi.</p>`,
          imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
          published: true,
          publishedAt: new Date(Date.now() - 86400000 * 7),
          viewCount: 80,
        },
      ]
    });

    // ==================== ANNOUNCEMENTS ====================
    const announcements = await db.announcement.createMany({
      data: [
        {
          title: 'Hasil Akreditasi Institusi USNI Terakreditasi B',
          content: `<p>Universitas Suryakancana Indonesia berhasil mempertahankan akreditasi institusi dengan peringkat B dari BAN-PT.</p>`,
          priority: 'high',
          published: true,
          publishedAt: new Date(),
          viewCount: 250,
        },
        {
          title: 'Jadwal Audit Internal Semester Genap 2024/2025',
          content: `<p>BPM USNI mengumumkan jadwal pelaksanaan audit internal semester genap tahun akademik 2024/2025.</p>`,
          priority: 'normal',
          published: true,
          publishedAt: new Date(Date.now() - 86400000 * 3),
          viewCount: 180,
        },
        {
          title: 'Pendaftaran Pelatihan Auditor Internal Angkatan VI',
          content: `<p>BPM USNI membuka pendaftaran pelatihan auditor internal SPMI angkatan ke-6.</p>`,
          priority: 'normal',
          published: true,
          publishedAt: new Date(Date.now() - 86400000 * 5),
          viewCount: 150,
        },
        {
          title: 'Pengumpulan Laporan Kinerja Program Studi',
          content: `<p>Kepada seluruh Koordinator Program Studi diharapkan untuk mengumpulkan laporan kinerja program studi.</p>`,
          priority: 'urgent',
          published: true,
          publishedAt: new Date(Date.now() - 86400000 * 7),
          viewCount: 120,
        },
      ]
    });

    // ==================== ALBUMS & GALLERY ====================
    const album1 = await db.album.create({
      data: {
        title: 'Kegiatan SPMI 2024',
        description: 'Dokumentasi kegiatan Sistem Penjaminan Mutu Internal tahun 2024',
        coverImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        orderIndex: 1,
        isActive: true,
      }
    });

    const album2 = await db.album.create({
      data: {
        title: 'Pelatihan & Workshop',
        description: 'Dokumentasi pelatihan dan workshop BPM USNI',
        coverImageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80',
        orderIndex: 2,
        isActive: true,
      }
    });

    const galleryImages = await db.galleryImage.createMany({
      data: [
        {
          title: 'Kegiatan Benchmarking BPM USNI',
          description: 'Kegiatan benchmarking BPM USNI ke KPM UEU tanggal 27 Oktober 2024',
          imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
          category: 'Benchmarking',
          albumId: album1.id,
          orderIndex: 1,
          isActive: true,
        },
        {
          title: 'Workshop SPMI',
          description: 'Workshop Sistem Penjaminan Mutu Internal',
          imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
          category: 'Workshop',
          albumId: album1.id,
          orderIndex: 2,
          isActive: true,
        },
        {
          title: 'Pelatihan Audit Internal',
          description: 'Pelatihan auditor internal',
          imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80',
          category: 'Pelatihan',
          albumId: album2.id,
          orderIndex: 3,
          isActive: true,
        },
        {
          title: 'Rapat Koordinasi BPM',
          description: 'Rapat koordinasi rutin tim BPM USNI',
          imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
          category: 'Rapat',
          orderIndex: 4,
          isActive: true,
        },
      ]
    });

    // ==================== ACCREDITATIONS ====================
    const accreditations = await db.accreditation.createMany({
      data: [
        {
          name: 'BAN-PT',
          category: 'B',
          count: 3,
          programs: JSON.stringify(['Akreditasi Institusi', 'Ilmu Komunikasi', 'Ilmu Hubungan Internasional']),
          color: '#10b981'
        },
        {
          name: 'BAN-PT',
          category: 'Baik',
          count: 2,
          programs: JSON.stringify(['Hukum', 'Manajemen']),
          color: '#f59e0b'
        },
        {
          name: 'BAN-PT',
          category: 'Baik Sekali',
          count: 2,
          programs: JSON.stringify(['Teknik Informatika', 'Sistem Informasi']),
          color: '#3b82f6'
        },
      ]
    });

    // ==================== ACCREDITATION DATA ====================
    const accreditationData = await db.accreditationData.createMany({
      data: [
        {
          title: 'Akreditasi Institusi Universitas Satya Negara Indonesia',
          description: 'Akreditasi institusi dari BAN-PT',
          category: 'nasional',
          accreditationBody: 'ban-pt',
          accreditationStatus: 'B',
          validUntil: new Date('2029-01-15'),
          published: true,
        },
        {
          title: 'Program Studi Teknik Informatika',
          description: 'Akreditasi program studi Teknik Informatika',
          category: 'nasional',
          accreditationBody: 'lam-infokom',
          accreditationStatus: 'Baik Sekali',
          validUntil: new Date('2028-09-30'),
          published: true,
        },
        {
          title: 'Program Studi Sistem Informasi',
          description: 'Akreditasi program studi Sistem Informasi',
          category: 'nasional',
          accreditationBody: 'lam-infokom',
          accreditationStatus: 'Baik Sekali',
          validUntil: new Date('2028-05-20'),
          published: true,
        },
        {
          title: 'Program Studi Teknik Sipil',
          description: 'Akreditasi program studi Teknik Sipil',
          category: 'nasional',
          accreditationBody: 'lam-teknik',
          accreditationStatus: 'Baik Sekali',
          validUntil: new Date('2028-12-28'),
          published: true,
        },
        {
          title: 'Program Studi Teknik Lingkungan',
          description: 'Akreditasi program studi Teknik Lingkungan',
          category: 'nasional',
          accreditationBody: 'lam-teknik',
          accreditationStatus: 'Baik Sekali',
          validUntil: new Date('2028-01-20'),
          published: true,
        },
        {
          title: 'Program Studi Ilmu Hukum',
          description: 'Akreditasi program studi Ilmu Hukum',
          category: 'nasional',
          accreditationBody: 'ban-pt',
          accreditationStatus: 'Baik',
          validUntil: new Date('2027-12-31'),
          published: true,
        },
        {
          title: 'Program Studi Manajemen',
          description: 'Akreditasi program studi Manajemen',
          category: 'nasional',
          accreditationBody: 'ban-pt',
          accreditationStatus: 'Baik',
          validUntil: new Date('2027-06-30'),
          published: true,
        },
        {
          title: 'Program Studi Ilmu Komunikasi',
          description: 'Akreditasi program studi Ilmu Komunikasi',
          category: 'nasional',
          accreditationBody: 'ban-pt',
          accreditationStatus: 'B',
          validUntil: new Date('2027-11-30'),
          published: true,
        },
        {
          title: 'Program Studi Ilmu Hubungan Internasional',
          description: 'Akreditasi program studi Ilmu Hubungan Internasional',
          category: 'nasional',
          accreditationBody: 'ban-pt',
          accreditationStatus: 'B',
          validUntil: new Date('2028-06-30'),
          published: true,
        },
      ]
    });

    // ==================== FACULTIES ====================
    const fakultasHukum = await db.faculty.create({
      data: {
        name: 'Fakultas Hukum',
        code: 'FH',
        description: 'Fakultas Hukum Universitas Suryakancana',
        deanName: 'Prof. Dr. H. Bambang Santoso, S.H., M.H.',
        orderIndex: 1,
        isActive: true,
      }
    });

    const fakultasEkonomi = await db.faculty.create({
      data: {
        name: 'Fakultas Ekonomi dan Bisnis',
        code: 'FEB',
        description: 'Fakultas Ekonomi dan Bisnis Universitas Suryakancana',
        deanName: 'Dr. H. Surya Dharma, M.M.',
        orderIndex: 2,
        isActive: true,
      }
    });

    const fakultasTeknik = await db.faculty.create({
      data: {
        name: 'Fakultas Teknik',
        code: 'FT',
        description: 'Fakultas Teknik Universitas Suryakancana',
        deanName: 'Ir. H. Bambang Suryanto, M.T.',
        orderIndex: 3,
        isActive: true,
      }
    });

    const fakultasFisip = await db.faculty.create({
      data: {
        name: 'Fakultas Ilmu Sosial dan Ilmu Politik',
        code: 'FISIP',
        description: 'Fakultas Ilmu Sosial dan Ilmu Politik Universitas Suryakancana',
        deanName: 'Dr. Hj. Ratna Dewi, M.Si.',
        orderIndex: 4,
        isActive: true,
      }
    });

    // ==================== STUDY PROGRAMS ====================
    const studyPrograms = await db.studyProgram.createMany({
      data: [
        { name: 'Ilmu Hukum', code: 'IH', facultyId: fakultasHukum.id, degreeLevel: 's1', accreditationStatus: 'Baik', accreditationBody: 'BAN-PT', orderIndex: 1, isActive: true },
        { name: 'Manajemen', code: 'MNJ', facultyId: fakultasEkonomi.id, degreeLevel: 's1', accreditationStatus: 'Baik', accreditationBody: 'BAN-PT', orderIndex: 2, isActive: true },
        { name: 'Akuntansi', code: 'AKT', facultyId: fakultasEkonomi.id, degreeLevel: 's1', accreditationStatus: 'Baik', accreditationBody: 'BAN-PT', orderIndex: 3, isActive: true },
        { name: 'Magister Manajemen', code: 'MM', facultyId: fakultasEkonomi.id, degreeLevel: 's2', accreditationStatus: 'Baik', accreditationBody: 'BAN-PT', orderIndex: 4, isActive: true },
        { name: 'Teknik Informatika', code: 'TI', facultyId: fakultasTeknik.id, degreeLevel: 's1', accreditationStatus: 'Baik Sekali', accreditationBody: 'LAM INFOKOM', orderIndex: 5, isActive: true },
        { name: 'Sistem Informasi', code: 'SI', facultyId: fakultasTeknik.id, degreeLevel: 's1', accreditationStatus: 'Baik Sekali', accreditationBody: 'LAM INFOKOM', orderIndex: 6, isActive: true },
        { name: 'Teknik Sipil', code: 'TS', facultyId: fakultasTeknik.id, degreeLevel: 's1', accreditationStatus: 'Baik Sekali', accreditationBody: 'LAM TEKNIK', orderIndex: 7, isActive: true },
        { name: 'Teknik Lingkungan', code: 'TL', facultyId: fakultasTeknik.id, degreeLevel: 's1', accreditationStatus: 'Baik Sekali', accreditationBody: 'LAM TEKNIK', orderIndex: 8, isActive: true },
        { name: 'Ilmu Komunikasi', code: 'IK', facultyId: fakultasFisip.id, degreeLevel: 's1', accreditationStatus: 'B', accreditationBody: 'BAN-PT', orderIndex: 9, isActive: true },
        { name: 'Ilmu Hubungan Internasional', code: 'IHI', facultyId: fakultasFisip.id, degreeLevel: 's1', accreditationStatus: 'B', accreditationBody: 'BAN-PT', orderIndex: 10, isActive: true },
      ]
    });

    // ==================== DOCUMENT CATEGORIES ====================
    const docCategory1 = await db.documentCategory.create({
      data: {
        name: 'Dokumen SPMI',
        slug: 'dokumen-spmi',
        description: 'Dokumen Sistem Penjaminan Mutu Internal',
        icon: 'file-text',
        orderIndex: 1,
        isActive: true,
      }
    });

    const docCategory2 = await db.documentCategory.create({
      data: {
        name: 'Dokumen Akreditasi',
        slug: 'dokumen-akreditasi',
        description: 'Dokumen terkait akreditasi program studi dan institusi',
        icon: 'award',
        orderIndex: 2,
        isActive: true,
      }
    });

    // ==================== DOCUMENTS ====================
    const documents = await db.document.createMany({
      data: [
        {
          title: 'Buku Pedoman SPMI',
          description: 'Pedoman Sistem Penjaminan Mutu Internal USNI',
          fileUrl: '/documents/pedoman-spmi.pdf',
          category: 'spmi',
          categoryId: docCategory1.id,
          published: true,
        },
        {
          title: 'Standar Mutu USNI',
          description: 'Dokumen standar mutu Universitas Suryakancana',
          fileUrl: '/documents/standar-mutu.pdf',
          category: 'spmi',
          categoryId: docCategory1.id,
          published: true,
        },
        {
          title: 'Kode Etik Civitas Akademika',
          description: 'Kode etik bagi seluruh civitas akademika USNI',
          fileUrl: '/documents/kode-etik.pdf',
          category: 'publik',
          published: true,
        },
      ]
    });

    // ==================== HOMEPAGE QUOTE ====================
    const homepageQuote = await db.homepageQuote.create({
      data: {
        quoteText: 'Menggenggam Mutu, Meningkatkan Daya Saing',
        authorName: 'Dr. Ir. Dwi Ernaningsih, M.Si.',
        authorTitle: 'Kepala Badan Penjaminan Mutu',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
        isActive: true,
      }
    });

    // ==================== STATIC PAGES (Layanan) ====================
    const staticPages = await db.staticPage.createMany({
      data: [
        {
          title: 'Audit Mutu Internal (AMI)',
          slug: 'ami',
          description: 'Pelaksanaan Audit Mutu Internal untuk menjamin kualitas pendidikan di USNI',
          content: `<h2>Tentang Audit Mutu Internal (AMI)</h2><p>Audit Mutu Internal (AMI) merupakan kegiatan evaluasi sistematis yang dilakukan oleh BPM USNI.</p>`,
          icon: 'clipboard-check',
          menuCategory: 'layanan',
          parentMenu: 'layanan',
          showInMenu: true,
          orderIndex: 1,
          published: true,
        },
        {
          title: 'Survey Kepuasan',
          slug: 'survey',
          description: 'Sistem survey kepuasan stakeholder untuk peningkatan mutu layanan USNI',
          content: `<h2>Survey Kepuasan Stakeholder</h2><p>BPM USNI secara berkala melaksanakan survey kepuasan.</p>`,
          icon: 'bar-chart',
          menuCategory: 'layanan',
          parentMenu: 'layanan',
          showInMenu: true,
          orderIndex: 2,
          published: true,
        },
        {
          title: 'Hibah & Pendanaan',
          slug: 'hibah',
          description: 'Informasi program hibah penelitian dan pengabdian masyarakat',
          content: `<h2>Hibah & Pendanaan Penelitian</h2><p>BPM USNI berperan dalam mendukung dan memonitor pelaksanaan hibah penelitian.</p>`,
          icon: 'gift',
          menuCategory: 'layanan',
          parentMenu: 'layanan',
          showInMenu: true,
          orderIndex: 3,
          published: true,
        },
        {
          title: 'PEKERTI/AA',
          slug: 'pekerti-aa',
          description: 'Program pelatihan pedagogik PEKERTI dan Applied Approach untuk dosen',
          content: `<h2>Program PEKERTI dan Applied Approach (AA)</h2><p>PEKERTI dan AA merupakan program pelatihan pedagogik bagi dosen.</p>`,
          icon: 'graduation-cap',
          menuCategory: 'layanan',
          parentMenu: 'layanan',
          showInMenu: true,
          orderIndex: 4,
          published: true,
        },
      ]
    });

    // ==================== CONTACT MESSAGES (Sample) ====================
    const contactMessages = await db.contactMessage.createMany({
      data: [
        {
          name: 'Ahmad Fadillah',
          email: 'ahmad.fadillah@email.com',
          subject: 'Pertanyaan tentang Akreditasi',
          message: 'Selamat siang, saya ingin menanyakan mengenai jadwal sosialisasi akreditasi untuk program studi baru. Terima kasih.',
          isRead: false,
        },
        {
          name: 'Siti Rahayu',
          email: 'siti.rahayu@email.com',
          subject: 'Permohonan Dokumen SPMI',
          message: 'Mohon informasi mengenai cara mendapatkan dokumen pedoman SPMI terbaru.',
          isRead: true,
        },
      ]
    });

    return NextResponse.json({ 
      success: true,
      message: 'Database seeded successfully!',
      data: {
        websiteIdentity: !!websiteIdentity,
        visionMission: !!visionMission,
        organizationStructures: organizationStructures.count,
        statistics: statistics.count,
        menuItems: menuItems.count,
        quickLinks: quickLinks.count,
        slideshows: slideshows.count,
        news: newsData.count,
        announcements: announcements.count,
        albums: 2,
        galleryImages: galleryImages.count,
        accreditations: accreditations.count,
        faculties: 4,
        studyPrograms: studyPrograms.count,
        documents: documents.count,
        homepageQuote: !!homepageQuote,
        staticPages: staticPages.count,
        contactMessages: contactMessages.count,
      }
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to seed database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
