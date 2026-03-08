'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Link2, GraduationCap } from 'lucide-react';

interface QuickLink {
  id: string;
  title: string;
  url: string;
  icon: string;
}

const iconMap: Record<string, React.ReactNode> = {
  'link': <Link2 className="h-7 w-7" />,
  'graduation-cap': <GraduationCap className="h-7 w-7" />,
};

export default function QuickLinksSection() {
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/quicklinks')
      .then((res) => res.json())
      .then((data) => {
        setLinks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching quick links:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-muted-foreground">Memuat tautan cepat...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="layanan" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[#0D93F2] font-semibold text-sm uppercase tracking-wider">
            Akses Cepat
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
            Sistem Informasi
          </h2>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3 md:gap-4">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card rounded-lg p-3 shadow-sm hover:shadow-md transition-all border border-border hover:border-primary/20 text-center"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary mx-auto mb-2 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {iconMap[link.icon] || <Link2 className="h-5 w-5" />}
              </div>
              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors text-xs leading-tight">
                {link.title}
              </h3>
              <ExternalLink className="h-3 w-3 mx-auto mt-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
