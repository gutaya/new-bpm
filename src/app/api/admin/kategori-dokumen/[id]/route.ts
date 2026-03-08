import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get single document category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const category = await db.documentCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { documents: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Kategori tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching document category:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data kategori' },
      { status: 500 }
    );
  }
}

// PATCH - Update document category
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, icon, orderIndex, isActive } = body;

    // Check if category exists
    const existingCategory = await db.documentCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Kategori tidak ditemukan' },
        { status: 404 }
      );
    }

    // Generate slug if name changed and slug not provided
    let categorySlug = slug;
    if (name && !slug) {
      categorySlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Check if new slug conflicts with another category
    if (categorySlug && categorySlug !== existingCategory.slug) {
      const slugConflict = await db.documentCategory.findUnique({
        where: { slug: categorySlug },
      });
      if (slugConflict) {
        return NextResponse.json(
          { error: 'Slug kategori sudah digunakan' },
          { status: 400 }
        );
      }
    }

    const category = await db.documentCategory.update({
      where: { id },
      data: {
        name: name || existingCategory.name,
        slug: categorySlug || existingCategory.slug,
        description: description !== undefined ? description : existingCategory.description,
        icon: icon !== undefined ? icon : existingCategory.icon,
        orderIndex: orderIndex !== undefined ? orderIndex : existingCategory.orderIndex,
        isActive: isActive !== undefined ? isActive : existingCategory.isActive,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating document category:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui kategori' },
      { status: 500 }
    );
  }
}

// DELETE - Delete document category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if category has documents
    const categoryWithDocs = await db.documentCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { documents: true },
        },
      },
    });

    if (!categoryWithDocs) {
      return NextResponse.json(
        { error: 'Kategori tidak ditemukan' },
        { status: 404 }
      );
    }

    if (categoryWithDocs._count.documents > 0) {
      return NextResponse.json(
        { error: `Tidak dapat menghapus kategori yang memiliki ${categoryWithDocs._count.documents} dokumen` },
        { status: 400 }
      );
    }

    await db.documentCategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document category:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus kategori' },
      { status: 500 }
    );
  }
}
