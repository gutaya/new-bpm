'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  ImageIcon,
  Calendar,
} from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/admin/DeleteConfirmationDialog';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

interface Slideshow {
  id: string;
  title: string;
  imageUrl: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
}

export default function SlideshowAdminPage() {
  const [slideshows, setSlideshows] = useState<Slideshow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    fetchSlideshows();
  }, []);

  const fetchSlideshows = async () => {
    try {
      const response = await fetch('/api/admin/slideshow');
      if (response.ok) {
        const data = await response.json();
        setSlideshows(data);
      }
    } catch (error) {
      console.error('Failed to fetch slideshows:', error);
      toast.error('Gagal memuat data slideshow');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/admin/slideshow/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSlideshows(slideshows.filter((item) => item.id !== deleteId));
        setSelectedIds(selectedIds.filter((id) => id !== deleteId));
        toast.success('Slideshow berhasil dihapus');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Gagal menghapus slideshow');
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/slideshow/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setSlideshows(
          slideshows.map((item) =>
            item.id === id ? { ...item, isActive: !currentStatus } : item
          )
        );
        toast.success(currentStatus ? 'Slideshow disembunyikan' : 'Slideshow ditampilkan');
      }
    } catch (error) {
      console.error('Toggle active error:', error);
      toast.error('Gagal mengubah status slideshow');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredSlideshows.map((item) => item.id));
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

    setIsBulkDeleting(true);
    try {
      const response = await fetch('/api/admin/slideshow/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (response.ok) {
        const result = await response.json();
        setSlideshows(slideshows.filter((item) => !selectedIds.includes(item.id)));
        setSelectedIds([]);
        setShowBulkDelete(false);
        toast.success(`${result.count} slideshow berhasil dihapus`);
      } else {
        throw new Error('Failed to bulk delete');
      }
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('Gagal menghapus slideshow');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const filteredSlideshows = slideshows.sort((a, b) => a.orderIndex - b.orderIndex);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isAllSelected = filteredSlideshows.length > 0 && selectedIds.length === filteredSlideshows.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < filteredSlideshows.length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              Manajemen Slideshow
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Kelola banner slideshow di halaman utama
            </p>
          </div>
          <Button asChild className="bg-[#1B99F4] hover:bg-[#1B99F4]/90 w-full sm:w-auto">
            <Link href="/admin/slideshow/tambah" className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Slide
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari slideshow..."
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

        {/* List View */}
        {loading ? (
          <Card className="p-6">
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4 animate-spin" />
              Memuat data...
            </div>
          </Card>
        ) : filteredSlideshows.length === 0 ? (
          <Card className="p-6">
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">Belum ada slideshow</p>
            </div>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Pilih semua"
                        className={isIndeterminate ? 'opacity-50' : ''}
                      />
                    </TableHead>
                    <TableHead className="w-[60px] text-center">No</TableHead>
                    <TableHead className="w-[120px]">Gambar</TableHead>
                    <TableHead className="w-[100px] text-center">Urutan</TableHead>
                    <TableHead className="w-[120px] text-center">Status</TableHead>
                    <TableHead className="w-[140px]">Tanggal</TableHead>
                    <TableHead className="w-[120px] text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSlideshows.map((item, index) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(item.id)}
                          onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                          aria-label={`Pilih slide ${index + 1}`}
                        />
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="w-20 h-14 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={`Slide ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono">
                          #{item.orderIndex}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={item.isActive ? 'default' : 'secondary'}
                          className={`text-xs ${item.isActive ? 'bg-emerald-500' : ''}`}
                        >
                          {item.isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(item.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <div className="flex items-center justify-center gap-0.5">
                            {/* Edit Button */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  className="h-8 w-8 hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]"
                                >
                                  <Link href={`/admin/slideshow/${item.id}`}>
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
                                  className={`h-8 w-8 ${item.isActive ? 'hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]' : 'hover:bg-emerald-100 hover:text-emerald-600'}`}
                                >
                                  {item.isActive ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{item.isActive ? 'Sembunyikan' : 'Tampilkan'}</p>
                              </TooltipContent>
                            </Tooltip>

                            {/* Delete Button */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeleteId(item.id)}
                                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-border">
              {filteredSlideshows.map((item, index) => (
                <div key={item.id} className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                      aria-label={`Pilih slide ${index + 1}`}
                      className="mt-2"
                    />
                    {/* Thumbnail */}
                    <div className="w-20 h-14 rounded-md overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={`Slide ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium line-clamp-1">Slide #{item.orderIndex}</p>
                        <Badge
                          variant={item.isActive ? 'default' : 'secondary'}
                          className={`text-xs flex-shrink-0 ${item.isActive ? 'bg-emerald-500' : ''}`}
                        >
                          {item.isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="outline" className="font-mono text-xs">
                          #{item.orderIndex}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1 pt-1 pl-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8 hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]"
                    >
                      <Link href={`/admin/slideshow/${item.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleActive(item.id, item.isActive)}
                      className={`h-8 w-8 ${item.isActive ? 'hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]' : 'hover:bg-emerald-100 hover:text-emerald-600'}`}
                    >
                      {item.isActive ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(item.id)}
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Delete Confirmation */}
        <DeleteConfirmationDialog
          open={!!deleteId}
          onOpenChange={(open) => !open && setDeleteId(null)}
          title="Hapus Slideshow?"
          description="Slideshow akan dihapus secara permanen dan tidak dapat dikembalikan."
          onConfirm={handleDelete}
        />

        {/* Bulk Delete Confirmation */}
        <DeleteConfirmationDialog
          open={showBulkDelete}
          onOpenChange={(open) => !open && setShowBulkDelete(false)}
          title="Hapus Slideshow Terpilih?"
          description={`${selectedIds.length} slideshow akan dihapus secara permanen dan tidak dapat dikembalikan.`}
          onConfirm={handleBulkDelete}
          loading={isBulkDeleting}
        />
      </div>
    </AdminLayout>
  );
}
