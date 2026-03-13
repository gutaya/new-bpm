import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Params = Promise<{ id: string }>;

// GET - Fetch single news
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const news = await db.news.findUnique({
      where: { id },
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

// PATCH - Update news
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, slug, excerpt, content, imageUrl, published, publishedAt, tagIds } = body;

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (published !== undefined) {
      updateData.published = published;
      if (published && !publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    if (publishedAt !== undefined) updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;

    // Handle tag updates
    if (tagIds !== undefined) {
      // First delete all existing tag relations
      await db.newsTag.deleteMany({
        where: { newsId: id }
      });

      // Then create new tag relations
      if (tagIds.length > 0) {
        await db.newsTag.createMany({
          data: tagIds.map((tagId: string) => ({
            newsId: id,
            tagId: tagId
          }))
        });
      }
    }

    const news = await db.news.update({
      where: { id },
      data: updateData,
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
    console.error('Error updating news:', error);
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
  }
}

// DELETE - Delete news
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    
    // Delete tag relations first (cascade should handle this, but let's be explicit)
    await db.newsTag.deleteMany({
      where: { newsId: id }
    });
    
    await db.news.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
