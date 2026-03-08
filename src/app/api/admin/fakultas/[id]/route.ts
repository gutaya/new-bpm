import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Params = Promise<{ id: string }>;

// GET - Fetch single faculty
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const faculty = await db.faculty.findUnique({
      where: { id },
      include: {
        studyPrograms: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!faculty) {
      return NextResponse.json({ error: 'Fakultas tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(faculty);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    return NextResponse.json({ error: 'Gagal memuat data fakultas' }, { status: 500 });
  }
}

// PATCH - Update faculty
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, code, description, deanName, orderIndex, isActive } = body;

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name.trim();
    if (code !== undefined) updateData.code = code?.trim() || null;
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (deanName !== undefined) updateData.deanName = deanName?.trim() || null;
    if (orderIndex !== undefined) updateData.orderIndex = orderIndex;
    if (isActive !== undefined) updateData.isActive = isActive;

    const faculty = await db.faculty.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(faculty);
  } catch (error) {
    console.error('Error updating faculty:', error);
    return NextResponse.json({ error: 'Gagal memperbarui fakultas' }, { status: 500 });
  }
}

// DELETE - Delete faculty
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    
    // Check if faculty has study programs
    const faculty = await db.faculty.findUnique({
      where: { id },
      include: {
        _count: {
          select: { studyPrograms: true },
        },
      },
    });

    if (!faculty) {
      return NextResponse.json({ error: 'Fakultas tidak ditemukan' }, { status: 404 });
    }

    if (faculty._count.studyPrograms > 0) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus fakultas yang masih memiliki program studi' },
        { status: 400 }
      );
    }

    await db.faculty.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    return NextResponse.json({ error: 'Gagal menghapus fakultas' }, { status: 500 });
  }
}
