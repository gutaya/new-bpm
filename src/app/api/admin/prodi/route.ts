import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all study programs with faculty relation
export async function GET() {
  try {
    const studyPrograms = await db.studyProgram.findMany({
      include: {
        faculty: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: [
        { orderIndex: 'asc' },
        { createdAt: 'desc' },
      ],
    });
    return NextResponse.json(studyPrograms);
  } catch (error) {
    console.error('Error fetching study programs:', error);
    return NextResponse.json([]);
  }
}

// POST - Create new study program
export async function POST(request: NextRequest) {
  try {
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

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Nama program studi wajib diisi' },
        { status: 400 }
      );
    }

    const studyProgram = await db.studyProgram.create({
      data: {
        name: name.trim(),
        code: code?.trim() || null,
        facultyId: facultyId || null,
        degreeLevel: degreeLevel || 's1',
        description: description?.trim() || null,
        headName: headName?.trim() || null,
        accreditationStatus: accreditationStatus?.trim() || null,
        accreditationBody: accreditationBody?.trim() || null,
        orderIndex: orderIndex ?? 0,
        isActive: isActive ?? true,
      },
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
    console.error('Error creating study program:', error);
    return NextResponse.json(
      { error: 'Gagal membuat program studi' },
      { status: 500 }
    );
  }
}
