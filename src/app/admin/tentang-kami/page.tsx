'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { WysiwygEditor } from '@/components/admin/WysiwygEditor';

interface AboutUsData {
  id: string;
  content: string;
  updatedAt: string;
}

export default function TentangKamiAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      const response = await fetch('/api/admin/tentang-kami');
      if (response.ok) {
        const data: AboutUsData = await response.json();
        setContent(data.content || '');
      }
    } catch (error) {
      console.error('Failed to fetch about us:', error);
      toast.error('Gagal memuat data tentang kami');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Konten wajib diisi');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/admin/tentang-kami', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        toast.success('Tentang Kami berhasil disimpan');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Gagal menyimpan tentang kami');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              Tentang Kami
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Kelola konten halaman Tentang Kami
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-[#1B99F4] hover:bg-[#1B99F4]/90 w-full sm:w-auto"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Simpan
              </>
            )}
          </Button>
        </div>

        {loading ? (
          <Card className="p-6">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Memuat data...
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Info Card */}
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-[#1B99F4] shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p>
                      Halaman ini digunakan untuk mengelola konten yang ditampilkan
                      pada halaman Tentang Kami publik. Gunakan editor di bawah untuk
                      menulis informasi tentang institusi Anda.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Konten Tentang Kami</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>
                    Konten <span className="text-destructive">*</span>
                  </Label>
                  <WysiwygEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Tulis konten tentang kami di sini..."
                    className="min-h-[400px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
