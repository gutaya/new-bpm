'use client';

import { useState, useEffect, use } from 'react';
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
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

interface Faculty {
  id: string;
  name: string;
  code: string | null;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

const degreeLevelOptions = [
  { value: 'd3', label: 'D3 (Diploma Tiga)' },
  { value: 's1', label: 'S1 (Sarjana)' },
  { value: 's2', label: 'S2 (Magister)' },
  { value: 's3', label: 'S3 (Doktor)' },
];

const accreditationStatusOptions = [
  { value: 'baik-sekali', label: 'Baik Sekali (A)' },
  { value: 'baik', label: 'Baik (B)' },
  { value: 'cukup', label: 'Cukup (C)' },
  { value: 'unggul', label: 'Unggul' },
  { value: 'proses', label: 'Dalam Proses' },
  { value: 'belum', label: 'Belum Terakreditasi' },
];

const accreditationBodyOptions = [
  { value: 'ban-pt', label: 'BAN-PT' },
  { value: 'lam-teknik', label: 'LAM Teknik' },
  { value: 'lam-infokom', label: 'LAM Infokom' },
  { value: 'lamemba', label: 'LAMEMBA' },
  { value: 'lamspak', label: 'LAMSPAK' },
  { value: 'lainnya', label: 'Lainnya' },
];

export default function EditProdiPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'tambah';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    facultyId: '',
    degreeLevel: 's1',
    description: '',
    headName: '',
    accreditationStatus: '',
    accreditationBody: '',
    orderIndex: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchFaculties();
    if (!isNew) {
      fetchStudyProgram();
    }
  }, [isNew, resolvedParams.id]);

  const fetchFaculties = async () => {
    try {
      const response = await fetch('/api/admin/fakultas');
      if (response.ok) {
        const data = await response.json();
        setFaculties(data);
      }
    } catch (error) {
      console.error('Error fetching faculties:', error);
    }
  };

  const fetchStudyProgram = async () => {
    try {
      const response = await fetch(`/api/admin/prodi/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || '',
          code: data.code || '',
          facultyId: data.facultyId || '',
          degreeLevel: data.degreeLevel || 's1',
          description: data.description || '',
          headName: data.headName || '',
          accreditationStatus: data.accreditationStatus || '',
          accreditationBody: data.accreditationBody || '',
          orderIndex: data.orderIndex ?? 0,
          isActive: data.isActive ?? true,
        });
      } else {
        toast.error('Program studi tidak ditemukan');
        router.push('/admin/prodi');
      }
    } catch (error) {
      console.error('Error fetching study program:', error);
      toast.error('Gagal memuat data program studi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Nama program studi wajib diisi');
      return;
    }

    setSaving(true);

    try {
      const url = isNew
        ? '/api/admin/prodi'
        : `/api/admin/prodi/${resolvedParams.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(isNew ? 'Program studi berhasil dibuat' : 'Program studi berhasil diperbarui');
        router.push('/admin/prodi');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Gagal menyimpan program studi');
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
            <Link href="/admin/prodi">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {isNew ? 'Tambah Program Studi' : 'Edit Program Studi'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isNew ? 'Buat program studi baru' : 'Perbarui informasi program studi'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Nama Program Studi *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Masukkan nama program studi"
                  required
                />
              </div>

              {/* Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Kode Program Studi</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, code: e.target.value }))
                    }
                    placeholder="Contoh: TI, MI, SI"
                  />
                </div>

                {/* Order Index */}
                <div className="space-y-2">
                  <Label htmlFor="orderIndex">Urutan Tampil</Label>
                  <Input
                    id="orderIndex"
                    type="number"
                    value={formData.orderIndex}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        orderIndex: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Faculty */}
              <div className="space-y-2">
                <Label htmlFor="facultyId">Fakultas</Label>
                <Select
                  value={formData.facultyId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, facultyId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih fakultas" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map((faculty) => (
                      <SelectItem key={faculty.id} value={faculty.id}>
                        {faculty.name}
                        {faculty.code && ` (${faculty.code})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Degree Level */}
              <div className="space-y-2">
                <Label htmlFor="degreeLevel">Jenjang Pendidikan</Label>
                <Select
                  value={formData.degreeLevel}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, degreeLevel: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenjang" />
                  </SelectTrigger>
                  <SelectContent>
                    {degreeLevelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Deskripsi singkat program studi (opsional)"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Leadership */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kepemimpinan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="headName">Nama Ketua Program Studi</Label>
                <Input
                  id="headName"
                  value={formData.headName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, headName: e.target.value }))
                  }
                  placeholder="Nama lengkap ketua program studi"
                />
              </div>
            </CardContent>
          </Card>

          {/* Accreditation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Akreditasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Accreditation Status */}
              <div className="space-y-2">
                <Label htmlFor="accreditationStatus">Status Akreditasi</Label>
                <Select
                  value={formData.accreditationStatus}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, accreditationStatus: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status akreditasi" />
                  </SelectTrigger>
                  <SelectContent>
                    {accreditationStatusOptions.map((option) => (
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
                    <SelectValue placeholder="Pilih lembaga akreditasi" />
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
            </CardContent>
          </Card>

          {/* Status Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pengaturan Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive">Status Aktif</Label>
                  <p className="text-sm text-muted-foreground">
                    Aktifkan untuk menampilkan program studi di website
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isActive: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/prodi">Batal</Link>
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
