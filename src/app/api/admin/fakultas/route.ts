import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all faculties
export async function GET() {
  try {
    const faculties = await db.faculty.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });
    return NextResponse.json(faculties);
  } catch (error) {
    console.error('Error fetching faculties:', error);
    return NextResponse.json([]);
  }
}
