import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import AkreditasiContent from '@/components/bpm/AkreditasiContent';

export const metadata = {
  title: 'Akreditasi Internasional - BPM USNI',
  description: 'Informasi akreditasi Internasional Universitas Satya Negara Indonesia.',
};

export default function AkreditasiInternasionalPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        <AkreditasiContent 
          activeCategory="internasional" 
          title="Akreditasi Internasional"
          description="Informasi akreditasi internasional untuk program studi dan institusi."
        />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
