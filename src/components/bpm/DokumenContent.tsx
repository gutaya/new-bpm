'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  FileText,
  Download,
  Search,
  Calendar,
  Folder,
  Eye,
  ChevronRight,
  ExternalLink,
  Loader2,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Document {
  id: string;
  title: string;
  description: string | null;
  category: string;
  categorySlug: string;
  date: string;
  size: string;
  type: string;
  url: string | null;
}

interface DokumenContentProps {
  activeCategory: string;
  title?: string;
  description?: string;
}

const categories = [
  { name: 'Semua', slug: 'semua', href: '/dokumen' },
  { name: 'Dokumen Publik', slug: 'publik', href: '/dokumen/publik' },
  { name: 'Dokumen Universitas', slug: 'universitas', href: '/dokumen/universitas' },
  { name: 'Dokumen Akreditasi', slug: 'akreditasi', href: '/dokumen/akreditasi' },
  { name: 'Dokumen Eksternal', slug: 'eksternal', href: '/dokumen/eksternal' },
  { name: 'Dokumen BPM', slug: 'bpm', href: '/dokumen/bpm' },
  { name: 'Dokumen SPMI', slug: 'spmi', href: '/dokumen/spmi' },
  { name: 'Dokumen SOP', slug: 'sop', href: '/dokumen/sop' },
  { name: 'SK Rektor', slug: 'sk-rektor', href: '/dokumen/sk-rektor' },
];

// Default documents as fallback
const defaultDocuments: Document[] = [
  {
    id: '1',
    title: 'Buku Pedoman SPMI',
    description: 'Pedoman Sistem Penjaminan Mutu Internal USNI',
    category: 'Dokumen SPMI',
    categorySlug: 'spmi',
    date: new Date().toISOString(),
    size: 'PDF',
    type: 'pdf',
    url: null,
  },
  {
    id: '2',
    title: 'Standar Mutu USNI',
    description: 'Dokumen standar mutu Universitas Suryakancana',
    category: 'Dokumen SPMI',
    categorySlug: 'spmi',
    date: new Date().toISOString(),
    size: 'PDF',
    type: 'pdf',
    url: null,
  },
];

export default function DokumenContent({ activeCategory, title, description }: DokumenContentProps) {
  const [allDocuments, setAllDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Fetch documents from API
  useEffect(() => {
    let isMounted = true;

    const fetchDocuments = async () => {
      const categoryParam = activeCategory !== 'semua' ? `?category=${activeCategory}` : '';
      try {
        const res = await fetch(`/api/documents${categoryParam}`);
        const data: Document[] = await res.json();
        if (isMounted) {
          if (data && data.length > 0) {
            setAllDocuments(data);
          } else {
            setAllDocuments(defaultDocuments);
          }
          setLoading(false);
          setHasLoaded(true);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
        if (isMounted) {
          setAllDocuments(defaultDocuments);
          setLoading(false);
          setHasLoaded(true);
        }
      }
    };

    fetchDocuments();

    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  // Filter documents based on category and search
  const filteredDocuments = allDocuments.filter(doc => {
    const matchesCategory = activeCategory === 'semua' || doc.categorySlug === activeCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryName = () => {
    if (activeCategory === 'semua') return '';
    const cat = categories.find(c => c.slug === activeCategory);
    return cat ? `"${cat.name}"` : '';
  };

  const getPageTitle = () => {
    if (title) return title;
    if (activeCategory === 'semua') return 'Dokumen';
    const cat = categories.find(c => c.slug === activeCategory);
    return cat ? cat.name : 'Dokumen';
  };

  const getPageDescription = () => {
    if (description) return description;
    return 'Kumpulan dokumen dan data yang tersedia untuk diunduh.';
  };

  const handlePreview = (doc: Document) => {
    if (!doc.url) return;
    setPreviewDoc(doc);
    setIsLoading(true);
    setIsPreviewOpen(true);
    setIsFullscreen(false);
  };

  const handleDownload = async (doc: Document) => {
    if (!doc.url) return;
    try {
      const link = document.createElement('a');
      link.href = doc.url;
      link.download = `${doc.title}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open(doc.url, '_blank');
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
              <span className="text-primary-foreground">{getPageTitle()}</span>
            ) : (
              <>
                <Link className="hover:text-[#D9F3FC] transition-colors" href="/dokumen">
                  Dokumen
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

      {/* Document Content with Tabs */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Search Bar */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari dokumen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tab Buttons */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={category.href}
                  className={`
                    inline-flex items-center rounded-full border font-semibold
                    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                    cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105
                    ${activeCategory === category.slug
                      ? 'border-transparent bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                    }
                  `}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Menampilkan <span className="font-medium text-foreground">{filteredDocuments.length}</span> dokumen
              {getCategoryName() && (
                <span> dalam kategori {getCategoryName()}</span>
              )}
            </p>
          </div>

          {/* Document List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredDocuments.length > 0 ? (
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <Card
                  key={doc.id}
                  className="bg-card rounded-xl p-6 shadow-card hover:shadow-lg transition-all border border-border group"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                        <FileText className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1 truncate">
                          {doc.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {doc.description}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(doc.date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {doc.size}
                          </span>
                          <span className="inline-flex items-center rounded-full border border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs px-2.5 py-0.5 font-semibold">
                            {doc.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {doc.url && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1.5"
                          onClick={() => handlePreview(doc)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">Preview</span>
                        </Button>
                        <Button
                          size="sm"
                          className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="h-4 w-4" />
                          <span className="hidden sm:inline">Unduh</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-card rounded-xl p-8 sm:p-12 shadow-card border border-border text-center">
              <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Tidak ada dokumen ditemukan</h3>
              <p className="text-muted-foreground">
                Coba ubah kata kunci pencarian atau pilih kategori lain
              </p>
            </Card>
          )}
        </div>
      </section>

      {/* Document Preview Dialog */}
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
            {/* Header */}
            <div className="flex items-center justify-between gap-4 p-4 border-b border-border bg-background flex-shrink-0">
              <DialogTitle className="text-lg font-semibold truncate max-w-[200px] sm:max-w-md">
                {previewDoc?.title}
              </DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5"
                  onClick={toggleFullscreen}
                  title={isFullscreen ? 'Perkecil Window' : 'Perbesar Window'}
                >
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Perkecil</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Perbesar</span>
                    </>
                  )}
                </Button>
                {previewDoc && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5"
                      onClick={() => {
                        setIsPreviewOpen(false);
                        handleDownload(previewDoc);
                      }}
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Unduh</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5"
                      onClick={() => previewDoc.url && window.open(previewDoc.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="hidden sm:inline">Buka Tab Baru</span>
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1.5"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">Tutup</span>
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 relative overflow-hidden bg-muted/30">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Memuat dokumen...</p>
                  </div>
                </div>
              )}
              {previewDoc?.url && (
                <iframe
                  src={previewDoc.url}
                  className="w-full h-full border-0"
                  title={previewDoc.title}
                  onLoad={handleIframeLoad}
                />
              )}
            </div>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </>
  );
}
