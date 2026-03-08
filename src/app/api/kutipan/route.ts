import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Default homepage quote
const defaultQuote = {
  quoteText: 'Menggenggam Mutu, Meningkatkan Daya Saing',
  authorName: 'Dr. Ir. Dwi Ernaningsih, M.Si.',
  authorTitle: 'Kepala Badan Penjaminan Mutu',
  imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
};

// GET - Public API for homepage quote
export async function GET() {
  try {
    const quote = await db.homepageQuote.findFirst({
      where: { isActive: true },
    });

    // Return default if not exists
    if (!quote) {
      return NextResponse.json(defaultQuote);
    }

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Error fetching homepage quote:', error);
    return NextResponse.json(defaultQuote);
  }
}
