import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import AboutContent from '@/components/bpm/AboutContent';

export const metadata = {
  title: 'Tentang Kami - BPM USNI',
  description: 'Mengenal lebih dekat Badan Penjaminan Mutu Universitas Satya Negara Indonesia',
};

export default function TentangKamiPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        {/* Hero Banner */}
        <section className="bg-primary text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-6">
              <a className="hover:text-[#D9F3FC] transition-colors" href="/">Beranda</a>
              <span className="flex items-center gap-2">
                <span className="text-primary-foreground/50">/</span>
                <a className="hover:text-[#D9F3FC] transition-colors" href="#profil">Profil</a>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-primary-foreground/50">/</span>
                <span className="text-primary-foreground">Tentang Kami</span>
              </span>
            </nav>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              Tentang Kami
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-3xl">
              Mengenal lebih dekat Badan Penjaminan Mutu Universitas Satya Negara Indonesia
            </p>
          </div>
        </section>

        {/* About Content */}
        <AboutContent />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
