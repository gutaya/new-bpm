import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Using existing models from the schema
    const [
      newsCount,
      announcementCount,
      documentCount,
      galleryCount,
      accreditationCount,
      messageCount,
      userCount,
    ] = await Promise.all([
      db.news.count().catch(() => 0),
      db.announcement.count().catch(() => 0),
      db.document.count().catch(() => 0),
      db.galleryImage.count().catch(() => 0),
      db.accreditationData.count().catch(() => 0),
      db.contactMessage.count().catch(() => 0),
      db.user.count().catch(() => 0),
    ]);

    return NextResponse.json({
      berita: newsCount,
      pengumuman: announcementCount,
      dokumen: documentCount,
      galeri: galleryCount,
      akreditasi: accreditationCount,
      pesan: messageCount,
      pengguna: userCount,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({
      berita: 0,
      pengumuman: 0,
      dokumen: 0,
      galeri: 0,
      akreditasi: 0,
      pesan: 0,
      pengguna: 0,
    });
  }
}
