import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Params = Promise<{ id: string }>;

// GET - Fetch single accreditation
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const accreditation = await db.accreditationData.findUnique({
      where: { id },
      include: {
        categoryRef: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!accreditation) {
      return NextResponse.json({ error: 'Accreditation not found' }, { status: 404 });
    }

    return NextResponse.json(accreditation);
  } catch (error) {
    console.error('Error fetching accreditation:', error);
    return NextResponse.json({ error: 'Failed to fetch accreditation' }, { status: 500 });
  }
}

// PATCH - Update accreditation
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      description,
      category,
      categoryId,
      accreditationBody,
      certificateUrl,
      imageUrl,
      validUntil,
      published,
    } = body;

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (categoryId !== undefined) updateData.categoryId = categoryId || null;
    if (accreditationBody !== undefined) updateData.accreditationBody = accreditationBody;
    if (certificateUrl !== undefined) updateData.certificateUrl = certificateUrl || null;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null;
    if (validUntil !== undefined) updateData.validUntil = validUntil ? new Date(validUntil) : null;
    if (published !== undefined) updateData.published = published;

    const accreditation = await db.accreditationData.update({
      where: { id },
      data: updateData,
      include: {
        categoryRef: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(accreditation);
  } catch (error) {
    console.error('Error updating accreditation:', error);
    return NextResponse.json({ error: 'Failed to update accreditation' }, { status: 500 });
  }
}

// DELETE - Delete accreditation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    await db.accreditationData.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting accreditation:', error);
    return NextResponse.json({ error: 'Failed to delete accreditation' }, { status: 500 });
  }
}
