'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Loader2, Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

// Common Lucide icons for quick links with categories
const ICON_CATEGORIES = {
  'Umum': [
    { name: 'Link', icon: LucideIcons.Link },
    { name: 'ExternalLink', icon: LucideIcons.ExternalLink },
    { name: 'Home', icon: LucideIcons.Home },
    { name: 'FileText', icon: LucideIcons.FileText },
    { name: 'FolderOpen', icon: LucideIcons.FolderOpen },
    { name: 'Download', icon: LucideIcons.Download },
    { name: 'Search', icon: LucideIcons.Search },
    { name: 'Globe', icon: LucideIcons.Globe },
  ],
  'Pendidikan': [
    { name: 'BookOpen', icon: LucideIcons.BookOpen },
    { name: 'GraduationCap', icon: LucideIcons.GraduationCap },
    { name: 'School', icon: LucideIcons.School },
    { name: 'Library', icon: LucideIcons.Library },
    { name: 'Notebook', icon: LucideIcons.Notebook },
    { name: 'Award', icon: LucideIcons.Award },
    { name: 'ClipboardList', icon: LucideIcons.ClipboardList },
    { name: 'FileCheck', icon: LucideIcons.FileCheck },
  ],
  'Organisasi': [
    { name: 'Users', icon: LucideIcons.Users },
    { name: 'User', icon: LucideIcons.User },
    { name: 'Building2', icon: LucideIcons.Building2 },
    { name: 'Building', icon: LucideIcons.Building },
    { name: 'Landmark', icon: LucideIcons.Landmark },
    { name: 'Briefcase', icon: LucideIcons.Briefcase },
    { name: 'UserCircle', icon: LucideIcons.UserCircle },
    { name: 'UserCog', icon: LucideIcons.UserCog },
  ],
  'Komunikasi': [
    { name: 'Mail', icon: LucideIcons.Mail },
    { name: 'Phone', icon: LucideIcons.Phone },
    { name: 'MapPin', icon: LucideIcons.MapPin },
    { name: 'MessageSquare', icon: LucideIcons.MessageSquare },
    { name: 'MessageCircle', icon: LucideIcons.MessageCircle },
    { name: 'Send', icon: LucideIcons.Send },
    { name: 'AtSign', icon: LucideIcons.AtSign },
    { name: 'Contact', icon: LucideIcons.Contact },
  ],
  'Media Sosial': [
    { name: 'Youtube', icon: LucideIcons.Youtube },
    { name: 'Instagram', icon: LucideIcons.Instagram },
    { name: 'Facebook', icon: LucideIcons.Facebook },
    { name: 'Twitter', icon: LucideIcons.Twitter },
    { name: 'Linkedin', icon: LucideIcons.Linkedin },
  ],
  'Informasi': [
    { name: 'Info', icon: LucideIcons.Info },
    { name: 'HelpCircle', icon: LucideIcons.HelpCircle },
    { name: 'AlertCircle', icon: LucideIcons.AlertCircle },
    { name: 'Newspaper', icon: LucideIcons.Newspaper },
    { name: 'Image', icon: LucideIcons.Image },
    { name: 'Video', icon: LucideIcons.Video },
    { name: 'Camera', icon: LucideIcons.Camera },
    { name: 'Mic', icon: LucideIcons.Mic },
  ],
  'Lainnya': [
    { name: 'Calendar', icon: LucideIcons.Calendar },
    { name: 'Clock', icon: LucideIcons.Clock },
    { name: 'Database', icon: LucideIcons.Database },
    { name: 'Server', icon: LucideIcons.Server },
    { name: 'Settings', icon: LucideIcons.Settings },
    { name: 'Shield', icon: LucideIcons.Shield },
    { name: 'Key', icon: LucideIcons.Key },
    { name: 'Lock', icon: LucideIcons.Lock },
  ],
};

// Get all icons as flat array
const ALL_ICONS = Object.values(ICON_CATEGORIES).flat();

