import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import AkreditasiContent from '@/components/bpm/AkreditasiContent';

export const metadata = {
  title: 'Akreditasi LAM Teknik - BPM USNI',
  description: 'Informasi akreditasi LAM Teknik Universitas Satya Negara Indonesia.',
};

export default function AkreditasiLAMTeknikPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        <AkreditasiContent 
          activeCategory="lam-teknik" 
          title="Akreditasi LAM Teknik"
          description="Informasi akreditasi Lembaga Akreditasi Mandiri Teknik (LAM Teknik) untuk program studi teknik."
        />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
