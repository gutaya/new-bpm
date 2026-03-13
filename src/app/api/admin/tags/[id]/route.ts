import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get single tag by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const tag = await db.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { news: true }
        }
      }
    });

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      newsCount: tag._count.news,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data tag' },
      { status: 500 }
    );
  }
}

// PUT - Update tag
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Nama tag tidak boleh kosong' },
        { status: 400 }
      );
    }

    // Check if tag exists
    const existingTag = await db.tag.findUnique({
      where: { id }
    });

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag tidak ditemukan' },
        { status: 404 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if another tag with same name or slug exists
    const duplicateTag = await db.tag.findFirst({
      where: {
        OR: [
          { name: name.trim() },
          { slug }
        ],
        NOT: { id }
      }
    });

    if (duplicateTag) {
      return NextResponse.json(
        { error: 'Tag dengan nama tersebut sudah ada' },
        { status: 400 }
      );
    }

    const tag = await db.tag.update({
      where: { id },
      data: {
        name: name.trim(),
        slug,
      }
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui tag' },
      { status: 500 }
    );
  }
}

// DELETE - Delete tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if tag exists
    const existingTag = await db.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { news: true }
        }
      }
    });

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag tidak ditemukan' },
        { status: 404 }
      );
    }

    // Delete all news-tag relations first (cascade should handle this, but let's be explicit)
    await db.newsTag.deleteMany({
      where: { tagId: id }
    });

    // Delete the tag
    await db.tag.delete({
      where: { id }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Tag berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus tag' },
      { status: 500 }
    );
  }
}
