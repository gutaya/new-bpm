import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - List all documents with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const menuItemId = searchParams.get('menuItemId');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    // Build where clause
    const where: Record<string, unknown> = {};
    if (menuItemId) where.menuItemId = menuItemId;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Get total count
    const total = await db.document.count({ where });

    // Calculate pagination
    const skip = (page - 1) * pageSize;
    const totalPages = Math.ceil(total / pageSize);

    // Get paginated data
    const documents = await db.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
      include: {
        menuItem: {
          select: { id: true, title: true, url: true },
        },
      },
    });

    return NextResponse.json({
      data: documents,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data dokumen' },
      { status: 500 }
    );
  }
}

// POST - Create new document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, fileUrl, menuItemId, published } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Judul dokumen wajib diisi' },
        { status: 400 }
      );
    }

    const document = await db.document.create({
      data: {
        title,
        description: description || null,
        fileUrl: fileUrl || null,
        menuItemId: menuItemId || null,
        published: published ?? true,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error creating document:', error);
    const errorMessage = error instanceof Error ? error.message : 'Gagal membuat dokumen';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
