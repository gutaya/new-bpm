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
import { Separator } from '@/components/ui/separator';
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
  Newspaper,
  Tag,
  ArrowRight,
  Printer,
  FileDown
} from 'lucide-react';

interface NewsDetail {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  publishedAt: string | null;
  viewCount: number;
  createdAt: string;
  tags?: { id: string; name: string; slug: string }[];
}

interface RelatedNews {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export default function BeritaDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [relatedNews, setRelatedNews] = useState<RelatedNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    // Fetch news detail
    fetch(`/api/news/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('News not found');
        return res.json();
      })
      .then((data) => {
        setNews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching news:', err);
        setError(true);
        setLoading(false);
      });

    // Fetch related news
    fetch('/api/news?limit=4')
      .then((res) => res.json())
      .then((data) => {
        // Filter out current news
        const filtered = data.filter((item: RelatedNews) => item.slug !== slug);
        setRelatedNews(filtered.slice(0, 3));
      })
      .catch((err) => {
        console.error('Error fetching related news:', err);
      });
  }, [slug]);

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

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = news?.title || '';

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

  // Print article
  const handlePrint = () => {
    window.print();
  };

  // Download as PDF
  const handleDownloadPDF = () => {
    // Create a printable version and trigger print with PDF option
    const printWindow = window.open('', '_blank');
    if (printWindow && news) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${news.title}</title>
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
          <h1>${news.title}</h1>
          <div class="meta">
            <span>📅 ${formatDate(news.publishedAt || news.createdAt)}</span>
            <span>👤 Admin BPM</span>
          </div>
          <div class="content">
            ${news.content}
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
                  <div className="h-64 bg-gray-200 rounded mb-6"></div>
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

  if (error || !news) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 pt-20 lg:pt-[7.5rem]">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Newspaper className="h-10 w-10 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-4">Berita Tidak Ditemukan</h1>
              <p className="text-muted-foreground mb-8">Berita yang Anda cari tidak tersedia atau telah dihapus.</p>
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
              <Link href="/#berita" className="text-muted-foreground hover:text-primary transition-colors">
                Berita
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium line-clamp-1 max-w-[200px] md:max-w-none">
                {news.title}
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
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                        <Newspaper className="h-3 w-3 mr-1" />
                        Berita
                      </Badge>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground leading-tight mb-4">
                      {news.title}
                    </h1>

                    {/* Meta Info & Share */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b">
                      <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{formatDate(news.publishedAt || news.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          <span>Admin BPM</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-primary" />
                          <span>{news.viewCount} views</span>
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
                      dangerouslySetInnerHTML={{ __html: news.content }} 
                    />

                    {/* Tags Section */}
                    <div className="mt-8 pt-6 border-t">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Tags:</span>
                        <div className="flex flex-wrap gap-2">
                          {news.tags && news.tags.length > 0 ? (
                            news.tags.map((tag) => (
                              <Link key={tag.id} href={`/berita/tag/${tag.slug}`}>
                                <Badge 
                                  variant="outline" 
                                  className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                  {tag.name}
                                </Badge>
                              </Link>
                            ))
                          ) : (
                            <Badge variant="outline" className="text-xs">Berita</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                </CardContent>
              </Card>

              {/* Back Button */}
              <div className="mt-6">
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/#berita">
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Daftar Berita
                  </Link>
                </Button>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Related News */}
                <Card className="shadow-sm">
                  <CardContent className="p-0">
                    <div className="p-4 bg-primary/5 border-b">
                      <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                        <Newspaper className="h-5 w-5 text-primary" />
                        Berita Lainnya
                      </h3>
                    </div>
                    <div className="p-4 space-y-4">
                      {relatedNews.map((item, index) => (
                        <Link
                          key={item.id}
                          href={`/berita/${item.slug}`}
                          className="group block"
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">{index + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0">
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
                      ))}
                      {relatedNews.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Tidak ada berita lainnya
                        </p>
                      )}
                    </div>
                    <div className="p-4 border-t">
                      <Button asChild variant="ghost" className="w-full gap-2 text-primary">
                        <Link href="/#berita">
                          Lihat Semua Berita
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
