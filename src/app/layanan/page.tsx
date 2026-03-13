'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import { Card } from '@/components/ui/card';
import {
  ChevronRight,
  ClipboardCheck,
  BarChart3,
  Gift,
  GraduationCap,
  ArrowRight,
  Loader2,
  FileText
} from 'lucide-react';

interface LayananItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  icon: string | null;
}

// Default layanan items if database is empty
const defaultLayananList = [
  {
    id: '1',
    title: 'Audit Mutu Internal (AMI)',
    slug: 'ami',
    description: 'Pelaksanaan Audit Mutu Internal untuk menjamin kualitas pendidikan di USNI',
    icon: 'clipboard-check',
  },
  {
    id: '2',
    title: 'Survey',
    slug: 'survey',
    description: 'Layanan survey kepuasan pelanggan dan stakeholder',
    icon: 'bar-chart',
  },
  {
    id: '3',
    title: 'Hibah',
    slug: 'hibah',
    description: 'Informasi dan layanan pengelolaan hibah penelitian dan pengabdian masyarakat',
    icon: 'gift',
  },
  {
    id: '4',
    title: 'PEKERTI/AA',
    slug: 'pekerti-aa',
    description: 'Program Pekerti dan Asisten Ahli untuk pengembangan kompetensi dosen',
    icon: 'graduation-cap',
  },
  {
    id: '5',
    title: 'Jabatan Fungsional',
    slug: 'jafung',
    description: 'Informasi dan layanan pengurusan jabatan fungsional dosen',
    icon: 'briefcase',
  },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'clipboard-check': ClipboardCheck,
  'bar-chart': BarChart3,
  'gift': Gift,
  'graduation-cap': GraduationCap,
  'file-text': FileText,
  'briefcase': FileText,
};

export default function LayananPage() {
  const [layananList, setLayananList] = useState<LayananItem[]>(defaultLayananList);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/static-pages?parentMenu=layanan')
      .then((res) => res.json())
      .then((data: LayananItem[]) => {
        if (data && data.length > 0) {
          setLayananList(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching layanan:', error);
        setLoading(false);
      });
  }, []);

  const getIcon = (iconName: string | null) => {
    if (!iconName) return FileText;
    return iconMap[iconName] || FileText;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        {/* Hero Banner */}
        <section className="bg-primary text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-6 flex-wrap">
              <Link className="hover:text-[#D9F3FC] transition-colors" href="/">
                Beranda
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-primary-foreground">Layanan</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              Layanan
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-3xl">
              Berbagai layanan yang disediakan oleh Badan Penjaminan Mutu USNI
            </p>
          </div>
        </section>

        {/* Layanan List */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {layananList.map((layanan) => {
                  const IconComponent = getIcon(layanan.icon);
                  return (
                    <Link key={layanan.id} href={`/layanan/${layanan.slug}`}>
                      <Card className="h-full bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all hover:border-primary/50 group">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                              {layanan.title}
                              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {layanan.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
