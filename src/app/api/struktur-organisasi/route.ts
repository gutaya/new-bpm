import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Public API for organization structure
export async function GET() {
  try {
    const members = await db.organizationStructure.findMany({
      where: {},
      orderBy: { orderIndex: 'asc' },
    });

    if (members.length === 0) {
      // Return default structure
      return NextResponse.json({
        kepala: {
          name: 'Dr. Ir. Dwi Ernaningsih, M.Si.',
          position: 'Kepala Badan Penjaminan Mutu',
          photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
        },
        coordinators: [
          {
            name: 'Dr. Achmad Budiman Soedarsono, S.Sos., M.I.Kom.',
            position: 'Koordinator Bidang Perencanaan dan Pengembangan',
            photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
          },
          {
            name: 'Tagor Darius Sidauruk, SE, M.Si., CRP',
            position: 'Koordinator Bagian Monitoring dan Evaluasi',
            photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
          },
        ],
        sekretaris: {
          name: 'Imaniah Aliati, S.Kom',
          position: 'Sekretaris',
          photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
        },
      });
    }

    // Transform database data into expected format
    const kepala = members.find(m => m.position.toLowerCase().includes('kepala'));
    const sekretaris = members.find(m => m.position.toLowerCase().includes('sekretaris'));
    const coordinators = members.filter(m =>
      !m.position.toLowerCase().includes('kepala') &&
      !m.position.toLowerCase().includes('sekretaris')
    );

    return NextResponse.json({
      kepala: kepala ? {
        name: kepala.name,
        position: kepala.position,
        photoUrl: kepala.photoUrl,
      } : null,
      coordinators: coordinators.map(c => ({
        name: c.name,
        position: c.position,
        photoUrl: c.photoUrl,
      })),
      sekretaris: sekretaris ? {
        name: sekretaris.name,
        position: sekretaris.position,
        photoUrl: sekretaris.photoUrl,
      } : null,
    });
  } catch (error) {
    console.error('Error fetching organization structure:', error);
    return NextResponse.json({
      kepala: null,
      coordinators: [],
      sekretaris: null,
    });
  }
}
