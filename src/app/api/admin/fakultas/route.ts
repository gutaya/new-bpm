import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all faculties (for admin, include all statuses)
export async function GET() {
  try {
    const faculties = await db.faculty.findMany({
      orderBy: { orderIndex: 'asc' },
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
        deanName: true,
        orderIndex: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { studyPrograms: true },
        },
      },
    });
    return NextResponse.json(faculties);
  } catch (error) {
    console.error('Error fetching faculties:', error);
    return NextResponse.json([]);
  }
}

// POST - Create new faculty
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, code, description, deanName, orderIndex, isActive } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Nama fakultas wajib diisi' }, { status: 400 });
    }

    const faculty = await db.faculty.create({
      data: {
        name: name.trim(),
        code: code?.trim() || null,
        description: description?.trim() || null,
        deanName: deanName?.trim() || null,
        orderIndex: orderIndex ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(faculty);
  } catch (error) {
    console.error('Error creating faculty:', error);
    return NextResponse.json({ error: 'Gagal membuat fakultas' }, { status: 500 });
  }
}
