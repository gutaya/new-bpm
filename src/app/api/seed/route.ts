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
        siteDescription: 'Badan Penjaminan Mutu Universitas Satya Negara Indonesia - Menggenggam Mutu, Meningkatkan Daya Saing',
        contactEmail: 'bpm@usni.ac.id',
        contactPhone: '(021) 789-1234',
        contactAddress: 'Jl. Raya Bogor Km. 30, Cirendeu, Cimanggis, Depok, Jawa Barat 16953',
        operationalHours: 'Senin - Jumat: 08.00 - 16.00 WIB',
        googleMapsUrl: 'https://maps.google.com/?q=-6.3756,106.8369',
        facebookUrl: 'https://facebook.com/bpmusni',
        instagramUrl: 'https://instagram.com/bpmusni',
        twitterUrl: 'https://twitter.com/bpmusni',
        youtubeUrl: 'https://youtube.com/bpmusni',
        linkedinUrl: 'https://linkedin.com/company/bpmusni',
        footerText: '© 2025 BPM USNI. Universitas Satya Negara Indonesia. All rights reserved.',
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
        { icon: 'award', value: '10', label: 'Program Studi Terakreditasi', orderIndex: 1 },
        { icon: 'building-2', value: '4', label: 'Fakultas', orderIndex: 2 },
        { icon: 'file-check', value: '50+', label: 'Dokumen Standar', orderIndex: 3 },
        { icon: 'users', value: '25+', label: 'Auditor Internal', orderIndex: 4 },
      ]
    });

    // ==================== MENU ITEMS ====================
    // Parent Menus
    const menuBeranda = await db.menuItem.create({
      data: { title: 'Beranda', url: '/', orderIndex: 1, isActive: true }
    });

    const menuProfil = await db.menuItem.create({
      data: { title: 'Profil', url: '#profil', orderIndex: 2, isActive: true }
    });

    const menuDokumen = await db.menuItem.create({
      data: { title: 'Dokumen', url: '/dokumen', orderIndex: 3, isActive: true }
    });

    const menuAkreditasi = await db.menuItem.create({
      data: { title: 'Akreditasi', url: '/akreditasi', orderIndex: 4, isActive: true }
    });

    const menuLayanan = await db.menuItem.create({
      data: { title: 'Layanan', url: '/layanan', orderIndex: 5, isActive: true }
    });

    const menuPusatData = await db.menuItem.create({
      data: { title: 'Pusat Data', url: '/pusat-data', orderIndex: 6, isActive: true }
    });

    const menuGaleri = await db.menuItem.create({
      data: { title: 'Galeri', url: '/galeri', orderIndex: 7, isActive: true }
    });

    const menuHubungiKami = await db.menuItem.create({
      data: { title: 'Hubungi Kami', url: '/hubungi-kami', orderIndex: 8, isActive: true }
    });

    // Submenus for Profil
    await db.menuItem.createMany({
      data: [
        { title: 'Tentang Kami', url: '/tentang-kami', parentId: menuProfil.id, orderIndex: 1, isActive: true },
        { title: 'Visi dan Misi', url: '/visi-misi', parentId: menuProfil.id, orderIndex: 2, isActive: true },
        { title: 'Struktur Organisasi', url: '/struktur-organisasi', parentId: menuProfil.id, orderIndex: 3, isActive: true },
      ]
    });

    // Submenus for Dokumen
    await db.menuItem.createMany({
      data: [
        { title: 'Dokumen Publik', url: '/dokumen/publik', parentId: menuDokumen.id, orderIndex: 1, isActive: true },
        { title: 'Dokumen Universitas', url: '/dokumen/universitas', parentId: menuDokumen.id, orderIndex: 2, isActive: true },
        { title: 'Dokumen Akreditasi', url: '/dokumen/akreditasi', parentId: menuDokumen.id, orderIndex: 3, isActive: true },
        { title: 'Dokumen Eksternal', url: '/dokumen/eksternal', parentId: menuDokumen.id, orderIndex: 4, isActive: true },
        { title: 'Dokumen BPM', url: '/dokumen/bpm', parentId: menuDokumen.id, orderIndex: 5, isActive: true },
        { title: 'Dokumen SPMI', url: '/dokumen/spmi', parentId: menuDokumen.id, orderIndex: 6, isActive: true },
        { title: 'Dokumen SOP', url: '/dokumen/sop', parentId: menuDokumen.id, orderIndex: 7, isActive: true },
        { title: 'SK Rektor', url: '/dokumen/sk-rektor', parentId: menuDokumen.id, orderIndex: 8, isActive: true },
      ]
    });

    // Submenus for Akreditasi
    await db.menuItem.createMany({
      data: [
        { title: 'Akreditasi Nasional', url: '/akreditasi/nasional', parentId: menuAkreditasi.id, orderIndex: 1, isActive: true },
        { title: 'Akreditasi Internasional', url: '/akreditasi/internasional', parentId: menuAkreditasi.id, orderIndex: 2, isActive: true },
        { title: 'Akreditasi Institusi', url: '/akreditasi/institusi', parentId: menuAkreditasi.id, orderIndex: 3, isActive: true },
      ]
    });

    // Submenus for Layanan
    await db.menuItem.createMany({
      data: [
        { title: 'Audit Mutu Internal (AMI)', url: '/layanan/ami', parentId: menuLayanan.id, orderIndex: 1, isActive: true },
        { title: 'Survey', url: '/layanan/survey', parentId: menuLayanan.id, orderIndex: 2, isActive: true },
        { title: 'Hibah', url: '/layanan/hibah', parentId: menuLayanan.id, orderIndex: 3, isActive: true },
        { title: 'PEKERTI/AA', url: '/layanan/pekerti-aa', parentId: menuLayanan.id, orderIndex: 4, isActive: true },
        { title: 'Jabatan Fungsional', url: '/layanan/jafung', parentId: menuLayanan.id, orderIndex: 5, isActive: true },
      ]
    });

    // ==================== QUICK LINKS ====================
    const quickLinks = await db.quickLink.createMany({
      data: [
        { title: 'Website USNI', url: 'https://usni.ac.id', icon: 'globe', orderIndex: 1, isActive: true },
        { title: 'Portal Dosen', url: 'https://dosen.usni.ac.id', icon: 'user', orderIndex: 2, isActive: true },
        { title: 'Portal Mahasiswa', url: 'https://mahasiswa.usni.ac.id', icon: 'graduation-cap', orderIndex: 3, isActive: true },
        { title: 'E-Learning', url: 'https://lms.usni.ac.id', icon: 'book-open', orderIndex: 4, isActive: true },
        { title: 'Perpustakaan Digital', url: 'https://lib.usni.ac.id', icon: 'library', orderIndex: 5, isActive: true },
        { title: 'Rumah Jurnal', url: 'https://jurnal.usni.ac.id', icon: 'file-text', orderIndex: 6, isActive: true },
        { title: 'Tracer Study', url: 'https://tracer.usni.ac.id', icon: 'target', orderIndex: 7, isActive: true },
        { title: 'PDDIKTI', url: 'https://pddikti.kemdiktisaintek.go.id', icon: 'database', orderIndex: 8, isActive: true },
        { title: 'SPMI Ditjen Dikti', url: 'https://spmi.kemdiktisaintek.go.id', icon: 'shield-check', orderIndex: 9, isActive: true },
      ]
    });

    // ==================== SLIDESHOW ====================
    const slideshows = await db.slideshow.createMany({
      data: [
        {
          title: 'Selamat Datang di BPM USNI',
          subtitle: 'Badan Penjaminan Mutu Universitas Satya Negara Indonesia',
          imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80',
          linkUrl: '/profil',
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
          title: 'Workshop SPMI 2025',
          subtitle: 'Meningkatkan budaya mutu bersama',
          imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80',
          linkUrl: '/berita',
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
          excerpt: 'BPM USNI menyelenggarakan workshop penyusunan dokumen akreditasi program studi yang diikuti oleh seluruh koordinator prodi.',
          content: `<p>BPM USNI menyelenggarakan workshop penyusunan dokumen akreditasi program studi yang diikuti oleh seluruh koordinator prodi dari 4 fakultas. Workshop ini bertujuan untuk meningkatkan pemahaman dan keterampilan dalam menyusun dokumen akreditasi yang sesuai standar BAN-PT dan LAM.</p>
          <p>Acara berlangsung selama 2 hari dengan menghadirkan narasumber ahli akreditasi dari berbagai perguruan tinggi terkemuka.</p>`,
          imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
          published: true,
          publishedAt: new Date(),
          viewCount: 250,
        },
        {
          title: 'Pelatihan Auditor Internal SPMI Angkatan ke-5',
          slug: 'pelatihan-auditor-internal-spmi-angkatan-5',
          excerpt: 'BPM USNI mengadakan pelatihan auditor internal SPMI angkatan ke-5 yang diikuti oleh 25 peserta dari berbagai unit kerja.',
          content: `<p>BPM USNI mengadakan pelatihan auditor internal SPMI angkatan ke-5 yang diikuti oleh 25 peserta dari berbagai unit kerja di lingkungan USNI.</p>
          <p>Pelatihan ini bertujuan untuk meningkatkan kompetensi auditor internal dalam melaksanakan audit mutu internal sesuai dengan standar yang berlaku.</p>`,
          imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80',
          published: true,
          publishedAt: new Date(Date.now() - 86400000 * 2),
          viewCount: 180,
        },
        {
          title: 'Kunjungan Benchmarking ke Universitas Terkemuka',
          slug: 'kunjungan-benchmarking-universitas',
          excerpt: 'Tim BPM USNI melakukan kunjungan benchmarking ke universitas terkemuka untuk mempelajari best practice dalam implementasi SPMI.',
          content: `<p>Tim BPM USNI melakukan kunjungan benchmarking ke universitas terkemuka untuk mempelajari best practice dalam implementasi SPMI. Kunjungan ini merupakan bagian dari upaya peningkatan kualitas sistem penjaminan mutu internal.</p>`,
          imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
          published: true,
          publishedAt: new Date(Date.now() - 86400000 * 5),
          viewCount: 145,
        },
        {
          title: 'Sosialisasi Standar Nasional Pendidikan Tinggi',
          slug: 'sosialisasi-standar-nasional-pendidikan-tinggi',
          excerpt: 'BPM USNI mengadakan sosialisasi SN-Dikti kepada seluruh pimpinan prodi dan fakultas.',
          content: `<p>BPM USNI mengadakan sosialisasi Standar Nasional Pendidikan Tinggi (SN-Dikti) kepada seluruh pimpinan program studi dan fakultas. Kegiatan ini bertujuan untuk memastikan pemahaman yang sama tentang standar yang harus dipenuhi.</p>`,
          imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
          published: true,
          publishedAt: new Date(Date.now() - 86400000 * 7),
          viewCount: 120,
        },
        {
          title: 'Program Studi Teknik Informatika Raih Akreditasi Unggul',
          slug: 'teknik-informatika-akreditasi-unggul',
          excerpt: 'Program Studi Teknik Informatika berhasil meraih akreditasi Unggul dari LAM Infokom.',
          content: `<p>Program Studi Teknik Informatika Fakultas Teknik berhasil meraih akreditasi Unggul dari LAM Infokom. Pencapaian ini merupakan hasil dari kerja keras seluruh civitas akademika dalam meningkatkan mutu pendidikan.</p>`,
          imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
          published: true,
          publishedAt: new Date(Date.now() - 86400000 * 10),
          viewCount: 320,
        },
      ]
    });

    // ==================== ANNOUNCEMENTS ====================
    const announcements = await db.announcement.createMany({
      data: [
        {
          title: 'Hasil Akreditasi Institusi USNI Terakreditasi B',
          content: `<p>Universitas Satya Negara Indonesia berhasil mempertahankan akreditasi institusi dengan peringkat B dari BAN-PT. Akreditasi ini berlaku hingga tahun 2029.</p>`,
          priority: 'high',
          published: true,
          publishedAt: new Date(),
          viewCount: 350,
        },
        {
          title: 'Jadwal Audit Internal Semester Genap 2024/2025',
          content: `<p>BPM USNI mengumumkan jadwal pelaksanaan audit internal semester genap tahun akademik 2024/2025. Audit akan dilaksanakan mulai tanggal 15-30 April 2025.</p>`,
          priority: 'normal',
          published: true,
          publishedAt: new Date(Date.now() - 86400000 * 3),
          viewCount: 210,
        },
        {
          title: 'Pendaftaran Pelatihan Auditor Internal Angkatan VI',
          content: `<p>BPM USNI membuka pendaftaran pelatihan auditor internal SPMI angkatan ke-6. Pendaftaran dibuka hingga 31 Maret 2025.</p>`,
          priority: 'normal',
          published: true,
          publishedAt: new Date(Date.now() - 86400000 * 5),
          viewCount: 175,
        },
        {
          title: 'Pengumpulan Laporan Kinerja Program Studi',
          content: `<p>Kepada seluruh Koordinator Program Studi diharapkan untuk mengumpulkan laporan kinerja program studi semester genap 2024/2025 paling lambat tanggal 15 Mei 2025.</p>`,
          priority: 'urgent',
          published: true,
          publishedAt: new Date(Date.now() - 86400000 * 7),
          viewCount: 140,
        },
      ]
    });

    // ==================== ALBUMS & GALLERY ====================
    const album1 = await db.album.create({
      data: {
        title: 'Kegiatan SPMI 2025',
        description: 'Dokumentasi kegiatan Sistem Penjaminan Mutu Internal tahun 2025',
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

    const album3 = await db.album.create({
      data: {
        title: 'Akreditasi Program Studi',
        description: 'Dokumentasi kegiatan akreditasi program studi',
        coverImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
        orderIndex: 3,
        isActive: true,
      }
    });

    const galleryImages = await db.galleryImage.createMany({
      data: [
        {
          title: 'Kegiatan Benchmarking BPM USNI',
          description: 'Kegiatan benchmarking BPM USNI ke universitas terkemuka',
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
          description: 'Pelatihan auditor internal SPMI',
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
        {
          title: 'Wisuda USNI 2025',
          description: 'Wisuda Universitas Satya Negara Indonesia periode I 2025',
          imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
          category: 'Wisuda',
          albumId: album3.id,
          orderIndex: 5,
          isActive: true,
        },
      ]
    });

    // ==================== FACULTIES ====================
    // Fakultas Teknik
    const fakultasTeknik = await db.faculty.create({
      data: {
        name: 'Fakultas Teknik',
        code: 'FT',
        description: 'Fakultas Teknik Universitas Satya Negara Indonesia',
        deanName: 'Ir. Bambang Suryanto, M.T.',
        orderIndex: 1,
        isActive: true,
      }
    });

    // Fakultas Ekonomi dan Bisnis
    const fakultasEkonomi = await db.faculty.create({
      data: {
        name: 'Fakultas Ekonomi dan Bisnis',
        code: 'FEB',
        description: 'Fakultas Ekonomi dan Bisnis Universitas Satya Negara Indonesia',
        deanName: 'Dr. H. Surya Dharma, M.M.',
        orderIndex: 2,
        isActive: true,
      }
    });

    // Fakultas Perikanan dan Ilmu Kelautan
    const fakultasPerikanan = await db.faculty.create({
      data: {
        name: 'Fakultas Perikanan dan Ilmu Kelautan',
        code: 'FPIK',
        description: 'Fakultas Perikanan dan Ilmu Kelautan Universitas Satya Negara Indonesia',
        deanName: 'Dr. Ir. Ahmad Hidayat, M.Si.',
        orderIndex: 3,
        isActive: true,
      }
    });

    // Fakultas Ilmu Sosial dan Ilmu Politik
    const fakultasFisip = await db.faculty.create({
      data: {
        name: 'Fakultas Ilmu Sosial dan Ilmu Politik',
        code: 'FISIP',
        description: 'Fakultas Ilmu Sosial dan Ilmu Politik Universitas Satya Negara Indonesia',
        deanName: 'Dr. Hj. Ratna Dewi, M.Si.',
        orderIndex: 4,
        isActive: true,
      }
    });

    // ==================== STUDY PROGRAMS ====================
    // Fakultas Teknik
    const prodiTeknikInformatika = await db.studyProgram.create({
      data: {
        name: 'Teknik Informatika',
        code: 'TI',
        facultyId: fakultasTeknik.id,
        degreeLevel: 's1',
        description: 'Program Studi Teknik Informatika fokus pada pengembangan perangkat lunak, sistem informasi, dan teknologi informasi.',
        headName: 'Dr. Rudi Hartono, S.Kom., M.Kom.',
        accreditationStatus: 'Unggul',
        accreditationBody: 'LAM Infokom',
        orderIndex: 1,
        isActive: true,
      }
    });

    const prodiTeknikLingkungan = await db.studyProgram.create({
      data: {
        name: 'Teknik Lingkungan',
        code: 'TL',
        facultyId: fakultasTeknik.id,
        degreeLevel: 's1',
        description: 'Program Studi Teknik Lingkungan fokus pada pengelolaan lingkungan dan teknologi pengendalian pencemaran.',
        headName: 'Ir. Sri Wahyuni, M.T.',
        accreditationStatus: 'Baik Sekali',
        accreditationBody: 'LAM Teknik',
        orderIndex: 2,
        isActive: true,
      }
    });

    const prodiSistemInformasi = await db.studyProgram.create({
      data: {
        name: 'Sistem Informasi',
        code: 'SI',
        facultyId: fakultasTeknik.id,
        degreeLevel: 's1',
        description: 'Program Studi Sistem Informasi fokus pada pengembangan dan pengelolaan sistem informasi organisasi.',
        headName: 'Hendra Wijaya, S.Kom., M.Kom.',
        accreditationStatus: 'Baik Sekali',
        accreditationBody: 'LAM Infokom',
        orderIndex: 3,
        isActive: true,
      }
    });

    // Fakultas Ekonomi dan Bisnis
    const prodiManajemen = await db.studyProgram.create({
      data: {
        name: 'Manajemen',
        code: 'MNJ',
        facultyId: fakultasEkonomi.id,
        degreeLevel: 's1',
        description: 'Program Studi Manajemen fokus pada pengelolaan organisasi bisnis dan kewirausahaan.',
        headName: 'Dr. H. Budi Santoso, M.M.',
        accreditationStatus: 'Baik',
        accreditationBody: 'BAN-PT',
        orderIndex: 4,
        isActive: true,
      }
    });

    const prodiAkuntansi = await db.studyProgram.create({
      data: {
        name: 'Akuntansi',
        code: 'AKT',
        facultyId: fakultasEkonomi.id,
        degreeLevel: 's1',
        description: 'Program Studi Akuntansi fokus pada akuntansi keuangan, perpajakan, dan auditing.',
        headName: 'Dra. Lilis Suryani, M.Si.',
        accreditationStatus: 'Baik',
        accreditationBody: 'BAN-PT',
        orderIndex: 5,
        isActive: true,
      }
    });

    const prodiMagisterManajemen = await db.studyProgram.create({
      data: {
        name: 'Magister Manajemen',
        code: 'MM',
        facultyId: fakultasEkonomi.id,
        degreeLevel: 's2',
        description: 'Program Magister Manajemen fokus pada strategi bisnis dan manajemen lanjutan.',
        headName: 'Prof. Dr. H. Ahmad Fauzi, M.Pd.',
        accreditationStatus: 'Baik',
        accreditationBody: 'BAN-PT',
        orderIndex: 6,
        isActive: true,
      }
    });

    // Fakultas Perikanan dan Ilmu Kelautan
    const prodiPSP = await db.studyProgram.create({
      data: {
        name: 'Pemanfaatan Sumberdaya Perikanan',
        code: 'PSP',
        facultyId: fakultasPerikanan.id,
        degreeLevel: 's1',
        description: 'Program Studi Pemanfaatan Sumberdaya Perikanan fokus pada pengelolaan dan pemanfaatan sumber daya perikanan berkelanjutan.',
        headName: 'Dr. Ir. Agus Setiawan, M.Si.',
        accreditationStatus: 'Baik',
        accreditationBody: 'BAN-PT',
        orderIndex: 7,
        isActive: true,
      }
    });

    // Fakultas Ilmu Sosial dan Ilmu Politik
    const prodiHI = await db.studyProgram.create({
      data: {
        name: 'Ilmu Hubungan Internasional',
        code: 'IHI',
        facultyId: fakultasFisip.id,
        degreeLevel: 's1',
        description: 'Program Studi Ilmu Hubungan Internasional fokus pada diplomasi, politik global, dan kerjasama internasional.',
        headName: 'Dr. Hj. Ratna Dewi, M.Si.',
        accreditationStatus: 'B',
        accreditationBody: 'BAN-PT',
        orderIndex: 8,
        isActive: true,
      }
    });

    const prodiIlmuKomunikasi = await db.studyProgram.create({
      data: {
        name: 'Ilmu Komunikasi',
        code: 'IK',
        facultyId: fakultasFisip.id,
        degreeLevel: 's1',
        description: 'Program Studi Ilmu Komunikasi fokus pada media, komunikasi massa, dan komunikasi strategis.',
        headName: 'Dra. Siti Nurhaliza, M.M.',
        accreditationStatus: 'B',
        accreditationBody: 'BAN-PT',
        orderIndex: 9,
        isActive: true,
      }
    });

    const prodiHukum = await db.studyProgram.create({
      data: {
        name: 'Hukum',
        code: 'HKM',
        facultyId: fakultasFisip.id,
        degreeLevel: 's1',
        description: 'Program Studi Ilmu Hukum fokus pada hukum positif Indonesia dan praktik hukum.',
        headName: 'Prof. Dr. H. Bambang Santoso, S.H., M.H.',
        accreditationStatus: 'Baik',
        accreditationBody: 'BAN-PT',
        orderIndex: 10,
        isActive: true,
      }
    });

    // ==================== ACCREDITATION DATA ====================
    const accreditationData = await db.accreditationData.createMany({
      data: [
        // Akreditasi Institusi
        {
          title: 'Akreditasi Institusi Universitas Satya Negara Indonesia',
          description: 'Akreditasi institusi dari BAN-PT untuk seluruh perguruan tinggi',
          category: 'nasional',
          accreditationBody: 'ban-pt',
          accreditationStatus: 'B',
          validUntil: new Date('2029-01-15'),
          certificateUrl: 'https://example.com/sertifikat/institusi.pdf',
          published: true,
        },
        // Fakultas Teknik
        {
          title: 'Program Studi Teknik Informatika',
          description: 'Program Studi Teknik Informatika - S1',
          category: 'nasional',
          studyProgramId: prodiTeknikInformatika.id,
          accreditationBody: 'lam-infokom',
          accreditationStatus: 'Unggul',
          validUntil: new Date('2029-09-30'),
          imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
          certificateUrl: 'https://example.com/sertifikat/ti.pdf',
          published: true,
        },
        {
          title: 'Program Studi Teknik Lingkungan',
          description: 'Program Studi Teknik Lingkungan - S1',
          category: 'nasional',
          studyProgramId: prodiTeknikLingkungan.id,
          accreditationBody: 'lam-teknik',
          accreditationStatus: 'Baik Sekali',
          validUntil: new Date('2028-06-20'),
          certificateUrl: 'https://example.com/sertifikat/tl.pdf',
          published: true,
        },
        {
          title: 'Program Studi Sistem Informasi',
          description: 'Program Studi Sistem Informasi - S1',
          category: 'nasional',
          studyProgramId: prodiSistemInformasi.id,
          accreditationBody: 'lam-infokom',
          accreditationStatus: 'Baik Sekali',
          validUntil: new Date('2028-11-15'),
          certificateUrl: 'https://example.com/sertifikat/si.pdf',
          published: true,
        },
        // Fakultas Ekonomi dan Bisnis
        {
          title: 'Program Studi Manajemen',
          description: 'Program Studi Manajemen - S1',
          category: 'nasional',
          studyProgramId: prodiManajemen.id,
          accreditationBody: 'ban-pt',
          accreditationStatus: 'Baik',
          validUntil: new Date('2027-08-31'),
          certificateUrl: 'https://example.com/sertifikat/manajemen.pdf',
          published: true,
        },
        {
          title: 'Program Studi Akuntansi',
          description: 'Program Studi Akuntansi - S1',
          category: 'nasional',
          studyProgramId: prodiAkuntansi.id,
          accreditationBody: 'ban-pt',
          accreditationStatus: 'Baik',
          validUntil: new Date('2027-12-31'),
          certificateUrl: 'https://example.com/sertifikat/akuntansi.pdf',
          published: true,
        },
        {
          title: 'Program Studi Magister Manajemen',
          description: 'Program Studi Magister Manajemen - S2',
          category: 'nasional',
          studyProgramId: prodiMagisterManajemen.id,
          accreditationBody: 'ban-pt',
          accreditationStatus: 'Baik',
          validUntil: new Date('2028-03-15'),
          certificateUrl: 'https://example.com/sertifikat/mm.pdf',
          published: true,
        },
        // Fakultas Perikanan
        {
          title: 'Program Studi Pemanfaatan Sumberdaya Perikanan',
          description: 'Program Studi Pemanfaatan Sumberdaya Perikanan - S1',
          category: 'nasional',
          studyProgramId: prodiPSP.id,
          accreditationBody: 'ban-pt',
          accreditationStatus: 'Baik',
          validUntil: new Date('2027-06-30'),
          certificateUrl: 'https://example.com/sertifikat/psp.pdf',
          published: true,
        },
        // Fakultas FISIP
        {
          title: 'Program Studi Ilmu Hubungan Internasional',
          description: 'Program Studi Ilmu Hubungan Internasional - S1',
          category: 'nasional',
          studyProgramId: prodiHI.id,
          accreditationBody: 'ban-pt',
          accreditationStatus: 'B',
          validUntil: new Date('2028-02-28'),
          certificateUrl: 'https://example.com/sertifikat/hi.pdf',
          published: true,
        },
        {
          title: 'Program Studi Ilmu Komunikasi',
          description: 'Program Studi Ilmu Komunikasi - S1',
          category: 'nasional',
          studyProgramId: prodiIlmuKomunikasi.id,
          accreditationBody: 'ban-pt',
          accreditationStatus: 'B',
          validUntil: new Date('2027-11-30'),
          certificateUrl: 'https://example.com/sertifikat/komunikasi.pdf',
          published: true,
        },
        {
          title: 'Program Studi Ilmu Hukum',
          description: 'Program Studi Ilmu Hukum - S1',
          category: 'nasional',
          studyProgramId: prodiHukum.id,
          accreditationBody: 'ban-pt',
          accreditationStatus: 'Baik',
          validUntil: new Date('2028-07-31'),
          certificateUrl: 'https://example.com/sertifikat/hukum.pdf',
          published: true,
        },
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

    const docCategory3 = await db.documentCategory.create({
      data: {
        name: 'Dokumen Publik',
        slug: 'dokumen-publik',
        description: 'Dokumen publik untuk umum',
        icon: 'globe',
        orderIndex: 3,
        isActive: true,
      }
    });

    const docCategory4 = await db.documentCategory.create({
      data: {
        name: 'SK Rektor',
        slug: 'sk-rektor',
        description: 'Surat Keputusan Rektor',
        icon: 'file-signature',
        orderIndex: 4,
        isActive: true,
      }
    });

    const docCategory5 = await db.documentCategory.create({
      data: {
        name: 'Dokumen SOP',
        slug: 'dokumen-sop',
        description: 'Standar Operasional Prosedur',
        icon: 'clipboard-list',
        orderIndex: 5,
        isActive: true,
      }
    });

    // ==================== DOCUMENTS ====================
    const documents = await db.document.createMany({
      data: [
        {
          title: 'Buku Pedoman SPMI 2025',
          description: 'Pedoman Sistem Penjaminan Mutu Internal USNI edisi terbaru tahun 2025',
          fileUrl: 'https://kyqmzcoxgsdwlyxmhcoa.supabase.co/storage/v1/object/public/documents/1770608480725-aneqep.pdf',
          categoryId: docCategory1.id,
          published: true,
        },
        {
          title: 'Standar Mutu USNI',
          description: 'Dokumen standar mutu Universitas Satya Negara Indonesia',
          fileUrl: 'https://example.com/documents/standar-mutu.pdf',
          categoryId: docCategory1.id,
          published: true,
        },
        {
          title: 'Kode Etik Civitas Akademika',
          description: 'Kode etik bagi seluruh civitas akademika USNI',
          fileUrl: 'https://example.com/documents/kode-etik.pdf',
          categoryId: docCategory3.id,
          published: true,
        },
        {
          title: 'SK Rektor Tentang BPM',
          description: 'Surat Keputusan Rektor tentang Badan Penjaminan Mutu',
          fileUrl: 'https://kyqmzcoxgsdwlyxmhcoa.supabase.co/storage/v1/object/public/documents/1770608480725-aneqep.pdf',
          categoryId: docCategory4.id,
          published: true,
        },
        {
          title: 'SOP Audit Mutu Internal',
          description: 'Prosedur operasional standar pelaksanaan audit mutu internal',
          fileUrl: 'https://example.com/documents/sop-ami.pdf',
          categoryId: docCategory5.id,
          published: true,
        },
        {
          title: 'SOP Pengelolaan Dokumen',
          description: 'Prosedur operasional standar pengelolaan dokumen akreditasi',
          fileUrl: 'https://example.com/documents/sop-dokumen.pdf',
          categoryId: docCategory5.id,
          published: true,
        },
        {
          title: 'Standar Pelayanan Minimal',
          description: 'Dokumen standar pelayanan minimal BPM USNI',
          fileUrl: 'https://example.com/documents/spm.pdf',
          categoryId: docCategory3.id,
          published: true,
        },
        {
          title: 'Pedoman Akademik 2025',
          description: 'Buku pedoman akademik untuk mahasiswa dan dosen tahun akademik 2024/2025',
          fileUrl: 'https://example.com/documents/pedoman-akademik.pdf',
          categoryId: docCategory3.id,
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

    // ==================== STATIC PAGES (Content Pages) ====================
    // Note: Menu structure is managed via Kelola Menu (MenuItem table)
    // Static pages are for content only, not for menu structure
    // IMPORTANT: Slug must match the URL in Kelola Menu (e.g., /layanan/ami -> slug: 'ami')
    const staticPages = await db.staticPage.createMany({
      data: [
        {
          title: 'Audit Mutu Internal (AMI)',
          slug: 'ami', // Must match menu URL: /layanan/ami
          description: 'Pelaksanaan Audit Mutu Internal untuk menjamin kualitas pendidikan di USNI',
          content: `<h2>Tentang Audit Mutu Internal (AMI)</h2>
          <p>Audit Mutu Internal (AMI) merupakan kegiatan evaluasi sistematis yang dilakukan oleh BPM USNI untuk memastikan bahwa seluruh unit kerja telah melaksanakan kegiatan sesuai dengan standar yang ditetapkan.</p>
          <h3>Tujuan AMI</h3>
          <ul>
            <li>Memastikan ketaatan terhadap standar mutu</li>
            <li>Mengidentifikasi peluang perbaikan</li>
            <li>Meningkatkan efektivitas sistem penjaminan mutu</li>
          </ul>`,
          icon: 'clipboard-check',
          menuCategory: 'layanan',
          parentMenu: null,
          showInMenu: false,
          orderIndex: 1,
          published: true,
        },
        {
          title: 'Survey Kepuasan',
          slug: 'survey', // Must match menu URL: /layanan/survey
          description: 'Sistem survey kepuasan stakeholder untuk peningkatan mutu layanan USNI',
          content: `<h2>Survey Kepuasan Stakeholder</h2>
          <p>BPM USNI secara berkala melaksanakan survey kepuasan kepada seluruh stakeholder untuk mendapatkan masukan dan umpan balik dalam peningkatan mutu layanan.</p>
          <h3>Jenis Survey</h3>
          <ul>
            <li>Survey Kepuasan Mahasiswa</li>
            <li>Survey Kepuasan Dosen</li>
            <li>Survey Kepuasan Tenaga Kependidikan</li>
            <li>Survey Kepuasan Pengguna Lulusan</li>
          </ul>`,
          icon: 'bar-chart',
          menuCategory: 'layanan',
          parentMenu: null,
          showInMenu: false,
          orderIndex: 2,
          published: true,
        },
        {
          title: 'Hibah',
          slug: 'hibah', // Must match menu URL: /layanan/hibah
          description: 'Informasi program hibah penelitian dan pengabdian masyarakat',
          content: `<h2>Hibah & Pendanaan Penelitian</h2>
          <p>BPM USNI berperan dalam mendukung dan memonitor pelaksanaan hibah penelitian dan pengabdian masyarakat dari berbagai sumber pendanaan.</p>`,
          icon: 'gift',
          menuCategory: 'layanan',
          parentMenu: null,
          showInMenu: false,
          orderIndex: 3,
          published: true,
        },
        {
          title: 'PEKERTI/AA',
          slug: 'pekerti-aa', // Must match menu URL: /layanan/pekerti-aa
          description: 'Program pelatihan pedagogik PEKERTI dan Applied Approach untuk dosen',
          content: `<h2>Program PEKERTI dan Applied Approach (AA)</h2>
          <p>PEKERTI dan AA merupakan program pelatihan pedagogik bagi dosen yang wajib diikuti sebagai syarat untuk memiliki sertifikasi dosen.</p>`,
          icon: 'graduation-cap',
          menuCategory: 'layanan',
          parentMenu: null,
          showInMenu: false,
          orderIndex: 4,
          published: true,
        },
        {
          title: 'Jabatan Fungsional',
          slug: 'jafung', // Must match menu URL: /layanan/jafung
          description: 'Informasi dan layanan pengurusan jabatan fungsional dosen',
          content: `<h2>Jabatan Fungsional Dosen</h2>
          <p>BPM USNI menyediakan layanan informasi dan pendampingan terkait pengurusan jabatan fungsional dosen, meliputi:</p>
          <h3>Jenis Jabatan Fungsional</h3>
          <ul>
            <li>Asisten Ahli</li>
            <li>Lektor</li>
            <li>Lektor Kepala</li>
            <li>Profesor</li>
          </ul>
          <h3>Persyaratan Umum</h3>
          <ul>
            <li>Pendidikan sesuai jenjang jabatan</li>
            <li>Sertifikasi Dosen (PEKERTI/AA)</li>
            <li>Karya ilmiah dan pengabdian masyarakat</li>
            <li>Pengalaman mengajar</li>
          </ul>`,
          icon: 'briefcase',
          menuCategory: 'layanan',
          parentMenu: null,
          showInMenu: false,
          orderIndex: 5,
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
        {
          name: 'Budi Santoso',
          email: 'budi.santoso@email.com',
          subject: 'Pendaftaran Auditor Internal',
          message: 'Saya ingin mendaftar sebagai peserta pelatihan auditor internal angkatan berikutnya. Mohon informasi mengenai persyaratan dan jadwal pelaksanaan.',
          isRead: false,
        },
      ]
    });

    // ==================== ACCREDITATION CATEGORIES ====================
    const accCategories = await db.accreditationCategory.createMany({
      data: [
        {
          name: 'Akreditasi BAN-PT',
          slug: 'ban-pt',
          description: 'Akreditasi dari Badan Akreditasi Nasional Perguruan Tinggi',
          icon: 'award',
          orderIndex: 1,
          isActive: true,
        },
        {
          name: 'Akreditasi LAM Teknik',
          slug: 'lam-teknik',
          description: 'Akreditasi dari Lembaga Akreditasi Mandiri Teknik',
          icon: 'settings',
          orderIndex: 2,
          isActive: true,
        },
        {
          name: 'Akreditasi LAM Infokom',
          slug: 'lam-infokom',
          description: 'Akreditasi dari Lembaga Akreditasi Mandiri Informatika dan Komputer',
          icon: 'monitor',
          orderIndex: 3,
          isActive: true,
        },
      ]
    });

    // ==================== ADMIN SETTINGS ====================
    const adminSettings = await db.adminSetting.createMany({
      data: [
        { key: 'maintenanceMode', value: 'false' },
        { key: 'metaDescription', value: 'BPM USNI - Badan Penjaminan Mutu Universitas Satya Negara Indonesia' },
        { key: 'metaKeywords', value: 'BPM, USNI, Akreditasi, SPMI, Mutu, Pendidikan Tinggi' },
        { key: 'enableContactForm', value: 'true' },
        { key: 'enableRegistration', value: 'true' },
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
        menuItems: 27, // 8 parent menus + 19 submenus
        quickLinks: quickLinks.count,
        slideshows: slideshows.count,
        news: newsData.count,
        announcements: announcements.count,
        albums: 3,
        galleryImages: galleryImages.count,
        faculties: 4,
        studyPrograms: 10,
        accreditationData: accreditationData.count,
        accreditationCategories: accCategories.count,
        documentCategories: 5,
        documents: documents.count,
        homepageQuote: !!homepageQuote,
        staticPages: staticPages.count,
        contactMessages: contactMessages.count,
        adminSettings: adminSettings.count,
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
