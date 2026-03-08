import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import DokumenContent from '@/components/bpm/DokumenContent';

export const metadata = {
  title: 'Dokumen SOP - BPM USNI',
  description: 'Dokumen SOP Badan Penjaminan Mutu Universitas Satya Negara Indonesia.',
};

export default function DokumenSOPPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        <DokumenContent 
          activeCategory="sop" 
          title="Dokumen SOP"
          description="Dokumen Prosedur Operasional Standar Badan Penjaminan Mutu Universitas Satya Negara Indonesia."
        />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
