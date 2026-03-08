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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  Building2,
  GraduationCap,
} from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/admin/DeleteConfirmationDialog';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

interface Faculty {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  deanName: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    studyPrograms: number;
  };
}

export default function FakultasAdminPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const response = await fetch('/api/admin/fakultas');
      if (response.ok) {
        const data = await response.json();
        setFaculties(data);
      }
    } catch (error) {
      console.error('Failed to fetch faculties:', error);
      toast.error('Gagal memuat data fakultas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/admin/fakultas/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFaculties(faculties.filter((item) => item.id !== deleteId));
        toast.success('Fakultas berhasil dihapus');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete');
      }
    } catch (error: unknown) {
      console.error('Delete error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus fakultas';
      toast.error(errorMessage);
    } finally {
      setDeleteId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    setIsBulkDeleting(true);
    try {
      const response = await fetch('/api/admin/fakultas/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (response.ok) {
        const result = await response.json();
        setFaculties(faculties.filter((item) => !selectedIds.includes(item.id)));
        setSelectedIds([]);
        setShowBulkDelete(false);
        toast.success(`${result.count} fakultas berhasil dihapus`);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete');
      }
    } catch (error: unknown) {
      console.error('Bulk delete error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus fakultas';
      toast.error(errorMessage);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Only select items that can be deleted (no study programs)
      const selectableIds = filteredFaculties
        .filter((item) => !item._count || item._count.studyPrograms === 0)
        .map((item) => item.id);
      setSelectedIds(selectableIds);
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

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/fakultas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setFaculties(
          faculties.map((item) =>
            item.id === id ? { ...item, isActive: !currentStatus } : item
          )
        );
        toast.success(currentStatus ? 'Fakultas dinonaktifkan' : 'Fakultas diaktifkan');
      }
    } catch (error) {
      console.error('Toggle active error:', error);
      toast.error('Gagal mengubah status fakultas');
    }
  };

  const filteredFaculties = faculties.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.code?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (item.deanName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  // Check if an item can be deleted
  const canDelete = (item: Faculty) => !item._count || item._count.studyPrograms === 0;

  // Get selectable items count (items that can be deleted)
  const selectableCount = filteredFaculties.filter(canDelete).length;

  // Action Buttons Component
  const ActionButtons = ({ item }: { item: Faculty }) => (
    <TooltipProvider>
      <div className="flex items-center justify-end gap-0.5 sm:gap-1">
        {/* Edit Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8 sm:h-8 sm:w-8 hover:bg-[#1B99F4]/10 hover:text-[#1B99F4] shrink-0"
            >
              <Link href={`/admin/fakultas/${item.id}`}>
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
              className={`h-8 w-8 sm:h-8 sm:w-8 shrink-0 ${item.isActive ? 'hover:bg-orange-100 hover:text-orange-600' : 'hover:bg-emerald-100 hover:text-emerald-600'}`}
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
              className="h-8 w-8 sm:h-8 sm:w-8 hover:bg-destructive/10 hover:text-destructive shrink-0"
              disabled={!canDelete(item)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{!canDelete(item) ? 'Tidak dapat dihapus (memiliki program studi)' : 'Hapus'}</p>
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
              Manajemen Fakultas
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Kelola data fakultas universitas
            </p>
          </div>
          <Button asChild className="bg-[#1B99F4] hover:bg-[#1B99F4]/90 w-full sm:w-auto">
            <Link href="/admin/fakultas/tambah" className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Fakultas
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari fakultas..."
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
          ) : filteredFaculties.length === 0 ? (
            <Card className="p-6">
              <div className="flex flex-col items-center gap-2">
                <Building2 className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'Tidak ada fakultas yang cocok' : 'Belum ada fakultas'}
                </p>
              </div>
            </Card>
          ) : (
            filteredFaculties.map((item) => (
              <Card key={item.id} className="p-3 sm:p-4">
                <div className="flex gap-3">
                  {/* Checkbox */}
                  <div className="shrink-0 self-center">
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                      disabled={!canDelete(item)}
                    />
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-[#1B99F4]/10 flex items-center justify-center shrink-0">
                    <Building2 className="h-6 w-6 sm:h-7 sm:w-7 text-[#1B99F4]" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base line-clamp-1">{item.name}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {item.code && (
                            <Badge variant="outline" className="text-xs">
                              {item.code}
                            </Badge>
                          )}
                          <Badge
                            variant={item.isActive ? 'default' : 'secondary'}
                            className={`text-xs ${item.isActive ? 'bg-emerald-500' : ''}`}
                          >
                            {item.isActive ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                          {item._count && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              {item._count.studyPrograms} Prodi
                            </span>
                          )}
                        </div>
                        {item.deanName && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Dekan: {item.deanName}
                          </p>
                        )}
                      </div>
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
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedIds.length === selectableCount && selectableCount > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="w-[60px]">No</TableHead>
                  <TableHead>Nama Fakultas</TableHead>
                  <TableHead className="w-[100px]">Kode</TableHead>
                  <TableHead>Nama Dekan</TableHead>
                  <TableHead className="w-[100px]">Prodi</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[130px] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4 animate-spin" />
                        Memuat data...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredFaculties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchQuery ? 'Tidak ada fakultas yang cocok' : 'Belum ada fakultas'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFaculties.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(item.id)}
                          onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                          disabled={!canDelete(item)}
                          aria-label={`Select ${item.name}`}
                        />
                      </TableCell>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium line-clamp-1">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.code ? (
                          <Badge variant="outline">{item.code}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.deanName || <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          {item._count?.studyPrograms ?? 0}
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
          title="Hapus Fakultas?"
          description="Fakultas akan dihapus secara permanen dan tidak dapat dikembalikan."
          onConfirm={handleDelete}
        />

        {/* Bulk Delete Confirmation Dialog */}
        <Dialog open={showBulkDelete} onOpenChange={setShowBulkDelete}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Fakultas Terpilih?</DialogTitle>
              <DialogDescription>
                {selectedIds.length} fakultas akan dihapus secara permanen dan tidak dapat dikembalikan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowBulkDelete(false)}
                disabled={isBulkDeleting}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={isBulkDeleting}
              >
                {isBulkDeleting ? 'Menghapus...' : 'Hapus'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
