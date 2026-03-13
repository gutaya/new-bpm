import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = await db.staticPage.findUnique({
    where: { slug },
  });

  if (!page) {
    return { title: 'Halaman Tidak Ditemukan' };
  }

  return {
    title: `${page.title} - BPM USNI`,
    description: page.description || page.title,
  };
}

export default async function HalamanPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await db.staticPage.findUnique({
    where: { slug },
  });

  if (!page || !page.published) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-36 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-muted-foreground">
              <span>Halaman</span>
              <span className="mx-2">/</span>
              <span className="text-foreground font-medium">{page.title}</span>
            </nav>

            {/* Content */}
            <article className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-8 border-b border-border">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {page.title}
                </h1>
                {page.description && (
                  <p className="mt-3 text-lg text-muted-foreground">
                    {page.description}
                  </p>
                )}
              </div>

              {/* Content */}
              <div 
                className="px-6 py-8 prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
