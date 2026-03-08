import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - List all gallery images
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const albumId = searchParams.get('albumId');

    const where = albumId ? { albumId } : {};

    const images = await prisma.galleryImage.findMany({
      where,
      orderBy: [
        { orderIndex: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        album: {
          select: { id: true, title: true },
        },
      },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data galeri' },
      { status: 500 }
    );
  }
}

// POST - Create new gallery image
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, category, albumId, orderIndex, isActive } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: 'Judul dan URL gambar wajib diisi' },
        { status: 400 }
      );
    }

    // Get max order index
    const maxOrder = await prisma.galleryImage.aggregate({
      _max: { orderIndex: true },
    });
    const newOrderIndex = orderIndex ?? (maxOrder._max.orderIndex ?? 0) + 1;

    const image = await prisma.galleryImage.create({
      data: {
        title,
        description: description || null,
        imageUrl,
        category: category || 'Kegiatan',
        albumId: albumId || null,
        orderIndex: newOrderIndex,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return NextResponse.json(
      { error: 'Gagal membuat gambar galeri' },
      { status: 500 }
    );
  }
}
