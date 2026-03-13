'use client';

import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft, Save, Loader2, ImagePlus, CalendarIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface Faculty {
  id: string;
  name: string;
  code: string | null;
}

interface StudyProgram {
  id: string;
  name: string;
  code: string | null;
  degreeLevel: string;
  facultyId: string | null;
  faculty?: Faculty | null;
}

const ACCREDITATION_BODY_NASIONAL = [
  { value: 'ban-pt', label: 'BAN-PT' },
  { value: 'lam-teknik', label: 'LAM Teknik' },
  { value: 'lam-infokom', label: 'LAM Infokom' },
  { value: 'lamemba', label: 'LAMEMBA' },
  { value: 'lamspak', label: 'LAMSPAK' },
];

const ACCREDITATION_BODY_INTERNASIONAL = [
  { value: 'hkcaavq', label: 'HKCAAVQ' },
  { value: 'heeact', label: 'HEEACT' },
  { value: 'teqsa', label: 'TEQSA' },
  { value: 'aacsb', label: 'AACSB' },
  { value: 'amba', label: 'AMBA' },
  { value: 'equis', label: 'EQUIS' },
  { value: 'iacbe', label: 'IACBE' },
  { value: 'aapbs', label: 'AAPBS' },
  { value: 'acbsp', label: 'ACBSP' },
  { value: 'rsc', label: 'RSC' },
  { value: 'rci', label: 'RCI' },
  { value: 'caep', label: 'CAEP' },
];

const CATEGORY_OPTIONS = [
  { value: 'nasional', label: 'Nasional' },
  { value: 'internasional', label: 'Internasional' },
];

const ACCREDITATION_STATUS_OPTIONS_NASIONAL = [
  { value: 'Unggul', label: 'Unggul' },
  { value: 'Baik Sekali', label: 'Baik Sekali' },
  { value: 'Baik', label: 'Baik' },
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
];

const ACCREDITATION_STATUS_OPTIONS_INTERNASIONAL = [
  { value: 'Terakreditasi', label: 'Terakreditasi' },
];

const degreeLevelLabels: Record<string, string> = {
  d3: 'D3',
  s1: 'S1',
  s2: 'S2',
  s3: 'S3',
};

