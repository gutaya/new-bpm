'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    deanName: '',
    orderIndex: 0,
    isActive: true,
  });

  useEffect(() => {
    if (!isNew) {
      fetchFaculty();
    } else {
      // Auto-fill orderIndex for new faculty
      fetchNextOrderIndex();
    }
  }, [isNew, resolvedParams.id]);

  const fetchNextOrderIndex = async () => {
    try {
      const response = await fetch('/api/admin/fakultas');
      if (response.ok) {
        const data = await response.json();
        const maxOrder = data.length > 0 ? Math.max(...data.map((f: { orderIndex: number }) => f.orderIndex || 0)) : 0;
        setFormData((prev) => ({ ...prev, orderIndex: maxOrder + 1 }));
      }
    } catch (error) {
      console.error('Error fetching order index:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculty = async () => {
    try {
      const response = await fetch(`/api/admin/fakultas/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || '',
          code: data.code || '',
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
        let errorMessage = 'Gagal menyimpan fakultas';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // Response body is empty or not JSON
          errorMessage = `Gagal menyimpan fakultas (Status: ${response.status})`;
        }
        toast.error(errorMessage);
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
              {/* Code and Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Code */}
                <div className="space-y-2">
                  <Label htmlFor="code">Kode Fakultas</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, code: e.target.value }))
                    }
                    placeholder="Contoh: FT"
                  />
                </div>

                {/* Name */}
                <div className="space-y-2 sm:col-span-2">
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

              {/* Status Aktif */}
              <div className="flex items-center justify-between py-2">
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

              {/* Hidden Order Index */}
              <input type="hidden" value={formData.orderIndex} />
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
