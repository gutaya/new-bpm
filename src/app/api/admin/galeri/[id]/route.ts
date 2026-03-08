import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get single gallery image
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const image = await prisma.galleryImage.findUnique({
      where: { id },
      include: {
        album: {
          select: { id: true, title: true },
        },
      },
    });

    if (!image) {
      return NextResponse.json(
        { error: 'Gambar tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data gambar' },
      { status: 500 }
    );
  }
}

// PATCH - Update gallery image
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingImage = await prisma.galleryImage.findUnique({
      where: { id },
    });

    if (!existingImage) {
      return NextResponse.json(
        { error: 'Gambar tidak ditemukan' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description || null;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.albumId !== undefined) updateData.albumId = body.albumId || null;
    if (body.orderIndex !== undefined) updateData.orderIndex = body.orderIndex;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const image = await prisma.galleryImage.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui gambar' },
      { status: 500 }
    );
  }
}

// DELETE - Delete gallery image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const image = await prisma.galleryImage.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json(
        { error: 'Gambar tidak ditemukan' },
        { status: 404 }
      );
    }

    await prisma.galleryImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus gambar' },
      { status: 500 }
    );
  }
}
