'use client';

import { useState, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Search,
  Eye,
  Trash2,
  Mail,
  Clock,
  CheckCircle2,
  User,
  Calendar,
  FileText,
  Reply,
} from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/admin/DeleteConfirmationDialog';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export default function PesanAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'read' | 'unread'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/pesan');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Gagal memuat data pesan');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/pesan/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        setMessages(
          messages.map((item) =>
            item.id === id ? { ...item, isRead: true } : item
          )
        );
        toast.success('Pesan ditandai sudah dibaca');
      }
    } catch (error) {
      console.error('Mark as read error:', error);
      toast.error('Gagal mengubah status pesan');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/admin/pesan/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(messages.filter((item) => item.id !== deleteId));
        toast.success('Pesan berhasil dihapus');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Gagal menghapus pesan');
    } finally {
      setDeleteId(null);
    }
  };

  const filteredMessages = messages.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'read' && item.isRead) ||
      (filterStatus === 'unread' && !item.isRead);
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Generate mailto link for reply
  const getMailtoLink = (message: ContactMessage) => {
    const subject = message.subject 
      ? `Re: ${message.subject}` 
      : 'Balasan Pesan Anda';
    const body = encodeURIComponent(`\n\n---\nPesan Asli dari ${message.name}:\n${message.message}`);
    return `mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              Manajemen Pesan
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Kelola pesan dari pengunjung website
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge variant="default" className="bg-emerald-500 w-fit">
              {unreadCount} pesan belum dibaca
            </Badge>
          )}
        </div>

        {/* Filters */}
        <Card className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pesan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
                className={filterStatus === 'all' ? 'bg-[#1B99F4] hover:bg-[#1B99F4]/90' : ''}
              >
                Semua
              </Button>
              <Button
                variant={filterStatus === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('unread')}
                className={filterStatus === 'unread' ? 'bg-[#1B99F4] hover:bg-[#1B99F4]/90' : ''}
              >
                Belum Dibaca
              </Button>
              <Button
                variant={filterStatus === 'read' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('read')}
                className={filterStatus === 'read' ? 'bg-[#1B99F4] hover:bg-[#1B99F4]/90' : ''}
              >
                Sudah Dibaca
              </Button>
            </div>
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
        ) : filteredMessages.length === 0 ? (
          <Card className="p-6">
            <div className="flex flex-col items-center gap-2">
              <Mail className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchQuery || filterStatus !== 'all' ? 'Tidak ada pesan yang cocok' : 'Belum ada pesan'}
              </p>
            </div>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px] text-center">No</TableHead>
                    <TableHead className="min-w-[150px]">Pengirim</TableHead>
                    <TableHead className="min-w-[150px]">Email</TableHead>
                    <TableHead className="min-w-[150px] max-w-xs">Subjek</TableHead>
                    <TableHead className="w-[100px] text-center">Status</TableHead>
                    <TableHead className="w-[160px]">Tanggal</TableHead>
                    <TableHead className="w-[130px] text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((item, index) => (
                    <TableRow 
                      key={item.id} 
                      className={`hover:bg-muted/50 ${!item.isRead ? 'bg-primary/5' : ''}`}
                    >
                      <TableCell className="text-center font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {!item.isRead && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                          <span className={`line-clamp-1 ${!item.isRead ? 'font-semibold' : ''}`}>
                            {item.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground line-clamp-1">
                          {item.email}
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className={`line-clamp-1 ${!item.isRead ? 'font-medium' : ''}`}>
                          {item.subject || '-'}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={item.isRead ? 'secondary' : 'default'}
                          className={`text-xs ${item.isRead ? '' : 'bg-emerald-500'}`}
                        >
                          {item.isRead ? 'Dibaca' : 'Baru'}
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
                            {/* View Button */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedMessage(item);
                                    if (!item.isRead) {
                                      handleMarkAsRead(item.id);
                                    }
                                  }}
                                  className="h-8 w-8 hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Lihat</p>
                              </TooltipContent>
                            </Tooltip>

                            {/* Reply Button */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  className="h-8 w-8 hover:bg-emerald-100 hover:text-emerald-600"
                                >
                                  <a href={getMailtoLink(item)}>
                                    <Reply className="h-4 w-4" />
                                  </a>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Balas</p>
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
              {filteredMessages.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`p-4 space-y-3 ${!item.isRead ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.isRead ? 'bg-muted' : 'bg-primary/10'}`}>
                      <Mail className={`h-5 w-5 ${item.isRead ? 'text-muted-foreground' : 'text-primary'}`} />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {!item.isRead && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                          <p className={`line-clamp-1 ${!item.isRead ? 'font-semibold' : 'font-medium'}`}>
                            {item.name}
                          </p>
                        </div>
                        <Badge
                          variant={item.isRead ? 'secondary' : 'default'}
                          className={`text-xs flex-shrink-0 ${item.isRead ? '' : 'bg-emerald-500'}`}
                        >
                          {item.isRead ? 'Dibaca' : 'Baru'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {item.email}
                      </p>
                      {item.subject && (
                        <p className={`text-sm line-clamp-1 ${!item.isRead ? 'font-medium' : ''}`}>
                          {item.subject}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1 pt-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedMessage(item);
                        if (!item.isRead) {
                          handleMarkAsRead(item.id);
                        }
                      }}
                      className="h-8 w-8 hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8 hover:bg-emerald-100 hover:text-emerald-600"
                    >
                      <a href={getMailtoLink(item)}>
                        <Reply className="h-4 w-4" />
                      </a>
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

        {/* Message Detail Dialog */}
        <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Detail Pesan
              </DialogTitle>
              <DialogDescription>
                Informasi lengkap pesan dari pengunjung
              </DialogDescription>
            </DialogHeader>
            {selectedMessage && (
              <div className="space-y-4 mt-4">
                {/* Sender Info */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{selectedMessage.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                  </div>
                </div>

                {/* Subject */}
                {selectedMessage.subject && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Subjek
                    </div>
                    <p className="font-medium">{selectedMessage.subject}</p>
                  </div>
                )}

                {/* Message */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    Pesan
                  </div>
                  <p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-lg">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Date & Status */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDate(selectedMessage.createdAt)}
                  </div>
                  <Badge
                    variant={selectedMessage.isRead ? 'secondary' : 'default'}
                    className={selectedMessage.isRead ? '' : 'bg-emerald-500'}
                  >
                    {selectedMessage.isRead ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Sudah Dibaca
                      </>
                    ) : (
                      'Pesan Baru'
                    )}
                  </Badge>
                </div>

                {/* Reply Button */}
                <div className="flex justify-end pt-2">
                  <Button
                    asChild
                    className="bg-emerald-500 hover:bg-emerald-600"
                  >
                    <a href={getMailtoLink(selectedMessage)} className="gap-2">
                      <Reply className="h-4 w-4" />
                      Balas Pesan
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <DeleteConfirmationDialog
          open={!!deleteId}
          onOpenChange={(open) => !open && setDeleteId(null)}
          title="Hapus Pesan?"
          description="Pesan akan dihapus secara permanen dan tidak dapat dikembalikan."
          onConfirm={handleDelete}
        />
      </div>
    </AdminLayout>
  );
}
