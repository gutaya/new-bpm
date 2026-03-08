'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  Menu,
  ChevronRight,
  Link2,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/admin/DeleteConfirmationDialog';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

// Dynamic Icon Component
const DynamicIcon = ({ name, className }: { name: string | null; className?: string }) => {
  if (!name) return <Menu className={className || "h-5 w-5"} />;
  
  const Icon = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[name];
  
  if (!Icon) return <Menu className={className || "h-5 w-5"} />;
  
  return <Icon className={className} />;
};

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

export default function MenuAdminPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/admin/menu');
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
      toast.error('Gagal memuat data menu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/admin/menu/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMenuItems(menuItems.filter((item) => item.id !== deleteId));
        toast.success('Menu berhasil dihapus');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete');
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Gagal menghapus menu');
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/menu/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setMenuItems(
          menuItems.map((item) =>
            item.id === id ? { ...item, isActive: !currentStatus } : item
          )
        );
        toast.success(currentStatus ? 'Menu dinonaktifkan' : 'Menu diaktifkan');
      }
    } catch (error) {
      console.error('Toggle active error:', error);
      toast.error('Gagal mengubah status menu');
    }
  };

  // Flatten menu items with hierarchy indication
  const flattenMenuItems = (items: MenuItem[], level = 0): (MenuItem & { level: number })[] => {
    const result: (MenuItem & { level: number })[] = [];
    
    // Get root items (no parent)
    const rootItems = items.filter(item => !item.parentId);
    
    const processItem = (item: MenuItem, currentLevel: number) => {
      result.push({ ...item, level: currentLevel });
      const children = items.filter(i => i.parentId === item.id);
      children.sort((a, b) => a.orderIndex - b.orderIndex).forEach(child => {
        processItem(child, currentLevel + 1);
      });
    };
    
    rootItems.sort((a, b) => a.orderIndex - b.orderIndex).forEach(item => {
      processItem(item, 0);
    });
    
    return result;
  };

  const flattenedItems = flattenMenuItems(menuItems);

  const filteredItems = flattenedItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.url?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  // Action Buttons Component
  const ActionButtons = ({ item }: { item: MenuItem & { level: number } }) => (
    <TooltipProvider>
      <div className="flex items-center justify-end gap-0.5 sm:gap-1">
        {/* Edit Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8 hover:bg-[#1B99F4]/10 hover:text-[#1B99F4] shrink-0"
            >
              <Link href={`/admin/menu/${item.id}`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit</p>
          </TooltipContent>
        </Tooltip>

        {/* Toggle Active Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleToggleActive(item.id, item.isActive)}
              className={`h-8 w-8 shrink-0 ${item.isActive ? 'hover:bg-orange-100 hover:text-orange-600' : 'hover:bg-emerald-100 hover:text-emerald-600'}`}
            >
              {item.isActive ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{item.isActive ? 'Nonaktifkan' : 'Aktifkan'}</p>
          </TooltipContent>
        </Tooltip>

        {/* Delete Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteId(item.id)}
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive shrink-0"
              disabled={item.children && item.children.length > 0}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{item.children && item.children.length > 0 ? 'Hapus submenu terlebih dahulu' : 'Hapus'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              Manajemen Menu
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Kelola menu navigasi website
            </p>
          </div>
          <Button asChild className="bg-[#1B99F4] hover:bg-[#1B99F4]/90 w-full sm:w-auto">
            <Link href="/admin/menu/tambah" className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Menu
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </Card>

        {/* Mobile Card View */}
        <div className="flex flex-col gap-3 lg:hidden">
          {loading ? (
            <Card className="p-6">
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 animate-spin" />
                Memuat data...
              </div>
            </Card>
          ) : filteredItems.length === 0 ? (
            <Card className="p-6">
              <div className="flex flex-col items-center gap-2">
                <Menu className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'Tidak ada menu yang cocok' : 'Belum ada menu'}
                </p>
              </div>
            </Card>
          ) : (
            filteredItems.map((item) => (
              <Card key={item.id} className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-[#1B99F4]/10 flex items-center justify-center shrink-0">
                    <DynamicIcon name={item.icon} className="h-5 w-5 text-[#1B99F4]" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {item.level > 0 && (
                        <div className="flex items-center">
                          {Array.from({ length: item.level }).map((_, i) => (
                            <ChevronRight key={i} className="h-3 w-3 text-muted-foreground" />
                          ))}
                        </div>
                      )}
                      <p className="font-medium text-sm sm:text-base truncate">
                        {item.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={item.isActive ? 'default' : 'secondary'}
                        className={`text-xs ${item.isActive ? 'bg-emerald-500' : ''}`}
                      >
                        {item.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                      {item.url && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Link2 className="h-3 w-3" />
                          {item.url}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        Urutan: {item.orderIndex}
                      </span>
                      {item.icon && (
                        <Badge variant="outline" className="text-xs font-mono">
                          {item.icon}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 self-center">
                    <ActionButtons item={item} />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <Card className="hidden lg:block">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Judul</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="w-[100px]">Icon</TableHead>
                  <TableHead className="w-[100px]">Urutan</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[130px] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4 animate-spin" />
                        Memuat data...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Menu className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchQuery ? 'Tidak ada menu yang cocok' : 'Belum ada menu'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.level > 0 && (
                            <div className="flex items-center shrink-0">
                              {Array.from({ length: item.level }).map((_, i) => (
                                <ChevronRight key={i} className="h-3 w-3 text-muted-foreground" />
                              ))}
                            </div>
                          )}
                          <span className="font-medium">{item.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.url ? (
                          <span className="text-sm text-muted-foreground">{item.url}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-md bg-[#1B99F4]/10 flex items-center justify-center">
                            <DynamicIcon name={item.icon} className="h-4 w-4 text-[#1B99F4]" />
                          </div>
                          <span className="text-xs text-muted-foreground font-mono">{item.icon || '-'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{item.orderIndex}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={item.isActive ? 'default' : 'secondary'}
                          className={item.isActive ? 'bg-emerald-500' : ''}
                        >
                          {item.isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <ActionButtons item={item} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Delete Confirmation */}
        <DeleteConfirmationDialog
          open={!!deleteId}
          onOpenChange={(open) => !open && setDeleteId(null)}
          title="Hapus Menu?"
          description="Menu akan dihapus secara permanen. Menu yang memiliki submenu tidak dapat dihapus."
          onConfirm={handleDelete}
        />
      </div>
    </AdminLayout>
  );
}
