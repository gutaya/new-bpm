import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import DokumenContent from '@/components/bpm/DokumenContent';

export const metadata = {
  title: 'SK Rektor - BPM USNI',
  description: 'SK Rektor Badan Penjaminan Mutu Universitas Satya Negara Indonesia.',
};

export default function SKRektorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        <DokumenContent 
          activeCategory="sk-rektor" 
          title="SK Rektor"
          description="Surat Keputusan Rektor terkait Badan Penjaminan Mutu Universitas Satya Negara Indonesia."
        />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
