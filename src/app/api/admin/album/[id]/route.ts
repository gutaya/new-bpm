import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get single album
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const album = await prisma.album.findUnique({
      where: { id },
      include: {
        galleryImages: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!album) {
      return NextResponse.json(
        { error: 'Album tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(album);
  } catch (error) {
    console.error('Error fetching album:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data album' },
      { status: 500 }
    );
  }
}

// PATCH - Update album
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingAlbum = await prisma.album.findUnique({
      where: { id },
    });

    if (!existingAlbum) {
      return NextResponse.json(
        { error: 'Album tidak ditemukan' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description || null;
    if (body.coverImageUrl !== undefined) updateData.coverImageUrl = body.coverImageUrl || null;
    if (body.orderIndex !== undefined) updateData.orderIndex = body.orderIndex;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const album = await prisma.album.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(album);
  } catch (error) {
    console.error('Error updating album:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui album' },
      { status: 500 }
    );
  }
}

// DELETE - Delete album
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const album = await prisma.album.findUnique({
      where: { id },
      include: { _count: { select: { galleryImages: true } } },
    });

    if (!album) {
      return NextResponse.json(
        { error: 'Album tidak ditemukan' },
        { status: 404 }
      );
    }

    // Delete all images in this album first
    await prisma.galleryImage.deleteMany({
      where: { albumId: id },
    });

    // Delete the album
    await prisma.album.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting album:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus album' },
      { status: 500 }
    );
  }
}
