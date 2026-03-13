import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ChevronRight,
  Clock,
  ArrowLeft,
  FileText,
} from 'lucide-react';

interface StaticPage {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string;
  icon: string | null;
  updatedAt: string;
}

// List of hardcoded pages that have their own files
const HARDCODED_PAGES = ['ami', 'survey', 'hibah', 'pekerti-aa', 'jafung'];

// Fetch page from API
async function getLayananPage(slug: string): Promise<StaticPage | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/layanan/${slug}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) return null;
    
    return res.json();
  } catch {
    return null;
  }
}

// Generate metadata
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  
  // Skip if this is a hardcoded page
  if (HARDCODED_PAGES.includes(slug)) {
    return {
      title: 'Loading...',
    };
  }
  
  const page = await getLayananPage(slug);
  
  if (!page) {
    return {
      title: 'Halaman Tidak Ditemukan - BPM USNI',
    };
  }
  
  return {
    title: `${page.title} - BPM USNI`,
    description: page.description || page.title,
  };
}

export default async function LayananDynamicPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  // Skip if this is a hardcoded page (let Next.js use the specific file)
  if (HARDCODED_PAGES.includes(slug)) {
    notFound();
  }
  
  // Fetch from database
  const page = await getLayananPage(slug);
  
  if (!page) {
    notFound();
  }
  
  const formattedDate = new Date(page.updatedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
              <Link className="hover:text-[#D9F3FC] transition-colors" href="/layanan">
                Layanan
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-primary-foreground">{page.title}</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              {page.title}
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-3xl">
              {page.description || page.title}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
              {/* Header Card */}
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 md:p-8 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                    <FileText className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-1">
                      {page.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        Diperbarui: {formattedDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 lg:p-10">
                <div 
                  className="prose prose-slate max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </div>

              {/* Footer Card */}
              <div className="px-6 md:px-8 lg:px-10 py-6 bg-muted/30 border-t border-border">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <Button variant="outline" asChild>
                    <Link href="/layanan">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Kembali ke Daftar Layanan
                    </Link>
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Ada pertanyaan?{' '}
                    <Link href="/hubungi-kami" className="text-primary font-medium hover:underline">
                      Hubungi Kami
                    </Link>
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

// Generate static params for known dynamic pages
export async function generateStaticParams() {
  // Fetch all published layanan pages from database
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/static-pages?menuCategory=layanan`);
    const pages: StaticPage[] = await res.json();
    
    return pages
      .filter(page => !HARDCODED_PAGES.includes(page.slug))
      .map(page => ({
        slug: page.slug,
      }));
  } catch {
    return [];
  }
}
