import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body as { items: { id: string; orderIndex: number; parentId?: string | null }[] };

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Update order for each item using a transaction-like approach
    for (const item of items) {
      await db.menuItem.update({
        where: { id: item.id },
        data: { 
          orderIndex: item.orderIndex,
          ...(item.parentId !== undefined && { parentId: item.parentId || null })
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering menu items:', error);
    return NextResponse.json({ error: 'Failed to reorder menu items' }, { status: 500 });
  }
}
