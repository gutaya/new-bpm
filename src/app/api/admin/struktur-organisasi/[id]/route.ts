import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Params = Promise<{ id: string }>;

// GET - Fetch single organization structure member
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const member = await db.organizationStructure.findUnique({
      where: { id },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Anggota tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error fetching organization structure member:', error);
    return NextResponse.json(
      { error: 'Gagal memuat data anggota' },
      { status: 500 }
    );
  }
}

// PATCH - Update organization structure member
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, position, photoUrl, orderIndex } = body;

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name;
    if (position !== undefined) updateData.position = position;
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl;
    if (orderIndex !== undefined) updateData.orderIndex = orderIndex;

    const member = await db.organizationStructure.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error updating organization structure member:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui data anggota' },
      { status: 500 }
    );
  }
}

// DELETE - Delete organization structure member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    await db.organizationStructure.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting organization structure member:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus anggota' },
      { status: 500 }
    );
  }
}
