import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import DokumenContent from '@/components/bpm/DokumenContent';

export const metadata = {
  title: 'Dokumen Universitas - BPM USNI',
  description: 'Dokumen universitas Badan Penjaminan Mutu Universitas Satya Negara Indonesia.',
};

export default function DokumenUniversitasPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        <DokumenContent 
          activeCategory="universitas" 
          title="Dokumen Universitas"
          description="Dokumen resmi universitas yang berkaitan dengan penjaminan mutu dan tata kelola institusi."
        />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
