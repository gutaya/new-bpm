'use client';

import { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Images, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  category: string;
}

export default function GallerySection() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex: selectedIndex });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setImages(data);
          setFilteredImages(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching gallery images:', error);
        setLoading(false);
      });
  }, []);

  // Update embla carousel when opening
  useEffect(() => {
    if (isOpen && emblaApi) {
      emblaApi.scrollTo(selectedIndex, true);
    }
  }, [isOpen, emblaApi, selectedIndex]);

  // Track current slide index
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === 'Semua') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter((img) => img.category === category));
    }
  };

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsOpen(true);
  };

  // Get unique categories from images, filter out empty/null/undefined
  const uniqueCategories = ['Semua', ...Array.from(
    new Set(images.map((img) => img.category).filter(Boolean))
  )];

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-muted-foreground">Memuat galeri foto...</p>
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <section id="pusat-data" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-[#0D93F2] font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
              <Images className="h-4 w-4" />
              Dokumentasi Kegiatan
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
              Galeri Foto
            </h2>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {uniqueCategories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-medium text-sm line-clamp-2">
                  {image.title}
                </p>
                {image.description && (
                  <p className="text-white/70 text-xs line-clamp-1 mt-1">
                    {image.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Dialog with Embla Carousel */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent 
            className="max-w-6xl w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-black/95 border-none"
            showCloseButton={false}
          >
            <div className="relative flex flex-col h-full">
              {/* Accessible Dialog Title (hidden visually) */}
              <VisuallyHidden>
                <DialogTitle>
                  {filteredImages[selectedIndex]?.title || 'Galeri Foto'}
                </DialogTitle>
              </VisuallyHidden>
              
              {/* Custom Close Button */}
              <DialogClose className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <X className="h-6 w-6" />
                <span className="sr-only">Tutup</span>
              </DialogClose>

              {/* Navigation Buttons */}
              {filteredImages.length > 1 && (
                <>
                  <button
                    onClick={scrollPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={scrollNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
              
              {/* Embla Carousel Container */}
              <div className="flex-1 overflow-hidden min-h-[60vh] max-h-[75vh]" ref={emblaRef}>
                <div className="flex h-full">
                  {filteredImages.map((image) => (
                    <div key={image.id} className="flex-[0_0_100%] min-w-0 flex items-center justify-center p-4">
                      <img
                        src={image.imageUrl}
                        alt={image.title}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Info Bar */}
              {filteredImages[selectedIndex] && (
                <div className="bg-background/95 backdrop-blur-sm px-6 py-4 border-t border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        {filteredImages[selectedIndex].title}
                      </h3>
                      {filteredImages[selectedIndex].description && (
                        <p className="text-muted-foreground text-sm mt-1">
                          {filteredImages[selectedIndex].description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-sm">
                        {selectedIndex + 1} / {filteredImages.length}
                      </span>
                      <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {filteredImages[selectedIndex].category}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
