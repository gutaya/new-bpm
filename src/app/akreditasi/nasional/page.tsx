import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import AkreditasiContent from '@/components/bpm/AkreditasiContent';

export const metadata = {
  title: 'Akreditasi Nasional - BPM USNI',
  description: 'Informasi akreditasi nasional dari BAN-PT, LAMEMBA, LAM Teknik, dan LAM Infokom untuk program studi Universitas Satya Negara Indonesia.',
};

export default function AkreditasiNasionalPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        <AkreditasiContent 
          activeCategory="nasional" 
          title="Akreditasi Nasional"
          description="Informasi akreditasi nasional dari berbagai lembaga akreditasi: BAN-PT, LAMEMBA, LAM Teknik, dan LAM Infokom."
        />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
