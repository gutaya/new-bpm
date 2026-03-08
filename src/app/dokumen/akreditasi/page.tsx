import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import DokumenContent from '@/components/bpm/DokumenContent';

export const metadata = {
  title: 'Dokumen Akreditasi - BPM USNI',
  description: 'Dokumen akreditasi Badan Penjaminan Mutu Universitas Satya Negara Indonesia.',
};

export default function DokumenAkreditasiPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        <DokumenContent 
          activeCategory="akreditasi" 
          title="Dokumen Akreditasi"
          description="Dokumen terkait proses akreditasi institusi dan program studi."
        />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
