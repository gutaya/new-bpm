import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ChevronRight, 
  GraduationCap, 
  Clock, 
  ArrowLeft,
  CheckCircle,
  Calendar,
  Users,
  BookOpen,
  Award
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'PEKERTI/AA - BPM USNI',
  description: 'Program pelatihan pedagogik PEKERTI dan Applied Approach untuk dosen',
};

const materiPEKERTI = [
  'Dasar-dasar pendidikan tinggi dan kurikulum',
  'Strategi pembelajaran yang efektif',
  'Pengembangan bahan ajar',
  'Evaluasi hasil belajar',
  'Penggunaan media dan teknologi pembelajaran',
];

const materiAA = [
  'Penyusunan RPS berbasis OBE',
  'Pengembangan asesmen autentik',
  'Implementasi pembelajaran berbasis kasus',
  'Praktik mengajar dengan peer review',
  'Refleksi dan pengembangan diri',
];

const jadwalPelatihan = [
  {
    program: 'PEKERTI',
    angkatan: 'Angkatan I',
    tanggal: '15-19 Januari 2024',
    kuota: '30 peserta',
  },
  {
    program: 'PEKERTI',
    angkatan: 'Angkatan II',
    tanggal: '8-12 Juli 2024',
    kuota: '30 peserta',
  },
  {
    program: 'AA',
    angkatan: 'Angkatan I',
    tanggal: '22-26 Januari 2024',
    kuota: '25 peserta',
  },
  {
    program: 'AA',
    angkatan: 'Angkatan II',
    tanggal: '15-19 Juli 2024',
    kuota: '25 peserta',
  },
];

const statistikPeserta = [
  {
    tahun: '2022',
    pekerti: '45',
    aa: '32',
    total: '77',
  },
  {
    tahun: '2023',
    pekerti: '52',
    aa: '38',
    total: '90',
  },
  {
    tahun: '2024',
    pekerti: '28',
    aa: '22',
    total: '50',
  },
];

export default function PekertiAaPage() {
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
              <span className="text-primary-foreground">PEKERTI/AA</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              PEKERTI/AA
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-3xl">
              Program pelatihan pedagogik PEKERTI dan Applied Approach untuk dosen
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
                    <GraduationCap className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-1">
                      PEKERTI/AA
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
                {/* Tentang Program */}
                <div className="mb-8">
                  <h3 className="text-xl md:text-2xl font-display font-semibold text-foreground mb-4 pb-2 border-b border-border">
                    Program PEKERTI dan Applied Approach (AA)
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    PEKERTI (Pelatihan Keterampilan Dasar Teknik Instruksional) dan AA (Applied Approach) merupakan program pelatihan pedagogik bagi dosen untuk meningkatkan kompetensi mengajar.
                  </p>
                </div>

                {/* Tentang PEKERTI */}
                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Tentang PEKERTI
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    PEKERTI adalah pelatihan dasar yang wajib diikuti oleh dosen baru untuk memahami konsep dasar pembelajaran di perguruan tinggi, meliputi:
                  </p>
                  <ul className="space-y-3">
                    {materiPEKERTI.map((materi, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{materi}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tentang AA */}
                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Tentang Applied Approach (AA)
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    AA adalah pelatihan lanjutan setelah PEKERTI yang fokus pada penerapan praktis kompetensi pedagogik, meliputi:
                  </p>
                  <ul className="space-y-3">
                    {materiAA.map((materi, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{materi}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Jadwal Pelatihan */}
                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Jadwal Pelatihan 2024
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-border rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-muted">
                          <th className="p-3 text-left text-foreground font-semibold">Program</th>
                          <th className="p-3 text-left text-foreground font-semibold">Angkatan</th>
                          <th className="p-3 text-left text-foreground font-semibold">Tanggal</th>
                          <th className="p-3 text-left text-foreground font-semibold">Kuota</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jadwalPelatihan.map((item, index) => (
                          <tr key={index} className="border-t border-border">
                            <td className="p-3">
                              <span className={`font-medium ${item.program === 'PEKERTI' ? 'text-primary' : 'text-green-600'}`}>
                                {item.program}
                              </span>
                            </td>
                            <td className="p-3 text-muted-foreground">{item.angkatan}</td>
                            <td className="p-3 text-muted-foreground">{item.tanggal}</td>
                            <td className="p-3 text-muted-foreground">{item.kuota}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Persyaratan Peserta */}
                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Persyaratan Peserta
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">PEKERTI:</strong> Dosen tetap/tidak tetap yang belum memiliki sertifikat PEKERTI
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">AA:</strong> Dosen yang telah memiliki sertifikat PEKERTI
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Statistik Peserta */}
                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Statistik Peserta
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-border rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-muted">
                          <th className="p-3 text-left text-foreground font-semibold">Tahun</th>
                          <th className="p-3 text-left text-foreground font-semibold">PEKERTI</th>
                          <th className="p-3 text-left text-foreground font-semibold">AA</th>
                          <th className="p-3 text-left text-foreground font-semibold">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statistikPeserta.map((item, index) => (
                          <tr key={index} className="border-t border-border">
                            <td className="p-3 font-medium text-foreground">{item.tahun}</td>
                            <td className="p-3 text-muted-foreground">{item.pekerti}</td>
                            <td className="p-3 text-muted-foreground">{item.aa}</td>
                            <td className="p-3">
                              <span className="text-primary font-semibold">{item.total}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pendaftaran */}
                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4">
                    Pendaftaran
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Pendaftaran dilakukan melalui sistem informasi kepegawaian atau langsung menghubungi BPM USNI.
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
