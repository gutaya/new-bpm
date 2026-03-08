import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Default about us content
const defaultAboutUs = {
  content: `<h2>Tentang Kami</h2>
<p>Selamat datang di website resmi kami. Kami adalah institusi pendidikan tinggi yang berkomitmen untuk menghasilkan lulusan yang berkualitas dan berdaya saing global.</p>

<h3>Sejarah Singkat</h3>
<p>Didirikan dengan semangat untuk memajukan pendidikan di Indonesia, kami terus berkembang menjadi institusi yang diakui secara nasional maupun internasional.</p>

<h3>Visi</h3>
<p>Menjadi institusi pendidikan tinggi yang unggul, inovatif, dan berdaya saing global.</p>

<h3>Misi</h3>
<ul>
<li>Menyelenggarakan pendidikan tinggi yang berkualitas</li>
<li>Melaksanakan penelitian yang berkontribusi bagi masyarakat</li>
<li>Mengembangkan pengabdian kepada masyarakat</li>
</ul>
`,
};

// GET - Get about us data (create default if not exists)
export async function GET() {
  try {
    let aboutUs = await db.aboutUs.findFirst();

    // Create default if not exists
    if (!aboutUs) {
      aboutUs = await db.aboutUs.create({
        data: defaultAboutUs,
      });
    }

    return NextResponse.json(aboutUs);
  } catch (error) {
    console.error('Error fetching about us:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data tentang kami' },
      { status: 500 }
    );
  }
}

// PUT/PATCH - Update about us
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Konten wajib diisi' },
        { status: 400 }
      );
    }

    // Check if exists
    let aboutUs = await db.aboutUs.findFirst();

    if (aboutUs) {
      // Update existing
      aboutUs = await db.aboutUs.update({
        where: { id: aboutUs.id },
        data: {
          content,
        },
      });
    } else {
      // Create new
      aboutUs = await db.aboutUs.create({
        data: {
          content,
        },
      });
    }

    return NextResponse.json(aboutUs);
  } catch (error) {
    console.error('Error updating about us:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate tentang kami' },
      { status: 500 }
    );
  }
}

// PATCH - Alias for PUT
export async function PATCH(request: NextRequest) {
  return PUT(request);
}
