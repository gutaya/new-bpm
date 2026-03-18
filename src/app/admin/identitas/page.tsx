'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Save,
  Loader2,
  ImagePlus,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

interface WebsiteIdentity {
  id: string;
  siteName: string | null;
  siteTagline: string | null;
  siteDescription: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  contactAddress: string | null;
  operationalHours: string | null;
  googleMapsUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  youtubeUrl: string | null;
  linkedinUrl: string | null;
  footerText: string | null;
}

export default function IdentitasAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    siteName: '',
    siteTagline: '',
    siteDescription: '',
    logoUrl: '',
    faviconUrl: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    operationalHours: '',
    googleMapsUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    youtubeUrl: '',
    linkedinUrl: '',
    footerText: '',
  });

  useEffect(() => {
    fetchIdentity();
  }, []);

  const fetchIdentity = async () => {
    try {
      const response = await fetch('/api/admin/identitas');
      if (response.ok) {
        const data: WebsiteIdentity = await response.json();
        setFormData({
          siteName: data.siteName || '',
          siteTagline: data.siteTagline || '',
          siteDescription: data.siteDescription || '',
          logoUrl: data.logoUrl || '',
          faviconUrl: data.faviconUrl || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          contactAddress: data.contactAddress || '',
          operationalHours: data.operationalHours || '',
          googleMapsUrl: data.googleMapsUrl || '',
          facebookUrl: data.facebookUrl || '',
          instagramUrl: data.instagramUrl || '',
          twitterUrl: data.twitterUrl || '',
          youtubeUrl: data.youtubeUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          footerText: data.footerText || '',
        });
      }
    } catch (error) {
      console.error('Error fetching identity:', error);
      toast.error('Gagal memuat data identitas website');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (
    file: File,
    field: 'logoUrl' | 'faviconUrl',
    setUploading: (value: boolean) => void
  ) => {
    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await response.json();

      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, [field]: data.url }));
        toast.success('Gambar berhasil diunggah');
      } else {
        toast.error(data.error || 'Gagal mengunggah gambar');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Gagal mengunggah gambar');
    } finally {
      setUploading(false);
    }
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, 'logoUrl', setUploadingLogo);
    }
    e.target.value = '';
  };

  const handleFaviconSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, 'faviconUrl', setUploadingFavicon);
    }
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);

    try {
      const response = await fetch('/api/admin/identitas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Identitas website berhasil diperbarui');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Gagal menyimpan identitas website');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Memuat data...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            Identitas Website
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Kelola informasi dasar dan identitas website
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Site Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Informasi Situs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Site Name */}
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nama Situs</Label>
                  <Input
                    id="siteName"
                    value={formData.siteName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, siteName: e.target.value }))
                    }
                    placeholder="Nama website"
                  />
                </div>

                {/* Site Tagline */}
                <div className="space-y-2">
                  <Label htmlFor="siteTagline">Tagline</Label>
                  <Input
                    id="siteTagline"
                    value={formData.siteTagline}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, siteTagline: e.target.value }))
                    }
                    placeholder="Slogan/tagline website"
                  />
                </div>
              </div>

              {/* Site Description */}
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Deskripsi Singkat</Label>
                <Textarea
                  id="siteDescription"
                  value={formData.siteDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, siteDescription: e.target.value }))
                  }
                  placeholder="Deskripsi singkat tentang website/organisasi yang ditampilkan di footer"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Deskripsi ini akan ditampilkan di bagian footer website
                </p>
              </div>

              {/* Logo URL */}
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo</Label>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                  onChange={handleLogoSelect}
                  className="hidden"
                />
                <div className="flex gap-2">
                  <Input
                    id="logoUrl"
                    value={formData.logoUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, logoUrl: e.target.value }))
                    }
                    placeholder="https://example.com/logo.png"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                    title="Upload logo"
                  >
                    {uploadingLogo ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImagePlus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {formData.logoUrl && (
                  <div className="mt-2 p-4 bg-muted/50 rounded-lg inline-flex items-center gap-3">
                    <img
                      src={formData.logoUrl}
                      alt="Logo Preview"
                      className="h-12 object-contain"
                    />
                    <span className="text-xs text-muted-foreground">Preview Logo</span>
                  </div>
                )}
              </div>

              {/* Favicon URL */}
              <div className="space-y-2">
                <Label htmlFor="faviconUrl">Favicon</Label>
                <input
                  ref={faviconInputRef}
                  type="file"
                  accept="image/x-icon,image/png,image/svg+xml"
                  onChange={handleFaviconSelect}
                  className="hidden"
                />
                <div className="flex gap-2">
                  <Input
                    id="faviconUrl"
                    value={formData.faviconUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, faviconUrl: e.target.value }))
                    }
                    placeholder="https://example.com/favicon.ico"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => faviconInputRef.current?.click()}
                    disabled={uploadingFavicon}
                    title="Upload favicon"
                  >
                    {uploadingFavicon ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImagePlus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ukuran ideal: 32x32 atau 16x16 pixel (ICO, PNG, atau SVG)
                </p>
                {formData.faviconUrl && (
                  <div className="mt-2 p-2 bg-muted/50 rounded-lg inline-flex items-center gap-3">
                    <img
                      src={formData.faviconUrl}
                      alt="Favicon Preview"
                      className="h-6 w-6 object-contain"
                    />
                    <span className="text-xs text-muted-foreground">Preview Favicon</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Informasi Kontak
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact Email */}
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))
                      }
                      placeholder="email@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Contact Phone */}
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Telepon</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))
                      }
                      placeholder="+62 xxx xxxx xxxx"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Address */}
              <div className="space-y-2">
                <Label htmlFor="contactAddress">Alamat</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="contactAddress"
                    value={formData.contactAddress}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, contactAddress: e.target.value }))
                    }
                    placeholder="Alamat lengkap"
                    rows={3}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Operational Hours */}
              <div className="space-y-2">
                <Label htmlFor="operationalHours">Jam Operasional</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="operationalHours"
                    value={formData.operationalHours}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, operationalHours: e.target.value }))
                    }
                    placeholder="Senin - Jumat: 08.00 - 16.00 WIB"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Google Maps URL */}
              <div className="space-y-2">
                <Label htmlFor="googleMapsUrl">Google Maps Embed URL</Label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="googleMapsUrl"
                    value={formData.googleMapsUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, googleMapsUrl: e.target.value }))
                    }
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Masukkan URL embed dari Google Maps (bukan link biasa)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Media Sosial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Facebook */}
                <div className="space-y-2">
                  <Label htmlFor="facebookUrl" className="flex items-center gap-2">
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Label>
                  <Input
                    id="facebookUrl"
                    value={formData.facebookUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, facebookUrl: e.target.value }))
                    }
                    placeholder="https://facebook.com/username"
                  />
                </div>

                {/* Instagram */}
                <div className="space-y-2">
                  <Label htmlFor="instagramUrl" className="flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </Label>
                  <Input
                    id="instagramUrl"
                    value={formData.instagramUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, instagramUrl: e.target.value }))
                    }
                    placeholder="https://instagram.com/username"
                  />
                </div>

                {/* Twitter */}
                <div className="space-y-2">
                  <Label htmlFor="twitterUrl" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter / X
                  </Label>
                  <Input
                    id="twitterUrl"
                    value={formData.twitterUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, twitterUrl: e.target.value }))
                    }
                    placeholder="https://twitter.com/username"
                  />
                </div>

                {/* YouTube */}
                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl" className="flex items-center gap-2">
                    <Youtube className="h-4 w-4" />
                    YouTube
                  </Label>
                  <Input
                    id="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, youtubeUrl: e.target.value }))
                    }
                    placeholder="https://youtube.com/@channel"
                  />
                </div>

                {/* LinkedIn */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="linkedinUrl" className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, linkedinUrl: e.target.value }))
                    }
                    placeholder="https://linkedin.com/company/name"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Teks Footer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="footerText">Teks Footer</Label>
                <Textarea
                  id="footerText"
                  value={formData.footerText}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, footerText: e.target.value }))
                  }
                  placeholder="© 2024 Website Resmi. All rights reserved."
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  Teks yang ditampilkan di bagian bawah website
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={saving} className="bg-[#1B99F4] hover:bg-[#1B99F4]/90">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
