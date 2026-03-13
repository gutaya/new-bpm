import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Status colors
const statusColors: Record<string, string> = {
  'Unggul': '#10b981',       // emerald-500
  'A': '#10b981',           // emerald-500
  'Baik Sekali': '#3b82f6', // blue-500
  'Baik': '#f59e0b',        // amber-500
  'B': '#f59e0b',           // amber-500
  'C': '#ef4444',           // red-500
};

// GET - API for accreditation chart data based on Program Studi
export async function GET() {
  try {
    // Get all accreditation data with study program info
    const accreditations = await db.accreditationData.findMany({
      where: { published: true },
      select: {
        title: true,
        accreditationBody: true,
        accreditationStatus: true,
        studyProgram: {
          select: {
            id: true,
            name: true,
            code: true,
            degreeLevel: true,
            faculty: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    // Group by accreditation body
    const groupedData: Record<string, {
      name: string;
      items: { status: string; count: number; programs: string[]; studyPrograms: { id: string; name: string; faculty?: string | null }[] }[]
    }> = {};

    // Lembaga names mapping
    const lembagaNames: Record<string, string> = {
      'ban-pt': 'BAN-PT',
      'lamemba': 'LAMEMBA',
      'lam-teknik': 'LAM TEKNIK',
      'lam-infokom': 'LAM INFOKOM',
      'lamspak': 'LAMSPAK',
    };

    // Process each accreditation
    accreditations.forEach((acc) => {
      const body = acc.accreditationBody || 'ban-pt';
      const lembagaName = lembagaNames[body] || body.toUpperCase();
      const status = acc.accreditationStatus || 'B';

      // Get program name - prefer study program name if linked
      const programName = acc.studyProgram?.name || acc.title || '';

      // Skip institution accreditation for program studi count
      const isInstitution = !acc.studyProgram && (
        programName.toLowerCase().includes('universitas') ||
        programName.toLowerCase().includes('institusi')
      );

      if (!groupedData[body]) {
        groupedData[body] = {
          name: lembagaName,
          items: []
        };
      }

      // Find or create status group
      let statusGroup = groupedData[body].items.find(s => s.status === status);
      if (!statusGroup) {
        statusGroup = { status, count: 0, programs: [], studyPrograms: [] };
        groupedData[body].items.push(statusGroup);
      }

      // Only count program studi (not institution)
      if (!isInstitution) {
        statusGroup.count++;
        statusGroup.programs.push(programName);
        if (acc.studyProgram) {
          statusGroup.studyPrograms.push({
            id: acc.studyProgram.id,
            name: acc.studyProgram.name,
            faculty: acc.studyProgram.faculty?.name || null,
          });
        }
      }
    });

    // Convert to chart format
    const result: {
      id: string;
      name: string;
      category: string;
      count: number;
      programs: string;
      studyPrograms: string;
      color: string;
    }[] = [];

    Object.entries(groupedData).forEach(([body, data]) => {
      data.items.forEach((item, idx) => {
        result.push({
          id: `${body}-${idx}`,
          name: data.name,
          category: item.status,
          count: item.count,
          programs: JSON.stringify(item.programs),
          studyPrograms: JSON.stringify(item.studyPrograms),
          color: statusColors[item.status] || '#6b7280',
        });
      });
    });

    // Sort by name and then by status
    const statusOrder = ['Unggul', 'A', 'Baik Sekali', 'Baik', 'B', 'C'];
    result.sort((a, b) => {
      if (a.name !== b.name) {
        return a.name.localeCompare(b.name);
      }
      return statusOrder.indexOf(a.category) - statusOrder.indexOf(b.category);
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching accreditation chart data:', error);
    return NextResponse.json([]);
  }
}
