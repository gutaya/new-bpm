'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Loader2, Eye, Target, TargetIcon } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

interface VisionMissionData {
  id: string;
  vision: string;
  mission: string;
  goals: string | null;
  updatedAt: string;
}

export default function VisiMisiAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    vision: '',
    mission: '',
    goals: '',
  });

  useEffect(() => {
    fetchVisionMission();
  }, []);

  const fetchVisionMission = async () => {
    try {
      const response = await fetch('/api/admin/visi-misi');
      if (response.ok) {
        const data: VisionMissionData = await response.json();
        setFormData({
          vision: data.vision || '',
          mission: data.mission || '',
          goals: data.goals || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch vision & mission:', error);
      toast.error('Gagal memuat data visi & misi');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.vision.trim() || !formData.mission.trim()) {
      toast.error('Visi dan Misi wajib diisi');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/admin/visi-misi', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vision: formData.vision,
          mission: formData.mission,
          goals: formData.goals || null,
        }),
      });

      if (response.ok) {
        toast.success('Visi & Misi berhasil disimpan');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Gagal menyimpan visi & misi');
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
              Visi & Misi
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Kelola visi dan misi institusi
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
            {/* Vision */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5 text-[#1B99F4]" />
                  Visi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="vision">
                    Visi Institusi <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="vision"
                    placeholder="Masukkan visi institusi..."
                    value={formData.vision}
                    onChange={(e) =>
                      setFormData({ ...formData, vision: e.target.value })
                    }
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Visi adalah gambaran tentang masa depan yang diinginkan dan akan
                    dicapai oleh institusi.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Mission */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#1B99F4]" />
                  Misi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="mission">
                    Misi Institusi <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="mission"
                    placeholder="Masukkan misi institusi..."
                    value={formData.mission}
                    onChange={(e) =>
                      setFormData({ ...formData, mission: e.target.value })
                    }
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Misi adalah pernyataan tentang apa yang harus dilakukan untuk
                    mencapai visi. Gunakan penomoran untuk setiap poin misi.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Goals */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TargetIcon className="h-5 w-5 text-[#1B99F4]" />
                  Tujuan (Opsional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="goals">Tujuan Institusi</Label>
                  <Textarea
                    id="goals"
                    placeholder="Masukkan tujuan institusi (opsional)..."
                    value={formData.goals}
                    onChange={(e) =>
                      setFormData({ ...formData, goals: e.target.value })
                    }
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Tujuan adalah sasaran-sasaran yang ingin dicapai dalam jangka
                    menengah atau panjang.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
