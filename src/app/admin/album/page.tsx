'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
  Calendar,
  ImageIcon,
  Folder,
  Images,
} from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/admin/DeleteConfirmationDialog';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

interface Album {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    galleryImages: number;
  };
}

export default function AlbumAdminPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkDelete, setShowBulkDelete] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await fetch('/api/admin/album');
      if (response.ok) {
        const data = await response.json();
        setAlbums(data);
      }
    } catch (error) {
      console.error('Failed to fetch albums:', error);
      toast.error('Gagal memuat data album');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/admin/album/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAlbums(albums.filter((item) => item.id !== deleteId));
        setSelectedIds(selectedIds.filter((id) => id !== deleteId));
        toast.success('Album berhasil dihapus');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Gagal menghapus album');
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/album/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setAlbums(
          albums.map((item) =>
            item.id === id ? { ...item, isActive: !currentStatus } : item
          )
        );
        toast.success(currentStatus ? 'Album dinonaktifkan' : 'Album diaktifkan');
      }
    } catch (error) {
      console.error('Toggle active error:', error);
      toast.error('Gagal mengubah status album');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredAlbums.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const response = await fetch('/api/admin/album/bulk-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds }),
    });

    if (response.ok) {
      const result = await response.json();
      setAlbums(albums.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]);
    } else {
      throw new Error('Failed to bulk delete');
    }
  };

  const filteredAlbums = albums.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isAllSelected = filteredAlbums.length > 0 && selectedIds.length === filteredAlbums.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < filteredAlbums.length;

  // Action Buttons Component
  const ActionButtons = ({ item }: { item: Album }) => (
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
              <Link href={`/admin/album/${item.id}`}>
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
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hapus</p>
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
              Manajemen Album
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Kelola album foto galeri
            </p>
          </div>
          <Button asChild className="bg-[#1B99F4] hover:bg-[#1B99F4]/90 w-full sm:w-auto">
            <Link href="/admin/album/tambah" className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Album
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari album..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                onClick={() => setShowBulkDelete(true)}
                className="gap-2 w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4" />
                Hapus Terpilih ({selectedIds.length})
              </Button>
            )}
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
          ) : filteredAlbums.length === 0 ? (
            <Card className="p-6">
              <div className="flex flex-col items-center gap-2">
                <Folder className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'Tidak ada album yang cocok' : 'Belum ada album'}
                </p>
              </div>
            </Card>
          ) : (
            filteredAlbums.map((item) => (
              <Card key={item.id} className="p-3 sm:p-4">
                <div className="flex gap-3">
                  {/* Checkbox */}
                  <div className="shrink-0 self-center">
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                    />
                  </div>

                  {/* Cover Image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0">
                    {item.coverImageUrl ? (
                      <img
                        src={item.coverImageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Folder className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base line-clamp-1">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={item.isActive ? 'default' : 'secondary'}
                        className={`text-xs ${item.isActive ? 'bg-emerald-500' : ''}`}
                      >
                        {item.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Images className="h-3 w-3" />
                        {item._count?.galleryImages ?? 0} foto
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(item.createdAt)}
                    </p>
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
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="w-[60px]">Cover</TableHead>
                  <TableHead>Judul Album</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[100px]">Foto</TableHead>
                  <TableHead className="w-[130px]">Tanggal</TableHead>
                  <TableHead className="w-[130px] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4 animate-spin" />
                        Memuat data...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredAlbums.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Folder className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchQuery ? 'Tidak ada album yang cocok' : 'Belum ada album'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAlbums.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(item.id)}
                          onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                          aria-label={`Select ${item.title}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                          {item.coverImageUrl ? (
                            <img
                              src={item.coverImageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Folder className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium line-clamp-1">{item.title}</p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={item.isActive ? 'default' : 'secondary'}
                          className={item.isActive ? 'bg-emerald-500' : ''}
                        >
                          {item.isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Images className="h-4 w-4 text-muted-foreground" />
                          {item._count?.galleryImages ?? 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(item.createdAt)}
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
          title="Hapus Album?"
          description="Album dan semua foto di dalamnya akan dihapus secara permanen dan tidak dapat dikembalikan."
          onConfirm={handleDelete}
        />

        {/* Bulk Delete Confirmation */}
        <DeleteConfirmationDialog
          open={showBulkDelete}
          onOpenChange={(open) => !open && setShowBulkDelete(false)}
          title={`Hapus ${selectedIds.length} Album?`}
          description="Album-album yang dipilih dan semua foto di dalamnya akan dihapus secara permanen dan tidak dapat dikembalikan."
          onConfirm={handleBulkDelete}
        />
      </div>
    </AdminLayout>
  );
}
