'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Target, Flag, Quote } from 'lucide-react';

interface VisionMissionData {
  vision: string;
  mission: string;
  goals: string | null;
}

interface QuoteData {
  quoteText: string;
  authorName: string | null;
  authorTitle: string | null;
  imageUrl: string | null;
}

const defaultVisionMission: VisionMissionData = {
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

const defaultQuote: QuoteData = {
  quoteText: 'Menggenggam Mutu, Meningkatkan Daya Saing',
  authorName: 'Dr. Ir. Dwi Ernaningsih, M.Si.',
  authorTitle: 'Kepala Badan Penjaminan Mutu',
  imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
};

export default function VisionMissionSection() {
  const [visionMission, setVisionMission] = useState<VisionMissionData>(defaultVisionMission);
  const [quote, setQuote] = useState<QuoteData>(defaultQuote);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch vision mission
    fetch('/api/visi-misi')
      .then((res) => res.json())
      .then((data: VisionMissionData) => {
        setVisionMission({ ...defaultVisionMission, ...data });
      })
      .catch((error) => {
        console.error('Error fetching vision mission:', error);
      });

    // Fetch homepage quote
    fetch('/api/kutipan')
      .then((res) => res.json())
      .then((data: QuoteData) => {
        setQuote({ ...defaultQuote, ...data });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching quote:', error);
        setLoading(false);
      });
  }, []);

  // Parse mission string into list items
  const missionItems = visionMission.mission
    .split('\n')
    .filter((item) => item.trim())
    .map((item) => item.replace(/^\d+\.\s*/, '').trim());

  // Parse goals string into list items
  const goalsItems = visionMission.goals
    ? visionMission.goals
        .split('\n')
        .filter((item: string) => item.trim())
        .map((item: string) => item.replace(/^[-•]\s*/, '').trim())
    : [];

  return (
    <section id="profil" className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Quote Card */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden">
              <div className="aspect-square bg-primary-foreground/10 rounded-2xl flex items-center justify-center relative">
                {/* Quote Icons */}
                <div className="absolute top-4 left-4 opacity-20">
                  <Quote className="h-10 w-10" />
                </div>
                <div className="absolute bottom-4 right-4 opacity-20 rotate-180">
                  <Quote className="h-10 w-10" />
                </div>

                {/* Content */}
                <div className="text-center px-6 py-4 relative z-10 flex flex-col items-center justify-center h-full">
                  {/* Profile Image */}
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-full mx-auto mb-4 overflow-hidden ring-4 ring-primary-foreground/20 flex-shrink-0 bg-primary-foreground/20 flex items-center justify-center">
                    {quote.imageUrl ? (
                      <img
                        src={quote.imageUrl}
                        alt={quote.authorName || 'Kepala BPM'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Quote className="h-16 w-16 opacity-50" />
                    )}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg md:text-xl italic mb-3 leading-relaxed line-clamp-3">
                    &ldquo;{quote.quoteText}&rdquo;
                  </blockquote>

                  {/* Name */}
                  {quote.authorName && (
                    <p className="font-semibold text-sm md:text-base">
                      {quote.authorName}
                    </p>
                  )}
                  {quote.authorTitle && (
                    <p className="text-xs md:text-sm text-primary-foreground/70">
                      {quote.authorTitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div>
            <Tabs defaultValue="visi" className="w-full">
              <TabsList className="h-10 items-center justify-center text-[#517398] bg-primary-foreground/10 p-1 rounded-xl w-full grid grid-cols-3 mb-8">
                <TabsTrigger
                  value="visi"
                  className="data-[state=active]:bg-[#D9F3FC] data-[state=active]:text-[#1B6498] text-[#517398] rounded-lg font-medium"
                >
                  Visi
                </TabsTrigger>
                <TabsTrigger
                  value="misi"
                  className="data-[state=active]:bg-[#D9F3FC] data-[state=active]:text-[#1B6498] text-[#517398] rounded-lg font-medium"
                >
                  Misi
                </TabsTrigger>
                <TabsTrigger
                  value="tujuan"
                  className="data-[state=active]:bg-[#D9F3FC] data-[state=active]:text-[#1B6498] text-[#517398] rounded-lg font-medium"
                >
                  Tujuan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="visi" className="mt-0">
                <Card className="bg-transparent border-none shadow-none">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#D9F3FC]/20 flex items-center justify-center">
                        <Eye className="h-6 w-6 text-[#D9F3FC]" />
                      </div>
                      <h3 className="text-2xl font-display font-bold text-white">Visi</h3>
                    </div>
                    <p className="text-lg leading-relaxed text-primary-foreground/90">
                      {visionMission.vision}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="misi" className="mt-0">
                <Card className="bg-transparent border-none shadow-none">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#D9F3FC]/20 flex items-center justify-center">
                        <Target className="h-6 w-6 text-[#D9F3FC]" />
                      </div>
                      <h3 className="text-2xl font-display font-bold text-white">Misi</h3>
                    </div>
                    <ul className="space-y-3 text-primary-foreground/90">
                      {missionItems.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-[#D9F3FC] font-bold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tujuan" className="mt-0">
                <Card className="bg-transparent border-none shadow-none">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#D9F3FC]/20 flex items-center justify-center">
                        <Flag className="h-6 w-6 text-[#D9F3FC]" />
                      </div>
                      <h3 className="text-2xl font-display font-bold text-white">Tujuan</h3>
                    </div>
                    <ul className="space-y-3 text-primary-foreground/90">
                      {goalsItems.length > 0 ? (
                        goalsItems.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-[#D9F3FC] font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-primary-foreground/70">Tujuan belum ditentukan</li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}
