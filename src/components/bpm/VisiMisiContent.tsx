'use client';

import { Card } from '@/components/ui/card';
import { Eye, Target, Flag, CircleCheckBig } from 'lucide-react';

export default function VisiMisiContent() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Visi Card */}
        <div className="bg-primary text-primary-foreground rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Eye className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-display font-bold">Visi</h2>
          </div>
          <p className="text-xl leading-relaxed">
            Menjadi lembaga penjaminan mutu yang unggul dan terpercaya dalam mewujudkan budaya mutu di lingkungan Universitas Satya Negara Indonesia.
          </p>
        </div>

        {/* Misi Card */}
        <Card className="bg-card rounded-2xl p-8 shadow-card border border-border mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Misi</h2>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-[#D9F3FC] text-[#0D93F2] flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </span>
              <span className="text-muted-foreground pt-1">
                Mengembangkan sistem penjaminan mutu internal yang efektif dan efisien
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-[#D9F3FC] text-[#0D93F2] flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </span>
              <span className="text-muted-foreground pt-1">
                Melaksanakan monitoring dan evaluasi mutu secara berkelanjutan
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-[#D9F3FC] text-[#0D93F2] flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </span>
              <span className="text-muted-foreground pt-1">
                Memfasilitasi peningkatan mutu akademik dan non-akademik
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-[#D9F3FC] text-[#0D93F2] flex items-center justify-center text-sm font-bold flex-shrink-0">
                4
              </span>
              <span className="text-muted-foreground pt-1">
                Mendorong tercapainya akreditasi unggul pada tingkat institusi dan program studi
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-[#D9F3FC] text-[#0D93F2] flex items-center justify-center text-sm font-bold flex-shrink-0">
                5
              </span>
              <span className="text-muted-foreground pt-1">
                Membangun kerjasama dengan lembaga penjaminan mutu nasional dan internasional
              </span>
            </li>
          </ul>
        </Card>

        {/* Tujuan Card */}
        <Card className="bg-card rounded-2xl p-8 shadow-card border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Flag className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Tujuan</h2>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">
                Terwujudnya sistem penjaminan mutu internal yang terintegrasi
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">
                Tercapainya standar mutu pendidikan tinggi yang ditetapkan
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">
                Meningkatnya kepuasan pemangku kepentingan
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">
                Tercapainya akreditasi institusi dan program studi yang unggul
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">
                Terbentuknya budaya mutu di seluruh unit kerja
              </span>
            </li>
          </ul>
        </Card>

      </div>
    </section>
  );
}
