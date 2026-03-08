import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Params = Promise<{ id: string }>;

// GET - Fetch single menu item
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const menuItem = await db.menuItem.findUnique({
      where: { id },
      include: {
        children: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });

    if (!menuItem) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    return NextResponse.json({ error: 'Failed to fetch menu item' }, { status: 500 });
  }
}

// PATCH - Update menu item
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, url, icon, parentId, orderIndex, isActive } = body;

    // Check if menu item exists
    const existing = await db.menuItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    // Prevent self-referencing
    if (parentId === id) {
      return NextResponse.json(
        { error: 'Menu cannot be its own parent' },
        { status: 400 }
      );
    }

    // Validate parent exists if parentId is provided
    if (parentId) {
      const parent = await db.menuItem.findUnique({
        where: { id: parentId }
      });
      if (!parent) {
        return NextResponse.json(
          { error: 'Parent menu not found' },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (url !== undefined) updateData.url = url || null;
    if (icon !== undefined) updateData.icon = icon || null;
    if (parentId !== undefined) updateData.parentId = parentId || null;
    if (orderIndex !== undefined) updateData.orderIndex = orderIndex;
    if (isActive !== undefined) updateData.isActive = isActive;

    const menuItem = await db.menuItem.update({
      where: { id },
      data: updateData,
      include: {
        children: true
      }
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

// DELETE - Delete menu item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;

    // Check if menu item exists
    const existing = await db.menuItem.findUnique({
      where: { id },
      include: { children: true }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    // Check if menu has children
    if (existing.children.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete menu with submenus. Delete or move submenus first.' },
        { status: 400 }
      );
    }

    await db.menuItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}
