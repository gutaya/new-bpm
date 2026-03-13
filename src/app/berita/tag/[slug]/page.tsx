'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Eye, 
  ArrowLeft, 
  ChevronRight, 
  Newspaper,
  Tag,
  Clock,
  Loader2
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  imageUrl: string | null;
  viewCount: number;
  createdAt: string;
  tags?: { id: string; name: string; slug: string }[];
}

interface TagData {
  id: string;
  name: string;
  slug: string;
}

export default function TagNewsPage() {
  const params = useParams();
  const tagSlug = params.slug as string;
  
  const [tag, setTag] = useState<TagData | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!tagSlug) return;

    // Fetch tag details
    fetch(`/api/tags/${tagSlug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Tag not found');
        return res.json();
      })
      .then((data) => {
        setTag(data);
      })
      .catch((err) => {
        console.error('Error fetching tag:', err);
        setError(true);
      });

    // Fetch news by tag
    fetch(`/api/news?tag=${tagSlug}`)
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching news:', err);
        setLoading(false);
      });
  }, [tagSlug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${dayName}, ${day} ${month} ${year}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 pt-20 lg:pt-[7.5rem]">
          <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Memuat berita...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !tag) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 pt-20 lg:pt-[7.5rem]">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Tag className="h-10 w-10 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-4">Tag Tidak Ditemukan</h1>
              <p className="text-muted-foreground mb-8">Tag yang Anda cari tidak tersedia.</p>
              <Button asChild className="gap-2">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Beranda
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Beranda
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Link href="/#berita" className="text-muted-foreground hover:text-primary transition-colors">
                Berita
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">Tag: {tag.name}</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Tag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  Tag: {tag.name}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {news.length} berita ditemukan
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button asChild variant="outline" className="mb-6 gap-2">
            <Link href="/#berita">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Berita
            </Link>
          </Button>

          {/* News Grid */}
          {news.length === 0 ? (
            <Card className="p-8">
              <div className="flex flex-col items-center gap-2 text-center">
                <Newspaper className="h-12 w-12 text-muted-foreground" />
                <h3 className="font-semibold text-lg">Belum ada berita</h3>
                <p className="text-muted-foreground">
                  Belum ada berita dengan tag &quot;{tag.name}&quot;
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <Link key={item.id} href={`/berita/${item.slug}`}>
                  <Card className="group overflow-hidden h-full hover:shadow-lg transition-all duration-300">
                    {/* Image */}
                    {item.imageUrl ? (
                      <div className="aspect-video relative overflow-hidden bg-gray-100">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video relative bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <Newspaper className="h-12 w-12 text-primary/40" />
                      </div>
                    )}
                    
                    <CardContent className="p-4">
                      {/* Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {item.tags.slice(0, 3).map((t) => (
                            <Badge 
                              key={t.id} 
                              variant="outline" 
                              className={`text-xs ${t.slug === tagSlug ? 'bg-primary text-primary-foreground' : ''}`}
                            >
                              {t.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {/* Title */}
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {item.title}
                      </h3>
                      
                      {/* Excerpt */}
                      {item.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {item.excerpt}
                        </p>
                      )}
                      
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{item.viewCount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
