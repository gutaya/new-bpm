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
  FolderOpen,
  FileText,
} from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/admin/DeleteConfirmationDialog';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

interface DocumentCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    documents: number;
  };
}

export default function KategoriDokumenAdminPage() {
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/kategori-dokumen');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Gagal memuat data kategori');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/admin/kategori-dokumen/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCategories(categories.filter((item) => item.id !== deleteId));
        toast.success('Kategori berhasil dihapus');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete');
      }
    } catch (error: unknown) {
      console.error('Delete error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus kategori';
      toast.error(errorMessage);
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/kategori-dokumen/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setCategories(
          categories.map((item) =>
            item.id === id ? { ...item, isActive: !currentStatus } : item
          )
        );
        toast.success(currentStatus ? 'Kategori dinonaktifkan' : 'Kategori diaktifkan');
      }
    } catch (error) {
      console.error('Toggle active error:', error);
      toast.error('Gagal mengubah status kategori');
    }
  };

  const filteredCategories = categories.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      item.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Action Buttons Component
  const ActionButtons = ({ item }: { item: DocumentCategory }) => (
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
              <Link href={`/admin/kategori-dokumen/${item.id}`}>
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

        {/* Delete Button - Only show if no documents */}
        {(!item._count || item._count.documents === 0) && (
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
        )}
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
              Kategori Dokumen
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Kelola kategori untuk dokumen
            </p>
          </div>
          <Button asChild className="bg-[#1B99F4] hover:bg-[#1B99F4]/90 w-full sm:w-auto">
            <Link href="/admin/kategori-dokumen/tambah" className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Kategori
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari kategori..."
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
          ) : filteredCategories.length === 0 ? (
            <Card className="p-6">
              <div className="flex flex-col items-center gap-2">
                <FolderOpen className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'Tidak ada kategori yang cocok' : 'Belum ada kategori'}
                </p>
              </div>
            </Card>
          ) : (
            filteredCategories.map((item) => (
              <Card key={item.id} className="p-3 sm:p-4">
                <div className="flex gap-3">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-[#1B99F4]/10 flex items-center justify-center shrink-0">
                    <FolderOpen className="h-6 w-6 text-[#1B99F4]" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {item.slug}
                    </p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge
                        variant={item.isActive ? 'default' : 'secondary'}
                        className={`text-xs ${item.isActive ? 'bg-emerald-500' : ''}`}
                      >
                        {item.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                      <Badge variant="outline" className="text-xs gap-1">
                        <FileText className="h-3 w-3" />
                        {item._count?.documents || 0} dokumen
                      </Badge>
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
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Nama Kategori</TableHead>
                  <TableHead className="w-[150px]">Slug</TableHead>
                  <TableHead className="w-[100px]">Dokumen</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[130px]">Tanggal</TableHead>
                  <TableHead className="w-[150px] text-right">Aksi</TableHead>
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
                ) : filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FolderOpen className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchQuery ? 'Tidak ada kategori yang cocok' : 'Belum ada kategori'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((item, index) => (
                    <TableRow key={item.id}>
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
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {item.slug}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <FileText className="h-3 w-3" />
                          {item._count?.documents || 0}
                        </Badge>
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
          title="Hapus Kategori?"
          description="Kategori akan dihapus secara permanen. Kategori yang memiliki dokumen tidak dapat dihapus."
          onConfirm={handleDelete}
        />
      </div>
    </AdminLayout>
  );
}
