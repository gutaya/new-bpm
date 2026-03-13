import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Params = Promise<{ slug: string }>;

// GET - Fetch layanan page by slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { slug } = await params;
    
    // Find static page by slug (slug should match the URL segment)
    // e.g., /layanan/ami -> slug: 'ami'
    const staticPage = await db.staticPage.findFirst({
      where: {
        slug,
        published: true,
      },
    });

    if (staticPage) {
      return NextResponse.json(staticPage);
    }

    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching layanan page:', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}
