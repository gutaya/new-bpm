import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - List all announcements with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const published = searchParams.get('published');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    // Build where clause
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }
    if (published === 'true') {
      where.published = true;
    } else if (published === 'false') {
      where.published = false;
    }

    // Get total count
    const total = await db.announcement.count({ where });

    // Calculate pagination
    const skip = (page - 1) * pageSize;
    const totalPages = Math.ceil(total / pageSize);

    const announcements = await db.announcement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    });

    return NextResponse.json({
      data: announcements,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({
      data: [],
      pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
    });
  }
}

// POST - Create new announcement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, published, priority, expireAt } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Judul dan konten wajib diisi' },
        { status: 400 }
      );
    }

    const announcement = await db.announcement.create({
      data: {
        title,
        content,
        published: published || false,
        priority: priority || 'normal',
        expireAt: expireAt ? new Date(expireAt) : null,
        publishedAt: published ? new Date() : null,
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { error: 'Gagal membuat pengumuman' },
      { status: 500 }
    );
  }
}
