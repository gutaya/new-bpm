'use client';

import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Loader2, ImagePlus, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditStrukturOrganisasiPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'tambah';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    photoUrl: '',
    orderIndex: 0,
  });

  useEffect(() => {
    if (!isNew) {
      fetchMember();
    }
  }, [isNew, resolvedParams.id]);

  const fetchMember = async () => {
    try {
      const response = await fetch(`/api/admin/struktur-organisasi/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || '',
          position: data.position || '',
          photoUrl: data.photoUrl || '',
          orderIndex: data.orderIndex ?? 0,
        });
      } else {
        toast.error('Anggota tidak ditemukan');
        router.push('/admin/struktur-organisasi');
      }
    } catch (error) {
      console.error('Error fetching member:', error);
      toast.error('Gagal memuat data anggota');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await response.json();

      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, photoUrl: data.url }));
        toast.success('Foto berhasil diunggah');
      } else {
        toast.error(data.error || 'Gagal mengunggah foto');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Gagal mengunggah foto');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Nama wajib diisi');
      return;
    }

    if (!formData.position.trim()) {
      toast.error('Jabatan wajib diisi');
      return;
    }

    setSaving(true);

    try {
      const url = isNew
        ? '/api/admin/struktur-organisasi'
        : `/api/admin/struktur-organisasi/${resolvedParams.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(isNew ? 'Anggota berhasil ditambahkan' : 'Anggota berhasil diperbarui');
        router.push('/admin/struktur-organisasi');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Gagal menyimpan data anggota');
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
            <Link href="/admin/struktur-organisasi">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {isNew ? 'Tambah Anggota' : 'Edit Anggota'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isNew ? 'Tambahkan anggota baru ke struktur organisasi' : 'Perbarui informasi anggota'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Anggota</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              {/* Position */}
              <div className="space-y-2">
                <Label htmlFor="position">Jabatan *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, position: e.target.value }))
                  }
                  placeholder="Contoh: Kepala Lembaga, Sekretaris, dll."
                  required
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
                  Angka lebih kecil akan tampil lebih dulu
                </p>
              </div>

              {/* Photo URL */}
              <div className="space-y-2">
                <Label htmlFor="photoUrl">Foto</Label>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <div className="flex gap-2">
                  <Input
                    id="photoUrl"
                    value={formData.photoUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, photoUrl: e.target.value }))
                    }
                    placeholder="https://example.com/photo.jpg"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={uploadingImage}
                    title="Upload foto"
                  >
                    {uploadingImage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImagePlus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Klik tombol upload atau masukkan URL foto langsung
                </p>
                
                {/* Image Preview */}
                {formData.photoUrl ? (
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                    <div className="w-32 h-32 rounded-lg overflow-hidden border border-border bg-muted">
                      <img
                        src={formData.photoUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '';
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                    <div className="w-32 h-32 rounded-lg border border-dashed border-border bg-muted flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/struktur-organisasi">Batal</Link>
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
