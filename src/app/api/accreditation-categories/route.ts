import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Public API for accreditation categories
export async function GET() {
  try {
    // Get all accreditation categories
    const categories = await db.accreditationCategory.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        _count: {
          select: {
            accreditations: {
              where: { published: true }
            }
          }
        }
      }
    });

    // Also add default categories based on accreditation bodies
    const defaultCategories = [
      { id: 'ban-pt', name: 'Akreditasi BAN-PT', slug: 'ban-pt', type: 'body' },
      { id: 'lam-teknik', name: 'Akreditasi LAM Teknik', slug: 'lam-teknik', type: 'body' },
      { id: 'lam-infokom', name: 'Akreditasi LAM Infokom', slug: 'lam-infokom', type: 'body' },
      { id: 'internasional', name: 'Akreditasi Internasional', slug: 'internasional', type: 'category' },
      { id: 'institusi', name: 'Akreditasi Institusi', slug: 'institusi', type: 'special' },
    ];

    // Count accreditations for each default category
    const counts = await Promise.all(
      defaultCategories.map(async (cat) => {
        let count = 0;
        if (cat.slug === 'ban-pt') {
          count = await db.accreditationData.count({
            where: { published: true, accreditationBody: 'ban-pt' }
          });
        } else if (cat.slug === 'lam-teknik') {
          count = await db.accreditationData.count({
            where: { published: true, accreditationBody: 'lam-teknik' }
          });
        } else if (cat.slug === 'lam-infokom') {
          count = await db.accreditationData.count({
            where: { published: true, accreditationBody: 'lam-infokom' }
          });
        } else if (cat.slug === 'internasional') {
          count = await db.accreditationData.count({
            where: { published: true, category: 'internasional' }
          });
        } else if (cat.slug === 'institusi') {
          count = await db.accreditationData.count({
            where: { 
              published: true, 
              accreditationBody: 'ban-pt',
              title: { contains: 'Institusi' }
            }
          });
        }
        return { ...cat, count };
      })
    );

    // Transform categories from database
    const dbCategories = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      accreditationCount: cat._count.accreditations,
      type: 'custom'
    }));

    // Combine default categories with custom ones
    const result = [
      { id: 'all', name: 'Semua', slug: 'semua', accreditationCount: 0, type: 'all' },
      ...counts.filter(c => c.count > 0).map(c => ({
        ...c,
        accreditationCount: c.count
      })),
      ...dbCategories
    ];

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching accreditation categories:', error);
    return NextResponse.json([]);
  }
}
