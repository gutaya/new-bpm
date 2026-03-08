import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all quick links
export async function GET() {
  try {
    const quickLinks = await db.quickLink.findMany({
      orderBy: [
        { orderIndex: 'asc' },
        { createdAt: 'asc' }
      ]
    });
    return NextResponse.json(quickLinks);
  } catch (error) {
    console.error('Error fetching quick links:', error);
    return NextResponse.json([]);
  }
}

// POST - Create new quick link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, url, icon, orderIndex, isActive } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!url || !url.trim()) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const quickLink = await db.quickLink.create({
      data: {
        title,
        url,
        icon: icon || 'Link',
        orderIndex: orderIndex ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(quickLink);
  } catch (error) {
    console.error('Error creating quick link:', error);
    return NextResponse.json(
      { error: 'Failed to create quick link' },
      { status: 500 }
    );
  }
}
