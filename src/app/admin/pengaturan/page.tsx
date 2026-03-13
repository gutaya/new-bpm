'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Settings,
  Save,
  Loader2,
  Wrench,
  Globe,
  Code,
  Shield,
  Bell,
  Mail,
  RefreshCw,
  Menu,
  GripVertical,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ChevronRight,
  Link2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { cn } from '@/lib/utils';

// Types
interface SettingsData {
  maintenanceMode: string;
  metaDescription: string;
  metaKeywords: string;
  googleAnalyticsId: string;
  facebookPixelId: string;
  customHeaderCode: string;
  customFooterCode: string;
  contactFormEmail: string;
  notificationEmail: string;
  enableRegistration: string;
  enableContactForm: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
}

interface MenuItem {
  id: string;
  title: string;
  url: string | null;
  icon: string | null;
  parentId: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  children?: MenuItem[];
}

const defaultSettings: SettingsData = {
  maintenanceMode: 'false',
  metaDescription: '',
  metaKeywords: '',
  googleAnalyticsId: '',
  facebookPixelId: '',
  customHeaderCode: '',
  customFooterCode: '',
  contactFormEmail: '',
  notificationEmail: '',
  enableRegistration: 'true',
  enableContactForm: 'true',
  smtpHost: '',
  smtpPort: '587',
  smtpUser: '',
  smtpPassword: ''
};

