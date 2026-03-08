import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import DokumenContent from '@/components/bpm/DokumenContent';

export const metadata = {
  title: 'Dokumen SPMI - BPM USNI',
  description: 'Dokumen SPMI Badan Penjaminan Mutu Universitas Satya Negara Indonesia.',
};

export default function DokumenSPMIPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        <DokumenContent 
          activeCategory="spmi" 
          title="Dokumen SPMI"
          description="Dokumen Sistem Penjaminan Mutu Internal Universitas Satya Negara Indonesia."
        />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
