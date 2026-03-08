import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all menu items with parent-child relationships
export async function GET() {
  try {
    // Only fetch parent menu items (parentId is null), children will be included
    const menuItems = await db.menuItem.findMany({
      where: {
        parentId: null
      },
      orderBy: [
        { orderIndex: 'asc' },
        { createdAt: 'asc' }
      ],
      include: {
        children: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json([]);
  }
}

// POST - Create new menu item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, url, icon, parentId, orderIndex, isActive } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
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

    const menuItem = await db.menuItem.create({
      data: {
        title,
        url: url || null,
        icon: icon || null,
        parentId: parentId || null,
        orderIndex: orderIndex ?? 0,
        isActive: isActive ?? true,
      },
      include: {
        children: true
      }
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}