export default function PengaturanPage() {
  // Settings state
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Menu state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [savingMenu, setSavingMenu] = useState(false);
  
  // Drag state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggedChildInfo, setDraggedChildInfo] = useState<{ parentIndex: number; childIndex: number } | null>(null);
  const [dragOverChildInfo, setDragOverChildInfo] = useState<{ parentIndex: number; childIndex: number } | null>(null);
  
  // Dialog state
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [deletingMenu, setDeletingMenu] = useState<MenuItem | null>(null);
  const [parentForNewMenu, setParentForNewMenu] = useState<MenuItem | null>(null);
  
  // Form state
  const [menuForm, setMenuForm] = useState({
    title: '',
    url: '',
    icon: '',
    parentId: '',
    isActive: true,
  });

  useEffect(() => {
    fetchSettings();
    fetchMenuItems();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/pengaturan');
      const data = await response.json();
      setSettings({ ...defaultSettings, ...data });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Gagal memuat pengaturan');
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      setLoadingMenu(true);
      const response = await fetch('/api/admin/menu');
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Gagal memuat data menu');
    } finally {
      setLoadingMenu(false);
    }
  };

  // Settings handlers
  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/pengaturan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast.success('Pengaturan berhasil disimpan');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleBoolean = (key: keyof SettingsData) => {
    const currentValue = settings[key] === 'true';
    updateSetting(key, String(!currentValue));
  };

  // Menu handlers
  const openAddMenuDialog = (parentMenu?: MenuItem) => {
    setEditingMenu(null);
    setParentForNewMenu(parentMenu || null);
    setMenuForm({
      title: '',
      url: '',
      icon: '',
      parentId: parentMenu?.id || '',
      isActive: true,
    });
    setMenuDialogOpen(true);
  };

  const openEditMenuDialog = (menu: MenuItem) => {
    setEditingMenu(menu);
    setParentForNewMenu(null);
    setMenuForm({
      title: menu.title,
      url: menu.url || '',
      icon: menu.icon || '',
      parentId: menu.parentId || '',
      isActive: menu.isActive,
    });
    setMenuDialogOpen(true);
  };

  const openDeleteDialog = (menu: MenuItem) => {
    setDeletingMenu(menu);
    setDeleteDialogOpen(true);
  };

  const handleSaveMenu = async () => {
    if (!menuForm.title.trim()) {
      toast.error('Judul menu wajib diisi');
      return;
    }

    try {
      setSavingMenu(true);
      
      if (editingMenu) {
        const response = await fetch(`/api/admin/menu/${editingMenu.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: menuForm.title,
            url: menuForm.url || null,
            icon: menuForm.icon || null,
            parentId: menuForm.parentId || null,
            isActive: menuForm.isActive,
          }),
        });

        if (response.ok) {
          toast.success('Menu berhasil diperbarui');
          fetchMenuItems();
        } else {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update');
        }
      } else {
        const response = await fetch('/api/admin/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: menuForm.title,
            url: menuForm.url || null,
            icon: menuForm.icon || null,
            parentId: menuForm.parentId || null,
            isActive: menuForm.isActive,
            orderIndex: 999,
          }),
        });

        if (response.ok) {
          toast.success('Menu berhasil ditambahkan');
          fetchMenuItems();
        } else {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create');
        }
      }
      
      setMenuDialogOpen(false);
    } catch (error) {
      console.error('Error saving menu:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan menu');
    } finally {
      setSavingMenu(false);
    }
  };

  const handleDeleteMenu = async () => {
    if (!deletingMenu) return;

    try {
      setSavingMenu(true);
      const response = await fetch(`/api/admin/menu/${deletingMenu.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Menu berhasil dihapus');
        fetchMenuItems();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus menu');
    } finally {
      setSavingMenu(false);
      setDeleteDialogOpen(false);
      setDeletingMenu(null);
    }
  };

  const handleToggleMenuActive = async (menu: MenuItem) => {
    try {
      const response = await fetch(`/api/admin/menu/${menu.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !menu.isActive }),
      });

      if (response.ok) {
        const updateMenu = (items: MenuItem[]): MenuItem[] => {
          return items.map(item => {
            if (item.id === menu.id) {
              return { ...item, isActive: !menu.isActive };
            }
            if (item.children) {
              return { ...item, children: updateMenu(item.children) };
            }
            return item;
          });
        };
        setMenuItems(updateMenu(menuItems));
        toast.success(menu.isActive ? 'Menu dinonaktifkan' : 'Menu diaktifkan');
      }
    } catch (error) {
      console.error('Error toggling menu:', error);
      toast.error('Gagal mengubah status menu');
    }
  };

  // Move menu up/down
  const handleMoveMenuUp = async (index: number) => {
    if (index <= 0) return;
    
    const newItems = [...menuItems];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    
    // Update orderIndex
    const updates = newItems.map((item, idx) => ({ id: item.id, orderIndex: idx }));
    
    setMenuItems(newItems);
    await saveMenuOrder(updates);
  };

  const handleMoveMenuDown = async (index: number) => {
    if (index >= menuItems.length - 1) return;
    
    const newItems = [...menuItems];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    
    // Update orderIndex
    const updates = newItems.map((item, idx) => ({ id: item.id, orderIndex: idx }));
    
    setMenuItems(newItems);
    await saveMenuOrder(updates);
  };

  const handleMoveSubMenuUp = async (parentIndex: number, childIndex: number) => {
    if (childIndex <= 0 || !menuItems[parentIndex].children) return;
    
    const newItems = [...menuItems];
    const children = [...(newItems[parentIndex].children || [])];
    [children[childIndex - 1], children[childIndex]] = [children[childIndex], children[childIndex - 1]];
    newItems[parentIndex] = { ...newItems[parentIndex], children };
    
    // Update orderIndex for children
    const updates = children.map((item, idx) => ({ id: item.id, orderIndex: idx }));
    
    setMenuItems(newItems);
    await saveMenuOrder(updates);
  };

  const handleMoveSubMenuDown = async (parentIndex: number, childIndex: number) => {
    const children = menuItems[parentIndex].children;
    if (!children || childIndex >= children.length - 1) return;
    
    const newItems = [...menuItems];
    const newChildren = [...children];
    [newChildren[childIndex], newChildren[childIndex + 1]] = [newChildren[childIndex + 1], newChildren[childIndex]];
    newItems[parentIndex] = { ...newItems[parentIndex], children: newChildren };
    
    // Update orderIndex for children
    const updates = newChildren.map((item, idx) => ({ id: item.id, orderIndex: idx }));
    
    setMenuItems(newItems);
    await saveMenuOrder(updates);
  };

  // Drag and Drop handlers
  const handleParentDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `parent-${index}`);
    setDraggedIndex(index);
    setDraggedChildInfo(null);
  };

  const handleChildDragStart = (e: React.DragEvent, parentIndex: number, childIndex: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `child-${parentIndex}-${childIndex}`);
    setDraggedChildInfo({ parentIndex, childIndex });
    setDraggedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number, isChild: boolean = false, childIndex?: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (isChild && childIndex !== undefined) {
      setDragOverChildInfo({ parentIndex: index, childIndex });
    } else {
      setDragOverIndex(index);
      setDragOverChildInfo(null);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
    setDragOverChildInfo(null);
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number, isChild: boolean = false) => {
    e.preventDefault();
    
    const data = e.dataTransfer.getData('text/plain');
    
    if (data.startsWith('parent-')) {
      // Moving parent menu
      const sourceIndex = parseInt(data.replace('parent-', ''));
      
      if (sourceIndex === targetIndex || draggedIndex === null) {
        resetDragState();
        return;
      }
      
      const newItems = [...menuItems];
      const [draggedItem] = newItems.splice(sourceIndex, 1);
      newItems.splice(targetIndex, 0, draggedItem);
      
      const updates = newItems.map((item, idx) => ({ id: item.id, orderIndex: idx }));
      
      setMenuItems(newItems);
      await saveMenuOrder(updates);
      
    } else if (data.startsWith('child-')) {
      // Moving child menu
      const [, parentIdx, childIdx] = data.split('-').map(Number);
      
      if (!isChild) {
        // Drop child on parent area - could convert to parent or ignore
        toast.info('Untuk mengubah sub menu menjadi menu utama, edit menu dan hapus menu induknya');
      } else {
        // Reorder within children
        const newItems = [...menuItems];
        const parentItem = newItems[parentIdx];
        
        if (parentItem.children && parentIdx === targetIndex) {
          const children = [...parentItem.children];
          const [draggedChild] = children.splice(childIdx, 1);
          
          // Find target child index
          const targetChildIndex = dragOverChildInfo?.childIndex ?? childIdx;
          children.splice(targetChildIndex, 0, draggedChild);
          
          newItems[parentIdx] = { ...parentItem, children };
          
          const updates = children.map((item, idx) => ({ id: item.id, orderIndex: idx }));
          
          setMenuItems(newItems);
          await saveMenuOrder(updates);
        }
      }
    }
    
    resetDragState();
  };

  const resetDragState = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDraggedChildInfo(null);
    setDragOverChildInfo(null);
  };

  const saveMenuOrder = async (items: { id: string; orderIndex: number }[]) => {
    try {
      setSavingMenu(true);
      const response = await fetch('/api/admin/menu/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });

      if (response.ok) {
        toast.success('Urutan menu berhasil disimpan');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving menu order:', error);
      toast.error('Gagal menyimpan urutan menu');
      fetchMenuItems(); // Revert on error
    } finally {
      setSavingMenu(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Pengaturan
            </h1>
            <p className="text-muted-foreground mt-1">
              Kelola pengaturan website dan menu navigasi
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="umum" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="umum" className="gap-2">
              <Settings className="h-4 w-4" />
              Umum
            </TabsTrigger>
            <TabsTrigger value="kelola-menu" className="gap-2">
              <Menu className="h-4 w-4" />
              Kelola Menu
            </TabsTrigger>
          </TabsList>

          {/* Tab Umum */}
          <TabsContent value="umum" className="space-y-6 mt-6">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={fetchSettings} disabled={saving}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleSaveSettings} disabled={saving} className="bg-[#1B99F4] hover:bg-[#1B99F4]/90">
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Simpan
              </Button>
            </div>

            {/* Maintenance Mode */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-[#1B99F4]" />
                  <CardTitle className="text-lg">Mode Pemeliharaan</CardTitle>
                </div>
                <CardDescription>
                  Aktifkan mode pemeliharaan untuk menampilkan halaman maintenance kepada pengunjung
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Status Mode Pemeliharaan</Label>
                    <p className="text-sm text-muted-foreground">
                      Website akan tidak dapat diakses oleh pengunjung umum
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {settings.maintenanceMode === 'true' && (
                      <Badge variant="destructive">Aktif</Badge>
                    )}
                    <Switch
                      checked={settings.maintenanceMode === 'true'}
                      onCheckedChange={() => toggleBoolean('maintenanceMode')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-lg">SEO & Meta</CardTitle>
                </div>
                <CardDescription>
                  Pengaturan default untuk optimasi mesin pencari
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description Default</Label>
                  <Textarea
                    id="metaDescription"
                    placeholder="Deskripsi singkat tentang website..."
                    value={settings.metaDescription}
                    onChange={(e) => updateSetting('metaDescription', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaKeywords">Meta Keywords</Label>
                  <Input
                    id="metaKeywords"
                    placeholder="kata kunci, website, institusi"
                    value={settings.metaKeywords}
                    onChange={(e) => updateSetting('metaKeywords', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Analytics & Tracking */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-lg">Analytics & Tracking</CardTitle>
                </div>
                <CardDescription>
                  Konfigurasi kode pelacakan dan analytics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                    <Input
                      id="googleAnalyticsId"
                      placeholder="G-XXXXXXXXXX"
                      value={settings.googleAnalyticsId}
                      onChange={(e) => updateSetting('googleAnalyticsId', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                    <Input
                      id="facebookPixelId"
                      placeholder="XXXXXXXXXXXXXXXX"
                      value={settings.facebookPixelId}
                      onChange={(e) => updateSetting('facebookPixelId', e.target.value)}
                    />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="customHeaderCode">Custom Header Code</Label>
                  <Textarea
                    id="customHeaderCode"
                    placeholder="<!-- Kode HTML/JavaScript untuk bagian head -->"
                    value={settings.customHeaderCode}
                    onChange={(e) => updateSetting('customHeaderCode', e.target.value)}
                    rows={4}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customFooterCode">Custom Footer Code</Label>
                  <Textarea
                    id="customFooterCode"
                    placeholder="<!-- Kode HTML/JavaScript untuk bagian footer -->"
                    value={settings.customFooterCode}
                    onChange={(e) => updateSetting('customFooterCode', e.target.value)}
                    rows={4}
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Email Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-500" />
                  <CardTitle className="text-lg">Email & Notifikasi</CardTitle>
                </div>
                <CardDescription>
                  Konfigurasi email untuk notifikasi sistem
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contactFormEmail">Email Penerima Form Kontak</Label>
                    <Input
                      id="contactFormEmail"
                      type="email"
                      placeholder="admin@example.com"
                      value={settings.contactFormEmail}
                      onChange={(e) => updateSetting('contactFormEmail', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notificationEmail">Email Notifikasi Sistem</Label>
                    <Input
                      id="notificationEmail"
                      type="email"
                      placeholder="noreply@example.com"
                      value={settings.notificationEmail}
                      onChange={(e) => updateSetting('notificationEmail', e.target.value)}
                    />
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Konfigurasi SMTP</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input
                        id="smtpHost"
                        placeholder="smtp.gmail.com"
                        value={settings.smtpHost}
                        onChange={(e) => updateSetting('smtpHost', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input
                        id="smtpPort"
                        placeholder="587"
                        value={settings.smtpPort}
                        onChange={(e) => updateSetting('smtpPort', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpUser">SMTP Username</Label>
                      <Input
                        id="smtpUser"
                        placeholder="username"
                        value={settings.smtpUser}
                        onChange={(e) => updateSetting('smtpUser', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        placeholder="••••••••"
                        value={settings.smtpPassword}
                        onChange={(e) => updateSetting('smtpPassword', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-cyan-500" />
                  <CardTitle className="text-lg">Fitur & Fungsionalitas</CardTitle>
                </div>
                <CardDescription>
                  Aktifkan atau nonaktifkan fitur-fitur website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-1">
                    <Label>Form Kontak</Label>
                    <p className="text-sm text-muted-foreground">
                      Izinkan pengunjung mengirim pesan melalui form kontak
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableContactForm === 'true'}
                    onCheckedChange={() => toggleBoolean('enableContactForm')}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-1">
                    <Label>Registrasi Pengguna</Label>
                    <p className="text-sm text-muted-foreground">
                      Izinkan pengguna baru untuk mendaftar akun
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableRegistration === 'true'}
                    onCheckedChange={() => toggleBoolean('enableRegistration')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Kelola Menu */}
          <TabsContent value="kelola-menu" className="space-y-6 mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Geser menu untuk mengubah urutan, atau gunakan tombol ↑↓ untuk memindahkan.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={fetchMenuItems} disabled={savingMenu}>
                  <RefreshCw className={cn("h-4 w-4 mr-2", savingMenu && "animate-spin")} />
                  Refresh
                </Button>
                <Button onClick={() => openAddMenuDialog()} className="bg-[#1B99F4] hover:bg-[#1B99F4]/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Menu
                </Button>
              </div>
            </div>

            {loadingMenu ? (
              <Card className="p-6">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Memuat data menu...
                </div>
              </Card>
            ) : menuItems.length === 0 ? (
              <Card className="p-8">
                <div className="flex flex-col items-center gap-2 text-center">
                  <Menu className="h-12 w-12 text-muted-foreground" />
                  <h3 className="font-semibold">Belum ada menu</h3>
                  <p className="text-sm text-muted-foreground">
                    Klik tombol "Tambah Menu" untuk membuat menu baru
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-2">
                {menuItems.map((menu, parentIndex) => (
                  <Card 
                    key={menu.id} 
                    className={cn(
                      "overflow-hidden transition-all",
                      draggedIndex === parentIndex && "opacity-50 scale-[0.98]",
                      dragOverIndex === parentIndex && "ring-2 ring-[#1B99F4]"
                    )}
                  >
                    {/* Parent Menu */}
                    <div
                      draggable
                      onDragStart={(e) => handleParentDragStart(e, parentIndex)}
                      onDragOver={(e) => handleDragOver(e, parentIndex)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, parentIndex)}
                      className="flex items-center gap-2 p-4 cursor-grab active:cursor-grabbing hover:bg-muted/30 transition-colors"
                    >
                      {/* Drag Handle */}
                      <div className="flex flex-col gap-0.5">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                      </div>
                      
                      {/* Move Buttons */}
                      <div className="flex flex-col gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 p-0 hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]"
                          onClick={() => handleMoveMenuUp(parentIndex)}
                          disabled={parentIndex === 0}
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 p-0 hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]"
                          onClick={() => handleMoveMenuDown(parentIndex)}
                          disabled={parentIndex === menuItems.length - 1}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {/* Menu Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{menu.title}</span>
                          <Badge variant={menu.isActive ? "default" : "secondary"} className="text-xs">
                            {menu.isActive ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                          {menu.children && menu.children.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {menu.children.length} sub menu
                            </Badge>
                          )}
                        </div>
                        {menu.url && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Link2 className="h-3 w-3" />
                            {menu.url}
                          </p>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openAddMenuDialog(menu)}
                          className="h-8 w-8 hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]"
                          title="Tambah Sub Menu"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleMenuActive(menu)}
                          className={cn(
                            "h-8 w-8",
                            menu.isActive ? "hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]" : "hover:bg-emerald-100 hover:text-emerald-600"
                          )}
                          title={menu.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {menu.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditMenuDialog(menu)}
                          className="h-8 w-8 hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(menu)}
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          disabled={menu.children && menu.children.length > 0}
                          title={menu.children && menu.children.length > 0 ? 'Hapus sub menu terlebih dahulu' : 'Hapus'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Sub Menu */}
                    {menu.children && menu.children.length > 0 && (
                      <div className="border-t bg-muted/20">
                        {menu.children.map((child, childIndex) => (
                          <div
                            key={child.id}
                            draggable
                            onDragStart={(e) => handleChildDragStart(e, parentIndex, childIndex)}
                            onDragOver={(e) => handleDragOver(e, parentIndex, true, childIndex)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, parentIndex, true)}
                            className={cn(
                              "flex items-center gap-2 px-4 py-3 pl-14 cursor-grab active:cursor-grabbing border-b last:border-b-0 hover:bg-muted/30 transition-colors",
                              draggedChildInfo?.parentIndex === parentIndex && draggedChildInfo?.childIndex === childIndex && "opacity-50",
                              dragOverChildInfo?.parentIndex === parentIndex && dragOverChildInfo?.childIndex === childIndex && "bg-[#1B99F4]/10"
                            )}
                          >
                            {/* Drag Handle */}
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            
                            {/* Move Buttons */}
                            <div className="flex flex-col gap-0.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]"
                                onClick={() => handleMoveSubMenuUp(parentIndex, childIndex)}
                                disabled={childIndex === 0}
                              >
                                <ChevronUp className="h-2.5 w-2.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]"
                                onClick={() => handleMoveSubMenuDown(parentIndex, childIndex)}
                                disabled={childIndex === (menu.children?.length || 0) - 1}
                              >
                                <ChevronDown className="h-2.5 w-2.5" />
                              </Button>
                            </div>
                            
                            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{child.title}</span>
                                <Badge variant={child.isActive ? "default" : "secondary"} className="text-xs">
                                  {child.isActive ? 'Aktif' : 'Nonaktif'}
                                </Badge>
                              </div>
                              {child.url && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <Link2 className="h-3 w-3" />
                                  {child.url}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleMenuActive(child)}
                                className={cn(
                                  "h-7 w-7",
                                  child.isActive ? "hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]" : "hover:bg-emerald-100 hover:text-emerald-600"
                                )}
                                title={child.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                              >
                                {child.isActive ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditMenuDialog(child)}
                                className="h-7 w-7 hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]"
                                title="Edit"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(child)}
                                className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                                title="Hapus"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {/* Info Card */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Cara Mengelola Menu</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <strong>Geser Menu:</strong> Klik dan tahan, lalu geser ke posisi yang diinginkan</li>
                      <li>• <strong>Tombol ↑↓:</strong> Klik untuk memindahkan menu naik atau turun satu posisi</li>
                      <li>• <strong>Tambah Sub Menu:</strong> Klik tombol + pada menu induk</li>
                      <li>• <strong>Edit/Hapus:</strong> Gunakan tombol aksi di sebelah kanan setiap menu</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Menu Dialog */}
      <Dialog open={menuDialogOpen} onOpenChange={setMenuDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingMenu ? 'Edit Menu' : parentForNewMenu ? `Tambah Sub Menu untuk "${parentForNewMenu.title}"` : 'Tambah Menu Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingMenu ? 'Perbarui informasi menu' : 'Isi informasi menu baru'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="menuTitle">Judul Menu *</Label>
              <Input
                id="menuTitle"
                placeholder="Contoh: Beranda"
                value={menuForm.title}
                onChange={(e) => setMenuForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="menuUrl">URL</Label>
              <Input
                id="menuUrl"
                placeholder="Contoh: /beranda atau https://example.com"
                value={menuForm.url}
                onChange={(e) => setMenuForm(prev => ({ ...prev, url: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                URL relatif (contoh: /profil) atau absolut (contoh: https://google.com)
              </p>
            </div>
            
            {!parentForNewMenu && (
              <div className="space-y-2">
                <Label htmlFor="menuParent">Menu Induk</Label>
                <Select
                  value={menuForm.parentId || 'none'}
                  onValueChange={(value) => setMenuForm(prev => ({ ...prev, parentId: value === 'none' ? '' : value }))}
                  disabled={!!editingMenu?.children && editingMenu.children.length > 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih menu induk (opsional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tidak ada (Menu Utama)</SelectItem>
                    {menuItems
                      .filter(m => m.id !== editingMenu?.id)
                      .map((menu) => (
                        <SelectItem key={menu.id} value={menu.id}>
                          {menu.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Pilih menu induk untuk membuat sub menu
                </p>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="menuActive">Status Aktif</Label>
                <p className="text-xs text-muted-foreground">
                  Menu akan ditampilkan jika aktif
                </p>
              </div>
              <Switch
                id="menuActive"
                checked={menuForm.isActive}
                onCheckedChange={(checked) => setMenuForm(prev => ({ ...prev, isActive: checked }))}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setMenuDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveMenu} disabled={savingMenu} className="bg-[#1B99F4] hover:bg-[#1B99F4]/90">
              {savingMenu && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingMenu ? 'Simpan Perubahan' : 'Tambah Menu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Menu?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus menu <strong>"{deletingMenu?.title}"</strong>? 
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteMenu} disabled={savingMenu}>
              {savingMenu && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Hapus Menu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
