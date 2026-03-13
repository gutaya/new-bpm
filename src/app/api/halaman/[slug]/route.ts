import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Params = Promise<{ slug: string }>;

// GET - Fetch static page by slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { slug } = await params;
    
    const staticPage = await db.staticPage.findFirst({
      where: {
        slug,
        published: true,
      },
    });

    if (!staticPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(staticPage);
  } catch (error) {
    console.error('Error fetching static page:', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}
