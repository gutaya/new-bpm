'use client';

import { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
}

export default function HeroSection() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    fetch('/api/slideshow')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching slideshows:', error);
        setLoading(false);
      });
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (!emblaApi || slides.length <= 1) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [emblaApi, slides.length]);

  // Default static content if no slides
  const defaultContent = {
    badge: 'Universitas Satya Negara Indonesia',
    title: 'Selamat Datang di',
    highlight: 'Badan Penjaminan Mutu',
    description: 'Menggenggam Mutu, Meningkatkan Daya Saing. Menjadi lembaga terkemuka dan profesional dalam memperkuat layanan pendidikan berbasis budaya mutu untuk mempercepat terwujudnya Visi USNI.',
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image / Slideshow */}
      <div className="absolute inset-0">
        {slides.length > 0 ? (
          <div className="overflow-hidden h-full" ref={emblaRef}>
            <div className="flex h-full">
              {slides.map((slide) => (
                <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80"
            alt="Gedung Universitas"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60"></div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-6 border border-white/30">
            {defaultContent.badge}
          </span>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
            {defaultContent.title}{' '}
            <span className="text-[#D9F3FC]">{defaultContent.highlight}</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
            {defaultContent.description}
          </p>

          {/* CTA Button */}
          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="bg-[#D9F3FC] text-[#0D93F2] hover:bg-[#D9F3FC]/90 gap-2 font-semibold"
            >
              <Link href="#profil">
                Selengkapnya
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}
