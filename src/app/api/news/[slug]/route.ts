import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const news = await db.news.findUnique({
      where: { slug },
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
    
    if (!news) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }
    
    // Increment view count
    await db.news.update({
      where: { id: news.id },
      data: { viewCount: { increment: 1 } },
    });

    // Transform the response to include tags as a flat array
    const result = {
      ...news,
      tags: news.tags.map(t => t.tag)
    };
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
