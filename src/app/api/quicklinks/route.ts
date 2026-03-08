import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const links = await db.quickLink.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' }
    });
    return NextResponse.json(links);
  } catch (error) {
    console.error('Error fetching quick links:', error);
    return NextResponse.json({ error: 'Failed to fetch quick links' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const link = await db.quickLink.create({
      data: {
        title: body.title,
        url: body.url,
        icon: body.icon,
        orderIndex: body.orderIndex ?? 0,
      }
    });
    return NextResponse.json(link);
  } catch (error) {
    console.error('Error creating quick link:', error);
    return NextResponse.json({ error: 'Failed to create quick link' }, { status: 500 });
  }
}
