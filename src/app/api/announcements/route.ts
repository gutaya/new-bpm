import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const priority = searchParams.get('priority');
    
    const where: { published: boolean; priority?: string } = { published: true };
    
    if (priority) {
      where.priority = priority;
    }
    
    const announcements = await db.announcement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    });
    
    return NextResponse.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const announcement = await db.announcement.create({
      data: {
        title: body.title,
        content: body.content,
        priority: body.priority ?? 'normal',
        published: body.published ?? true,
        publishedAt: body.published ? new Date() : null,
      }
    });
    return NextResponse.json(announcement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}
