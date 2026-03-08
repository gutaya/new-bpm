'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, ArrowRight, Calendar } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  createdAt: string;
}

export default function AnnouncementSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/announcements?limit=4')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAnnouncements(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching announcements:', error);
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return { label: 'Mendesak', className: 'bg-red-500 text-white' };
      case 'high':
        return { label: 'Penting', className: 'bg-orange-500 text-white' };
      default:
        return { label: 'Umum', className: 'bg-primary text-primary-foreground' };
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Memuat pengumuman...</p>
          </div>
        </div>
      </section>
    );
  }

  if (announcements.length === 0) {
    return null;
  }

  return (
    <section id="pengumuman" className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider mb-2">
            <Megaphone className="h-4 w-4" />
            Pengumuman Resmi
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
            Pengumuman BPM USNI
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            Informasi penting dan pengumuman resmi dari Badan Penjaminan Mutu USNI
          </p>
        </div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.map((item, index) => {
            const priorityBadge = getPriorityBadge(item.priority);
            return (
              <Link key={item.id} href={`/pengumuman/${item.id}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-primary h-full">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      {/* Index Number */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-primary">{index + 1}</span>
                      </div>

                      <div className="flex-1">
                        {/* Priority Badge & Date */}
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${priorityBadge.className} text-xs`}>
                            {priorityBadge.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.createdAt)}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {item.content.replace(/<[^>]*>/g, '')}
                        </p>

                        {/* Read More */}
                        <div className="flex items-center gap-1 text-sm text-primary font-medium mt-3 group-hover:gap-2 transition-all">
                          Selengkapnya
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
