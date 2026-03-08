import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get single slideshow
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const slideshow = await db.slideshow.findUnique({
      where: { id },
    });

    if (!slideshow) {
      return NextResponse.json(
        { error: 'Slideshow tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(slideshow);
  } catch (error) {
    console.error('Error fetching slideshow:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data slideshow' },
      { status: 500 }
    );
  }
}

// PATCH - Update slideshow
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingSlideshow = await db.slideshow.findUnique({
      where: { id },
    });

    if (!existingSlideshow) {
      return NextResponse.json(
        { error: 'Slideshow tidak ditemukan' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.subtitle !== undefined) updateData.subtitle = body.subtitle || null;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.linkUrl !== undefined) updateData.linkUrl = body.linkUrl || null;
    if (body.orderIndex !== undefined) updateData.orderIndex = body.orderIndex;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const slideshow = await db.slideshow.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(slideshow);
  } catch (error) {
    console.error('Error updating slideshow:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui slideshow' },
      { status: 500 }
    );
  }
}

// DELETE - Delete slideshow
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const slideshow = await db.slideshow.findUnique({
      where: { id },
    });

    if (!slideshow) {
      return NextResponse.json(
        { error: 'Slideshow tidak ditemukan' },
        { status: 404 }
      );
    }

    await db.slideshow.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting slideshow:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus slideshow' },
      { status: 500 }
    );
  }
}
