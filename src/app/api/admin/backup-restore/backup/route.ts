import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    // Get all data from all tables
    const backup = {
      version: '1.0',
      createdAt: new Date().toISOString(),
      tables: {} as Record<string, unknown[]>,
    };

    // Fetch all data from each table
    const tables = [
      { name: 'users', data: await db.user.findMany() },
      { name: 'news', data: await db.news.findMany() },
      { name: 'announcements', data: await db.announcement.findMany() },
      { name: 'albums', data: await db.album.findMany() },
      { name: 'gallery_images', data: await db.galleryImage.findMany() },
      { name: 'slideshows', data: await db.slideshow.findMany() },
      { name: 'document_categories', data: await db.documentCategory.findMany() },
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

    // Calculate total records
    let totalRecords = 0;
    tables.forEach((table) => {
      backup.tables[table.name] = table.data;
      totalRecords += table.data.length;
    });

    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `backup-bpm-usni-${timestamp}.json`;

    // Calculate size
    const jsonString = JSON.stringify(backup, null, 2);
    const size = new Blob([jsonString]).size;

    // Format size
    const formatBytes = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return NextResponse.json({
      success: true,
      filename,
      size: formatBytes(size),
      tables: tables.length,
      records: totalRecords,
      backup, // Include backup data for download
    });
  } catch (error) {
    console.error('Backup error:', error);
    return NextResponse.json(
      { error: 'Gagal membuat backup database' },
      { status: 500 }
    );
  }
}
