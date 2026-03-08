'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog';
import { 
  ChevronRight, 
  Search, 
  FileText, 
  Award,
  Calendar,
  Eye,
  Download,
  Loader2,
  X,
  ExternalLink,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample document data
const documentsData = [
  {
    id: '1',
    title: 'SK Rektor Tentang BPM',
    description: 'Surat Keputusan Rektor tentang Badan Penjaminan Mutu',
    category: 'SK Rektor',
    date: '9 Februari 2025',
    url: 'https://kyqmzcoxgsdwlyxmhcoa.supabase.co/storage/v1/object/public/documents/1770608480725-aneqep.pdf',
  },
  {
    id: '2',
    title: 'Pedoman Akademik 2024',
    description: 'Buku pedoman akademik untuk mahasiswa dan dosen',
    category: 'Dokumen Universitas',
    date: '2 Februari 2025',
    url: '#',
  },
  {
    id: '3',
    title: 'Pedoman SPMI',
    description: 'Buku pedoman Sistem Penjaminan Mutu Internal',
    category: 'Dokumen SPMI',
    date: '15 Januari 2025',
    url: '#',
  },
  {
    id: '4',
    title: 'Standar Pelayanan Minimal',
    description: 'Dokumen standar pelayanan minimal BPM USNI',
    category: 'Dokumen Publik',
    date: '10 Januari 2025',
    url: '#',
  },
  {
    id: '5',
    title: 'SOP Audit Mutu Internal',
    description: 'Prosedur operasional standar pelaksanaan AMI',
    category: 'Dokumen SOP',
    date: '5 Januari 2025',
    url: '#',
  },
];

// Sample accreditation data
const accreditationData = [
  {
    id: '1',
    title: 'Terakreditasi: B',
    program: 'Akreditasi Institusi',
    category: 'Akreditasi BAN-PT',
    level: 'Nasional',
    status: 'B',
    validUntil: '2029-01-15',
  },
  {
    id: '2',
    title: 'Terakreditasi: Baik',
    program: 'Hukum',
    category: 'Akreditasi BAN-PT',
    level: 'Nasional',
    status: 'Baik',
    validUntil: '2027-12-31',
  },
  {
    id: '3',
    title: 'Terakreditasi: B',
    program: 'Ilmu Komunikasi',
    category: 'Akreditasi BAN-PT',
    level: 'Nasional',
    status: 'B',
    validUntil: '2027-11-30',
  },
  {
    id: '4',
    title: 'Terakreditasi: Baik Sekali',
    program: 'Teknik Informatika',
    category: 'Akreditasi Program Studi',
    level: 'Nasional',
    status: 'Baik Sekali',
    validUntil: '2028-09-30',
  },
  {
    id: '5',
    title: 'Terakreditasi: Baik Sekali',
    program: 'Sistem Informasi',
    category: 'Akreditasi Program Studi',
    level: 'Nasional',
    status: 'Baik Sekali',
    validUntil: '2028-05-20',
  },
  {
    id: '6',
    title: 'Terakreditasi: Baik Sekali',
    program: 'Teknik Lingkungan',
    category: 'Akreditasi LAM Teknik',
    level: 'Nasional',
    status: 'Baik Sekali',
    validUntil: '2028-12-28',
    imageUrl: 'https://kyqmzcoxgsdwlyxmhcoa.supabase.co/storage/v1/object/public/accreditation-docs/1770608811609-p2exvw.jpg',
    certificateUrl: 'https://kyqmzcoxgsdwlyxmhcoa.supabase.co/storage/v1/object/public/accreditation-docs/1770608828987-c9zsy.pdf',
  },
];

const documentCategories = [
  'Semua',
  'Dokumen Publik',
  'Dokumen Universitas',
  'Dokumen Akreditasi',
  'Dokumen Eksternal',
  'Dokumen BPM',
  'Dokumen SPMI',
  'Dokumen SOP',
  'SK Rektor',
];

const accreditationCategories = [
  'Semua',
  'Akreditasi BAN-PT',
  'Akreditasi Internasional',
  'Akreditasi Program Studi',
  'Akreditasi Institusi',
  'Akreditasi LAM Teknik',
];

export default function PusatDataPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDocCategory, setActiveDocCategory] = useState('Semua');
  const [activeAccCategory, setActiveAccCategory] = useState('Semua');
  const [previewDoc, setPreviewDoc] = useState<typeof documentsData[0] | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter documents
  const filteredDocuments = documentsData.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeDocCategory === 'Semua' || doc.category === activeDocCategory;
    return matchesSearch && matchesCategory;
  });

  // Filter accreditations
  const filteredAccreditations = accreditationData.filter(acc => {
    const matchesSearch = acc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          acc.program.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeAccCategory === 'Semua' || acc.category === activeAccCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle document preview
  const handlePreview = (doc: typeof documentsData[0]) => {
    setPreviewDoc(doc);
    setIsLoading(true);
    setIsPreviewOpen(true);
    setIsFullscreen(false);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        {/* Hero Banner */}
        <section className="bg-primary text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-6 flex-wrap">
              <Link className="hover:text-[#D9F3FC] transition-colors" href="/">
                Beranda
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-primary-foreground">Pusat Data</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              Pusat Data
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-3xl">
              Akses seluruh dokumen dan data akreditasi institusi dalam satu tempat.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Search Bar */}
            <div className="relative max-w-lg mx-auto mb-10">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari dokumen atau data akreditasi..."
                className="pl-12 h-12 text-base rounded-xl border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="documents" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="documents" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Dokumen ({filteredDocuments.length})
                </TabsTrigger>
                <TabsTrigger value="accreditation" className="gap-2">
                  <Award className="h-4 w-4" />
                  Akreditasi ({filteredAccreditations.length})
                </TabsTrigger>
              </TabsList>

              {/* Documents Tab */}
              <TabsContent value="documents">
                {/* Category Filters */}
                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                  {documentCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveDocCategory(category)}
                      className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition-all hover:scale-105 ${
                        activeDocCategory === category
                          ? 'bg-primary text-primary-foreground border-transparent'
                          : 'border-border text-foreground hover:bg-secondary'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Documents List */}
                <div className="space-y-3">
                  {filteredDocuments.map((doc) => (
                    <Card key={doc.id} className="bg-card rounded-xl p-5 border border-border hover:shadow-lg transition-all group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                            <FileText className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground mb-1 truncate">
                              {doc.title}
                            </h3>
                            {doc.description && (
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {doc.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {doc.date}
                              </span>
                              <span className="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs font-semibold">
                                {doc.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 hover:bg-[#279BF3] hover:text-white hover:border-[#279BF3] transition-colors"
                            onClick={() => handlePreview(doc)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">Preview</span>
                          </Button>
                          <Button
                            size="sm"
                            className="gap-1.5 hover:bg-[#279BF3] transition-colors"
                            onClick={() => window.open(doc.url, '_blank')}
                          >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Unduh</span>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {filteredDocuments.length === 0 && (
                    <Card className="bg-card rounded-xl p-8 text-center border border-border">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">Tidak ada dokumen</h3>
                      <p className="text-muted-foreground">
                        Tidak ditemukan dokumen dengan filter yang dipilih
                      </p>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Accreditation Tab */}
              <TabsContent value="accreditation">
                {/* Category Filters */}
                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                  {accreditationCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveAccCategory(category)}
                      className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition-all hover:scale-105 ${
                        activeAccCategory === category
                          ? 'bg-primary text-primary-foreground border-transparent'
                          : 'border-border text-foreground hover:bg-secondary'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Accreditation List */}
                <div className="space-y-3">
                  {filteredAccreditations.map((acc) => (
                    <Card key={acc.id} className="bg-card rounded-xl p-5 border border-border hover:shadow-lg transition-all group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                            <Award className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground mb-1 truncate">
                              {acc.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {acc.program}
                            </p>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Berlaku: {new Date(acc.validUntil).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </span>
                              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-2.5 py-0.5 text-xs font-semibold">
                                {acc.category}
                              </span>
                              <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold">
                                {acc.level}
                              </span>
                            </div>
                          </div>
                        </div>
                        {acc.certificateUrl && (
                          <Button
                            size="sm"
                            className="gap-1.5 flex-shrink-0 hover:bg-[#279BF3] transition-colors"
                            onClick={() => window.open(acc.certificateUrl, '_blank')}
                          >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Unduh</span>
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}

                  {filteredAccreditations.length === 0 && (
                    <Card className="bg-card rounded-xl p-8 text-center border border-border">
                      <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">Tidak ada data akreditasi</h3>
                      <p className="text-muted-foreground">
                        Tidak ditemukan data akreditasi dengan filter yang dipilih
                      </p>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />

      {/* Document Preview Dialog - Using Radix UI */}
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
                {previewDoc?.url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5"
                    onClick={() => window.open(previewDoc.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="hidden sm:inline">Buka Tab Baru</span>
                  </Button>
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
    </div>
  );
}
