import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const albumId = searchParams.get('albumId');
    
    const where: { isActive: boolean; category?: string; albumId?: string | null } = { isActive: true };
    
    if (category && category !== 'Semua') {
      where.category = category;
    }
    
    if (albumId) {
      where.albumId = albumId;
    }
    
    const images = await db.galleryImage.findMany({
      where,
      orderBy: [
        { orderIndex: 'asc' },
        { createdAt: 'desc' }
      ],
      include: {
        album: {
          select: { id: true, title: true }
        }
      }
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const image = await db.galleryImage.create({
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        category: body.category ?? 'Kegiatan',
        isActive: body.isActive ?? true,
      }
    });
    return NextResponse.json(image);
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return NextResponse.json({ error: 'Failed to create gallery image' }, { status: 500 });
  }
}
