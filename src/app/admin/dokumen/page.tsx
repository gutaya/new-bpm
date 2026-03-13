'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  FileText,
  ExternalLink,
  Menu,
} from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/admin/DeleteConfirmationDialog';
import { PaginationControls } from '@/components/admin/PaginationControls';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

interface Document {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string | null;
  menuItemId: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  menuItem: {
    id: string;
    title: string;
    url: string | null;
  } | null;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function DokumenAdminPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [menuItems, setMenuItems] = useState<{id: string; title: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMenu, setFilterMenu] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [pagination.page, pagination.pageSize, filterMenu]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination(prev => ({ ...prev, page: 1 }));
      } else {
        fetchDocuments();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/admin/menu?includeAll=true');
      if (response.ok) {
        const data = await response.json();
        const dokumenParent = data.find((item: {parentId: string | null; isActive: boolean; title: string}) => 
          !item.parentId && item.isActive && item.title.toLowerCase() === 'dokumen'
        );
        
        if (dokumenParent) {
          const dokumenSubMenus = data.filter((item: {parentId: string | null; isActive: boolean}) => 
            item.parentId === dokumenParent.id && item.isActive
          );
          setMenuItems(dokumenSubMenus);
        } else {
          setMenuItems([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(pagination.page));
      params.append('pageSize', String(pagination.pageSize));
      if (searchQuery) params.append('search', searchQuery);
      if (filterMenu !== 'all') params.append('menuItemId', filterMenu);

      const response = await fetch(`/api/admin/dokumen?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.data);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      toast.error('Gagal memuat data dokumen');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/admin/dokumen/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDocuments(documents.filter((item) => item.id !== deleteId));
        setPagination(prev => ({ ...prev, total: prev.total - 1 }));
        toast.success('Dokumen berhasil dihapus');
        fetchDocuments();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Gagal menghapus dokumen');
    } finally {
      setDeleteId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    setIsBulkDeleting(true);
    try {
      const response = await fetch('/api/admin/dokumen/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (response.ok) {
        const result = await response.json();
        setSelectedIds([]);
        setShowBulkDelete(false);
        toast.success(`${result.count} dokumen berhasil dihapus`);
        fetchDocuments();
      } else {
        throw new Error('Failed to bulk delete');
      }
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('Gagal menghapus dokumen');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(documents.map((item) => item.id));
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

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/dokumen/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (response.ok) {
        setDocuments(
          documents.map((item) =>
            item.id === id ? { ...item, published: !currentStatus } : item
          )
        );
        toast.success(currentStatus ? 'Dokumen disembunyikan' : 'Dokumen dipublikasikan');
      }
    } catch (error) {
      console.error('Toggle publish error:', error);
      toast.error('Gagal mengubah status dokumen');
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    setSelectedIds([]);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination(prev => ({ ...prev, page: 1, pageSize }));
    setSelectedIds([]);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const truncateText = (text: string | null | undefined, maxLength: number): string => {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    const truncated = text.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    if (lastSpaceIndex > 0) {
      return truncated.substring(0, lastSpaceIndex) + '...';
    }
    return truncated + '...';
  };

  const ActionButtons = ({ item }: { item: Document }) => (
    <TooltipProvider>
      <div className="flex items-center justify-end gap-0.5 sm:gap-1">
        {item.fileUrl && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-8 w-8 hover:bg-[#1B99F4]/10 hover:text-[#1B99F4] shrink-0"
              >
                <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Lihat File</p></TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8 hover:bg-[#1B99F4]/10 hover:text-[#1B99F4] shrink-0"
            >
              <Link href={`/admin/dokumen/${item.id}`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Edit</p></TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleTogglePublish(item.id, item.published)}
              className={`h-8 w-8 shrink-0 ${item.published ? 'hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]' : 'hover:bg-emerald-100 hover:text-emerald-600'}`}
            >
              {item.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>{item.published ? 'Sembunyikan' : 'Publikasikan'}</p></TooltipContent>
        </Tooltip>

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
          <TooltipContent><p>Hapus</p></TooltipContent>
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
              Manajemen Dokumen
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Kelola dokumen berdasarkan sub menu
            </p>
          </div>
          <Button asChild className="bg-[#1B99F4] hover:bg-[#1B99F4]/90 w-full sm:w-auto">
            <Link href="/admin/dokumen/tambah" className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Dokumen
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari dokumen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterMenu} onValueChange={(v) => { setFilterMenu(v); setPagination(p => ({ ...p, page: 1 })); }}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Menu className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter sub menu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Sub Menu</SelectItem>
                {menuItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                onClick={() => setShowBulkDelete(true)}
                className="w-full sm:w-auto gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Hapus ({selectedIds.length})
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
          ) : documents.length === 0 ? (
            <Card className="p-6">
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchQuery || filterMenu !== 'all' ? 'Tidak ada dokumen yang cocok' : 'Belum ada dokumen'}
                </p>
              </div>
            </Card>
          ) : (
            <>
              {documents.map((item) => (
                <Card key={item.id} className="p-3 sm:p-4">
                  <div className="flex gap-3">
                    <div className="flex items-center shrink-0">
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                      />
                    </div>

                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base">{truncateText(item.title, 50)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {truncateText(item.description, 60)}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {item.menuItem ? (
                          <Badge className="bg-[#1B99F4]">
                            <Menu className="h-3 w-3 mr-1" />
                            {item.menuItem.title}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Tanpa Menu</Badge>
                        )}
                        <Badge
                          variant={item.published ? 'default' : 'secondary'}
                          className={`text-xs ${item.published ? 'bg-emerald-500' : ''}`}
                        >
                          {item.published ? 'Dipublikasi' : 'Draft'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>

                    <div className="shrink-0 self-center">
                      <ActionButtons item={item} />
                    </div>
                  </div>
                </Card>
              ))}
              
              <Card className="p-4">
                <PaginationControls
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  pageSize={pagination.pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </Card>
            </>
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
                      checked={documents.length > 0 && selectedIds.length === documents.length}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="w-[50px]">File</TableHead>
                  <TableHead>Judul Dokumen</TableHead>
                  <TableHead className="w-[180px]">Sub Menu</TableHead>
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
                ) : documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchQuery || filterMenu !== 'all' ? 'Tidak ada dokumen yang cocok' : 'Belum ada dokumen'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(item.id)}
                          onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{truncateText(item.title, 40)}</p>
                          <p className="text-sm text-muted-foreground">
                            {truncateText(item.description, 50)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.menuItem ? (
                          <Badge className="bg-[#1B99F4]">
                            <Menu className="h-3 w-3 mr-1" />
                            {item.menuItem.title}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Tanpa Menu</span>
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
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <ActionButtons item={item} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {documents.length > 0 && (
            <div className="border-t px-4 py-4">
              <PaginationControls
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.total}
                pageSize={pagination.pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          )}
        </Card>

        <DeleteConfirmationDialog
          open={!!deleteId}
          onOpenChange={(open) => !open && setDeleteId(null)}
          title="Hapus Dokumen?"
          description="Dokumen akan dihapus secara permanen dan tidak dapat dikembalikan."
          onConfirm={handleDelete}
        />

        <DeleteConfirmationDialog
          open={showBulkDelete}
          onOpenChange={(open) => !open && setShowBulkDelete(false)}
          title={`Hapus ${selectedIds.length} Dokumen?`}
          description="Dokumen yang dipilih akan dihapus secara permanen."
          onConfirm={handleBulkDelete}
          loading={isBulkDeleting}
        />
      </div>
    </AdminLayout>
  );
}
