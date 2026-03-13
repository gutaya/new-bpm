import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ChevronRight, 
  Briefcase, 
  Clock, 
  ArrowLeft,
  CheckCircle,
  Target,
  FileText,
  FileCheck,
  GraduationCap,
  Award
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Jabatan Fungsional - BPM USNI',
  description: 'Informasi dan layanan pengurusan jabatan fungsional dosen di USNI',
};

const jenisJabatan = [
  {
    jabatan: 'Asisten Ahli',
    golongan: 'III/a - III/c',
    persyaratan: 'S2, sertifikasi PEKERTI/AA, karya ilmiah',
  },
  {
    jabatan: 'Lektor',
    golongan: 'III/d - IV/a',
    persyaratan: 'S3 atau S2 dengan pengalaman, karya ilmiah terakreditasi',
  },
  {
    jabatan: 'Lektor Kepala',
    golongan: 'IV/b - IV/c',
    persyaratan: 'S3, karya ilmiah internasional, pengalaman mengajar',
  },
  {
    jabatan: 'Profesor',
    golongan: 'IV/d',
    persyaratan: 'S3, karya ilmiah internasional bereputasi, pengalaman prestisius',
  },
];

const prosedurPengajuan = [
  'Mengumpulkan dokumen persyaratan lengkap',
  'Mengisi formulir permohonan jabatan fungsional',
  'Menyusun dan mengumpulkan karya ilmiah',
  'Melakukan penilaian angka kredit',
  'Mengikuti uji kompetensi (jika diperlukan)',
  'Penetapan SK jabatan fungsional',
];

const dokumenPersyaratan = [
  'Fotokopi ijazah dan transkrip nilai terlegalisir',
  'Fotokopi SK pengangkatan dosen tetap',
  'Sertifikat PEKERTI/AA',
  'Daftar karya ilmiah yang telah diterbitkan',
  'Surat tugas mengajar dari prodi',
  'Sertifikat seminar/workshop (pendukung)',
  'Pas foto terbaru',
];

export default function JabatanFungsionalPage() {
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
              <span className="text-primary-foreground">Jabatan Fungsional</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              Jabatan Fungsional
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-3xl">
              Informasi dan layanan pengurusan jabatan fungsional dosen di USNI
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
                    <Briefcase className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-1">
                      Jabatan Fungsional Dosen
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        Diperbarui: Februari 2025
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 lg:p-10">
                {/* Tentang Jabatan Fungsional */}
                <div className="mb-8">
                  <h3 className="text-xl md:text-2xl font-display font-semibold text-foreground mb-4 pb-2 border-b border-border">
                    Tentang Jabatan Fungsional
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Jabatan fungsional dosen adalah jabatan yang melekat pada dosen berdasarkan keahlian dan keterampilannya dalam bidang pengajaran, penelitian, dan pengabdian kepada masyarakat. BPM USNI mendukung proses pengurusan jabatan fungsional dosen dengan memberikan informasi dan pendampingan yang diperlukan.
                  </p>
                </div>

                {/* Jenis Jabatan Fungsional */}
                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Jenis Jabatan Fungsional
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-border rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-muted">
                          <th className="p-3 text-left text-foreground font-semibold">Jabatan</th>
                          <th className="p-3 text-left text-foreground font-semibold">Golongan</th>
                          <th className="p-3 text-left text-foreground font-semibold">Persyaratan Utama</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jenisJabatan.map((item, index) => (
                          <tr key={index} className="border-t border-border">
                            <td className="p-3 font-medium text-foreground">{item.jabatan}</td>
                            <td className="p-3 text-muted-foreground">{item.golongan}</td>
                            <td className="p-3 text-muted-foreground">{item.persyaratan}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Prosedur Pengajuan */}
                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Prosedur Pengajuan
                  </h3>
                  <ul className="space-y-3">
                    {prosedurPengajuan.map((prosedur, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-semibold text-primary">{index + 1}</span>
                        </div>
                        <span className="text-muted-foreground">{prosedur}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dokumen Persyaratan */}
                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Dokumen Persyaratan
                  </h3>
                  <ul className="space-y-3">
                    {dokumenPersyaratan.map((doc, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <FileCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Informasi Tambahan */}
                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Informasi Penting
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
                        <span>Proses pengajuan jabatan fungsional memerlukan waktu 3-6 bulan</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
                        <span>Konsultasikan dengan BPM sebelum mengajukan usulan</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
                        <span>Siapkan portofolio karya ilmiah dengan baik</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
                        <span>Ikuti perkembangan kebijakan jabatan fungsional terbaru</span>
                      </li>
                    </ul>
                  </div>
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
