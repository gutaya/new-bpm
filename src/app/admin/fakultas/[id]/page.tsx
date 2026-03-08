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
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditFakultasPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'tambah';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    deanName: '',
    orderIndex: 0,
    isActive: true,
  });

  useEffect(() => {
    if (!isNew) {
      fetchFaculty();
    }
  }, [isNew, resolvedParams.id]);

  const fetchFaculty = async () => {
    try {
      const response = await fetch(`/api/admin/fakultas/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || '',
          code: data.code || '',
          description: data.description || '',
          deanName: data.deanName || '',
          orderIndex: data.orderIndex ?? 0,
          isActive: data.isActive ?? true,
        });
      } else {
        toast.error('Fakultas tidak ditemukan');
        router.push('/admin/fakultas');
      }
    } catch (error) {
      console.error('Error fetching faculty:', error);
      toast.error('Gagal memuat data fakultas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Nama fakultas wajib diisi');
      return;
    }

    setSaving(true);

    try {
      const url = isNew
        ? '/api/admin/fakultas'
        : `/api/admin/fakultas/${resolvedParams.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(isNew ? 'Fakultas berhasil dibuat' : 'Fakultas berhasil diperbarui');
        router.push('/admin/fakultas');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal menyimpan fakultas';
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
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/fakultas">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {isNew ? 'Tambah Fakultas' : 'Edit Fakultas'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isNew ? 'Buat fakultas baru' : 'Perbarui informasi fakultas'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Fakultas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Nama Fakultas *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Masukkan nama fakultas"
                  required
                />
              </div>

              {/* Code */}
              <div className="space-y-2">
                <Label htmlFor="code">Kode Fakultas</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, code: e.target.value }))
                  }
                  placeholder="Contoh: FT, FKIP, FH"
                />
                <p className="text-xs text-muted-foreground">
                  Kode singkat untuk identifikasi fakultas (opsional)
                </p>
              </div>

              {/* Dean Name */}
              <div className="space-y-2">
                <Label htmlFor="deanName">Nama Dekan</Label>
                <Input
                  id="deanName"
                  value={formData.deanName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, deanName: e.target.value }))
                  }
                  placeholder="Masukkan nama dekan"
                />
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
                  placeholder="Deskripsi singkat tentang fakultas (opsional)"
                  rows={3}
                />
              </div>

              {/* Order Index */}
              <div className="space-y-2">
                <Label htmlFor="orderIndex">Urutan Tampil</Label>
                <Input
                  id="orderIndex"
                  type="number"
                  min="0"
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
                  Nomor urutan untuk pengurutan tampilan (angka lebih kecil ditampilkan lebih dulu)
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
                    Aktifkan untuk menampilkan fakultas di website
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
              <Link href="/admin/fakultas">Batal</Link>
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
