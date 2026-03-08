import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ChevronRight, 
  ClipboardCheck, 
  Clock, 
  ArrowLeft,
  Calendar,
  FileText,
  Users,
  CheckCircle,
  Target,
  FileCheck
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Audit Mutu Internal (AMI) - BPM USNI',
  description: 'Pelaksanaan Audit Mutu Internal untuk menjamin kualitas pendidikan di USNI',
};

const jadwalAMI = [
  {
    tahap: 'Persiapan',
    waktu: 'Januari - Februari',
    keterangan: 'Penyusunan instrumen dan pelatihan auditor',
  },
  {
    tahap: 'Pelaksanaan',
    waktu: 'Maret - Mei',
    keterangan: 'Audit lapangan di semua program studi',
  },
  {
    tahap: 'Pelaporan',
    waktu: 'Juni',
    keterangan: 'Penyusunan dan presentasi laporan hasil AMI',
  },
  {
    tahap: 'Tindak Lanjut',
    waktu: 'Juli - Agustus',
    keterangan: 'Implementasi rekomendasi perbaikan',
  },
];

const tujuanAMI = [
  'Mengevaluasi kesesuaian pelaksanaan standar SPMI di setiap unit kerja',
  'Mengidentifikasi peluang perbaikan dan pengembangan mutu',
  'Memberikan rekomendasi untuk peningkatan kinerja institusi',
  'Mempersiapkan unit kerja dalam menghadapi akreditasi eksternal',
];

const dokumenTerkait = [
  'Pedoman Audit Mutu Internal USNI',
  'Instrumen AMI Program Studi',
  'Template Laporan Hasil AMI',
  'Form Tindak Lanjut Temuan',
];

export default function AMIPage() {
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
              <span className="text-primary-foreground">Audit Mutu Internal (AMI)</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              Audit Mutu Internal (AMI)
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-3xl">
              Pelaksanaan Audit Mutu Internal untuk menjamin kualitas pendidikan di USNI
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
                    <ClipboardCheck className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-1">
                      Audit Mutu Internal (AMI)
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
                {/* Tentang AMI */}
                <div className="mb-8">
                  <h3 className="text-xl md:text-2xl font-display font-semibold text-foreground mb-4 pb-2 border-b border-border">
                    Tentang Audit Mutu Internal (AMI)
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Audit Mutu Internal (AMI) merupakan kegiatan evaluasi sistematis yang dilakukan oleh BPM USNI untuk memastikan penyelenggaraan pendidikan di setiap program studi berjalan sesuai dengan standar mutu yang ditetapkan.
                  </p>
                </div>

                {/* Tujuan AMI */}
                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Tujuan AMI
                  </h3>
                  <ul className="space-y-3">
                    {tujuanAMI.map((tujuan, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{tujuan}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Jadwal Pelaksanaan */}
                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Jadwal Pelaksanaan AMI 2025
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-border rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-muted">
                          <th className="p-3 text-left text-foreground font-semibold">Tahap</th>
                          <th className="p-3 text-left text-foreground font-semibold">Waktu</th>
                          <th className="p-3 text-left text-foreground font-semibold">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jadwalAMI.map((item, index) => (
                          <tr key={index} className="border-t border-border">
                            <td className="p-3 font-medium text-foreground">{item.tahap}</td>
                            <td className="p-3 text-muted-foreground">{item.waktu}</td>
                            <td className="p-3 text-muted-foreground">{item.keterangan}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Dokumen Terkait */}
                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Dokumen Terkait
                  </h3>
                  <ul className="space-y-3">
                    {dokumenTerkait.map((doc, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <FileCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tim Auditor */}
                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Tim Auditor Internal
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Tim Auditor Internal terdiri dari dosen dan tenaga kependidikan yang telah mengikuti pelatihan auditor mutu internal dan memiliki sertifikat kompetensi.
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
