import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const tagSlug = searchParams.get('tag');
    
    // Build the where clause
    const where: any = { published: true };
    
    // If tag is specified, filter by tag slug
    if (tagSlug) {
      where.tags = {
        some: {
          tag: {
            slug: tagSlug
          }
        }
      };
    }
    
    const news = await db.news.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
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
    const result = news.map(item => ({
      ...item,
      tags: item.tags.map(t => t.tag)
    }));
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
