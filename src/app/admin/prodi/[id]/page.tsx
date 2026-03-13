'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    headName: '',
    orderIndex: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchFaculties();
    if (!isNew) {
      fetchStudyProgram();
    } else {
      // Auto-fill orderIndex for new study program
      fetchNextOrderIndex();
    }
  }, [isNew, resolvedParams.id]);

  const fetchNextOrderIndex = async () => {
    try {
      const response = await fetch('/api/admin/prodi');
      if (response.ok) {
        const data = await response.json();
        const maxOrder = data.length > 0 ? Math.max(...data.map((p: { orderIndex: number }) => p.orderIndex || 0)) : 0;
        setFormData((prev) => ({ ...prev, orderIndex: maxOrder + 1 }));
      }
    } catch (error) {
      console.error('Error fetching order index:', error);
    } finally {
      setLoading(false);
    }
  };

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
          headName: data.headName || '',
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
              {/* Fakultas, Code and Name */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Fakultas */}
                <div className="space-y-2">
                  <Label htmlFor="facultyId">Fakultas</Label>
                  <Select
                    value={formData.facultyId || 'none'}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, facultyId: value === 'none' ? '' : value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tidak ada</SelectItem>
                      {faculties.map((faculty) => (
                        <SelectItem key={faculty.id} value={faculty.id}>
                          {faculty.code || faculty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Code */}
                <div className="space-y-2">
                  <Label htmlFor="code">Kode Prodi</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, code: e.target.value }))
                    }
                    placeholder="TI"
                  />
                </div>

                {/* Name */}
                <div className="space-y-2 sm:col-span-2">
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
              </div>

              {/* Hidden Order Index */}
              <input type="hidden" value={formData.orderIndex} />

              {/* Degree Level */}
              <div className="space-y-2 sm:w-1/2">
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

              {/* Head Name */}
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

              {/* Status Aktif */}
              <div className="flex items-center justify-between py-2">
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
