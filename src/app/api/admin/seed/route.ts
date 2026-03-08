import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    // Create demo user
    const user = await db.user.upsert({
      where: { email: 'admin@usni.ac.id' },
      update: {},
      create: {
        email: 'admin@usni.ac.id',
        fullName: 'Administrator',
        role: 'admin',
      },
    });

    // Create sample news
    const existingNews = await db.news.findFirst();
    if (!existingNews) {
      await db.news.createMany({
        data: [
          {
            title: 'Workshop SPMI 2024',
            slug: 'workshop-spmi-2024',
            excerpt: 'BPM USNI menyelenggarakan workshop SPMI untuk meningkatkan kualitas pendidikan.',
            content: 'Badan Penjaminan Mutu Universitas Satya Negara Indonesia menyelenggarakan workshop Sistem Penjaminan Mutu Internal (SPMI) tahun 2024. Workshop ini diikuti oleh seluruh dosen dan tenaga kependidikan universitas.',
            imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
            published: true,
            publishedAt: new Date(),
          },
          {
            title: 'Akreditasi Institusi BAN-PT',
            slug: 'akreditasi-institusi-ban-pt',
            excerpt: 'USNI berhasil meraih akreditasi B dari BAN-PT.',
            content: 'Universitas Satya Negara Indonesia berhasil meraih akreditasi institusi dengan peringkat B dari Badan Akreditasi Nasional Perguruan Tinggi (BAN-PT).',
            imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
            published: true,
            publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
          {
            title: 'Pelatihan Auditor Internal',
            slug: 'pelatihan-auditor-internal',
            excerpt: 'Pelatihan auditor internal untuk meningkatkan kualitas audit mutu.',
            content: 'BPM USNI mengadakan pelatihan auditor internal untuk meningkatkan kompetensi tim auditor.',
            published: false,
          },
        ],
      });
    }

    // Create sample announcements
    const existingAnnouncements = await db.announcement.findFirst();
    if (!existingAnnouncements) {
      await db.announcement.createMany({
        data: [
          {
            title: 'Jadwal Audit Internal 2024',
            content: 'Audit internal akan dilaksanakan pada tanggal 15-20 Desember 2024.',
            priority: 'high',
            published: true,
            publishedAt: new Date(),
          },
          {
            title: 'Pengumpulan Dokumen Mutu',
            content: 'Diharapkan kepada seluruh prodi untuk mengumpulkan dokumen mutu terbaru.',
            priority: 'normal',
            published: true,
            publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
        ],
      });
    }

    // Create sample Albums first
    await db.galleryImage.deleteMany({});
    await db.album.deleteMany({});
    
    // Create albums one by one to ensure they exist
    const albumWisuda = await db.album.create({
      data: {
        id: 'album-wisuda',
        title: 'Wisuda 2024',
        description: 'Dokumentasi acara wisuda tahun akademik 2024',
        coverImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
        orderIndex: 1,
        isActive: true,
      },
    });
    
    const albumWorkshop = await db.album.create({
      data: {
        id: 'album-workshop',
        title: 'Workshop SPMI',
        description: 'Kegiatan workshop Sistem Penjaminan Mutu Internal',
        coverImageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
        orderIndex: 2,
        isActive: true,
      },
    });
    
    const albumAudit = await db.album.create({
      data: {
        id: 'album-audit',
        title: 'Audit Internal',
        description: 'Kegiatan audit mutu internal tahun 2024',
        coverImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
        orderIndex: 3,
        isActive: true,
      },
    });
    
    const albumPelatihan = await db.album.create({
      data: {
        id: 'album-pelatihan',
        title: 'Pelatihan Auditor',
        description: 'Pelatihan sertifikasi auditor internal',
        coverImageUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800',
        orderIndex: 4,
        isActive: true,
      },
    });
    
    const albumSeminar = await db.album.create({
      data: {
        id: 'album-seminar',
        title: 'Seminar Nasional',
        description: 'Seminar nasional penjaminan mutu pendidikan tinggi',
        coverImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        orderIndex: 5,
        isActive: true,
      },
    });
    
    const albumVisitasi = await db.album.create({
      data: {
        id: 'album-visitasi',
        title: 'Visitasi BAN-PT',
        description: 'Kunjungan asesor BAN-PT untuk akreditasi',
        coverImageUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800',
        orderIndex: 6,
        isActive: true,
      },
    });

    // Create diverse Gallery Images with album associations
    await db.galleryImage.createMany({
      data: [
        // Wisuda Album
        {
          title: 'Prosesi Wisuda',
          description: 'Prosesi pawai wisuda di gedung utama',
          imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
          category: 'Wisuda',
          albumId: albumWisuda.id,
          orderIndex: 1,
          isActive: true,
        },
        {
          title: 'Penyerahan Ijazah',
          description: 'Rektor menyerahkan ijazah kepada wisudawan',
          imageUrl: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800',
          category: 'Wisuda',
          albumId: albumWisuda.id,
          orderIndex: 2,
          isActive: true,
        },
        {
          title: 'Foto Bersama',
          description: 'Foto bersama wisudawan dan keluarga',
          imageUrl: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800',
          category: 'Wisuda',
          albumId: albumWisuda.id,
          orderIndex: 3,
          isActive: true,
        },
        // Workshop Album
        {
          title: 'Workshop SPMI Pembukaan',
          description: 'Sesi pembukaan workshop SPMI',
          imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
          category: 'Workshop',
          albumId: albumWorkshop.id,
          orderIndex: 1,
          isActive: true,
        },
        {
          title: 'Diskusi Kelompok',
          description: 'Sesi diskusi kelompok peserta workshop',
          imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
          category: 'Workshop',
          albumId: albumWorkshop.id,
          orderIndex: 2,
          isActive: true,
        },
        {
          title: 'Presentasi Materi',
          description: 'Narasumber mempresentasikan materi SPMI',
          imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
          category: 'Workshop',
          albumId: albumWorkshop.id,
          orderIndex: 3,
          isActive: true,
        },
        // Audit Album
        {
          title: 'Rapat Pembukaan Audit',
          description: 'Rapat pembukaan kegiatan audit internal',
          imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
          category: 'Audit',
          albumId: albumAudit.id,
          orderIndex: 1,
          isActive: true,
        },
        {
          title: 'Verifikasi Dokumen',
          description: 'Tim auditor memverifikasi dokumen mutu',
          imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
          category: 'Audit',
          albumId: albumAudit.id,
          orderIndex: 2,
          isActive: true,
        },
        {
          title: 'Wawancara',
          description: 'Sesi wawancara dengan stakeholder',
          imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
          category: 'Audit',
          albumId: albumAudit.id,
          orderIndex: 3,
          isActive: true,
        },
        // Pelatihan Album
        {
          title: 'Pelatihan Auditor Internal',
          description: 'Sesi pelatihan untuk calon auditor internal',
          imageUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800',
          category: 'Pelatihan',
          albumId: albumPelatihan.id,
          orderIndex: 1,
          isActive: true,
        },
        {
          title: 'Simulasi Audit',
          description: 'Praktik simulasi audit oleh peserta pelatihan',
          imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
          category: 'Pelatihan',
          albumId: albumPelatihan.id,
          orderIndex: 2,
          isActive: true,
        },
        {
          title: 'Sertifikasi Auditor',
          description: 'Penyerahan sertifikat auditor internal',
          imageUrl: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800',
          category: 'Pelatihan',
          albumId: albumPelatihan.id,
          orderIndex: 3,
          isActive: true,
        },
        // Seminar Album
        {
          title: 'Seminar Nasional BPM',
          description: 'Pembukaan seminar nasional penjaminan mutu',
          imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
          category: 'Seminar',
          albumId: albumSeminar.id,
          orderIndex: 1,
          isActive: true,
        },
        {
          title: 'Keynote Speaker',
          description: 'Presentasi dari keynote speaker seminar',
          imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
          category: 'Seminar',
          albumId: albumSeminar.id,
          orderIndex: 2,
          isActive: true,
        },
        {
          title: 'Panel Discussion',
          description: 'Sesi diskusi panel seminar nasional',
          imageUrl: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800',
          category: 'Seminar',
          albumId: albumSeminar.id,
          orderIndex: 3,
          isActive: true,
        },
        // Visitasi Album
        {
          title: 'Kedatangan Asesor',
          description: 'Penyambutan asesor BAN-PT',
          imageUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800',
          category: 'Visitasi',
          albumId: albumVisitasi.id,
          orderIndex: 1,
          isActive: true,
        },
        {
          title: 'Tinjauan Lapangan',
          description: 'Asesor melakukan tinjauan fasilitas',
          imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
          category: 'Visitasi',
          albumId: albumVisitasi.id,
          orderIndex: 2,
          isActive: true,
        },
        {
          title: 'Penutupan Visitasi',
          description: 'Rapat penutupan kegiatan visitasi',
          imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
          category: 'Visitasi',
          albumId: albumVisitasi.id,
          orderIndex: 3,
          isActive: true,
        },
        // Additional images without album (Kegiatan Umum)
        {
          title: 'Rapat Koordinasi',
          description: 'Rapat koordinasi bulanan tim BPM',
          imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
          category: 'Kegiatan',
          orderIndex: 1,
          isActive: true,
        },
        {
          title: 'Konsultasi Prodi',
          description: 'Sesi konsultasi dengan prodi terkait dokumen mutu',
          imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
          category: 'Kegiatan',
          orderIndex: 2,
          isActive: true,
        },
        {
          title: 'Monitoring Evaluasi',
          description: 'Kegiatan monitoring dan evaluasi program kerja',
          imageUrl: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800',
          category: 'Kegiatan',
          orderIndex: 3,
          isActive: true,
        },
      ],
    });

    // Create sample documents
    const existingDocs = await db.document.findFirst();
    if (!existingDocs) {
      await db.document.createMany({
        data: [
          {
            title: 'SK Rektor Tentang BPM',
            description: 'Surat Keputusan Rektor tentang Badan Penjaminan Mutu',
            category: 'publik',
            published: true,
          },
          {
            title: 'Pedoman SPMI',
            description: 'Buku pedoman Sistem Penjaminan Mutu Internal',
            category: 'spmi',
            published: true,
          },
        ],
      });
    }

    // Create sample accreditation data
    const existingAccred = await db.accreditationData.findFirst();
    if (!existingAccred) {
      await db.accreditationData.createMany({
        data: [
          {
            title: 'Terakreditasi: B',
            description: 'Akreditasi Institusi',
            category: 'nasional',
            accreditationBody: 'ban-pt',
            validUntil: new Date('2029-01-15'),
            published: true,
          },
          {
            title: 'Terakreditasi: Baik Sekali',
            description: 'Teknik Informatika',
            category: 'nasional',
            accreditationBody: 'ban-pt',
            validUntil: new Date('2028-09-30'),
            published: true,
          },
        ],
      });
    }

    // Create sample contact messages
    const existingMessages = await db.contactMessage.findFirst();
    if (!existingMessages) {
      await db.contactMessage.createMany({
        data: [
          {
            name: 'John Doe',
            email: 'john@example.com',
            subject: 'Pertanyaan tentang Akreditasi',
            message: 'Apakah prodi Teknik Informatika sudah terakreditasi?',
          },
        ],
      });
    }

    return NextResponse.json({ success: true, message: 'Seed data created' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to create seed data' },
      { status: 500 }
    );
  }
}
