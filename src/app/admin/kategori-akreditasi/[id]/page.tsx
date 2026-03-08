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

interface PageProps {
  params: Promise<{ id: string }>;
}

// Common icon options for accreditation categories
const iconOptions = [
  { value: 'Award', label: 'Award (Penghargaan)' },
  { value: 'Shield', label: 'Shield (Perisai)' },
  { value: 'BadgeCheck', label: 'Badge Check (Centang)' },
  { value: 'Star', label: 'Star (Bintang)' },
  { value: 'GraduationCap', label: 'Graduation Cap (Toga)' },
  { value: 'FileCheck', label: 'File Check (Dokumen Valid)' },
  { value: 'CheckCircle', label: 'Check Circle (Lingkaran Centang)' },
  { value: 'Medal', label: 'Medal (Medali)' },
  { value: 'Certificate', label: 'Certificate (Sertifikat)' },
  { value: 'Building', label: 'Building (Gedung)' },
];

export default function EditKategoriAkreditasiPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'tambah';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    orderIndex: 0,
    isActive: true,
  });

  useEffect(() => {
    if (!isNew) {
      fetchCategory();
    } else {
      setLoading(false);
    }
  }, [isNew, resolvedParams.id]);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/admin/kategori-akreditasi/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          description: data.description || '',
          icon: data.icon || '',
          orderIndex: data.orderIndex || 0,
          isActive: data.isActive ?? true,
        });
      } else {
        toast.error('Kategori tidak ditemukan');
        router.push('/admin/kategori-akreditasi');
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      toast.error('Gagal memuat data kategori');
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || slug, // Only auto-fill if slug is empty
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Nama kategori wajib diisi');
      return;
    }

    setSaving(true);

    try {
      const url = isNew
        ? '/api/admin/kategori-akreditasi'
        : `/api/admin/kategori-akreditasi/${resolvedParams.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug || undefined,
          description: formData.description || null,
          icon: formData.icon || null,
          orderIndex: formData.orderIndex,
          isActive: formData.isActive,
        }),
      });

      if (response.ok) {
        toast.success(isNew ? 'Kategori berhasil dibuat' : 'Kategori berhasil diperbarui');
        router.push('/admin/kategori-akreditasi');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }
    } catch (error: unknown) {
      console.error('Save error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal menyimpan kategori';
      toast.error(errorMessage);
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
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/kategori-akreditasi">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {isNew ? 'Tambah Kategori Akreditasi' : 'Edit Kategori Akreditasi'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isNew ? 'Buat kategori akreditasi baru' : 'Perbarui informasi kategori'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Kategori</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Nama Kategori *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Masukkan nama kategori"
                  required
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">Slug URL</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="kategori-slug"
                />
                <p className="text-xs text-muted-foreground">
                  Slug akan dibuat otomatis dari nama kategori jika dikosongkan
                </p>
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
                  placeholder="Deskripsi singkat kategori (opsional)"
                  rows={3}
                />
              </div>

              {/* Icon */}
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, icon: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Pilih icon yang akan ditampilkan pada kategori
                </p>
              </div>

              {/* Order Index */}
              <div className="space-y-2">
                <Label htmlFor="orderIndex">Urutan</Label>
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
                <p className="text-xs text-muted-foreground">
                  Urutan tampil kategori (angka lebih kecil ditampilkan lebih dulu)
                </p>
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
                    Aktifkan untuk menampilkan kategori
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
              <Link href="/admin/kategori-akreditasi">Batal</Link>
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
