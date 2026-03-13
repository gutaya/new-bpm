import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get all tags
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};
    
    if (search) {
      where.name = {
        contains: search,
      };
    }

    const tags = await db.tag.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { news: true }
        }
      }
    });

    const result = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      newsCount: tag._count.news,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data tag' },
      { status: 500 }
    );
  }
}

// POST - Create new tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Nama tag tidak boleh kosong' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if tag already exists
    const existingTag = await db.tag.findFirst({
      where: {
        OR: [
          { name: name.trim() },
          { slug }
        ]
      }
    });

    if (existingTag) {
      return NextResponse.json(
        { error: 'Tag dengan nama tersebut sudah ada' },
        { status: 400 }
      );
    }

    const tag = await db.tag.create({
      data: {
        name: name.trim(),
        slug,
      }
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: 'Gagal membuat tag baru' },
      { status: 500 }
    );
  }
}
