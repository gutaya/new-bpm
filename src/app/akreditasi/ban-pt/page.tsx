import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import AkreditasiContent from '@/components/bpm/AkreditasiContent';

export const metadata = {
  title: 'Akreditasi BAN-PT - BPM USNI',
  description: 'Informasi akreditasi BAN-PT Universitas Satya Negara Indonesia.',
};

export default function AkreditasiBANPTPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        <AkreditasiContent 
          activeCategory="ban-pt" 
          title="Akreditasi BAN-PT"
          description="Informasi akreditasi Badan Akreditasi Nasional Pendidikan Tinggi (BAN-PT) untuk institusi dan program studi."
        />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
