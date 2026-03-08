import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - List all quotes
export async function GET(request: NextRequest) {
  try {
    const quotes = await db.homepageQuote.findMany({
      orderBy: [
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data kutipan' },
      { status: 500 }
    );
  }
}

// POST - Create new quote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quoteText, authorName, authorTitle, imageUrl, isActive } = body;

    if (!quoteText) {
      return NextResponse.json(
        { error: 'Teks kutipan wajib diisi' },
        { status: 400 }
      );
    }

    const quote = await db.homepageQuote.create({
      data: {
        quoteText,
        authorName: authorName || null,
        authorTitle: authorTitle || null,
        imageUrl: imageUrl || null,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json(
      { error: 'Gagal membuat kutipan' },
      { status: 500 }
    );
  }
}
