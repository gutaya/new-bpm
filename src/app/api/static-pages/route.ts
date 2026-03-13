import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch static pages for public
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const parentMenu = searchParams.get('parentMenu');
    const menuCategory = searchParams.get('menuCategory');

    const where: {
      published: boolean;
      showInMenu?: boolean;
      parentMenu?: string | null;
      menuCategory?: string | null;
    } = {
      published: true,
    };

    // If parentMenu is specified, filter by it
    if (parentMenu) {
      where.parentMenu = parentMenu;
      where.showInMenu = true;
    }

    // If menuCategory is specified, filter by it
    if (menuCategory) {
      where.menuCategory = menuCategory;
    }

    const staticPages = await db.staticPage.findMany({
      where,
      orderBy: { orderIndex: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        icon: true,
        parentMenu: true,
        menuCategory: true,
        orderIndex: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(staticPages);
  } catch (error) {
    console.error('Error fetching static pages:', error);
    return NextResponse.json([]);
  }
}
