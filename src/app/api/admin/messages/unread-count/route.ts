import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Count unread messages
    const count = await db.contactMessage.count({
      where: {
        isRead: false,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil jumlah pesan belum dibaca' },
      { status: 500 }
    );
  }
}
