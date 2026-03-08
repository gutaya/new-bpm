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
  GraduationCap,
} from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/admin/DeleteConfirmationDialog';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

interface Faculty {
  id: string;
  name: string;
  code: string | null;
}

interface StudyProgram {
  id: string;
  name: string;
  code: string | null;
  facultyId: string | null;
  degreeLevel: string | null;
  description: string | null;
  headName: string | null;
  accreditationStatus: string | null;
  accreditationBody: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  faculty: Faculty | null;
}

const degreeLevelLabels: Record<string, string> = {
  d3: 'D3',
  s1: 'S1',
  s2: 'S2',
  s3: 'S3',
};

export default function ProdiAdminPage() {
  const [studyPrograms, setStudyPrograms] = useState<StudyProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    fetchStudyPrograms();
  }, []);

  const fetchStudyPrograms = async () => {
    try {
      const response = await fetch('/api/admin/prodi');
      if (response.ok) {
        const data = await response.json();
        setStudyPrograms(data);
      }
    } catch (error) {
      console.error('Failed to fetch study programs:', error);
      toast.error('Gagal memuat data program studi');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/admin/prodi/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setStudyPrograms(studyPrograms.filter((item) => item.id !== deleteId));
        setSelectedIds(selectedIds.filter((id) => id !== deleteId));
        toast.success('Program studi berhasil dihapus');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Gagal menghapus program studi');
    } finally {
      setDeleteId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    setIsBulkDeleting(true);
    try {
      const response = await fetch('/api/admin/prodi/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (response.ok) {
        const result = await response.json();
        setStudyPrograms(studyPrograms.filter((item) => !selectedIds.includes(item.id)));
        setSelectedIds([]);
        toast.success(`${result.count} program studi berhasil dihapus`);
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('Gagal menghapus program studi');
    } finally {
      setIsBulkDeleting(false);
      setShowBulkDelete(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredStudyPrograms.map((item) => item.id));
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
      const response = await fetch(`/api/admin/prodi/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setStudyPrograms(
          studyPrograms.map((item) =>
            item.id === id ? { ...item, isActive: !currentStatus } : item
          )
        );
        toast.success(currentStatus ? 'Program studi dinonaktifkan' : 'Program studi diaktifkan');
      }
    } catch (error) {
      console.error('Toggle active error:', error);
      toast.error('Gagal mengubah status program studi');
    }
  };

  const filteredStudyPrograms = studyPrograms.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.code?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (item.faculty?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const isAllSelected = filteredStudyPrograms.length > 0 && selectedIds.length === filteredStudyPrograms.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < filteredStudyPrograms.length;

  // Action Buttons Component
  const ActionButtons = ({ item }: { item: StudyProgram }) => (
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
              <Link href={`/admin/prodi/${item.id}`}>
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
              Manajemen Program Studi
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Kelola data program studi universitas
            </p>
          </div>
          <Button asChild className="bg-[#1B99F4] hover:bg-[#1B99F4]/90 w-full sm:w-auto">
            <Link href="/admin/prodi/tambah" className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Program Studi
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari program studi..."
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
          ) : filteredStudyPrograms.length === 0 ? (
            <Card className="p-6">
              <div className="flex flex-col items-center gap-2">
                <GraduationCap className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'Tidak ada program studi yang cocok' : 'Belum ada program studi'}
                </p>
              </div>
            </Card>
          ) : (
            filteredStudyPrograms.map((item) => (
              <Card key={item.id} className="p-3 sm:p-4">
                <div className="flex gap-3">
                  {/* Checkbox */}
                  <div className="flex items-center shrink-0">
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                    />
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0">
                    <GraduationCap className="h-6 w-6 text-muted-foreground" />
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
                          <Badge variant="secondary" className="text-xs">
                            {degreeLevelLabels[item.degreeLevel || 's1']}
                          </Badge>
                          <Badge
                            variant={item.isActive ? 'default' : 'secondary'}
                            className={`text-xs ${item.isActive ? 'bg-emerald-500' : ''}`}
                          >
                            {item.isActive ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                        </div>
                        {item.faculty && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.faculty.name}
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
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) {
                          (el as HTMLButtonElement & { indeterminate: boolean }).indeterminate = isIndeterminate;
                        }
                      }}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Nama Program Studi</TableHead>
                  <TableHead className="w-[100px]">Kode</TableHead>
                  <TableHead className="w-[180px]">Fakultas</TableHead>
                  <TableHead className="w-[80px]">Jenjang</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
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
                ) : filteredStudyPrograms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <GraduationCap className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchQuery ? 'Tidak ada program studi yang cocok' : 'Belum ada program studi'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudyPrograms.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(item.id)}
                          onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium line-clamp-1">{item.name}</p>
                          {item.headName && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              Ketua: {item.headName}
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
                        {item.faculty ? (
                          <span className="line-clamp-1">{item.faculty.name}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {degreeLevelLabels[item.degreeLevel || 's1']}
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
          title="Hapus Program Studi?"
          description="Program studi akan dihapus secara permanen dan tidak dapat dikembalikan."
          onConfirm={handleDelete}
        />

        {/* Bulk Delete Confirmation */}
        <DeleteConfirmationDialog
          open={showBulkDelete}
          onOpenChange={(open) => !open && setShowBulkDelete(false)}
          title={`Hapus ${selectedIds.length} Program Studi?`}
          description={`${selectedIds.length} program studi akan dihapus secara permanen dan tidak dapat dikembalikan.`}
          onConfirm={handleBulkDelete}
          loading={isBulkDeleting}
        />
      </div>
    </AdminLayout>
  );
}
