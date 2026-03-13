import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all news with pagination
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
        { excerpt: { contains: search } },
      ];
    }
    if (published === 'true') {
      where.published = true;
    } else if (published === 'false') {
      where.published = false;
    }

    // Get total count
    const total = await db.news.count({ where });

    // Calculate pagination
    const skip = (page - 1) * pageSize;
    const totalPages = Math.ceil(total / pageSize);

    const news = await db.news.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
      include: {
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              }
            }
          }
        }
      }
    });

    // Transform the response to include tags as a flat array
    const data = news.map(item => ({
      ...item,
      tags: item.tags.map(t => t.tag)
    }));

    return NextResponse.json({
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({
      data: [],
      pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
    });
  }
}

// POST - Create new news
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, imageUrl, published, publishedAt, tagIds } = body;

    // Generate slug if not provided
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const news = await db.news.create({
      data: {
        title,
        slug: finalSlug,
        excerpt,
        content,
        imageUrl,
        published: published ?? false,
        publishedAt: published ? (publishedAt ? new Date(publishedAt) : new Date()) : null,
        // Create tag relations if provided
        ...(tagIds && tagIds.length > 0 && {
          tags: {
            create: tagIds.map((tagId: string) => ({
              tag: { connect: { id: tagId } }
            }))
          }
        })
      },
      include: {
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              }
            }
          }
        }
      }
    });

    // Transform the response to include tags as a flat array
    const result = {
      ...news,
      tags: news.tags.map(t => t.tag)
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    );
  }
}
