import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Public API for documents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Build filter
    const where: Record<string, unknown> = { published: true };

    if (category && category !== 'semua') {
      where.category = category;
    }

    const documents = await db.document.findMany({
      where,
      include: {
        categoryRef: {
          select: { name: true, slug: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    // Filter by search term if provided
    let filteredDocs = documents;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredDocs = documents.filter((doc: Record<string, unknown>) =>
        (doc.title as string).toLowerCase().includes(searchLower) ||
        (doc.description as string)?.toLowerCase().includes(searchLower)
      );
    }

    // Transform for frontend
    const result = filteredDocs.map((doc: Record<string, unknown>) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      category: (doc.categoryRef as Record<string, string>)?.name || doc.category,
      categorySlug: doc.category,
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
