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
import { ArrowLeft, Save, Loader2, Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

// Common Lucide icons for menu with categories
const ICON_CATEGORIES = {
  'Navigasi': [
    { name: 'Home', icon: LucideIcons.Home },
    { name: 'Menu', icon: LucideIcons.Menu },
    { name: 'LayoutDashboard', icon: LucideIcons.LayoutDashboard },
    { name: 'Layers', icon: LucideIcons.Layers },
    { name: 'Navigation', icon: LucideIcons.Navigation },
    { name: 'Compass', icon: LucideIcons.Compass },
    { name: 'Map', icon: LucideIcons.Map },
    { name: 'Route', icon: LucideIcons.Route },
  ],
  'Umum': [
    { name: 'FileText', icon: LucideIcons.FileText },
    { name: 'FolderOpen', icon: LucideIcons.FolderOpen },
    { name: 'Info', icon: LucideIcons.Info },
    { name: 'HelpCircle', icon: LucideIcons.HelpCircle },
    { name: 'Search', icon: LucideIcons.Search },
    { name: 'Globe', icon: LucideIcons.Globe },
    { name: 'ExternalLink', icon: LucideIcons.ExternalLink },
    { name: 'Link', icon: LucideIcons.Link },
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
    { name: 'Contact', icon: LucideIcons.Contact },
    { name: 'AtSign', icon: LucideIcons.AtSign },
    { name: 'Send', icon: LucideIcons.Send },
  ],
  'Media & Dokumen': [
    { name: 'Newspaper', icon: LucideIcons.Newspaper },
    { name: 'Image', icon: LucideIcons.Image },
    { name: 'Video', icon: LucideIcons.Video },
    { name: 'Camera', icon: LucideIcons.Camera },
    { name: 'Download', icon: LucideIcons.Download },
    { name: 'Upload', icon: LucideIcons.Upload },
    { name: 'File', icon: LucideIcons.File },
    { name: 'Files', icon: LucideIcons.Files },
  ],
  'Lainnya': [
    { name: 'Calendar', icon: LucideIcons.Calendar },
    { name: 'Clock', icon: LucideIcons.Clock },
    { name: 'Database', icon: LucideIcons.Database },
    { name: 'Settings', icon: LucideIcons.Settings },
    { name: 'Shield', icon: LucideIcons.Shield },
    { name: 'Key', icon: LucideIcons.Key },
    { name: 'Lock', icon: LucideIcons.Lock },
    { name: 'Star', icon: LucideIcons.Star },
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
  const [activeCategory, setActiveCategory] = useState<keyof typeof ICON_CATEGORIES>('Navigasi');
  
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
                <LucideIcons.Menu className="h-5 w-5 text-muted-foreground" />
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

interface MenuItem {
  id: string;
  title: string;
  url: string | null;
  icon: string | null;
  parentId: string | null;
  orderIndex: number;
  isActive: boolean;
  children?: MenuItem[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditMenuPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'tambah';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [parentMenus, setParentMenus] = useState<MenuItem[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    icon: '',
    parentId: '',
    orderIndex: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchParentMenus();
    if (!isNew) {
      fetchMenuItem();
    }
  }, [isNew, resolvedParams.id]);

  const fetchParentMenus = async () => {
    try {
      const response = await fetch('/api/admin/menu');
      if (response.ok) {
        const data = await response.json();
        // Only get root menus (no parent) for parent dropdown
        const rootMenus = data.filter((item: MenuItem) => !item.parentId);
        setParentMenus(rootMenus);
      }
    } catch (error) {
      console.error('Error fetching parent menus:', error);
    }
  };

  const fetchMenuItem = async () => {
    try {
      const response = await fetch(`/api/admin/menu/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title || '',
          url: data.url || '',
          icon: data.icon || '',
          parentId: data.parentId || '',
          orderIndex: data.orderIndex ?? 0,
          isActive: data.isActive ?? true,
        });
      } else {
        toast.error('Menu tidak ditemukan');
        router.push('/admin/menu');
      }
    } catch (error) {
      console.error('Error fetching menu item:', error);
      toast.error('Gagal memuat data menu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Judul menu wajib diisi');
      return;
    }

    setSaving(true);

    try {
      const url = isNew
        ? '/api/admin/menu'
        : `/api/admin/menu/${resolvedParams.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          url: formData.url || null,
          icon: formData.icon || null,
          parentId: formData.parentId || null,
          orderIndex: formData.orderIndex,
          isActive: formData.isActive,
        }),
      });

      if (response.ok) {
        toast.success(isNew ? 'Menu berhasil dibuat' : 'Menu berhasil diperbarui');
        router.push('/admin/menu');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Gagal menyimpan menu');
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
            <Link href="/admin/menu">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {isNew ? 'Tambah Menu' : 'Edit Menu'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isNew ? 'Buat menu baru' : 'Perbarui informasi menu'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Menu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Judul Menu *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Masukkan judul menu"
                  required
                />
              </div>

              {/* URL */}
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, url: e.target.value }))
                  }
                  placeholder="/halaman atau https://example.com"
                />
                <p className="text-xs text-muted-foreground">
                  Kosongkan jika menu hanya sebagai parent (induk)
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

              {/* Parent Menu */}
              <div className="space-y-2">
                <Label htmlFor="parentId">Menu Induk</Label>
                <Select
                  value={formData.parentId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, parentId: value === 'none' ? '' : value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih menu induk (opsional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tidak ada (Menu Utama)</SelectItem>
                    {parentMenus
                      .filter((menu) => menu.id !== resolvedParams.id) // Prevent self-reference
                      .map((menu) => (
                        <SelectItem key={menu.id} value={menu.id}>
                          {menu.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Pilih jika menu ini adalah submenu dari menu lain
                </p>
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
                    Aktifkan untuk menampilkan menu di website
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
              <Link href="/admin/menu">Batal</Link>
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
