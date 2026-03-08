import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - List all accreditation categories
export async function GET() {
  try {
    const categories = await db.accreditationCategory.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: {
          select: { accreditations: true },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching accreditation categories:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data kategori akreditasi' },
      { status: 500 }
    );
  }
}

// POST - Create new accreditation category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, icon, orderIndex, isActive } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Nama kategori wajib diisi' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const categorySlug = slug || name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingCategory = await db.accreditationCategory.findUnique({
      where: { slug: categorySlug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Slug kategori sudah digunakan' },
        { status: 400 }
      );
    }

    const category = await db.accreditationCategory.create({
      data: {
        name,
        slug: categorySlug,
        description: description || null,
        icon: icon || null,
        orderIndex: orderIndex || 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating accreditation category:', error);
    return NextResponse.json(
      { error: 'Gagal membuat kategori akreditasi' },
      { status: 500 }
    );
  }
}
