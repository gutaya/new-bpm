import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { nanoid } from 'nanoid';

// POST - Receive contact form submissions from public website
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nama, email, dan pesan wajib diisi' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    // Save to database
    const contactMessage = await db.contactMessage.create({
      data: {
        id: nanoid(),
        name,
        email,
        subject: subject || null,
        message,
        isRead: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Pesan berhasil dikirim',
      data: {
        id: contactMessage.id,
        name: contactMessage.name,
        email: contactMessage.email,
        subject: contactMessage.subject,
        createdAt: contactMessage.createdAt,
      },
    });
  } catch (error) {
    console.error('Error saving contact message:', error);
    return NextResponse.json(
      { error: 'Gagal mengirim pesan. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
