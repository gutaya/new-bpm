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
import { WysiwygEditor } from '@/components/admin/WysiwygEditor';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditPengumumanPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'tambah';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal',
    expireAt: '',
    published: false,
  });

  useEffect(() => {
    if (!isNew) {
      fetchAnnouncement();
    }
  }, [isNew, resolvedParams.id]);

  const fetchAnnouncement = async () => {
    try {
      const response = await fetch(`/api/admin/pengumuman/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title || '',
          content: data.content || '',
          priority: data.priority || 'normal',
          expireAt: data.expireAt ? new Date(data.expireAt).toISOString().split('T')[0] : '',
          published: data.published || false,
        });
      } else {
        toast.error('Pengumuman tidak ditemukan');
        router.push('/admin/pengumuman');
      }
    } catch (error) {
      console.error('Error fetching announcement:', error);
      toast.error('Gagal memuat data pengumuman');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Judul pengumuman wajib diisi');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Konten pengumuman wajib diisi');
      return;
    }

    setSaving(true);

    try {
      const url = isNew
        ? '/api/admin/pengumuman'
        : `/api/admin/pengumuman/${resolvedParams.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          expireAt: formData.expireAt || null,
        }),
      });

      if (response.ok) {
        toast.success(isNew ? 'Pengumuman berhasil dibuat' : 'Pengumuman berhasil diperbarui');
        router.push('/admin/pengumuman');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Gagal menyimpan pengumuman');
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
            <Link href="/admin/pengumuman">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {isNew ? 'Tambah Pengumuman' : 'Edit Pengumuman'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isNew ? 'Buat pengumuman baru' : 'Perbarui informasi pengumuman'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Pengumuman</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Judul Pengumuman *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Masukkan judul pengumuman"
                  required
                />
              </div>

              {/* Content - WYSIWYG Editor */}
              <div className="space-y-2">
                <Label htmlFor="content">Konten *</Label>
                <WysiwygEditor
                  content={formData.content}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, content }))
                  }
                  placeholder="Tulis konten pengumuman di sini..."
                />
                <p className="text-xs text-muted-foreground">
                  Gunakan toolbar untuk memformat teks: tebal, miring, heading, daftar, link, dll.
                </p>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority">Prioritas</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih prioritas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">Tinggi</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Prioritas menentukan seberapa penting pengumuman ini ditampilkan
                </p>
              </div>

              {/* Expire At */}
              <div className="space-y-2">
                <Label htmlFor="expireAt">Tanggal Kadaluarsa</Label>
                <Input
                  id="expireAt"
                  type="date"
                  value={formData.expireAt}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, expireAt: e.target.value }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Kosongkan jika pengumuman tidak memiliki batas waktu
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pengaturan Publikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Status Publikasi</Label>
                  <p className="text-sm text-muted-foreground">
                    Aktifkan untuk mempublikasikan pengumuman
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
              <Link href="/admin/pengumuman">Batal</Link>
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
