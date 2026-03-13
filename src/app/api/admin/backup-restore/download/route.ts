import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('file');

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename tidak ditemukan' },
        { status: 400 }
      );
    }

    // Get all data from all tables
    const backup = {
      version: '1.0',
      createdAt: new Date().toISOString(),
      tables: {} as Record<string, unknown[]>,
    };

    // Fetch all data from each table (matching Prisma schema)
    const tables = [
      { name: 'users', data: await db.user.findMany() },
      { name: 'news', data: await db.news.findMany() },
      { name: 'announcements', data: await db.announcement.findMany() },
      { name: 'albums', data: await db.album.findMany() },
      { name: 'gallery_images', data: await db.galleryImage.findMany() },
      { name: 'slideshows', data: await db.slideshow.findMany() },
      { name: 'documents', data: await db.document.findMany() },
      { name: 'accreditation_categories', data: await db.accreditationCategory.findMany() },
      { name: 'accreditation_data', data: await db.accreditationData.findMany() },
      { name: 'faculties', data: await db.faculty.findMany() },
      { name: 'study_programs', data: await db.studyProgram.findMany() },
      { name: 'vision_mission', data: await db.visionMission.findMany() },
      { name: 'about_us', data: await db.aboutUs.findMany() },
      { name: 'organization_structure', data: await db.organizationStructure.findMany() },
      { name: 'statistics', data: await db.statistic.findMany() },
      { name: 'menu_items', data: await db.menuItem.findMany() },
      { name: 'quick_links', data: await db.quickLink.findMany() },
      { name: 'homepage_quotes', data: await db.homepageQuote.findMany() },
      { name: 'website_identity', data: await db.websiteIdentity.findMany() },
      { name: 'static_pages', data: await db.staticPage.findMany() },
      { name: 'contact_messages', data: await db.contactMessage.findMany() },
      { name: 'admin_settings', data: await db.adminSetting.findMany() },
      { name: 'upload_logs', data: await db.uploadLog.findMany() },
      { name: 'page_views', data: await db.pageView.findMany() },
      { name: 'accreditations', data: await db.accreditation.findMany() },
    ];

    tables.forEach((table) => {
      backup.tables[table.name] = table.data;
    });

    const jsonString = JSON.stringify(backup, null, 2);

    return new NextResponse(jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Download backup error:', error);
    return NextResponse.json(
      { error: 'Gagal mengunduh backup' },
      { status: 500 }
    );
  }
}
