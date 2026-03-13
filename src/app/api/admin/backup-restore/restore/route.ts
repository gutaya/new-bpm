import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'File tidak ditemukan' },
        { status: 400 }
      );
    }

    // Read file content
    const text = await file.text();
    let backup;

    try {
      backup = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: 'Format file tidak valid. Pastikan file adalah JSON yang valid.' },
        { status: 400 }
      );
    }

    // Validate backup structure
    if (!backup.version || !backup.tables) {
      return NextResponse.json(
        { error: 'Struktur file backup tidak valid' },
        { status: 400 }
      );
    }

    // Use transaction to ensure atomic restore
    const result = await db.$transaction(async (tx) => {
      let totalRecords = 0;
      let tablesCount = 0;

      // Define table order for restore (respecting foreign key constraints)
      // Tables with no foreign keys first, then tables with dependencies
      const tableOrder = [
        'users',
        'vision_mission',
        'about_us',
        'website_identity',
        'admin_settings',
        'accreditation_categories',
        'faculties',
        'albums',
        'menu_items',
        'quick_links',
        'homepage_quotes',
        'accreditations',
        'news',
        'announcements',
        'gallery_images',
        'slideshows',
        'documents',
        'accreditation_data',
        'study_programs',
        'organization_structure',
        'statistics',
        'static_pages',
        'contact_messages',
        'upload_logs',
        'page_views',
      ];

      for (const tableName of tableOrder) {
        const tableData = backup.tables[tableName];
        if (!tableData || !Array.isArray(tableData)) continue;

        tablesCount++;

        // Clear existing data
        switch (tableName) {
          case 'users':
            await tx.user.deleteMany();
            break;
          case 'news':
            await tx.news.deleteMany();
            break;
          case 'announcements':
            await tx.announcement.deleteMany();
            break;
          case 'albums':
            await tx.album.deleteMany();
            break;
          case 'gallery_images':
            await tx.galleryImage.deleteMany();
            break;
          case 'slideshows':
            await tx.slideshow.deleteMany();
            break;
          case 'documents':
            await tx.document.deleteMany();
            break;
          case 'accreditation_categories':
            await tx.accreditationCategory.deleteMany();
            break;
          case 'accreditation_data':
            await tx.accreditationData.deleteMany();
            break;
          case 'faculties':
            await tx.faculty.deleteMany();
            break;
          case 'study_programs':
            await tx.studyProgram.deleteMany();
            break;
          case 'vision_mission':
            await tx.visionMission.deleteMany();
            break;
          case 'about_us':
            await tx.aboutUs.deleteMany();
            break;
          case 'organization_structure':
            await tx.organizationStructure.deleteMany();
            break;
          case 'statistics':
            await tx.statistic.deleteMany();
            break;
          case 'menu_items':
            await tx.menuItem.deleteMany();
            break;
          case 'quick_links':
            await tx.quickLink.deleteMany();
            break;
          case 'homepage_quotes':
            await tx.homepageQuote.deleteMany();
            break;
          case 'website_identity':
            await tx.websiteIdentity.deleteMany();
            break;
          case 'static_pages':
            await tx.staticPage.deleteMany();
            break;
          case 'contact_messages':
            await tx.contactMessage.deleteMany();
            break;
          case 'admin_settings':
            await tx.adminSetting.deleteMany();
            break;
          case 'upload_logs':
            await tx.uploadLog.deleteMany();
            break;
          case 'page_views':
            await tx.pageView.deleteMany();
            break;
          case 'accreditations':
            await tx.accreditation.deleteMany();
            break;
        }

        // Insert data
        if (tableData.length > 0) {
          for (const record of tableData) {
            try {
              switch (tableName) {
                case 'users':
                  await tx.user.create({ data: record as Prisma.UserCreateInput });
                  break;
                case 'news':
                  await tx.news.create({ data: record as Prisma.NewsCreateInput });
                  break;
                case 'announcements':
                  await tx.announcement.create({ data: record as Prisma.AnnouncementCreateInput });
                  break;
                case 'albums':
                  await tx.album.create({ data: record as Prisma.AlbumCreateInput });
                  break;
                case 'gallery_images':
                  await tx.galleryImage.create({ data: record as Prisma.GalleryImageCreateInput });
                  break;
                case 'slideshows':
                  await tx.slideshow.create({ data: record as Prisma.SlideshowCreateInput });
                  break;
                case 'documents':
                  await tx.document.create({ data: record as Prisma.DocumentCreateInput });
                  break;
                case 'accreditation_categories':
                  await tx.accreditationCategory.create({ data: record as Prisma.AccreditationCategoryCreateInput });
                  break;
                case 'accreditation_data':
                  await tx.accreditationData.create({ data: record as Prisma.AccreditationDataCreateInput });
                  break;
                case 'faculties':
                  await tx.faculty.create({ data: record as Prisma.FacultyCreateInput });
                  break;
                case 'study_programs':
                  await tx.studyProgram.create({ data: record as Prisma.StudyProgramCreateInput });
                  break;
                case 'vision_mission':
                  await tx.visionMission.create({ data: record as Prisma.VisionMissionCreateInput });
                  break;
                case 'about_us':
                  await tx.aboutUs.create({ data: record as Prisma.AboutUsCreateInput });
                  break;
                case 'organization_structure':
                  await tx.organizationStructure.create({ data: record as Prisma.OrganizationStructureCreateInput });
                  break;
                case 'statistics':
                  await tx.statistic.create({ data: record as Prisma.StatisticCreateInput });
                  break;
                case 'menu_items':
                  await tx.menuItem.create({ data: record as Prisma.MenuItemCreateInput });
                  break;
                case 'quick_links':
                  await tx.quickLink.create({ data: record as Prisma.QuickLinkCreateInput });
                  break;
                case 'homepage_quotes':
                  await tx.homepageQuote.create({ data: record as Prisma.HomepageQuoteCreateInput });
                  break;
                case 'website_identity':
                  await tx.websiteIdentity.create({ data: record as Prisma.WebsiteIdentityCreateInput });
                  break;
                case 'static_pages':
                  await tx.staticPage.create({ data: record as Prisma.StaticPageCreateInput });
                  break;
                case 'contact_messages':
                  await tx.contactMessage.create({ data: record as Prisma.ContactMessageCreateInput });
                  break;
                case 'admin_settings':
                  await tx.adminSetting.create({ data: record as Prisma.AdminSettingCreateInput });
                  break;
                case 'upload_logs':
                  await tx.uploadLog.create({ data: record as Prisma.UploadLogCreateInput });
                  break;
                case 'page_views':
                  await tx.pageView.create({ data: record as Prisma.PageViewCreateInput });
                  break;
                case 'accreditations':
                  await tx.accreditation.create({ data: record as Prisma.AccreditationCreateInput });
                  break;
              }
              totalRecords++;
            } catch (insertError) {
              console.error(`Error inserting into ${tableName}:`, insertError);
              // Continue with other records
            }
          }
        }
      }

      return { tables: tablesCount, records: totalRecords };
    });

    return NextResponse.json({
      success: true,
      tables: result.tables,
      records: result.records,
      message: 'Database berhasil di-restore',
    });
  } catch (error) {
    console.error('Restore error:', error);
    return NextResponse.json(
      { error: 'Gagal restore database. Pastikan file backup valid.' },
      { status: 500 }
    );
  }
}
