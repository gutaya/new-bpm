import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ChevronRight, 
  Gift, 
  Clock, 
  ArrowLeft,
  CheckCircle,
  DollarSign,
  FileText,
  ListOrdered
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hibah & Pendanaan - BPM USNI',
  description: 'Informasi program hibah penelitian dan pengabdian masyarakat',
};

const jenisHibah = [
  {
    nama: 'Hibah Penelitian Internal USNI',
    deskripsi: 'Dana penelitian untuk dosen USNI dengan skema kompetitif',
  },
  {
    nama: 'Hibah Pengabdian kepada Masyarakat',
    deskripsi: 'Dana untuk kegiatan pengabdian dan pemberdayaan masyarakat',
  },
  {
    nama: 'Hibah Penelitian Kemendikbudristek',
    deskripsi: 'Pendampingan proposal hibah nasional (PDP, PD, dll)',
  },
  {
    nama: 'Hibah Kolaborasi Industri',
    deskripsi: 'Kerjasama penelitian dengan mitra industri',
  },
];

const statistikHibah = [
  {
    jenis: 'Internal USNI',
    jumlahProposal: '45',
    didanai: '28',
    totalDana: '560.000.000',
  },
  {
    jenis: 'Kemendikbudristek',
    jumlahProposal: '32',
    didanai: '12',
    totalDana: '720.000.000',
  },
  {
    jenis: 'Pengabdian',
    jumlahProposal: '25',
    didanai: '18',
    totalDana: '270.000.000',
  },
];

const prosedurPengajuan = [
  'Pengumuman call for proposal oleh LPPM',
  'Pengajuan proposal melalui sistem informasi penelitian',
  'Review proposal oleh reviewer internal',
  'Pengumuman penerima hibah',
  'Kontrak dan pencairan dana tahap I',
  'Monitoring dan evaluasi oleh BPM',
  'Laporan kemajuan dan pencairan tahap II',
  'Laporan akhir dan output publikasi',
];

export default function HibahPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        {/* Hero Banner */}
        <section className="bg-primary text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-6 flex-wrap">
              <Link className="hover:text-[#D9F3FC] transition-colors" href="/">
                Beranda
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link className="hover:text-[#D9F3FC] transition-colors" href="/layanan">
                Layanan
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-primary-foreground">Hibah & Pendanaan</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              Hibah & Pendanaan
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-3xl">
              Informasi program hibah penelitian dan pengabdian masyarakat
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
              {/* Header Card */}
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 md:p-8 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                    <Gift className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-1">
                      Hibah & Pendanaan
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        Diperbarui: 4 Februari 2025
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 lg:p-10">
                {/* Tentang Hibah */}
                <div className="mb-8">
                  <h3 className="text-xl md:text-2xl font-display font-semibold text-foreground mb-4 pb-2 border-b border-border">
                    Hibah & Pendanaan Penelitian
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    BPM USNI berperan dalam mendukung dan memonitor pelaksanaan hibah penelitian dan pengabdian kepada masyarakat untuk memastikan kualitas output sesuai standar yang ditetapkan.
                  </p>
                </div>

                {/* Jenis Hibah */}
                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Jenis Hibah yang Tersedia
                  </h3>
                  <ul className="space-y-4">
                    {jenisHibah.map((hibah, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <span className="font-medium text-foreground">{hibah.nama}</span>
                          <span className="text-muted-foreground"> - {hibah.deskripsi}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Statistik Hibah */}
                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Statistik Hibah 2023-2024
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-border rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-muted">
                          <th className="p-3 text-left text-foreground font-semibold">Jenis Hibah</th>
                          <th className="p-3 text-left text-foreground font-semibold">Jumlah Proposal</th>
                          <th className="p-3 text-left text-foreground font-semibold">Didanai</th>
                          <th className="p-3 text-left text-foreground font-semibold">Total Dana (Rp)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statistikHibah.map((item, index) => (
                          <tr key={index} className="border-t border-border">
                            <td className="p-3 font-medium text-foreground">{item.jenis}</td>
                            <td className="p-3 text-muted-foreground">{item.jumlahProposal}</td>
                            <td className="p-3 text-muted-foreground">{item.didanai}</td>
                            <td className="p-3">
                              <span className="text-primary font-semibold">{item.totalDana}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Prosedur Pengajuan */}
                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <ListOrdered className="h-5 w-5 text-primary" />
                    Prosedur Pengajuan Hibah Internal
                  </h3>
                  <ol className="space-y-3">
                    {prosedurPengajuan.map((langkah, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-muted-foreground">{langkah}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Kontak Informasi */}
                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4">
                    Kontak Informasi
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Untuk informasi lebih lanjut mengenai hibah penelitian, silakan hubungi LPPM USNI atau BPM USNI.
                  </p>
                </div>
              </div>

              {/* Footer Card */}
              <div className="px-6 md:px-8 lg:px-10 py-6 bg-muted/30 border-t border-border">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <Button variant="outline" asChild>
                    <Link href="/layanan">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Kembali ke Daftar Layanan
                    </Link>
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Ada pertanyaan?{' '}
                    <Link href="/hubungi-kami" className="text-primary font-medium hover:underline">
                      Hubungi Kami
                    </Link>
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