export default function EditAkreditasiPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'tambah';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [studyPrograms, setStudyPrograms] = useState<StudyProgram[]>([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const certificateInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'nasional',
    studyProgramId: '',
    accreditationBody: 'ban-pt',
    accreditationStatus: '',
    certificateUrl: '',
    imageUrl: '',
    validUntil: null as Date | null,
    published: true,
  });

  useEffect(() => {
    fetchFaculties();
    fetchStudyPrograms();
    if (!isNew) {
      fetchAccreditation();
    } else {
      setLoading(false);
    }
  }, [isNew, resolvedParams.id]);

  const fetchFaculties = async () => {
    try {
      const response = await fetch('/api/admin/fakultas');
      if (response.ok) {
        const data = await response.json();
        setFaculties(data.filter((f: Faculty & { isActive: boolean }) => f.isActive));
      }
    } catch (error) {
      console.error('Error fetching faculties:', error);
    }
  };

  const fetchStudyPrograms = async () => {
    try {
      const response = await fetch('/api/admin/prodi');
      if (response.ok) {
        const data = await response.json();
        setStudyPrograms(data.filter((p: StudyProgram & { isActive: boolean }) => p.isActive));
      }
    } catch (error) {
      console.error('Error fetching study programs:', error);
    }
  };

  const fetchAccreditation = async () => {
    try {
      const response = await fetch(`/api/admin/akreditasi/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'nasional',
          studyProgramId: data.studyProgramId || '',
          accreditationBody: data.accreditationBody || 'ban-pt',
          accreditationStatus: data.accreditationStatus || '',
          certificateUrl: data.certificateUrl || '',
          imageUrl: data.imageUrl || '',
          validUntil: data.validUntil ? new Date(data.validUntil) : null,
          published: data.published ?? true,
        });
        // Set selected faculty based on study program
        if (data.studyProgram?.facultyId) {
          setSelectedFacultyId(data.studyProgram.facultyId);
        }
      } else {
        toast.error('Akreditasi tidak ditemukan');
        router.push('/admin/akreditasi');
      }
    } catch (error) {
      console.error('Error fetching accreditation:', error);
      toast.error('Gagal memuat data akreditasi');
    } finally {
      setLoading(false);
    }
  };

  // Filter study programs by selected faculty
  const filteredStudyPrograms = selectedFacultyId
    ? studyPrograms.filter((sp) => sp.facultyId === selectedFacultyId)
    : studyPrograms;

  // Get accreditation body options based on category
  const accreditationBodyOptions = formData.category === 'internasional'
    ? ACCREDITATION_BODY_INTERNASIONAL
    : ACCREDITATION_BODY_NASIONAL;

  // Get accreditation status options based on category
  const accreditationStatusOptions = formData.category === 'internasional'
    ? ACCREDITATION_STATUS_OPTIONS_INTERNASIONAL
    : ACCREDITATION_STATUS_OPTIONS_NASIONAL;

  // Handle faculty change - reset study program selection
  const handleFacultyChange = (value: string) => {
    setSelectedFacultyId(value === 'none' ? '' : value);
    setFormData((prev) => ({ ...prev, studyProgramId: '' }));
  };

  // Handle study program selection - auto-fill title
  const handleStudyProgramChange = (value: string) => {
    const selectedProgram = studyPrograms.find((sp) => sp.id === value);
    setFormData((prev) => ({
      ...prev,
      studyProgramId: value === 'none' ? '' : value,
      // Auto-fill title if empty
      title: prev.title || selectedProgram?.name || '',
    }));
  };

  const handleImageUpload = async (file: File, type: 'image' | 'certificate') => {
    if (type === 'image') {
      setUploadingImage(true);
    }
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await response.json();

      if (data.success && data.url) {
        if (type === 'image') {
          setFormData((prev) => ({ ...prev, imageUrl: data.url }));
          toast.success('Gambar berhasil diunggah');
        } else {
          setFormData((prev) => ({ ...prev, certificateUrl: data.url }));
          toast.success('Sertifikat berhasil diunggah');
        }
      } else {
        toast.error(data.error || 'Gagal mengunggah file');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Gagal mengunggah file');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'certificate') => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, type);
    }
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Judul akreditasi wajib diisi');
      return;
    }

    setSaving(true);

    try {
      const url = isNew
        ? '/api/admin/akreditasi'
        : `/api/admin/akreditasi/${resolvedParams.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          studyProgramId: formData.studyProgramId || null,
          accreditationStatus: formData.accreditationStatus || null,
          validUntil: formData.validUntil?.toISOString() || null,
        }),
      });

      if (response.ok) {
        toast.success(isNew ? 'Akreditasi berhasil dibuat' : 'Akreditasi berhasil diperbarui');
        router.push('/admin/akreditasi');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Gagal menyimpan akreditasi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Memuat data...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/akreditasi">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {isNew ? 'Tambah Akreditasi' : 'Edit Akreditasi'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isNew ? 'Buat data akreditasi baru' : 'Perbarui informasi akreditasi'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Program Studi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Faculty and Study Program */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Faculty */}
                <div className="space-y-2">
                  <Label htmlFor="facultyId">Fakultas</Label>
                  <Select
                    value={selectedFacultyId || 'none'}
                    onValueChange={handleFacultyChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih fakultas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Semua Fakultas</SelectItem>
                      {faculties.map((faculty) => (
                        <SelectItem key={faculty.id} value={faculty.id}>
                          {faculty.code || faculty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Study Program */}
                <div className="space-y-2">
                  <Label htmlFor="studyProgramId">Program Studi</Label>
                  <Select
                    value={formData.studyProgramId || 'none'}
                    onValueChange={handleStudyProgramChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih program studi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tidak ada / Institusi</SelectItem>
                      {filteredStudyPrograms.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name}
                          <span className="text-muted-foreground ml-1">
                            - {degreeLevelLabels[program.degreeLevel] || 'S1'}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Title (auto-filled from study program) */}
              <div className="space-y-2">
                <Label htmlFor="title">Judul Akreditasi *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Masukkan judul akreditasi"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Otomatis terisi berdasarkan program studi yang dipilih
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detail Akreditasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Deskripsi singkat akreditasi (opsional)"
                  rows={3}
                />
              </div>

              {/* Category Type, Accreditation Body, Status, and Valid Until - 4 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Type */}
                <div className="space-y-2">
                  <Label htmlFor="category">Jenis Kategori</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => {
                      // Reset accreditation body and status when category changes
                      const defaultBody = value === 'internasional' ? 'hkcaavq' : 'ban-pt';
                      const defaultStatus = value === 'internasional' ? 'Terakreditasi' : '';
                      setFormData((prev) => ({ ...prev, category: value, accreditationBody: defaultBody, accreditationStatus: defaultStatus }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Accreditation Body */}
                <div className="space-y-2">
                  <Label htmlFor="accreditationBody">Lembaga Akreditasi</Label>
                  <Select
                    value={formData.accreditationBody}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, accreditationBody: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih lembaga" />
                    </SelectTrigger>
                    <SelectContent>
                      {accreditationBodyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Accreditation Status */}
                <div className="space-y-2">
                  <Label htmlFor="accreditationStatus">Status Akreditasi</Label>
                  <Select
                    value={formData.accreditationStatus || 'none'}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, accreditationStatus: value === 'none' ? '' : value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.category === 'nasional' && (
                        <SelectItem value="none">Tidak ada</SelectItem>
                      )}
                      {accreditationStatusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Valid Until - Date Picker */}
                <div className="space-y-2">
                  <Label>Berlaku Sampai</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !formData.validUntil && 'text-muted-foreground'
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.validUntil
                          ? format(formData.validUntil, 'PPP', { locale: id })
                          : 'Pilih tanggal'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.validUntil || undefined}
                        onSelect={(date) =>
                          setFormData((prev) => ({ ...prev, validUntil: date || null }))
                        }
                        captionLayout="dropdown"
                        fromYear={2020}
                        toYear={2050}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Clear date button - shown below the grid when date is selected */}
              {formData.validUntil && (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, validUntil: null }))
                    }
                    className="text-muted-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Hapus tanggal
                  </Button>
                </div>
              )}

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Gambar Akreditasi</Label>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={(e) => handleImageSelect(e, 'image')}
                  className="hidden"
                />
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
                    }
                    placeholder="https://example.com/image.jpg"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={uploadingImage}
                    title="Upload gambar"
                  >
                    {uploadingImage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImagePlus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Klik tombol upload atau masukkan URL gambar langsung
                </p>
                {formData.imageUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-border">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Certificate URL */}
              <div className="space-y-2">
                <Label htmlFor="certificateUrl">URL Sertifikat</Label>
                <input
                  ref={certificateInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                  onChange={(e) => handleImageSelect(e, 'certificate')}
                  className="hidden"
                />
                <div className="flex gap-2">
                  <Input
                    id="certificateUrl"
                    value={formData.certificateUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, certificateUrl: e.target.value }))
                    }
                    placeholder="https://example.com/certificate.pdf"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => certificateInputRef.current?.click()}
                    title="Upload sertifikat"
                  >
                    <ImagePlus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  URL sertifikat akreditasi (PDF atau gambar)
                </p>
              </div>

              {/* Status Publikasi */}
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Status Publikasi</Label>
                  <p className="text-sm text-muted-foreground">
                    Aktifkan untuk mempublikasikan akreditasi
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, published: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/akreditasi">Batal</Link>
            </Button>
            <Button type="submit" disabled={saving} className="bg-[#1B99F4] hover:bg-[#1B99F4]/90">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
