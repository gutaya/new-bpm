import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all contact messages
export async function GET() {
  try {
    const messages = await db.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json([]);
  }
}
