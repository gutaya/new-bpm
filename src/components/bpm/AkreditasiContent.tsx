'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog';
import Link from 'next/link';
import {
  Award,
  Calendar,
  ChevronRight,
  Download,
  Loader2,
  Maximize2,
  Minimize2,
  Menu,
  X,
  LayoutGrid,
  Building2,
  Globe,
  Landmark,
  LucideIcon,
  ZoomIn
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Accreditation {
  id: string;
  title: string;
  program: string;
  category: string;
  categorySlug: string;
  level: string;
  status: string;
  validUntil: string | null;
  imageUrl?: string | null;
  certificateUrl?: string | null;
}

interface AkreditasiContentProps {
  activeCategory: string;
  title?: string;
  description?: string;
}

const categories: { name: string; slug: string; href: string; icon: LucideIcon }[] = [
  { name: 'Semua', slug: 'semua', href: '/akreditasi', icon: LayoutGrid },
  { name: 'Akreditasi Nasional', slug: 'nasional', href: '/akreditasi/nasional', icon: Building2 },
  { name: 'Akreditasi Internasional', slug: 'internasional', href: '/akreditasi/internasional', icon: Globe },
  { name: 'Akreditasi Institusi', slug: 'institusi', href: '/akreditasi/institusi', icon: Landmark },
];

// Default accreditation data as fallback
const defaultAccreditations: Accreditation[] = [
  {
    id: '1',
    title: 'Terakreditasi: B',
    program: 'Akreditasi Institusi',
    category: 'Akreditasi BAN-PT',
    categorySlug: 'ban-pt',
    level: 'Nasional',
    status: 'B',
    validUntil: '2029-01-15',
  },
  {
    id: '2',
    title: 'Terakreditasi: Baik Sekali',
    program: 'Teknik Informatika',
    category: 'Akreditasi Program Studi',
    categorySlug: 'program-studi',
    level: 'Nasional',
    status: 'Baik Sekali',
    validUntil: '2028-09-30',
  },
];

export default function AkreditasiContent({ activeCategory, title, description }: AkreditasiContentProps) {
  const [allAccreditations, setAllAccreditations] = useState<Accreditation[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<Accreditation | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Image preview state
  const [imagePreview, setImagePreview] = useState<{ url: string; title: string } | null>(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  // Fetch accreditations from API
  useEffect(() => {
    let isMounted = true;

    const fetchAccreditations = async () => {
      const categoryParam = activeCategory !== 'semua' ? `?category=${activeCategory}` : '';
      try {
        const res = await fetch(`/api/accreditations${categoryParam}`);
        const data: Accreditation[] = await res.json();
        if (isMounted) {
          if (data && data.length > 0) {
            setAllAccreditations(data);
          } else {
            setAllAccreditations(defaultAccreditations);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching accreditations:', error);
        if (isMounted) {
          setAllAccreditations(defaultAccreditations);
          setLoading(false);
        }
      }
    };

    fetchAccreditations();

    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  // Filter accreditations based on category
  const filteredAccreditations = allAccreditations.filter(acc => {
    if (activeCategory === 'semua') return true;
    if (activeCategory === 'nasional') {
      // Nasional includes all national accreditation bodies (BAN-PT, LAMEMBA, LAM Teknik, LAM Infokom)
      // but excludes Institusi and Internasional
      return acc.level === 'Nasional' && acc.categorySlug !== 'institusi';
    }
    return acc.categorySlug === activeCategory;
  });

  const getPageTitle = () => {
    if (title) return title;
    if (activeCategory === 'semua') return 'Data Akreditasi';
    const cat = categories.find(c => c.slug === activeCategory);
    return cat ? `Akreditasi ${cat.name}` : 'Data Akreditasi';
  };

  const getPageDescription = () => {
    if (description) return description;
    return 'Informasi status dan sertifikat akreditasi institusi serta program studi.';
  };

  const handlePreview = (acc: Accreditation) => {
    if (acc.certificateUrl) {
      setPreviewDoc(acc);
      setIsLoading(true);
      setIsPreviewOpen(true);
      setIsFullscreen(false);
    }
  };

  const handleImagePreview = (acc: Accreditation) => {
    if (acc.imageUrl) {
      setImagePreview({ url: acc.imageUrl, title: acc.title });
      setIsImagePreviewOpen(true);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-6 flex-wrap">
            <a className="hover:text-[#D9F3FC] transition-colors" href="/">Beranda</a>
            <ChevronRight className="h-4 w-4" />
            {activeCategory === 'semua' ? (
              <span className="text-primary-foreground">Akreditasi</span>
            ) : (
              <>
                <Link className="hover:text-[#D9F3FC] transition-colors" href="/akreditasi">
                  Akreditasi
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-primary-foreground">{getPageTitle()}</span>
              </>
            )}
          </nav>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            {getPageTitle()}
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-3xl">
            {getPageDescription()}
          </p>
        </div>
      </section>

      {/* Accreditation Content with Sidebar */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content - Left Side */}
            <div className="flex-1">
              <div className="space-y-4">
                {/* Stats Card */}
                <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl p-6 mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-80">Total Data Akreditasi</p>
                      <p className="text-4xl font-display font-bold">{filteredAccreditations.length}</p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <Award className="h-8 w-8" />
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredAccreditations.length > 0 ? (
                  <div className="space-y-4">
                    {filteredAccreditations.map((acc) => (
                      <Card
                        key={acc.id}
                        className="text-card-foreground flex flex-col gap-6 py-0 shadow-sm bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row">
                          {/* Image/Icon Section */}
                          <div className="w-full md:w-32 h-28 md:h-auto flex-shrink-0">
                            {acc.imageUrl ? (
                              <div
                                className="w-full h-full bg-muted cursor-pointer hover:opacity-80 transition-opacity relative group"
                                onClick={() => handleImagePreview(acc)}
                              >
                                <img
                                  src={acc.imageUrl}
                                  alt={acc.status}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                  <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                            ) : acc.certificateUrl ? (
                              <div
                                className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center min-h-[112px] cursor-pointer hover:from-primary/20 hover:to-primary/10 transition-all relative group"
                                onClick={() => handlePreview(acc)}
                              >
                                <Award className="h-10 w-10 text-primary/30 group-hover:text-primary/50 transition-colors" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                                  <ZoomIn className="h-5 w-5 text-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center min-h-[112px]">
                                <Award className="h-10 w-10 text-primary/30" />
                              </div>
                            )}
                          </div>

                          {/* Content Section */}
                          <div className="flex-1 p-5">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-2 flex-1">
                                <h3 className="font-semibold text-foreground text-lg">
                                  {acc.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {acc.program}
                                </p>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="inline-flex items-center rounded-full border border-transparent bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs px-2.5 py-0.5 font-semibold">
                                    {acc.category}
                                  </span>
                                  <span className="inline-flex items-center rounded-full border border-border text-foreground text-xs px-2.5 py-0.5 font-semibold">
                                    {acc.level}
                                  </span>
                                  {acc.validUntil && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Berlaku hingga: {new Date(acc.validUntil).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                      })}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {acc.certificateUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2 flex-shrink-0 hover:bg-[#279BF3] hover:text-white hover:border-[#279BF3] transition-colors"
                                  onClick={() => window.open(acc.certificateUrl!, '_blank')}
                                >
                                  <Download className="h-4 w-4" />
                                  Unduh
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-card rounded-xl p-8 sm:p-12 border border-border text-center">
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Tidak ada data akreditasi</h3>
                    <p className="text-muted-foreground">
                      Pilih kategori lain untuk melihat data akreditasi
                    </p>
                  </Card>
                )}
              </div>
            </div>

            {/* Sidebar Menu - Right Side */}
            <aside className="lg:w-80 flex-shrink-0">
              {/* Mobile Toggle Button */}
              <Button
                variant="outline"
                className="lg:hidden w-full mb-4 flex items-center justify-between"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <span>Kategori</span>
                {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>

              {/* Sidebar Card */}
              <Card className={`rounded-lg border bg-card shadow-sm sticky top-24 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
                <div className="p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Kategori Akreditasi
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <Link
                          key={category.slug}
                          href={category.href}
                          onClick={() => setIsSidebarOpen(false)}
                          className={`
                            flex items-center gap-3 p-3 rounded-lg transition-colors
                            ${activeCategory === category.slug
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            }
                          `}
                        >
                          <IconComponent className="h-5 w-5 flex-shrink-0" />
                          <span className="flex-1 font-medium">{category.name}</span>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </section>

      {/* PDF Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogPortal>
          <DialogOverlay
            className={cn(
              "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            )}
          />
          <DialogPrimitive.Content
            className={cn(
              "fixed z-50 flex flex-col bg-background shadow-2xl transition-all duration-300",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              isFullscreen
                ? "inset-0 m-0 w-screen h-screen max-w-none max-h-none rounded-none translate-x-0 translate-y-0"
                : "top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[95vw] max-w-[95vw] h-[85vh] max-h-[85vh] rounded-xl border"
            )}
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={() => setIsPreviewOpen(false)}
          >
            <div className="flex items-center justify-between gap-4 p-4 border-b border-border bg-background flex-shrink-0">
              <DialogTitle className="text-lg font-semibold truncate max-w-[200px] sm:max-w-md">
                {previewDoc?.title}
              </DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsPreviewOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden bg-muted/30">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {previewDoc?.certificateUrl && (
                <iframe
                  src={previewDoc.certificateUrl}
                  className="w-full h-full border-0"
                  title={previewDoc.title}
                  onLoad={handleIframeLoad}
                />
              )}
            </div>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
          <DialogPrimitive.Content
            className="fixed inset-0 z-50 flex flex-col bg-transparent shadow-none border-0 translate-x-0 translate-y-0 top-0 left-0"
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={() => setIsImagePreviewOpen(false)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
              onClick={() => setIsImagePreviewOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="absolute top-4 left-4 z-50 text-white bg-black/50 px-3 py-1.5 rounded-lg">
              <DialogTitle className="text-lg font-semibold">
                {imagePreview?.title}
              </DialogTitle>
            </div>

            <div className="w-full h-full flex items-center justify-center p-8 pt-16">
              {imagePreview && (
                <img
                  src={imagePreview.url}
                  alt={imagePreview.title}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              )}
            </div>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </>
  );
}
