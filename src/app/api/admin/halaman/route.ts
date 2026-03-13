import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all static pages
export async function GET() {
  try {
    const staticPages = await db.staticPage.findMany({
      orderBy: [
        { menuCategory: 'asc' },
        { orderIndex: 'asc' },
      ],
    });
    return NextResponse.json(staticPages);
  } catch (error) {
    console.error('Error fetching static pages:', error);
    return NextResponse.json([]);
  }
}

// POST - Create new static page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, description, content, icon, menuCategory, parentMenu, showInMenu, orderIndex, published } = body;

    // Generate slug if not provided
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const staticPage = await db.staticPage.create({
      data: {
        title,
        slug: finalSlug,
        description,
        content: content || '',
        icon,
        menuCategory: menuCategory === 'none' ? null : menuCategory,
        parentMenu: parentMenu === 'none' ? null : parentMenu,
        showInMenu: showInMenu ?? false,
        orderIndex: orderIndex ?? 0,
        published: published ?? false,
      },
    });

    return NextResponse.json(staticPage);
  } catch (error) {
    console.error('Error creating static page:', error);
    return NextResponse.json(
      { error: 'Failed to create static page' },
      { status: 500 }
    );
  }
}
