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
import { WysiwygEditor } from '@/components/admin/WysiwygEditor';

interface PageProps {
  params: Promise<{ id: string }>;
}

const MENU_CATEGORIES = [
  { value: 'profil', label: 'Profil' },
  { value: 'akademik', label: 'Akademik' },
  { value: 'layanan', label: 'Layanan' },
  { value: 'informasi', label: 'Informasi' },
  { value: 'lainnya', label: 'Lainnya' },
];

export default function EditHalamanStatisPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'tambah';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    icon: '',
    menuCategory: '',
    orderIndex: 0,
    published: false,
  });

  useEffect(() => {
    if (!isNew) {
      fetchStaticPage();
    }
  }, [isNew, resolvedParams.id]);

  const fetchStaticPage = async () => {
    try {
      const response = await fetch(`/api/admin/halaman/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          description: data.description || '',
          content: data.content || '',
          icon: data.icon || '',
          menuCategory: data.menuCategory || '',
          orderIndex: data.orderIndex || 0,
          published: data.published || false,
        });
      } else {
        toast.error('Halaman tidak ditemukan');
        router.push('/admin/halaman');
      }
    } catch (error) {
      console.error('Error fetching static page:', error);
      toast.error('Gagal memuat data halaman');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Judul halaman wajib diisi');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Konten halaman wajib diisi');
      return;
    }

    setSaving(true);

    try {
      const url = isNew
        ? '/api/admin/halaman'
        : `/api/admin/halaman/${resolvedParams.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(isNew ? 'Halaman berhasil dibuat' : 'Halaman berhasil diperbarui');
        router.push('/admin/halaman');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Gagal menyimpan halaman');
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
            <Link href="/admin/halaman">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {isNew ? 'Tambah Halaman Statis' : 'Edit Halaman Statis'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isNew ? 'Buat halaman statis baru' : 'Perbarui informasi halaman'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Halaman</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Judul Halaman *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Masukkan judul halaman"
                  required
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">/</span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="judul-halaman"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Slug otomatis dibuat dari judul, dapat diubah manual
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
                  placeholder="Deskripsi singkat halaman (opsional)"
                  rows={2}
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
                  placeholder="Tulis konten halaman di sini..."
                />
                <p className="text-xs text-muted-foreground">
                  Gunakan toolbar untuk memformat teks: tebal, miring, heading, daftar, link, gambar, dll.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pengaturan Halaman</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Icon */}
              <div className="space-y-2">
                <Label htmlFor="icon">Ikon (Lucide Icon Name)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, icon: e.target.value }))
                  }
                  placeholder="contoh: FileText, Info, Users"
                />
                <p className="text-xs text-muted-foreground">
                  Nama ikon dari library Lucide (contoh: FileText, Info, Users, Settings)
                </p>
              </div>

              {/* Menu Category */}
              <div className="space-y-2">
                <Label htmlFor="menuCategory">Kategori Menu</Label>
                <Select
                  value={formData.menuCategory}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, menuCategory: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori menu" />
                  </SelectTrigger>
                  <SelectContent>
                    {MENU_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Kategori untuk pengelompokan menu
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
                  min="0"
                />
                <p className="text-xs text-muted-foreground">
                  Urutan tampil di menu (angka lebih kecil ditampilkan lebih dulu)
                </p>
              </div>

              {/* Published */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Status Publikasi</Label>
                  <p className="text-sm text-muted-foreground">
                    Aktifkan untuk mempublikasikan halaman
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
              <Link href="/admin/halaman">Batal</Link>
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