// Icon Picker Component
function IconPicker({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<keyof typeof ICON_CATEGORIES>('Umum');
  
  return (
    <div className="space-y-3">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {Object.keys(ICON_CATEGORIES).map((category) => (
          <Button
            key={category}
            type="button"
            variant={activeCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(category as keyof typeof ICON_CATEGORIES)}
            className={activeCategory === category ? 'bg-[#1B99F4] hover:bg-[#1B99F4]/90' : ''}
          >
            {category}
          </Button>
        ))}
      </div>
      
      {/* Icon Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 p-3 border rounded-lg bg-muted/30 max-h-64 overflow-y-auto">
        {ICON_CATEGORIES[activeCategory].map(({ name, icon: Icon }) => (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            className={`
              relative flex flex-col items-center justify-center gap-1 p-2 sm:p-3 rounded-lg border-2 transition-all
              ${value === name 
                ? 'border-[#1B99F4] bg-[#1B99F4]/10 shadow-sm' 
                : 'border-transparent hover:border-muted-foreground/30 hover:bg-muted/50'
              }
            `}
            title={name}
          >
            <Icon className={`h-5 w-5 ${value === name ? 'text-[#1B99F4]' : 'text-muted-foreground'}`} />
            <span className={`text-[10px] truncate w-full text-center ${value === name ? 'text-[#1B99F4] font-medium' : 'text-muted-foreground'}`}>
              {name}
            </span>
            {value === name && (
              <div className="absolute -top-1 -right-1 bg-[#1B99F4] rounded-full p-0.5">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Selected Icon Preview */}
      <div className="flex items-center gap-3 p-3 border rounded-lg bg-background">
        <span className="text-sm text-muted-foreground">Icon dipilih:</span>
        {(() => {
          const selectedIcon = ALL_ICONS.find(i => i.name === value);
          if (selectedIcon) {
            const Icon = selectedIcon.icon;
            return (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-[#1B99F4]/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-[#1B99F4]" />
                </div>
                <span className="font-medium text-sm">{value}</span>
              </div>
            );
          }
          return (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <LucideIcons.Link className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="font-medium text-sm">{value || 'Tidak ada'}</span>
            </div>
          );
        })()}
      </div>
      
      {/* Custom Icon Input */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Atau ketik nama icon kustom:</Label>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Nama icon Lucide (contoh: Heart, Star, etc.)"
          className="text-sm"
        />
      </div>
    </div>
  );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditQuickLinkPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'tambah';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    icon: 'Link',
    orderIndex: 0,
    isActive: true,
  });

  useEffect(() => {
    if (!isNew) {
      fetchQuickLink();
    }
  }, [isNew, resolvedParams.id]);

  const fetchQuickLink = async () => {
    try {
      const response = await fetch(`/api/admin/quick-links/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title || '',
          url: data.url || '',
          icon: data.icon || 'Link',
          orderIndex: data.orderIndex ?? 0,
          isActive: data.isActive ?? true,
        });
      } else {
        toast.error('Quick link tidak ditemukan');
        router.push('/admin/quick-links');
      }
    } catch (error) {
      console.error('Error fetching quick link:', error);
      toast.error('Gagal memuat data quick link');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Judul quick link wajib diisi');
      return;
    }

    if (!formData.url.trim()) {
      toast.error('URL quick link wajib diisi');
      return;
    }

    setSaving(true);

    try {
      const url = isNew
        ? '/api/admin/quick-links'
        : `/api/admin/quick-links/${resolvedParams.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          url: formData.url,
          icon: formData.icon || 'Link',
          orderIndex: formData.orderIndex,
          isActive: formData.isActive,
        }),
      });

      if (response.ok) {
        toast.success(isNew ? 'Quick link berhasil dibuat' : 'Quick link berhasil diperbarui');
        router.push('/admin/quick-links');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Gagal menyimpan quick link');
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
            <Link href="/admin/quick-links">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {isNew ? 'Tambah Quick Link' : 'Edit Quick Link'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isNew ? 'Buat tautan cepat baru' : 'Perbarui informasi tautan cepat'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Quick Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Masukkan judul tautan"
                  required
                />
              </div>

              {/* URL */}
              <div className="space-y-2">
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, url: e.target.value }))
                  }
                  placeholder="https://example.com atau /halaman"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Gunakan URL lengkap untuk link eksternal atau /path untuk halaman internal
                </p>
              </div>

              {/* Icon Picker */}
              <div className="space-y-2">
                <Label>Pilih Icon</Label>
                <IconPicker 
                  value={formData.icon} 
                  onChange={(value) => setFormData((prev) => ({ ...prev, icon: value }))}
                />
              </div>

              {/* Order Index */}
              <div className="space-y-2">
                <Label htmlFor="orderIndex">Urutan</Label>
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
                  Angka lebih kecil akan tampil di atas
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
                    Aktifkan untuk menampilkan quick link di website
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
              <Link href="/admin/quick-links">Batal</Link>
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
