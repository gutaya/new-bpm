import Header from '@/components/bpm/Header';
import HeroSection from '@/components/bpm/HeroSection';
import NewsSection from '@/components/bpm/NewsSection';
import AnnouncementSection from '@/components/bpm/AnnouncementSection';
import AccreditationSection from '@/components/bpm/AccreditationSection';
import VisionMissionSection from '@/components/bpm/VisionMissionSection';
import QuickLinksSection from '@/components/bpm/QuickLinksSection';
import GallerySection from '@/components/bpm/GallerySection';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        <HeroSection />
        <NewsSection />
        <AnnouncementSection />
        <AccreditationSection />
        <VisionMissionSection />
        <QuickLinksSection />
        <GallerySection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
