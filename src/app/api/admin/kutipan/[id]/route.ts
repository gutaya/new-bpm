import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get single quote
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const quote = await db.homepageQuote.findUnique({
      where: { id },
    });

    if (!quote) {
      return NextResponse.json(
        { error: 'Kutipan tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data kutipan' },
      { status: 500 }
    );
  }
}

// PATCH - Update quote
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingQuote = await db.homepageQuote.findUnique({
      where: { id },
    });

    if (!existingQuote) {
      return NextResponse.json(
        { error: 'Kutipan tidak ditemukan' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.quoteText !== undefined) updateData.quoteText = body.quoteText;
    if (body.authorName !== undefined) updateData.authorName = body.authorName || null;
    if (body.authorTitle !== undefined) updateData.authorTitle = body.authorTitle || null;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl || null;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const quote = await db.homepageQuote.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Error updating quote:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui kutipan' },
      { status: 500 }
    );
  }
}

// DELETE - Delete quote
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const quote = await db.homepageQuote.findUnique({
      where: { id },
    });

    if (!quote) {
      return NextResponse.json(
        { error: 'Kutipan tidak ditemukan' },
        { status: 404 }
      );
    }

    await db.homepageQuote.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quote:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus kutipan' },
      { status: 500 }
    );
  }
}
