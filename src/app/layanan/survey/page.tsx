import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ChevronRight, 
  BarChart3, 
  Clock, 
  ArrowLeft,
  Users,
  CheckCircle,
  Calendar,
  TrendingUp
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Survey Kepuasan - BPM USNI',
  description: 'Sistem survey kepuasan stakeholder untuk peningkatan mutu layanan USNI',
};

const jenisSurvey = [
  {
    nama: 'Survey Kepuasan Mahasiswa',
    deskripsi: 'Mengukur kepuasan mahasiswa terhadap proses pembelajaran, fasilitas, dan layanan akademik',
  },
  {
    nama: 'Survey Kepuasan Dosen',
    deskripsi: 'Mengukur kepuasan dosen terhadap dukungan institusi dan lingkungan kerja',
  },
  {
    nama: 'Survey Kepuasan Tenaga Kependidikan',
    deskripsi: 'Mengukur kepuasan tendik terhadap kondisi kerja dan pengembangan karir',
  },
  {
    nama: 'Survey Kepuasan Alumni',
    deskripsi: 'Mengukur kesesuaian kompetensi lulusan dengan kebutuhan dunia kerja',
  },
  {
    nama: 'Survey Kepuasan Pengguna Lulusan',
    deskripsi: 'Mengukur kepuasan employer terhadap kinerja lulusan USNI',
  },
];

const hasilSurvey = [
  {
    jenis: 'Kepuasan Mahasiswa',
    tahun: '2024',
    skor: '3.75/4.00',
    target: '3.50',
  },
  {
    jenis: 'Kepuasan Dosen',
    tahun: '2024',
    skor: '3.68/4.00',
    target: '3.50',
  },
  {
    jenis: 'Kepuasan Alumni',
    tahun: '2023',
    skor: '3.82/4.00',
    target: '3.50',
  },
  {
    jenis: 'Pengguna Lulusan',
    tahun: '2023',
    skor: '3.71/4.00',
    target: '3.50',
  },
];

const jadwalSurvey = [
  {
    semester: 'Semester Ganjil',
    waktu: 'September - Oktober 2024',
  },
  {
    semester: 'Semester Genap',
    waktu: 'Maret - April 2025',
  },
];

export default function SurveyPage() {
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
              <span className="text-primary-foreground">Survey Kepuasan</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              Survey Kepuasan
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-3xl">
              Sistem survey kepuasan stakeholder untuk peningkatan mutu layanan USNI
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
                    <BarChart3 className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-1">
                      Survey Kepuasan
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
                {/* Tentang Survey */}
                <div className="mb-8">
                  <h3 className="text-xl md:text-2xl font-display font-semibold text-foreground mb-4 pb-2 border-b border-border">
                    Survey Kepuasan Stakeholder
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    BPM USNI secara berkala melaksanakan survey kepuasan untuk mengukur tingkat kepuasan berbagai pemangku kepentingan terhadap layanan dan penyelenggaraan pendidikan di USNI.
                  </p>
                </div>

                {/* Jenis Survey */}
                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Jenis Survey yang Dilaksanakan
                  </h3>
                  <ul className="space-y-4">
                    {jenisSurvey.map((survey, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <span className="font-medium text-foreground">{survey.nama}</span>
                          <span className="text-muted-foreground"> - {survey.deskripsi}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hasil Survey Terbaru */}
                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Hasil Survey Terbaru
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-border rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-muted">
                          <th className="p-3 text-left text-foreground font-semibold">Jenis Survey</th>
                          <th className="p-3 text-left text-foreground font-semibold">Tahun</th>
                          <th className="p-3 text-left text-foreground font-semibold">Skor Kepuasan</th>
                          <th className="p-3 text-left text-foreground font-semibold">Target</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hasilSurvey.map((item, index) => (
                          <tr key={index} className="border-t border-border">
                            <td className="p-3 font-medium text-foreground">{item.jenis}</td>
                            <td className="p-3 text-muted-foreground">{item.tahun}</td>
                            <td className="p-3">
                              <span className="text-primary font-semibold">{item.skor}</span>
                            </td>
                            <td className="p-3 text-muted-foreground">{item.target}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Jadwal Pelaksanaan */}
                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Jadwal Pelaksanaan Survey 2024
                  </h3>
                  <ul className="space-y-3">
                    {jadwalSurvey.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">
                          <strong className="text-foreground">{item.semester}:</strong> {item.waktu}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    Hasil survey digunakan sebagai dasar penyusunan rencana perbaikan dan pengembangan mutu institusi.
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
