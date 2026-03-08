'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/bpm/Header';
import Footer from '@/components/bpm/Footer';
import ScrollToTop from '@/components/bpm/ScrollToTop';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Send,
  Loader2,
  CheckCircle
} from 'lucide-react';

export default function HubungiKamiPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        // Reset success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        alert(result.error || 'Gagal mengirim pesan. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-[7.5rem]">
        {/* Hero Banner */}
        <section className="bg-primary text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-6 flex-wrap">
              <Link className="hover:text-[#D9F3FC] transition-colors" href="/">
                Beranda
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-primary-foreground">Hubungi Kami</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              Hubungi Kami
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-3xl">
              Jangan ragu untuk menghubungi kami jika Anda memiliki pertanyaan atau membutuhkan informasi lebih lanjut
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Contact Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Contact Information Card */}
                <Card className="bg-card border border-border">
                  <div className="p-6 border-b border-border">
                    <h3 className="text-xl font-semibold text-foreground">Informasi Kontak</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Alamat */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Alamat</h4>
                        <p className="text-sm text-muted-foreground">
                          Jl. Arteri Pondok Indah No.11, Kebayoran Lama, Jakarta Selatan
                        </p>
                      </div>
                    </div>

                    {/* Telepon */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Telepon</h4>
                        <p className="text-sm text-muted-foreground">(021) - 739 8393</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Email</h4>
                        <p className="text-sm text-muted-foreground">bpm@usni.ac.id</p>
                      </div>
                    </div>

                    {/* Jam Operasional */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Jam Operasional</h4>
                        <p className="text-sm text-muted-foreground">Senin - Jumat: 08.00 - 17.00 WIB</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Google Maps Card */}
                <Card className="bg-card border border-border overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <h3 className="text-xl font-semibold text-foreground">Lokasi Kami</h3>
                  </div>
                  <div className="p-0">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1661769586467!2d106.782867!3d-6.241817999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f117796d80a1%3A0x4c3c904bd5138a15!2sUniversitas%20Satya%20Negara%20Indonesia!5e0!3m2!1sid!2sid!4v1770195569845!5m2!1sid!2sid"
                      width="100%"
                      height="250"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Lokasi Universitas Satya Negara Indonesia"
                      className="w-full"
                    />
                  </div>
                </Card>
              </div>

              {/* Right Column - Contact Form */}
              <div className="lg:col-span-2">
                <Card className="bg-card border border-border">
                  <div className="p-6 border-b border-border">
                    <h3 className="text-xl font-semibold text-foreground">Kirim Pesan</h3>
                  </div>
                  <div className="p-6">
                    {isSubmitted ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-foreground mb-2">Pesan Terkirim!</h4>
                        <p className="text-muted-foreground">
                          Terima kasih telah menghubungi kami. Kami akan segera merespons pesan Anda.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name and Email */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                              id="name"
                              name="name"
                              placeholder="Masukkan nama lengkap"
                              value={formData.name}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="Masukkan email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        {/* Phone and Subject */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Nomor Telepon (Opsional)</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              placeholder="Masukkan nomor telepon"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="subject">Subjek</Label>
                            <Input
                              id="subject"
                              name="subject"
                              placeholder="Masukkan subjek pesan"
                              value={formData.subject}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                          <Label htmlFor="message">Pesan</Label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder="Tulis pesan Anda di sini..."
                            value={formData.message}
                            onChange={handleChange}
                            className="min-h-[150px] resize-none"
                            required
                          />
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Mengirim...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Kirim Pesan
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
