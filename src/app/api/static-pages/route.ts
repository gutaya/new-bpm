import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Public API for static pages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentMenu = searchParams.get('parentMenu');
    const slug = searchParams.get('slug');

    // If slug is provided, get single page
    if (slug) {
      const page = await db.staticPage.findUnique({
        where: { slug },
      });
      return NextResponse.json(page);
    }

    // Build filter
    const where: Record<string, unknown> = { published: true };
    if (parentMenu) {
      where.parentMenu = parentMenu;
    }

    const pages = await db.staticPage.findMany({
      where,
      orderBy: { orderIndex: 'asc' },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching static pages:', error);
    return NextResponse.json([]);
  }
}
