import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body as { items: { id: string; orderIndex: number }[] };

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Update order for each item
    for (const item of items) {
      await db.quickLink.update({
        where: { id: item.id },
        data: { orderIndex: item.orderIndex }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering quick links:', error);
    return NextResponse.json({ error: 'Failed to reorder quick links' }, { status: 500 });
  }
}
