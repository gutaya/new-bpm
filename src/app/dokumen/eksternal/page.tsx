import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import DokumenContent from '@/components/bpm/DokumenContent';

export const metadata = {
  title: 'Dokumen Eksternal - BPM USNI',
  description: 'Dokumen eksternal Badan Penjaminan Mutu Universitas Satya Negara Indonesia.',
};

export default function DokumenEksternalPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        <DokumenContent 
          activeCategory="eksternal" 
          title="Dokumen Eksternal"
          description="Dokumen dari instansi eksternal yang berkaitan dengan penjaminan mutu pendidikan tinggi."
        />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
