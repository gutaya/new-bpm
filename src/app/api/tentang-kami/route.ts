import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Default about content
const defaultAboutContent = {
  content: `<p>Badan Penjaminan Mutu (BPM) Universitas Satya Negara Indonesia merupakan lembaga yang bertanggung jawab dalam mengkoordinasikan, mengendalikan, dan mengaudit mutu secara internal di lingkungan universitas.</p>`,
};

// GET - Public API for about us content
export async function GET() {
  try {
    const aboutUs = await db.aboutUs.findFirst();

    if (!aboutUs) {
      return NextResponse.json(defaultAboutContent);
    }

    return NextResponse.json({
      content: aboutUs.content,
    });
  } catch (error) {
    console.error('Error fetching about us:', error);
    return NextResponse.json(defaultAboutContent);
  }
}
