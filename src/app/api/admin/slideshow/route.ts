import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { nanoid } from 'nanoid';

// GET - List all slideshows
export async function GET(request: NextRequest) {
  try {
    const slideshows = await db.slideshow.findMany({
      orderBy: [
        { orderIndex: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(slideshows);
  } catch (error) {
    console.error('Error fetching slideshows:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data slideshow' },
      { status: 500 }
    );
  }
}

// POST - Create new slideshow
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle, imageUrl, linkUrl, orderIndex, isActive } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: 'Judul dan gambar wajib diisi' },
        { status: 400 }
      );
    }

    // Get max order index
    const maxOrder = await db.slideshow.aggregate({
      _max: { orderIndex: true },
    });
    const newOrderIndex = orderIndex ?? (maxOrder._max.orderIndex ?? 0) + 1;

    const slideshow = await db.slideshow.create({
      data: {
        id: nanoid(),
        title,
        subtitle: subtitle || null,
        imageUrl,
        linkUrl: linkUrl || null,
        orderIndex: newOrderIndex,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(slideshow);
  } catch (error) {
    console.error('Error creating slideshow:', error);
    return NextResponse.json(
      { error: 'Gagal membuat slideshow' },
      { status: 500 }
    );
  }
}
