import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get website identity (create default if not exists)
export async function GET(request: NextRequest) {
  try {
    let identity = await db.websiteIdentity.findFirst();

    // Create default identity if not exists
    if (!identity) {
      identity = await db.websiteIdentity.create({
        data: {
          siteName: 'Website Resmi',
          siteTagline: 'Portal Informasi',
          siteDescription: 'Deskripsi singkat tentang website ini.',
          footerText: '© 2024 Website Resmi. All rights reserved.',
        },
      });
    }

    return NextResponse.json(identity);
  } catch (error) {
    console.error('Error fetching website identity:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data identitas website' },
      { status: 500 }
    );
  }
}

// PUT/PATCH - Update website identity
export async function PUT(request: NextRequest) {
  return updateIdentity(request);
}

export async function PATCH(request: NextRequest) {
  return updateIdentity(request);
}

async function updateIdentity(request: NextRequest) {
  try {
    const body = await request.json();

    let identity = await db.websiteIdentity.findFirst();

    if (!identity) {
      // Create new identity if not exists
      identity = await db.websiteIdentity.create({
        data: {
          siteName: body.siteName || null,
          siteTagline: body.siteTagline || null,
          siteDescription: body.siteDescription || null,
          logoUrl: body.logoUrl || null,
          faviconUrl: body.faviconUrl || null,
          heroTitle: body.heroTitle || null,
          heroSubtitle: body.heroSubtitle || null,
          heroDescription: body.heroDescription || null,
          contactEmail: body.contactEmail || null,
          contactPhone: body.contactPhone || null,
          contactAddress: body.contactAddress || null,
          operationalHours: body.operationalHours || null,
          googleMapsUrl: body.googleMapsUrl || null,
          facebookUrl: body.facebookUrl || null,
          instagramUrl: body.instagramUrl || null,
          twitterUrl: body.twitterUrl || null,
          youtubeUrl: body.youtubeUrl || null,
          linkedinUrl: body.linkedinUrl || null,
          footerText: body.footerText || null,
        },
      });
    } else {
      // Update existing identity
      const updateData: Record<string, unknown> = {};

      if (body.siteName !== undefined) updateData.siteName = body.siteName || null;
      if (body.siteTagline !== undefined) updateData.siteTagline = body.siteTagline || null;
      if (body.siteDescription !== undefined) updateData.siteDescription = body.siteDescription || null;
      if (body.logoUrl !== undefined) updateData.logoUrl = body.logoUrl || null;
      if (body.faviconUrl !== undefined) updateData.faviconUrl = body.faviconUrl || null;
      if (body.heroTitle !== undefined) updateData.heroTitle = body.heroTitle || null;
      if (body.heroSubtitle !== undefined) updateData.heroSubtitle = body.heroSubtitle || null;
      if (body.heroDescription !== undefined) updateData.heroDescription = body.heroDescription || null;
      if (body.contactEmail !== undefined) updateData.contactEmail = body.contactEmail || null;
      if (body.contactPhone !== undefined) updateData.contactPhone = body.contactPhone || null;
      if (body.contactAddress !== undefined) updateData.contactAddress = body.contactAddress || null;
      if (body.operationalHours !== undefined) updateData.operationalHours = body.operationalHours || null;
      if (body.googleMapsUrl !== undefined) updateData.googleMapsUrl = body.googleMapsUrl || null;
      if (body.facebookUrl !== undefined) updateData.facebookUrl = body.facebookUrl || null;
      if (body.instagramUrl !== undefined) updateData.instagramUrl = body.instagramUrl || null;
      if (body.twitterUrl !== undefined) updateData.twitterUrl = body.twitterUrl || null;
      if (body.youtubeUrl !== undefined) updateData.youtubeUrl = body.youtubeUrl || null;
      if (body.linkedinUrl !== undefined) updateData.linkedinUrl = body.linkedinUrl || null;
      if (body.footerText !== undefined) updateData.footerText = body.footerText || null;

      identity = await db.websiteIdentity.update({
        where: { id: identity.id },
        data: updateData,
      });
    }

    return NextResponse.json(identity);
  } catch (error) {
    console.error('Error updating website identity:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui identitas website' },
      { status: 500 }
    );
  }
}
