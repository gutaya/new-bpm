'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Database,
  Download,
  Upload,
  HardDrive,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  FileJson,
  Trash2,
  RefreshCw,
  Info,
  Shield,
  Archive,
} from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { cn } from '@/lib/utils';

interface BackupInfo {
  filename: string;
  size: string;
  createdAt: string;
  tables: number;
  records: number;
}

export default function BackupRestorePage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [backupInfo, setBackupInfo] = useState<BackupInfo | null>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/backup-restore/backup', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal membuat backup');
      }

      const data = await response.json();
      
      // Set backup info
      setBackupInfo({
        filename: data.filename,
        size: data.size,
        createdAt: new Date().toISOString(),
        tables: data.tables,
        records: data.records,
      });

      // Download the file
      const blob = await fetch(`/api/admin/backup-restore/download?file=${data.filename}`).then(r => r.blob());
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Backup database berhasil dibuat dan diunduh');
    } catch (error) {
      console.error('Backup error:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal membuat backup database');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.endsWith('.json') && !file.name.endsWith('.sql')) {
        toast.error('File harus berformat .json atau .sql');
        return;
      }
      setSelectedFile(file);
      setRestoreDialogOpen(true);
    }
    e.target.value = '';
  };

  const handleRestore = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/admin/backup-restore/restore', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal restore database');
      }

      toast.success(`Database berhasil di-restore. ${data.tables} tabel, ${data.records} record dipulihkan.`);
      setRestoreDialogOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Restore error:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal restore database');
    } finally {
      setUploading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Database className="h-6 w-6" />
              Backup & Restore Database
            </h1>
            <p className="text-muted-foreground mt-1">
              Kelola backup dan restore database website
            </p>
          </div>
        </div>

        {/* Alert Warning */}
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 dark:text-amber-200">Perhatian</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            Proses restore akan mengganti seluruh data yang ada. Pastikan Anda telah membuat backup sebelum melakukan restore.
          </AlertDescription>
        </Alert>

        {/* Main Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Backup Card */}
          <Card className="border-2 border-transparent hover:border-[#1B99F4]/30 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-[#1B99F4]/10">
                  <Download className="h-6 w-6 text-[#1B99F4]" />
                </div>
                <div>
                  <CardTitle className="text-lg">Backup Database</CardTitle>
                  <CardDescription>
                    Unduh salinan database dalam format JSON
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Archive className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Format Backup</p>
                    <p className="text-muted-foreground">
                      File backup dalam format JSON yang berisi semua data tabel
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Keamanan Data</p>
                    <p className="text-muted-foreground">
                      Data sensitif seperti password tetap terenkripsi
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleBackup}
                disabled={loading}
                className="w-full bg-[#1B99F4] hover:bg-[#1B99F4]/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Membuat Backup...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Buat Backup & Download
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Restore Card */}
          <Card className="border-2 border-transparent hover:border-orange-400/30 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <Upload className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Restore Database</CardTitle>
                  <CardDescription>
                    Pulihkan database dari file backup
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <FileJson className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Format File</p>
                    <p className="text-muted-foreground">
                      Upload file backup dengan format .json
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10">
                  <Trash2 className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-destructive">Peringatan</p>
                    <p className="text-muted-foreground">
                      Data yang ada akan dihapus dan diganti dengan data backup
                    </p>
                  </div>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.sql"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full border-orange-400 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Memulihkan...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload & Restore
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Backup Info Card */}
        {backupInfo && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg text-green-800 dark:text-green-200">
                  Backup Terakhir
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Nama File</p>
                  <p className="font-medium">{backupInfo.filename}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Ukuran</p>
                  <p className="font-medium">{backupInfo.size}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Jumlah Tabel</p>
                  <p className="font-medium">{backupInfo.tables} tabel</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Record</p>
                  <p className="font-medium">{backupInfo.records} record</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Informasi</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Backup Database</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Backup mencakup semua data dari database</li>
                    <li>• Format file mudah dibaca (JSON)</li>
                    <li>• Dapat digunakan untuk migrasi server</li>
                    <li>• Disarankan backup secara berkala</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Restore Database</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Upload file backup (.json)</li>
                    <li>• Data lama akan dihapus</li>
                    <li>• Proses tidak dapat dibatalkan</li>
                    <li>• Pastikan file backup valid</li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Tabel yang di-backup:</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    'users', 'news', 'announcements', 'gallery_images', 'albums',
                    'documents', 'menu_items', 'slideshows', 'accreditations',
                    'accreditation_data', 'website_identity', 'vision_mission',
                    'quick_links', 'homepage_quotes', 'messages', 'faculties',
                    'study_programs', 'static_pages', 'settings'
                  ].map((table) => (
                    <Badge key={table} variant="outline" className="text-xs">
                      {table}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Restore Confirmation Dialog */}
      <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Konfirmasi Restore Database
            </DialogTitle>
            <DialogDescription>
              Anda yakin ingin memulihkan database dari file ini?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertTitle>Peringatan!</AlertTitle>
              <AlertDescription>
                Semua data yang ada saat ini akan dihapus dan diganti dengan data dari file backup.
                Proses ini tidak dapat dibatalkan.
              </AlertDescription>
            </Alert>

            {selectedFile && (
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm font-medium">File yang dipilih:</p>
                <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  Ukuran: {formatBytes(selectedFile.size)}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setRestoreDialogOpen(false);
                setSelectedFile(null);
              }}
              disabled={uploading}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleRestore}
              disabled={uploading}
              className="w-full sm:w-auto"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Memulihkan...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Ya, Restore Database
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
