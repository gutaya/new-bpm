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
  FileText,
  Clock,
} from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/admin/DeleteConfirmationDialog';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

interface StaticPage {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  menuCategory: string | null;
  parentMenu: string | null;
  showInMenu: boolean;
  orderIndex: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function HalamanStatisAdminPage() {
  const [staticPages, setStaticPages] = useState<StaticPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchStaticPages();
  }, []);

  const fetchStaticPages = async () => {
    try {
      const response = await fetch('/api/admin/halaman');
      if (response.ok) {
        const data = await response.json();
        setStaticPages(data);
      }
    } catch (error) {
      console.error('Failed to fetch static pages:', error);
      toast.error('Gagal memuat data halaman statis');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/admin/halaman/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setStaticPages(staticPages.filter((item) => item.id !== deleteId));
        toast.success('Halaman statis berhasil dihapus');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Gagal menghapus halaman statis');
    } finally {
      setDeleteId(null);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/halaman/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (response.ok) {
        setStaticPages(
          staticPages.map((item) =>
            item.id === id ? { ...item, published: !currentStatus } : item
          )
        );
        toast.success(currentStatus ? 'Halaman disembunyikan' : 'Halaman dipublikasikan');
      }
    } catch (error) {
      console.error('Toggle publish error:', error);
      toast.error('Gagal mengubah status publikasi');
    }
  };

  const filteredPages = staticPages.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.menuCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Fungsi untuk memotong teks pada akhir kata dan menambahkan "..."
  const truncateText = (text: string | null | undefined, maxLength: number): string => {
    if (!text) return '-';
    
    if (text.length <= maxLength) return text;
    
    // Potong teks
    let truncated = text.substring(0, maxLength);
    
    // Cari spasi terakhir untuk memotong pada akhir kata
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    if (lastSpaceIndex > 0) {
      truncated = truncated.substring(0, lastSpaceIndex);
    }
    
    return truncated + '...';
  };

  // Action Buttons Component
  const ActionButtons = ({ item }: { item: StaticPage }) => (
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
              <Link href={`/admin/halaman/${item.id}`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit</p>
          </TooltipContent>
        </Tooltip>

        {/* Hide/Publish Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleTogglePublish(item.id, item.published)}
              className={`h-8 w-8 sm:h-8 sm:w-8 shrink-0 ${item.published ? 'hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]' : 'hover:bg-emerald-100 hover:text-emerald-600'}`}
            >
              {item.published ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{item.published ? 'Sembunyikan' : 'Publikasikan'}</p>
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
              Manajemen Halaman Statis
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Kelola halaman statis website
            </p>
          </div>
          <Button asChild className="bg-[#1B99F4] hover:bg-[#1B99F4]/90 w-full sm:w-auto">
            <Link href="/admin/halaman/tambah" className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Halaman
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari halaman..."
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
          ) : filteredPages.length === 0 ? (
            <Card className="p-6">
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'Tidak ada halaman yang cocok' : 'Belum ada halaman statis'}
                </p>
              </div>
            </Card>
          ) : (
            filteredPages.map((item) => (
              <Card key={item.id} className="p-3 sm:p-4">
                <div className="flex gap-3">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base">{truncateText(item.title, 50)}</p>
                        <p className="text-xs text-muted-foreground mt-1">/{item.slug}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant={item.published ? 'default' : 'secondary'}
                            className={`text-xs ${item.published ? 'bg-emerald-500' : ''}`}
                          >
                            {item.published ? 'Dipublikasi' : 'Draft'}
                          </Badge>
                          {item.showInMenu && (
                            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                              Di Menu
                            </Badge>
                          )}
                          {item.parentMenu && (
                            <Badge variant="outline" className="text-xs">
                              {item.parentMenu}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Diperbarui: {formatDate(item.updatedAt)}
                        </p>
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
                  <TableHead>Judul</TableHead>
                  <TableHead className="w-[150px]">Slug</TableHead>
                  <TableHead className="w-[120px]">Menu Induk</TableHead>
                  <TableHead className="w-[100px]">Di Menu</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[130px]">Diperbarui</TableHead>
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
                ) : filteredPages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchQuery ? 'Tidak ada halaman yang cocok' : 'Belum ada halaman statis'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPages.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{truncateText(item.title, 40)}</p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">
                              {truncateText(item.description, 60)}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          /{item.slug}
                        </code>
                      </TableCell>
                      <TableCell>
                        {item.parentMenu ? (
                          <Badge variant="outline" className="capitalize">
                            {item.parentMenu}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.showInMenu ? (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            Ya
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">Tidak</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={item.published ? 'default' : 'secondary'}
                          className={item.published ? 'bg-emerald-500' : ''}
                        >
                          {item.published ? 'Dipublikasi' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(item.updatedAt)}
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
          title="Hapus Halaman Statis?"
          description="Halaman statis akan dihapus secara permanen dan tidak dapat dikembalikan."
          onConfirm={handleDelete}
        />
      </div>
    </AdminLayout>
  );
}
