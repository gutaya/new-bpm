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
  User, 
  Eye, 
  ArrowLeft, 
  Facebook, 
  Twitter, 
  Linkedin, 
  MessageCircle,
  ChevronRight,
  Megaphone,
  ArrowRight,
  Printer,
  FileDown,
  AlertCircle,
  Bell
} from 'lucide-react';

interface AnnouncementDetail {
  id: string;
  title: string;
  content: string;
  priority: string;
  publishedAt: string | null;
  viewCount: number;
  createdAt: string;
}

interface RelatedAnnouncement {
  id: string;
  title: string;
  content: string;
  priority: string;
  createdAt: string;
}

export default function PengumumanDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [announcement, setAnnouncement] = useState<AnnouncementDetail | null>(null);
  const [relatedAnnouncements, setRelatedAnnouncements] = useState<RelatedAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Fetch announcement detail
    fetch(`/api/announcements/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Announcement not found');
        return res.json();
      })
      .then((data) => {
        setAnnouncement(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching announcement:', err);
        setError(true);
        setLoading(false);
      });

    // Fetch related announcements
    fetch('/api/announcements?limit=4')
      .then((res) => res.json())
      .then((data) => {
        // Filter out current announcement
        const filtered = data.filter((item: RelatedAnnouncement) => item.id !== id);
        setRelatedAnnouncements(filtered.slice(0, 3));
      })
      .catch((err) => {
        console.error('Error fetching related announcements:', err);
      });
  }, [id]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    // Use UTC to avoid timezone differences between server and client
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${dayName}, ${day} ${month} ${year}`;
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 
                    'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return { label: 'Mendesak', className: 'bg-red-500 text-white hover:bg-red-600' };
      case 'high':
        return { label: 'Penting', className: 'bg-orange-500 text-white hover:bg-orange-600' };
      default:
        return { label: 'Umum', className: 'bg-primary/10 text-primary hover:bg-primary/20' };
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = announcement?.title || '';

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank');
  };

  const shareToLinkedin = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`, '_blank');
  };

  const shareToWhatsapp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`, '_blank');
  };

  // Print announcement
  const handlePrint = () => {
    window.print();
  };

  // Download as PDF
  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && announcement) {
      const priorityInfo = getPriorityBadge(announcement.priority);
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${announcement.title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
              color: #333;
              line-height: 1.6;
            }
            h1 {
              font-family: "Times New Roman", serif;
              font-size: 28px;
              margin-bottom: 10px;
              color: #111;
            }
            .priority {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
              margin-bottom: 15px;
            }
            .priority-urgent { background: #ef4444; color: white; }
            .priority-high { background: #f97316; color: white; }
            .priority-normal { background: #0D93F2; color: white; }
            .meta {
              font-size: 14px;
              color: #666;
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 1px solid #eee;
            }
            .meta span {
              margin-right: 15px;
            }
            .content {
              font-size: 16px;
            }
            .content img {
              max-width: 100%;
              height: auto;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #999;
              text-align: center;
            }
            .logo {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo h2 {
              color: #0D93F2;
              margin: 0;
            }
            .logo p {
              color: #666;
              font-size: 14px;
              margin: 5px 0 0 0;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="logo">
            <h2>BPM USNI</h2>
            <p>Badan Penjaminan Mutu - Universitas Satya Negara Indonesia</p>
          </div>
          <span class="priority priority-${announcement.priority}">${priorityInfo.label}</span>
          <h1>${announcement.title}</h1>
          <div class="meta">
            <span>📅 ${formatDate(announcement.publishedAt || announcement.createdAt)}</span>
            <span>👤 Admin BPM</span>
          </div>
          <div class="content">
            ${announcement.content}
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} BPM USNI - Badan Penjaminan Mutu Universitas Satya Negara Indonesia</p>
            <p>Dokumen ini diunduh dari ${shareUrl}</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 pt-20 lg:pt-[7.5rem]">
          <div className="bg-white border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="animate-pulse h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 pt-20 lg:pt-[7.5rem]">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="h-10 w-10 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-4">Pengumuman Tidak Ditemukan</h1>
              <p className="text-muted-foreground mb-8">Pengumuman yang Anda cari tidak tersedia atau telah dihapus.</p>
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

  const priorityBadge = getPriorityBadge(announcement.priority);

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
              <Link href="/#pengumuman" className="text-muted-foreground hover:text-primary transition-colors">
                Pengumuman
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium line-clamp-1 max-w-[200px] md:max-w-none">
                {announcement.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Article Content */}
            <article className="lg:col-span-2">
              {/* Article Card */}
              <Card className="overflow-hidden shadow-sm">
                <CardContent className="p-6 md:p-8">
                    {/* Category Badge */}
                    <div className="mb-4">
                      <Badge className={priorityBadge.className}>
                        {announcement.priority === 'urgent' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {announcement.priority === 'high' && <Bell className="h-3 w-3 mr-1" />}
                        {announcement.priority === 'normal' && <Megaphone className="h-3 w-3 mr-1" />}
                        {priorityBadge.label}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground leading-tight mb-4">
                      {announcement.title}
                    </h1>

                    {/* Meta Info & Share */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b">
                      <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{formatDate(announcement.publishedAt || announcement.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          <span>Admin BPM</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-primary" />
                          <span>{announcement.viewCount} views</span>
                        </div>
                      </div>
                      {/* Share & Action Buttons */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={shareToFacebook}
                          className="h-8 w-8 text-[#1877F2] hover:bg-[#1877F2]/10"
                          title="Share to Facebook"
                        >
                          <Facebook className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={shareToTwitter}
                          className="h-8 w-8 text-[#1DA1F2] hover:bg-[#1DA1F2]/10"
                          title="Share to Twitter"
                        >
                          <Twitter className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={shareToLinkedin}
                          className="h-8 w-8 text-[#0A66C2] hover:bg-[#0A66C2]/10"
                          title="Share to LinkedIn"
                        >
                          <Linkedin className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={shareToWhatsapp}
                          className="h-8 w-8 text-[#25D366] hover:bg-[#25D366]/10"
                          title="Share to WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <div className="w-px h-5 bg-border mx-1"></div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handlePrint}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
                          title="Print"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleDownloadPDF}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
                          title="Download PDF"
                        >
                          <FileDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <div 
                      className="prose prose-lg max-w-none text-foreground"
                      dangerouslySetInnerHTML={{ __html: announcement.content }} 
                    />
                </CardContent>
              </Card>

              {/* Back Button */}
              <div className="mt-6">
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/#pengumuman">
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Daftar Pengumuman
                  </Link>
                </Button>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Related Announcements */}
                <Card className="shadow-sm">
                  <CardContent className="p-0">
                    <div className="p-4 bg-primary/5 border-b">
                      <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                        <Megaphone className="h-5 w-5 text-primary" />
                        Pengumuman Lainnya
                      </h3>
                    </div>
                    <div className="p-4 space-y-4">
                      {relatedAnnouncements.map((item, index) => {
                        const itemPriority = getPriorityBadge(item.priority);
                        return (
                          <Link
                            key={item.id}
                            href={`/pengumuman/${item.id}`}
                            className="group block"
                          >
                            <div className="flex gap-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-bold text-primary">{index + 1}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className={`${itemPriority.className} text-[10px] px-2 py-0.5`}>
                                    {itemPriority.label}
                                  </Badge>
                                </div>
                                <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                  {item.title}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatShortDate(item.createdAt)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                      {relatedAnnouncements.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Tidak ada pengumuman lainnya
                        </p>
                      )}
                    </div>
                    <div className="p-4 border-t">
                      <Button asChild variant="ghost" className="w-full gap-2 text-primary">
                        <Link href="/#pengumuman">
                          Lihat Semua Pengumuman
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card className="shadow-sm">
                  <CardContent className="p-0">
                    <div className="p-4 bg-primary/5 border-b">
                      <h3 className="font-display font-bold text-foreground">
                        Tautan Cepat
                      </h3>
                    </div>
                    <div className="p-4">
                      <nav className="space-y-1">
                        <Link
                          href="/tentang-kami"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-secondary"
                        >
                          <ChevronRight className="h-4 w-4" />
                          Tentang Kami
                        </Link>
                        <Link
                          href="/visi-misi"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-secondary"
                        >
                          <ChevronRight className="h-4 w-4" />
                          Visi & Misi
                        </Link>
                        <Link
                          href="/struktur-organisasi"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-secondary"
                        >
                          <ChevronRight className="h-4 w-4" />
                          Struktur Organisasi
                        </Link>
                        <Link
                          href="/dokumen"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-secondary"
                        >
                          <ChevronRight className="h-4 w-4" />
                          Dokumen
                        </Link>
                        <Link
                          href="/akreditasi"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-secondary"
                        >
                          <ChevronRight className="h-4 w-4" />
                          Akreditasi
                        </Link>
                        <Link
                          href="/hubungi-kami"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-secondary"
                        >
                          <ChevronRight className="h-4 w-4" />
                          Hubungi Kami
                        </Link>
                      </nav>
                    </div>
                  </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="shadow-sm bg-primary text-primary-foreground">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-display font-bold text-lg mb-2">
                      Butuh Informasi Lebih Lanjut?
                    </h3>
                    <p className="text-sm text-primary-foreground/80 mb-4">
                      Hubungi kami untuk informasi seputar BPM USNI
                    </p>
                    <Button asChild variant="secondary" className="w-full">
                      <Link href="/hubungi-kami">
                        Hubungi Kami
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
