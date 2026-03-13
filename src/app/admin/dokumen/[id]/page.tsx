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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Loader2, Upload, Menu } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface MenuItem {
  id: string;
  title: string;
  url: string | null;
  parentId: string | null;
  parent?: {
    id: string;
    title: string;
  } | null;
}

export default function EditDokumenPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'tambah';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileUrl: '',
    menuItemId: '',
    published: true,
  });

  useEffect(() => {
    fetchMenuItems();
    if (!isNew) {
      fetchDocument();
    } else {
      setLoading(false);
    }
  }, [isNew, resolvedParams.id]);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/admin/menu?includeAll=true');
      if (response.ok) {
        const data = await response.json();
        // Find "Dokumen" parent menu (parentId is null and title is "Dokumen")
        const dokumenParent = data.find((item: MenuItem) => 
          !item.parentId && item.isActive && item.title.toLowerCase() === 'dokumen'
        );
        
        if (dokumenParent) {
          // Filter only submenu items under "Dokumen" menu
          const dokumenSubMenus = data.filter((item: MenuItem) => 
            item.parentId === dokumenParent.id && item.isActive
          );
          setMenuItems(dokumenSubMenus);
        } else {
          setMenuItems([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    }
  };

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/admin/dokumen/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title || '',
          description: data.description || '',
          fileUrl: data.fileUrl || '',
          menuItemId: data.menuItemId || '',
          published: data.published ?? true,
        });
      } else {
        toast.error('Dokumen tidak ditemukan');
        router.push('/admin/dokumen');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      toast.error('Gagal memuat data dokumen');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadingFile(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await response.json();

      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, fileUrl: data.url }));
        toast.success('File berhasil diunggah');
      } else {
        toast.error(data.error || 'Gagal mengunggah file');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Gagal mengunggah file');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Judul dokumen wajib diisi');
      return;
    }

    if (!formData.menuItemId) {
      toast.error('Pilih sub menu untuk menampilkan dokumen');
      return;
    }

    setSaving(true);

    try {
      const url = isNew
        ? '/api/admin/dokumen'
        : `/api/admin/dokumen/${resolvedParams.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          fileUrl: formData.fileUrl,
          menuItemId: formData.menuItemId || null,
          published: formData.published,
        }),
      });

      if (response.ok) {
        toast.success(isNew ? 'Dokumen berhasil dibuat' : 'Dokumen berhasil diperbarui');
        router.push('/admin/dokumen');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Gagal menyimpan dokumen');
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
            <Link href="/admin/dokumen">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {isNew ? 'Tambah Dokumen' : 'Edit Dokumen'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isNew ? 'Upload dokumen baru' : 'Perbarui informasi dokumen'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Dokumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Judul Dokumen *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Masukkan judul dokumen"
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
                  placeholder="Deskripsi singkat dokumen (opsional)"
                  rows={3}
                />
              </div>

              {/* File URL */}
              <div className="space-y-2">
                <Label htmlFor="fileUrl">File Dokumen</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="flex gap-2">
                  <Input
                    id="fileUrl"
                    value={formData.fileUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, fileUrl: e.target.value }))
                    }
                    placeholder="https://example.com/document.pdf"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingFile}
                    className="gap-2"
                  >
                    {uploadingFile ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Upload
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Format: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX. Maksimal 10MB
                </p>
                {formData.fileUrl && (
                  <div className="mt-2 p-3 bg-muted rounded-lg flex items-center gap-2">
                    <svg className="h-5 w-5 text-[#1B99F4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-muted-foreground truncate flex-1">
                      {formData.fileUrl.split('/').pop()}
                    </span>
                    <a
                      href={formData.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#1B99F4] hover:underline"
                    >
                      Lihat
                    </a>
                  </div>
                )}
              </div>

              {/* Sub Menu - untuk menentukan di menu Dokumen mana dokumen ditampilkan */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="menuItemId">Tampilkan di Sub Menu *</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-7 text-xs text-[#1B99F4]"
                  >
                    <Link href="/admin/menu" target="_blank">
                      Kelola Menu
                    </Link>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground -mt-1">
                  Pilih sub menu di bawah menu Dokumen
                </p>
                {menuItems.length > 0 ? (
                  <Select
                    value={formData.menuItemId || 'none'}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, menuItemId: value === 'none' ? '' : value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih sub menu dokumen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tidak ada (Tidak ditampilkan di menu)</SelectItem>
                      {menuItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          <div className="flex items-center gap-2">
                            <Menu className="h-4 w-4" />
                            {item.title}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <Menu className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Belum ada sub menu pada menu Dokumen
                    </span>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      asChild
                      className="ml-auto text-[#1B99F4]"
                    >
                      <Link href="/admin/menu" target="_blank">
                        Kelola Menu
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* Status Publikasi */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="published">Status Publikasi</Label>
                    <p className="text-sm text-muted-foreground">
                      Aktifkan untuk mempublikasikan dokumen
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
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/dokumen">Batal</Link>
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
