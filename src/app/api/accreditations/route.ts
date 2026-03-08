import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Public API for accreditations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // Build filter
    const where: Record<string, unknown> = { published: true };
    if (category && category !== 'semua') {
      // Handle nasional category - includes all national accreditation bodies
      if (category === 'nasional') {
        where.accreditationBody = { in: ['ban-pt', 'lamemba', 'lam-teknik', 'lam-infokom'] };
      } else if (category === 'internasional') {
        where.category = 'internasional';
      } else if (category === 'institusi') {
        where.accreditationBody = 'ban-pt';
        where.title = { contains: 'Institusi' };
      } else {
        // Map category slug to accreditation body
        const categoryMap: Record<string, string> = {
          'ban-pt': 'ban-pt',
          'lamemba': 'lamemba',
          'lam-teknik': 'lam-teknik',
          'lam-infokom': 'lam-infokom',
        };
        where.accreditationBody = categoryMap[category] || category;
      }
    }

    const accreditations = await db.accreditationData.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Transform for frontend
    const result = accreditations.map((acc) => {
      // Determine category name based on accreditation body
      let categoryName = 'Akreditasi Nasional';
      let categorySlug = 'nasional';
      
      if (acc.accreditationBody === 'ban-pt') {
        if (acc.title.toLowerCase().includes('institusi') || acc.title.toLowerCase().includes('universitas')) {
          categoryName = 'Akreditasi Institusi';
          categorySlug = 'institusi';
        } else {
          categoryName = 'Akreditasi BAN-PT';
          categorySlug = 'ban-pt';
        }
      } else if (acc.accreditationBody === 'lamemba') {
        categoryName = 'Akreditasi LAMEMBA';
        categorySlug = 'nasional';
      } else if (acc.accreditationBody === 'lam-teknik') {
        categoryName = 'Akreditasi LAM Teknik';
        categorySlug = 'nasional';
      } else if (acc.accreditationBody === 'lam-infokom') {
        categoryName = 'Akreditasi LAM Infokom';
        categorySlug = 'nasional';
      } else if (acc.category === 'internasional') {
        categoryName = 'Akreditasi Internasional';
        categorySlug = 'internasional';
      }

      return {
        id: acc.id,
        title: `Terakreditasi: ${acc.accreditationStatus || 'Terakreditasi'}`,
        program: acc.title,
        category: categoryName,
        categorySlug: categorySlug,
        level: acc.category === 'internasional' ? 'Internasional' : 'Nasional',
        status: acc.accreditationStatus || 'Terakreditasi',
        validUntil: acc.validUntil,
        imageUrl: acc.imageUrl,
        certificateUrl: acc.certificateUrl,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching accreditations:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const accreditation = await db.accreditation.create({
      data: {
        name: body.name,
        category: body.category,
        count: body.count,
        programs: body.programs,
        color: body.color,
      }
    });
    return NextResponse.json(accreditation);
  } catch (error) {
    console.error('Error creating accreditation:', error);
    return NextResponse.json({ error: 'Failed to create accreditation' }, { status: 500 });
  }
}
