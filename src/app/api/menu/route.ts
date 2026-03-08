import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Public API for navigation menu
export async function GET() {
  try {
    const menuItems = await db.menuItem.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' },
    });

    // Organize into parent-child structure
    const parentMenus = menuItems.filter(item => !item.parentId);
    const childMenus = menuItems.filter(item => item.parentId);

    const menuWithChildren = parentMenus.map(parent => ({
      ...parent,
      children: childMenus.filter(child => child.parentId === parent.id)
        .sort((a, b) => a.orderIndex - b.orderIndex),
    }));

    return NextResponse.json(menuWithChildren);
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json([]);
  }
}
