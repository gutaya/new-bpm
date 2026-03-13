import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all accreditations with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const accreditationBody = searchParams.get('accreditationBody');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    // Build where clause
    const where: Record<string, unknown> = {};
    if (category && (category === 'nasional' || category === 'internasional')) {
      where.category = category;
    }
    if (accreditationBody) {
      where.accreditationBody = accreditationBody;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Get total count
    const total = await db.accreditationData.count({ where });

    // Calculate pagination
    const skip = (page - 1) * pageSize;
    const totalPages = Math.ceil(total / pageSize);

    const accreditations = await db.accreditationData.findMany({
      where,
      include: {
        categoryRef: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        studyProgram: {
          select: {
            id: true,
            name: true,
            code: true,
            degreeLevel: true,
            faculty: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    });

    return NextResponse.json({
      data: accreditations,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching accreditations:', error);
    return NextResponse.json({
      data: [],
      pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
    });
  }
}

// POST - Create new accreditation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      categoryId,
      studyProgramId,
      accreditationBody,
      accreditationStatus,
      certificateUrl,
      imageUrl,
      validUntil,
      published,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const accreditation = await db.accreditationData.create({
      data: {
        title,
        description,
        category: category || 'nasional',
        categoryId: categoryId || null,
        studyProgramId: studyProgramId || null,
        accreditationBody: accreditationBody || 'ban-pt',
        accreditationStatus: accreditationStatus || null,
        certificateUrl: certificateUrl || null,
        imageUrl: imageUrl || null,
        validUntil: validUntil ? new Date(validUntil) : null,
        published: published ?? true,
      },
      include: {
        categoryRef: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        studyProgram: {
          select: {
            id: true,
            name: true,
            code: true,
            degreeLevel: true,
            faculty: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(accreditation);
  } catch (error) {
    console.error('Error creating accreditation:', error);
    return NextResponse.json(
      { error: 'Failed to create accreditation' },
      { status: 500 }
    );
  }
}
