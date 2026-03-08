import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - List all albums
export async function GET(request: NextRequest) {
  try {
    const albums = await prisma.album.findMany({
      orderBy: [
        { orderIndex: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        _count: {
          select: { galleryImages: true },
        },
      },
    });

    return NextResponse.json(albums);
  } catch (error) {
    console.error('Error fetching albums:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data album' },
      { status: 500 }
    );
  }
}

// POST - Create new album
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, coverImageUrl, orderIndex, isActive } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Judul album wajib diisi' },
        { status: 400 }
      );
    }

    // Get max order index
    const maxOrder = await prisma.album.aggregate({
      _max: { orderIndex: true },
    });
    const newOrderIndex = orderIndex ?? (maxOrder._max.orderIndex ?? 0) + 1;

    const album = await prisma.album.create({
      data: {
        title,
        description: description || null,
        coverImageUrl: coverImageUrl || null,
        orderIndex: newOrderIndex,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(album);
  } catch (error) {
    console.error('Error creating album:', error);
    return NextResponse.json(
      { error: 'Gagal membuat album' },
      { status: 500 }
    );
  }
}
