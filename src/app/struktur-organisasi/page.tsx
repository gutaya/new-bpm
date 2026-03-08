import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import StrukturOrganisasiContent from '@/components/bpm/StrukturOrganisasiContent';

export const metadata = {
  title: 'Struktur Organisasi - BPM USNI',
  description: 'Struktur organisasi Badan Penjaminan Mutu Universitas Satya Negara Indonesia',
};

export default function StrukturOrganisasiPage() {
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
                <span className="text-primary-foreground">Struktur Organisasi</span>
              </span>
            </nav>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              Struktur Organisasi
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-3xl">
              Struktur organisasi Badan Penjaminan Mutu Universitas Satya Negara Indonesia.
            </p>
          </div>
        </section>

        {/* Struktur Organisasi Content */}
        <StrukturOrganisasiContent />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
