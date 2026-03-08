import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating website identity...');
  
  const identity = await prisma.websiteIdentity.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'BPM USNI',
      siteTagline: 'Badan Penjaminan Mutu',
      logoUrl: 'https://bpm.usni.ac.id/assets/logo-usni-C0MgIZ6x.png',
      faviconUrl: null,
      contactEmail: 'bpm@usni.ac.id',
      contactPhone: '(021) 739-8393',
      contactAddress: 'Jl. Arteri Pondok Indah No.11, Kebayoran Lama, Jakarta Selatan 12240',
      operationalHours: 'Senin - Jumat: 08.00 - 16.00 WIB',
      googleMapsUrl: null,
      facebookUrl: 'https://www.facebook.com/pages/Universitas-Satya-Negara-Indonesia-USNI/399165366801048',
      instagramUrl: 'https://www.instagram.com/usni.official',
      twitterUrl: 'https://twitter.com/usniofficial',
      youtubeUrl: 'https://www.youtube.com/channel/UClxzpWTpLIDeRtD0U8rcxhw',
      linkedinUrl: 'https://www.linkedin.com/company/universitas-satya-negara-indonesia-kampus-usni/',
      footerText: '© 2025 BPM USNI - Universitas Satya Negara Indonesia. All rights reserved.',
    },
  });
  
  console.log('Website identity created:', identity.siteName);
  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
