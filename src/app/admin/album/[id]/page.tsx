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
import { ArrowLeft, Save, Loader2, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditAlbumPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'tambah';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImageUrl: '',
    orderIndex: 0,
    isActive: true,
  });

  useEffect(() => {
    if (!isNew) {
      fetchAlbum();
    }
  }, [isNew, resolvedParams.id]);

  const fetchAlbum = async () => {
    try {
      const response = await fetch(`/api/admin/album/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title || '',
          description: data.description || '',
          coverImageUrl: data.coverImageUrl || '',
          orderIndex: data.orderIndex || 0,
          isActive: data.isActive ?? true,
        });
      } else {
        toast.error('Album tidak ditemukan');
        router.push('/admin/album');
      }
    } catch (error) {
      console.error('Error fetching album:', error);
      toast.error('Gagal memuat data album');
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
        setFormData((prev) => ({ ...prev, coverImageUrl: data.url }));
        toast.success('Gambar berhasil diunggah');
      } else {
        toast.error(data.error || 'Gagal mengunggah gambar');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Gagal mengunggah gambar');
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

    if (!formData.title.trim()) {
      toast.error('Judul album wajib diisi');
      return;
    }

    setSaving(true);

    try {
      const url = isNew
        ? '/api/admin/album'
        : `/api/admin/album/${resolvedParams.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(isNew ? 'Album berhasil dibuat' : 'Album berhasil diperbarui');
        router.push('/admin/album');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Gagal menyimpan album');
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
            <Link href="/admin/album">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {isNew ? 'Tambah Album' : 'Edit Album'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isNew ? 'Buat album baru' : 'Perbarui informasi album'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Album</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Judul Album *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Masukkan judul album"
                  required
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
                  placeholder="Deskripsi singkat album (opsional)"
                  rows={3}
                />
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <Label htmlFor="coverImageUrl">Cover Album</Label>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <div className="flex gap-2">
                  <Input
                    id="coverImageUrl"
                    value={formData.coverImageUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, coverImageUrl: e.target.value }))
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
                {formData.coverImageUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-border">
                    <img
                      src={formData.coverImageUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Order Index */}
              <div className="space-y-2">
                <Label htmlFor="orderIndex">Urutan</Label>
                <Input
                  id="orderIndex"
                  type="number"
                  value={formData.orderIndex}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, orderIndex: parseInt(e.target.value) || 0 }))
                  }
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">
                  Urutan tampil album (lebih kecil = lebih awal)
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
                    Aktifkan untuk menampilkan album
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
              <Link href="/admin/album">Batal</Link>
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
