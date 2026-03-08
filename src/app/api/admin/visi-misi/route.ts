import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Default vision and mission content
const defaultVisionMission = {
  vision: 'Menjadi institusi pendidikan tinggi yang unggul, inovatif, dan berdaya saing global dalam pengembangan ilmu pengetahuan, teknologi, dan seni.',
  mission: `1. Menyelenggarakan pendidikan tinggi yang berkualitas dan relevan dengan kebutuhan pembangunan nasional dan global.
2. Melaksanakan penelitian yang berkontribusi pada pengembangan ilmu pengetahuan, teknologi, dan seni.
3. Mengembangkan pengabdian kepada masyarakat yang bermanfaat bagi kesejahteraan rakyat.
4. Membangun kerjasama dengan berbagai pihak untuk meningkatkan kualitas tri dharma perguruan tinggi.`,
  goals: null,
};

// GET - Get vision & mission data (create default if not exists)
export async function GET() {
  try {
    let visionMission = await db.visionMission.findFirst();

    // Create default if not exists
    if (!visionMission) {
      visionMission = await db.visionMission.create({
        data: defaultVisionMission,
      });
    }

    return NextResponse.json(visionMission);
  } catch (error) {
    console.error('Error fetching vision & mission:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data visi & misi' },
      { status: 500 }
    );
  }
}

// PUT/PATCH - Update vision & mission
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { vision, mission, goals } = body;

    if (!vision || !mission) {
      return NextResponse.json(
        { error: 'Visi dan Misi wajib diisi' },
        { status: 400 }
      );
    }

    // Check if exists
    let visionMission = await db.visionMission.findFirst();

    if (visionMission) {
      // Update existing
      visionMission = await db.visionMission.update({
        where: { id: visionMission.id },
        data: {
          vision,
          mission,
          goals: goals || null,
        },
      });
    } else {
      // Create new
      visionMission = await db.visionMission.create({
        data: {
          vision,
          mission,
          goals: goals || null,
        },
      });
    }

    return NextResponse.json(visionMission);
  } catch (error) {
    console.error('Error updating vision & mission:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate visi & misi' },
      { status: 500 }
    );
  }
}

// PATCH - Alias for PUT
export async function PATCH(request: NextRequest) {
  return PUT(request);
}
