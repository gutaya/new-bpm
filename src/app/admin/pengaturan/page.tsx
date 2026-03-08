'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Link2,
  ChevronRight,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { cn } from '@/lib/utils';

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
  children?: MenuItem[];
}

interface QuickLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  orderIndex: number;
  isActive: boolean;
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
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Menu state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [savingMenu, setSavingMenu] = useState(false);
  const [draggedItem, setDraggedItem] = useState<{ type: 'menu' | 'quicklink' | 'submenu', id: string, parentId?: string } | null>(null);

  useEffect(() => {
    fetchSettings();
    fetchMenuItems();
    fetchQuickLinks();
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
    } finally {
      setLoadingMenu(false);
    }
  };

  const fetchQuickLinks = async () => {
    try {
      const response = await fetch('/api/admin/quick-links');
      if (response.ok) {
        const data = await response.json();
        setQuickLinks(data);
      }
    } catch (error) {
      console.error('Error fetching quick links:', error);
    }
  };

  const handleSave = async () => {
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

  // Drag and Drop handlers for Menu
  const handleDragStart = (type: 'menu' | 'quicklink' | 'submenu', id: string, parentId?: string) => {
    setDraggedItem({ type, id, parentId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropMenu = async (targetId: string, position: 'before' | 'after' | 'inside') => {
    if (!draggedItem || draggedItem.type !== 'menu') return;
    if (draggedItem.id === targetId) {
      setDraggedItem(null);
      return;
    }

    const newItems = [...menuItems];
    const draggedIndex = newItems.findIndex(item => item.id === draggedItem.id);
    const targetIndex = newItems.findIndex(item => item.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [draggedMenuItem] = newItems.splice(draggedIndex, 1);
    
    if (position === 'inside') {
      // Not handling inside for simplicity - would make it a child
      return;
    }

    const insertIndex = position === 'before' 
      ? (targetIndex > draggedIndex ? targetIndex - 1 : targetIndex)
      : (targetIndex > draggedIndex ? targetIndex : targetIndex + 1);

    newItems.splice(insertIndex, 0, draggedMenuItem);
    
    // Update orderIndex
    newItems.forEach((item, index) => {
      item.orderIndex = index;
    });

    setMenuItems(newItems);
    setDraggedItem(null);
    
    // Save to backend
    await saveMenuOrder(newItems);
  };

  const handleDropQuickLink = async (targetId: string) => {
    if (!draggedItem || draggedItem.type !== 'quicklink') return;
    if (draggedItem.id === targetId) {
      setDraggedItem(null);
      return;
    }

    const newItems = [...quickLinks];
    const draggedIndex = newItems.findIndex(item => item.id === draggedItem.id);
    const targetIndex = newItems.findIndex(item => item.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [draggedLink] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedLink);
    
    // Update orderIndex
    newItems.forEach((item, index) => {
      item.orderIndex = index;
    });

    setQuickLinks(newItems);
    setDraggedItem(null);
    
    // Save to backend
    await saveQuickLinkOrder(newItems);
  };

  const saveMenuOrder = async (items: MenuItem[]) => {
    try {
      setSavingMenu(true);
      const response = await fetch('/api/admin/menu/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: items.map((item, index) => ({ id: item.id, orderIndex: index }))
        })
      });

      if (response.ok) {
        toast.success('Urutan menu berhasil disimpan');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving menu order:', error);
      toast.error('Gagal menyimpan urutan menu');
    } finally {
      setSavingMenu(false);
    }
  };

  const saveQuickLinkOrder = async (items: QuickLink[]) => {
    try {
      setSavingMenu(true);
      const response = await fetch('/api/admin/quick-links/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: items.map((item, index) => ({ id: item.id, orderIndex: index }))
        })
      });

      if (response.ok) {
        toast.success('Urutan quick links berhasil disimpan');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving quick link order:', error);
      toast.error('Gagal menyimpan urutan quick links');
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
              Kelola pengaturan website dan menu
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
            <TabsTrigger value="order-menu" className="gap-2">
              <Menu className="h-4 w-4" />
              Order Menu
            </TabsTrigger>
          </TabsList>

          {/* Tab Umum */}
          <TabsContent value="umum" className="space-y-6 mt-6">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={fetchSettings} disabled={saving}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleSave} disabled={saving}>
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
                  <Wrench className="h-5 w-5 text-orange-500" />
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
                  <p className="text-xs text-muted-foreground">
                    Deskripsi default untuk halaman yang tidak memiliki meta description khusus (maks. 160 karakter)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaKeywords">Meta Keywords</Label>
                  <Input
                    id="metaKeywords"
                    placeholder="kata kunci, website, institusi"
                    value={settings.metaKeywords}
                    onChange={(e) => updateSetting('metaKeywords', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Pisahkan dengan koma
                  </p>
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
                      placeholder="G-XXXXXXXXXX atau UA-XXXXXXXX-X"
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
                  <p className="text-xs text-muted-foreground">
                    Kode ini akan dimasukkan ke dalam tag &lt;head&gt;
                  </p>
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
                  <p className="text-xs text-muted-foreground">
                    Kode ini akan dimasukkan sebelum tag &lt;/body&gt;
                  </p>
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

            {/* Info Card */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Catatan Penting</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Perubahan akan langsung berlaku setelah disimpan</li>
                      <li>• Mode pemeliharaan akan menampilkan halaman khusus kepada pengunjung</li>
                      <li>• Kode tracking akan otomatis aktif setelah ID dimasukkan</li>
                      <li>• Simpan pengaturan SMTP dengan benar agar email dapat terkirim</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Order Menu */}
          <TabsContent value="order-menu" className="space-y-6 mt-6">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { fetchMenuItems(); fetchQuickLinks(); }} disabled={savingMenu}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            {loadingMenu ? (
              <Card className="p-6">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memuat data menu...
                </div>
              </Card>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Menu Items */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Menu className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-lg">Menu Website</CardTitle>
                    </div>
                    <CardDescription>
                      Drag dan drop untuk mengubah urutan menu di website utama
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {menuItems.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Belum ada menu
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {menuItems.map((item) => (
                          <div key={item.id}>
                            <div
                              draggable
                              onDragStart={() => handleDragStart('menu', item.id)}
                              onDragOver={handleDragOver}
                              onDrop={(e) => {
                                e.preventDefault();
                                const rect = e.currentTarget.getBoundingClientRect();
                                const y = e.clientY - rect.top;
                                const position = y < rect.height / 2 ? 'before' : 'after';
                                handleDropMenu(item.id, position);
                              }}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border bg-card cursor-move transition-colors",
                                "hover:bg-accent hover:border-accent-foreground/20",
                                draggedItem?.id === item.id && "opacity-50"
                              )}
                            >
                              <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{item.title}</p>
                                {item.url && (
                                  <p className="text-xs text-muted-foreground truncate">{item.url}</p>
                                )}
                              </div>
                              <Badge variant={item.isActive ? "default" : "secondary"} className="text-xs">
                                {item.isActive ? 'Aktif' : 'Nonaktif'}
                              </Badge>
                            </div>
                            
                            {/* Sub Menu */}
                            {item.children && item.children.length > 0 && (
                              <div className="ml-6 mt-2 space-y-1 border-l-2 border-border pl-3">
                                {item.children.map((child) => (
                                  <div
                                    key={child.id}
                                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                                  >
                                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">{child.title}</p>
                                    </div>
                                    <Badge variant={child.isActive ? "default" : "secondary"} className="text-xs">
                                      {child.isActive ? 'Aktif' : 'Nonaktif'}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Link2 className="h-5 w-5 text-green-500" />
                      <CardTitle className="text-lg">Quick Links</CardTitle>
                    </div>
                    <CardDescription>
                      Drag dan drop untuk mengubah urutan quick links di website utama
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {quickLinks.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Belum ada quick links
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {quickLinks.map((item) => (
                          <div
                            key={item.id}
                            draggable
                            onDragStart={() => handleDragStart('quicklink', item.id)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => {
                              e.preventDefault();
                              handleDropQuickLink(item.id);
                            }}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg border bg-card cursor-move transition-colors",
                              "hover:bg-accent hover:border-accent-foreground/20",
                              draggedItem?.id === item.id && "opacity-50"
                            )}
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{item.url}</p>
                            </div>
                            <Badge variant={item.isActive ? "default" : "secondary"} className="text-xs">
                              {item.isActive ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Info Card */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Cara Mengubah Urutan</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Drag (tarik) item menu dan drop (lepas) pada posisi yang diinginkan</li>
                      <li>• Perubahan urutan akan otomatis tersimpan</li>
                      <li>• Urutan baru akan langsung diterapkan di website utama</li>
                      <li>• Untuk mengubah sub-menu, silakan edit menu induk melalui halaman Menu</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
