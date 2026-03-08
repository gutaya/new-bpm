import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all organization structure members
export async function GET() {
  try {
    const members = await db.organizationStructure.findMany({
      orderBy: { orderIndex: 'asc' },
    });
    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching organization structure:', error);
    return NextResponse.json([]);
  }
}

// POST - Create new organization structure member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, position, photoUrl, orderIndex } = body;

    if (!name || !position) {
      return NextResponse.json(
        { error: 'Nama dan jabatan wajib diisi' },
        { status: 400 }
      );
    }

    // Get the highest orderIndex if not provided
    let finalOrderIndex = orderIndex;
    if (finalOrderIndex === undefined || finalOrderIndex === null) {
      const highestOrder = await db.organizationStructure.findFirst({
        orderBy: { orderIndex: 'desc' },
        select: { orderIndex: true },
      });
      finalOrderIndex = (highestOrder?.orderIndex ?? -1) + 1;
    }

    const member = await db.organizationStructure.create({
      data: {
        name,
        position,
        photoUrl,
        orderIndex: finalOrderIndex,
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error creating organization structure member:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan anggota struktur organisasi' },
      { status: 500 }
    );
  }
}
