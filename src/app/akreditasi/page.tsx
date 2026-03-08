import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import AkreditasiContent from '@/components/bpm/AkreditasiContent';

export const metadata = {
  title: 'Akreditasi - BPM USNI',
  description: 'Informasi akreditasi institusi dan program studi Universitas Satya Negara Indonesia.',
};

export default function AkreditasiPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        <AkreditasiContent activeCategory="semua" />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
