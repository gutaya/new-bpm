import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Default vision and mission content
const defaultVisionMission = {
  vision: 'Menjadi lembaga penjaminan mutu yang unggul dan terpercaya dalam mewujudkan budaya mutu di lingkungan Universitas Satya Negara Indonesia.',
  mission: `1. Menetapkan dan mengembangkan kebijakan, standar, dan prosedur penjaminan mutu pendidikan tinggi.
2. Melaksanakan monitoring, evaluasi, dan tindak lanjut pelaksanaan kebijakan, standar, dan prosedur penjaminan mutu.
3. Melaksanakan kegiatan audit mutu internal secara berkala.
4. Membina budaya mutu di lingkungan USNI.`,
  goals: `- Terwujudnya sistem penjaminan mutu internal yang efektif dan efisien.
- Terciptanya budaya mutu yang berkelanjutan di seluruh unit kerja.
- Meningkatnya kepuasan pemangku kepentingan terhadap layanan pendidikan.
- Tercapainya akreditasi institusi dan program studi yang baik.`,
};

// GET - Public API for vision & mission
export async function GET() {
  try {
    let visionMission = await db.visionMission.findFirst();

    // Return default if not exists
    if (!visionMission) {
      return NextResponse.json(defaultVisionMission);
    }

    return NextResponse.json(visionMission);
  } catch (error) {
    console.error('Error fetching vision & mission:', error);
    return NextResponse.json(defaultVisionMission);
  }
}
