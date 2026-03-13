'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Quote,
} from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/admin/DeleteConfirmationDialog';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

interface HomepageQuote {
  id: string;
  quoteText: string;
  authorName: string | null;
  authorTitle: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function KutipanAdminPage() {
  const [quotes, setQuotes] = useState<HomepageQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await fetch('/api/admin/kutipan');
      if (response.ok) {
        const data = await response.json();
        setQuotes(data);
      }
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
      toast.error('Gagal memuat data kutipan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/admin/kutipan/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setQuotes(quotes.filter((item) => item.id !== deleteId));
        toast.success('Kutipan berhasil dihapus');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Gagal menghapus kutipan');
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/kutipan/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setQuotes(
          quotes.map((item) =>
            item.id === id ? { ...item, isActive: !currentStatus } : item
          )
        );
        toast.success(currentStatus ? 'Kutipan disembunyikan' : 'Kutipan ditampilkan');
      }
    } catch (error) {
      console.error('Toggle active error:', error);
      toast.error('Gagal mengubah status kutipan');
    }
  };

  const filteredQuotes = quotes.filter(
    (item) =>
      item.quoteText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              Manajemen Kutipan
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Kelola kutipan yang ditampilkan di halaman utama
            </p>
          </div>
          <Button asChild className="bg-[#1B99F4] hover:bg-[#1B99F4]/90 w-full sm:w-auto">
            <Link href="/admin/kutipan/tambah" className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Kutipan
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari kutipan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </Card>

        {/* Table */}
        {loading ? (
          <Card className="p-6">
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4 animate-spin" />
              Memuat data...
            </div>
          </Card>
        ) : filteredQuotes.length === 0 ? (
          <Card className="p-6">
            <div className="flex flex-col items-center gap-2">
              <Quote className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchQuery ? 'Tidak ada kutipan yang cocok' : 'Belum ada kutipan'}
              </p>
            </div>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Teks Kutipan</TableHead>
                    <TableHead className="w-[20%]">Penulis</TableHead>
                    <TableHead className="w-[15%]">Status</TableHead>
                    <TableHead className="w-[15%] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotes.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">
                            &quot;{truncateText(item.quoteText, 80)}&quot;
                          </p>
                          {item.imageUrl && (
                            <p className="text-xs text-muted-foreground">📷 Ada gambar</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{truncateText(item.authorName, 25)}</p>
                          {item.authorTitle && (
                            <p className="text-xs text-muted-foreground">{truncateText(item.authorTitle, 30)}</p>
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
                                  <Link href={`/admin/kutipan/${item.id}`}>
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
                                  className={`h-8 w-8 shrink-0 ${item.isActive ? 'hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]' : 'hover:bg-emerald-100 hover:text-emerald-600'}`}
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {/* Delete Confirmation */}
        <DeleteConfirmationDialog
          open={!!deleteId}
          onOpenChange={(open) => !open && setDeleteId(null)}
          title="Hapus Kutipan?"
          description="Kutipan akan dihapus secara permanen dan tidak dapat dikembalikan."
          onConfirm={handleDelete}
        />
      </div>
    </AdminLayout>
  );
}
