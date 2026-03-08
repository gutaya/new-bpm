'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Quote, Clock, CheckCircle2, Loader2 } from 'lucide-react';

interface AboutData {
  content: string;
}

const defaultAboutContent: AboutData = {
  content: `<p>Badan Penjaminan Mutu (BPM) Universitas Satya Negara Indonesia merupakan lembaga yang bertanggung jawab dalam mengkoordinasikan, mengendalikan, dan mengaudit mutu secara internal di lingkungan universitas.</p>`,
};

export default function AboutContent() {
  const [aboutData, setAboutData] = useState<AboutData>(defaultAboutContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tentang-kami')
      .then((res) => res.json())
      .then((data: AboutData) => {
        if (data && data.content) {
          setAboutData(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching about us:', error);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-16 md:py-20 bg-background relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Content Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#D9F3FC]/20 rounded-full blur-2xl"></div>

            {/* Main Card */}
            <Card className="relative bg-card rounded-3xl shadow-2xl border border-border/50 overflow-hidden">
              {/* Top Gradient Bar */}
              <div className="h-2 bg-gradient-to-r from-primary via-primary/80 to-[#D9F3FC]"></div>

              {/* Quote Icons */}
              <div className="absolute top-8 left-8 opacity-5">
                <Quote className="h-24 w-24 text-primary" />
              </div>
              <div className="absolute bottom-8 right-8 opacity-5 rotate-180">
                <Quote className="h-24 w-24 text-primary" />
              </div>

              {/* Content */}
              <div className="p-8 md:p-12 lg:p-16 relative z-10">
                {/* Main Title */}
                <h2 className="text-2xl font-display font-bold text-foreground mb-6 pb-3 border-b border-border/50">
                  Tentang Badan Penjaminan Mutu USNI
                </h2>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {/* Main Content */}
                    <div 
                      className="text-muted-foreground leading-relaxed text-base md:text-lg mb-8 text-justify prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: aboutData.content }}
                    />

                    {/* Sejarah Section */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-display font-bold text-primary">Sejarah</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-justify md:pl-13">
                        BPM USNI didirikan sebagai respon terhadap tuntutan peningkatan mutu pendidikan tinggi di Indonesia. Sejak saat itu, BPM terus berkembang dan berkontribusi dalam peningkatan kualitas pendidikan di USNI.
                      </p>
                    </div>

                    {/* Fungsi Utama Section */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#D9F3FC]/30 flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-[#0D93F2]" />
                        </div>
                        <h3 className="text-xl font-display font-bold text-[#0D93F2]">Fungsi Utama</h3>
                      </div>
                      <ul className="space-y-3 md:pl-13">
                        <li className="flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                          <span className="text-muted-foreground">Penetapan standar mutu internal</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                          <span className="text-muted-foreground">Pelaksanaan audit mutu internal</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                          <span className="text-muted-foreground">Monitoring dan evaluasi kinerja</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                          <span className="text-muted-foreground">Pendampingan akreditasi</span>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>

              {/* Bottom Gradient Line */}
              <div className="h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
