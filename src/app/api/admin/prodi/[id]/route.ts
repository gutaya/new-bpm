import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Params = Promise<{ id: string }>;

// GET - Fetch single study program
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const studyProgram = await db.studyProgram.findUnique({
      where: { id },
      include: {
        faculty: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    if (!studyProgram) {
      return NextResponse.json(
        { error: 'Program studi tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(studyProgram);
  } catch (error) {
    console.error('Error fetching study program:', error);
    return NextResponse.json(
      { error: 'Gagal memuat data program studi' },
      { status: 500 }
    );
  }
}

// PATCH - Update study program
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      code,
      facultyId,
      degreeLevel,
      description,
      headName,
      accreditationStatus,
      accreditationBody,
      orderIndex,
      isActive,
    } = body;

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name.trim();
    if (code !== undefined) updateData.code = code?.trim() || null;
    if (facultyId !== undefined) updateData.facultyId = facultyId || null;
    if (degreeLevel !== undefined) updateData.degreeLevel = degreeLevel;
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (headName !== undefined) updateData.headName = headName?.trim() || null;
    if (accreditationStatus !== undefined) updateData.accreditationStatus = accreditationStatus?.trim() || null;
    if (accreditationBody !== undefined) updateData.accreditationBody = accreditationBody?.trim() || null;
    if (orderIndex !== undefined) updateData.orderIndex = orderIndex;
    if (isActive !== undefined) updateData.isActive = isActive;

    const studyProgram = await db.studyProgram.update({
      where: { id },
      data: updateData,
      include: {
        faculty: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return NextResponse.json(studyProgram);
  } catch (error) {
    console.error('Error updating study program:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui program studi' },
      { status: 500 }
    );
  }
}

// DELETE - Delete study program
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    await db.studyProgram.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting study program:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus program studi' },
      { status: 500 }
    );
  }
}
