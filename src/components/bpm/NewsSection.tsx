'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper, ArrowRight, Calendar } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  createdAt: string;
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news?limit=4')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setNews(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching news:', error);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Memuat berita...</p>
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return null;
  }

  return (
    <section id="berita" className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-[#0D93F2] font-semibold text-sm uppercase tracking-wider mb-2">
            <Newspaper className="h-4 w-4" />
            Informasi Terkini
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
            Berita BPM USNI
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            Berita terbaru seputar kegiatan Badan Penjaminan Mutu USNI
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.map((item) => (
            <Link key={item.id} href={`/berita/${item.slug}`}>
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <Newspaper className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <CardContent className="p-4">
                  {/* Date */}
                  <span className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                    <Calendar className="h-3 w-3" />
                    {formatDate(item.createdAt)}
                  </span>

                  {/* Title */}
                  <h3 className="font-semibold text-base text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>

                  {/* Read More */}
                  <div className="flex items-center gap-1 text-sm text-primary font-medium mt-3 group-hover:gap-2 transition-all">
                    Baca
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
