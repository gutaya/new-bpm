import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import DokumenContent from '@/components/bpm/DokumenContent';

export const metadata = {
  title: 'Dokumen - BPM USNI',
  description: 'Kumpulan dokumen dan data yang tersedia untuk diunduh.',
};

export default function DokumenPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        <DokumenContent activeCategory="semua" />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
