import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Params = Promise<{ id: string }>;

// GET - Fetch single quick link
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const quickLink = await db.quickLink.findUnique({
      where: { id },
    });

    if (!quickLink) {
      return NextResponse.json({ error: 'Quick link not found' }, { status: 404 });
    }

    return NextResponse.json(quickLink);
  } catch (error) {
    console.error('Error fetching quick link:', error);
    return NextResponse.json({ error: 'Failed to fetch quick link' }, { status: 500 });
  }
}

// PATCH - Update quick link
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, url, icon, orderIndex, isActive } = body;

    // Check if quick link exists
    const existing = await db.quickLink.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Quick link not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (url !== undefined) updateData.url = url;
    if (icon !== undefined) updateData.icon = icon || 'Link';
    if (orderIndex !== undefined) updateData.orderIndex = orderIndex;
    if (isActive !== undefined) updateData.isActive = isActive;

    const quickLink = await db.quickLink.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(quickLink);
  } catch (error) {
    console.error('Error updating quick link:', error);
    return NextResponse.json({ error: 'Failed to update quick link' }, { status: 500 });
  }
}

// DELETE - Delete quick link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;

    // Check if quick link exists
    const existing = await db.quickLink.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: 'Quick link not found' }, { status: 404 });
    }

    await db.quickLink.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quick link:', error);
    return NextResponse.json({ error: 'Failed to delete quick link' }, { status: 500 });
  }
}
