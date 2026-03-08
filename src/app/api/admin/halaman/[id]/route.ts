import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Params = Promise<{ id: string }>;

// GET - Fetch single static page
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const staticPage = await db.staticPage.findUnique({
      where: { id },
    });

    if (!staticPage) {
      return NextResponse.json({ error: 'Static page not found' }, { status: 404 });
    }

    return NextResponse.json(staticPage);
  } catch (error) {
    console.error('Error fetching static page:', error);
    return NextResponse.json({ error: 'Failed to fetch static page' }, { status: 500 });
  }
}

// PATCH - Update static page
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, slug, description, content, icon, menuCategory, orderIndex, published } = body;

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (icon !== undefined) updateData.icon = icon;
    if (menuCategory !== undefined) updateData.menuCategory = menuCategory;
    if (orderIndex !== undefined) updateData.orderIndex = orderIndex;
    if (published !== undefined) updateData.published = published;

    const staticPage = await db.staticPage.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(staticPage);
  } catch (error) {
    console.error('Error updating static page:', error);
    return NextResponse.json({ error: 'Failed to update static page' }, { status: 500 });
  }
}

// DELETE - Delete static page
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    await db.staticPage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting static page:', error);
    return NextResponse.json({ error: 'Failed to delete static page' }, { status: 500 });
  }
}
