import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import DokumenContent from '@/components/bpm/DokumenContent';

export const metadata = {
  title: 'Dokumen Publik - BPM USNI',
  description: 'Dokumen publik Badan Penjaminan Mutu Universitas Satya Negara Indonesia.',
};

export default function DokumenPublikPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        <DokumenContent 
          activeCategory="publik" 
          title="Dokumen Publik"
          description="Kumpulan dokumen publik Badan Penjaminan Mutu Universitas Satya Negara Indonesia yang dapat diakses oleh masyarakat umum."
        />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
