import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Public API for documents (filtered by sub menu)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const menuUrl = searchParams.get('menuUrl');
    const menuItemId = searchParams.get('menuItemId');
    const search = searchParams.get('search');

    // Build filter
    const where: Record<string, unknown> = { published: true };

    // Filter by menuItemId directly
    if (menuItemId && menuItemId !== 'semua' && menuItemId !== 'all') {
      where.menuItemId = menuItemId;
    }
    // Filter by menu URL path
    else if (menuUrl && menuUrl !== 'semua' && menuUrl !== 'all') {
      // Find menu item by URL
      const menuItem = await db.menuItem.findFirst({
        where: { 
          url: menuUrl.startsWith('/') ? menuUrl : `/${menuUrl}`,
          isActive: true 
        },
        select: { id: true }
      });
      
      if (menuItem) {
        where.menuItemId = menuItem.id;
      } else {
        // No menu found, return empty
        return NextResponse.json([]);
      }
    }

    const documents = await db.document.findMany({
      where,
      include: {
        menuItem: {
          select: { id: true, title: true, url: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    // Filter by search term if provided
    let filteredDocs = documents;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredDocs = documents.filter((doc) =>
        doc.title.toLowerCase().includes(searchLower) ||
        doc.description?.toLowerCase().includes(searchLower)
      );
    }

    // Transform for frontend
    const result = filteredDocs.map((doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      menuItem: doc.menuItem ? {
        id: doc.menuItem.id,
        title: doc.menuItem.title,
        url: doc.menuItem.url
      } : null,
      date: doc.createdAt,
      size: doc.fileUrl ? 'PDF' : 'N/A',
      type: 'pdf',
      url: doc.fileUrl,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json([]);
  }
}
