import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const slideshows = await db.slideshow.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' },
    });
    return NextResponse.json(slideshows);
  } catch (error) {
    console.error('Error fetching slideshows:', error);
    return NextResponse.json([]);
  }
}
