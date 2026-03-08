import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Public API for website identity (used in footer, header, etc.)
export async function GET() {
  try {
    const identity = await db.websiteIdentity.findFirst();

    if (!identity) {
      return NextResponse.json(null);
    }

    return NextResponse.json(identity);
  } catch (error) {
    console.error('Error fetching website identity:', error);
    return NextResponse.json(null);
  }
}
