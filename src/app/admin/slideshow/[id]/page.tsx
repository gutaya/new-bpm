'use client';

import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Loader2, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditSlideshowPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'tambah';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    imageUrl: '',
    orderIndex: 0,
    isActive: true,
  });

  useEffect(() => {
    if (!isNew) {
      fetchSlideshow();
    } else {
      setLoading(false);
    }
  }, [isNew, resolvedParams.id]);

  const fetchSlideshow = async () => {
    try {
      const response = await fetch(`/api/admin/slideshow/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          imageUrl: data.imageUrl || '',
          orderIndex: data.orderIndex || 0,
          isActive: data.isActive ?? true,
        });
      } else {
        toast.error('Slideshow tidak ditemukan');
        router.push('/admin/slideshow');
      }
    } catch (error) {
      console.error('Error fetching slideshow:', error);
      toast.error('Gagal memuat data slideshow');
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
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
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

    if (!formData.imageUrl.trim()) {
      toast.error('Gambar slide wajib diisi');
      return;
    }

    setSaving(true);

    try {
      const dataToSave = {
        ...formData,
        title: `Slide ${formData.orderIndex + 1}`,
        subtitle: '',
        linkUrl: '',
      };

      const url = isNew
        ? '/api/admin/slideshow'
        : `/api/admin/slideshow/${resolvedParams.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        toast.success(isNew ? 'Slideshow berhasil dibuat' : 'Slideshow berhasil diperbarui');
        router.push('/admin/slideshow');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Gagal menyimpan slideshow');
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
            <Link href="/admin/slideshow">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {isNew ? 'Tambah Slideshow' : 'Edit Slideshow'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isNew ? 'Upload gambar slide baru' : 'Perbarui gambar slide'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gambar Slide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Gambar Slide *</Label>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
                    }
                    placeholder="https://example.com/image.jpg"
                    className="flex-1"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-full sm:w-auto"
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Mengunggah...
                      </>
                    ) : (
                      <>
                        <ImagePlus className="h-4 w-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ukuran ideal: 1920x600 pixel. Klik tombol upload atau masukkan URL gambar
                </p>
                {formData.imageUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-border">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Order Index */}
              <div className="space-y-2">
                <Label htmlFor="orderIndex">Urutan Tampil</Label>
                <Input
                  id="orderIndex"
                  type="number"
                  value={formData.orderIndex}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, orderIndex: parseInt(e.target.value) || 0 }))
                  }
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-muted-foreground">
                  Urutan tampil slide (lebih kecil = lebih awal)
                </p>
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive">Status Aktif</Label>
                  <p className="text-sm text-muted-foreground">
                    Aktifkan untuk menampilkan slide di slideshow
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
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/admin/slideshow">Batal</Link>
            </Button>
            <Button type="submit" disabled={saving} className="bg-[#1B99F4] hover:bg-[#1B99F4]/90 w-full sm:w-auto">
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
