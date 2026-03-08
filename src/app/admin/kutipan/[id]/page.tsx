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

export default function EditKutipanPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'tambah';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    quoteText: '',
    authorName: '',
    authorTitle: '',
    imageUrl: '',
    isActive: true,
  });

  useEffect(() => {
    if (!isNew) {
      fetchQuote();
    } else {
      setLoading(false);
    }
  }, [isNew, resolvedParams.id]);

  const fetchQuote = async () => {
    try {
      const response = await fetch(`/api/admin/kutipan/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          quoteText: data.quoteText || '',
          authorName: data.authorName || '',
          authorTitle: data.authorTitle || '',
          imageUrl: data.imageUrl || '',
          isActive: data.isActive ?? true,
        });
      } else {
        toast.error('Kutipan tidak ditemukan');
        router.push('/admin/kutipan');
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      toast.error('Gagal memuat data kutipan');
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

    if (!formData.quoteText.trim()) {
      toast.error('Teks kutipan wajib diisi');
      return;
    }

    setSaving(true);

    try {
      const url = isNew
        ? '/api/admin/kutipan'
        : `/api/admin/kutipan/${resolvedParams.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(isNew ? 'Kutipan berhasil dibuat' : 'Kutipan berhasil diperbarui');
        router.push('/admin/kutipan');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Gagal menyimpan kutipan');
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
            <Link href="/admin/kutipan">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {isNew ? 'Tambah Kutipan' : 'Edit Kutipan'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isNew ? 'Buat kutipan baru' : 'Perbarui informasi kutipan'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Kutipan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quote Text */}
              <div className="space-y-2">
                <Label htmlFor="quoteText">Teks Kutipan *</Label>
                <Textarea
                  id="quoteText"
                  value={formData.quoteText}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, quoteText: e.target.value }))
                  }
                  placeholder="Masukkan teks kutipan..."
                  rows={4}
                  required
                />
              </div>

              {/* Author Name */}
              <div className="space-y-2">
                <Label htmlFor="authorName">Nama Penulis</Label>
                <Input
                  id="authorName"
                  value={formData.authorName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, authorName: e.target.value }))
                  }
                  placeholder="Masukkan nama penulis (opsional)"
                />
              </div>

              {/* Author Title */}
              <div className="space-y-2">
                <Label htmlFor="authorTitle">Jabatan Penulis</Label>
                <Input
                  id="authorTitle"
                  value={formData.authorTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, authorTitle: e.target.value }))
                  }
                  placeholder="Masukkan jabatan penulis (opsional)"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Gambar Penulis (Opsional)</Label>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageSelect}
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
                  Foto penulis kutipan (opsional). Klik tombol upload atau masukkan URL gambar
                </p>
                {formData.imageUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-border inline-block">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-32 h-32 object-cover"
                    />
                  </div>
                )}
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
                    Aktifkan untuk menampilkan kutipan di halaman utama
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
              <Link href="/admin/kutipan">Batal</Link>
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
