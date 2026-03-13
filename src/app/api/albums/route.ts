import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Fetch albums with first image for cover
    const albums = await db.album.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' },
      include: {
        galleryImages: {
          where: { isActive: true },
          take: 1,
          select: { imageUrl: true },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    // Get count of active images for each album
    const albumIds = albums.map(a => a.id);
    const imageCounts = await db.galleryImage.groupBy({
      by: ['albumId'],
      where: {
        albumId: { in: albumIds },
        isActive: true,
      },
      _count: { id: true },
    });

    // Create a map of albumId -> count
    const countMap = new Map(
      imageCounts.map(item => [item.albumId, item._count.id])
    );

    // Transform albums with cover image and correct count
    const albumsWithCover = albums.map((album) => ({
      id: album.id,
      title: album.title,
      description: album.description,
      coverImageUrl: album.coverImageUrl || album.galleryImages[0]?.imageUrl || null,
      orderIndex: album.orderIndex,
      isActive: album.isActive,
      createdAt: album.createdAt,
      updatedAt: album.updatedAt,
      _count: {
        galleryImages: countMap.get(album.id) || 0,
      },
    }));

    return NextResponse.json(albumsWithCover);
  } catch (error) {
    console.error('Error fetching albums:', error);
    return NextResponse.json({ error: 'Failed to fetch albums' }, { status: 500 });
  }
}
