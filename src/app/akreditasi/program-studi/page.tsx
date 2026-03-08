import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import AkreditasiContent from '@/components/bpm/AkreditasiContent';

export const metadata = {
  title: 'Akreditasi Program Studi - BPM USNI',
  description: 'Informasi akreditasi Program Studi Universitas Satya Negara Indonesia.',
};

export default function AkreditasiProgramStudiPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        <AkreditasiContent 
          activeCategory="program-studi" 
          title="Akreditasi Program Studi"
          description="Informasi akreditasi program studi di Universitas Satya Negara Indonesia."
        />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
