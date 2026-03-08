import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import AkreditasiContent from '@/components/bpm/AkreditasiContent';

export const metadata = {
  title: 'Akreditasi Institusi - BPM USNI',
  description: 'Informasi akreditasi Institusi Universitas Satya Negara Indonesia.',
};

export default function AkreditasiInstitusiPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        <AkreditasiContent 
          activeCategory="institusi" 
          title="Akreditasi Institusi"
          description="Informasi akreditasi institusi Universitas Satya Negara Indonesia."
        />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
