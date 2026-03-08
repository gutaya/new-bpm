'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Images, X, ChevronLeft, ChevronRight, ArrowLeft, Image as ImageIcon } from 'lucide-react';

interface Album {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  orderIndex: number;
  _count?: {
    galleryImages: number;
  };
}

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  category: string;
  albumId: string | null;
  album?: {
    id: string;
    title: string;
  } | null;
}

export default function GaleriPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumImages, setAlbumImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'albums' | 'images'>('albums');
  
  // Lightbox state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex: selectedIndex });
  
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    // Fetch albums
    fetch('/api/albums')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAlbums(data);
        }
      })
      .catch((error) => console.error('Error fetching albums:', error));
    
    // Fetch all gallery images
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAllImages(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching gallery images:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isOpen && emblaApi) {
      emblaApi.scrollTo(selectedIndex, true);
    }
  }, [isOpen, emblaApi, selectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi]);

  const openAlbum = (album: Album) => {
    const images = allImages.filter((img) => img.albumId === album.id);
    setSelectedAlbum(album);
    setAlbumImages(images);
    setViewMode('images');
  };

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsOpen(true);
  };

  const currentImages = selectedAlbum ? albumImages : allImages;
  const uniqueCategories = ['Semua', ...Array.from(new Set(allImages.map((img) => img.category).filter(Boolean)))];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20 lg:pt-[7.5rem] flex items-center justify-center">
          <p className="text-muted-foreground">Memuat galeri...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider flex items-center gap-2 mb-3">
                <Images className="h-4 w-4" />
                Dokumentasi Kegiatan
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
                Galeri Foto
              </h1>
              <p className="text-lg text-muted-foreground">
                Dokumentasi kegiatan dan acara Badan Penjaminan Mutu Universitas Satya Negara Indonesia
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {viewMode === 'albums' ? (
              <>
                {/* Albums Grid */}
                <div className="mb-12">
                  <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    Album Kegiatan
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {albums.map((album) => (
                      <div
                        key={album.id}
                        className="group cursor-pointer"
                        onClick={() => openAlbum(album)}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                          {album.coverImageUrl ? (
                            <img
                              src={album.coverImageUrl}
                              alt={album.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Images className="h-16 w-16 text-muted-foreground/50" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-white font-semibold text-lg">{album.title}</h3>
                            {album.description && (
                              <p className="text-white/80 text-sm line-clamp-2 mt-1">{album.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs text-white">
                                <ImageIcon className="h-3 w-3" />
                                {album._count?.galleryImages || 0} foto
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All Images */}
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
                    <Images className="h-5 w-5 text-primary" />
                    Semua Foto
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {allImages.map((image, index) => (
                      <div
                        key={image.id}
                        className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer bg-muted"
                        onClick={() => {
                          setSelectedAlbum(null);
                          setAlbumImages([]);
                          openLightbox(index);
                        }}
                      >
                        <img
                          src={image.imageUrl}
                          alt={image.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-white font-medium text-sm line-clamp-1">{image.title}</p>
                          <span className="text-white/70 text-xs">{image.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Album Detail View */
              <div>
                <Button
                  variant="ghost"
                  className="mb-6"
                  onClick={() => {
                    setViewMode('albums');
                    setSelectedAlbum(null);
                    setAlbumImages([]);
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali ke Album
                </Button>

                {selectedAlbum && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                      {selectedAlbum.title}
                    </h2>
                    {selectedAlbum.description && (
                      <p className="text-muted-foreground">{selectedAlbum.description}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">
                      {albumImages.length} foto
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {albumImages.map((image, index) => (
                    <div
                      key={image.id}
                      className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer bg-muted"
                      onClick={() => openLightbox(index)}
                    >
                      <img
                        src={image.imageUrl}
                        alt={image.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white font-medium text-sm line-clamp-1">{image.title}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {albumImages.length === 0 && (
                  <div className="text-center py-12">
                    <Images className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">Belum ada foto di album ini</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Lightbox Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent 
            className="max-w-6xl w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-black/95 border-none"
            showCloseButton={false}
          >
            <div className="relative flex flex-col h-full">
              <VisuallyHidden>
                <DialogTitle>
                  {currentImages[selectedIndex]?.title || 'Galeri Foto'}
                </DialogTitle>
              </VisuallyHidden>
              
              <DialogClose className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <X className="h-6 w-6" />
                <span className="sr-only">Tutup</span>
              </DialogClose>

              {currentImages.length > 1 && (
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
              
              <div className="flex-1 overflow-hidden min-h-[60vh] max-h-[75vh]" ref={emblaRef}>
                <div className="flex h-full">
                  {currentImages.map((image) => (
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
              
              {currentImages[selectedIndex] && (
                <div className="bg-background/95 backdrop-blur-sm px-6 py-4 border-t border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        {currentImages[selectedIndex].title}
                      </h3>
                      {currentImages[selectedIndex].description && (
                        <p className="text-muted-foreground text-sm mt-1">
                          {currentImages[selectedIndex].description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-sm">
                        {selectedIndex + 1} / {currentImages.length}
                      </span>
                      <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {currentImages[selectedIndex].category}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}
