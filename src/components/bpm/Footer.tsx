'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';

interface WebsiteIdentity {
  siteName: string | null;
  siteTagline: string | null;
  siteDescription: string | null;
  logoUrl: string | null;
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

const defaultIdentity: WebsiteIdentity = {
  siteName: 'BPM USNI',
  siteTagline: 'Badan Penjaminan Mutu',
  siteDescription: 'Menggenggam Mutu, Meningkatkan Daya Saing. Menjadi lembaga terkemuka dan profesional dalam memperkuat layanan pendidikan berbasis budaya mutu untuk mempercepat terwujudnya Visi USNI.',
  logoUrl: 'https://bpm.usni.ac.id/assets/logo-usni-C0MgIZ6x.png',
  contactEmail: 'bpm@usni.ac.id',
  contactPhone: '(021) 739-8393',
  contactAddress: 'Jl. Arteri Pondok Indah No.11, Kebayoran Lama, Jakarta Selatan',
  operationalHours: 'Senin - Jumat: 08.00 - 16.00 WIB',
  googleMapsUrl: null,
  facebookUrl: 'https://www.facebook.com/pages/Universitas-Satya-Negara-Indonesia-USNI/399165366801048',
  instagramUrl: 'https://www.instagram.com/usni.official',
  twitterUrl: 'https://twitter.com/usniofficial',
  youtubeUrl: 'https://www.youtube.com/channel/UClxzpWTpLIDeRtD0U8rcxhw',
  linkedinUrl: 'https://www.linkedin.com/company/universitas-satya-negara-indonesia-kampus-usni/',
  footerText: '© 2024 BPM USNI. All rights reserved.',
};

const mainMenu = [
  { name: 'Beranda', href: '/' },
  { name: 'Profil', href: '#profil' },
  { name: 'Dokumen', href: '#dokumen' },
  { name: 'Akreditasi', href: '#akreditasi' },
  { name: 'Layanan', href: '#layanan' },
  { name: 'Pusat Data', href: '#pusat-data' },
  { name: 'Hubungi Kami', href: '#kontak' },
];

const systemLinks = [
  { name: 'Website USNI', href: 'https://usni.ac.id' },
  { name: 'Portal Dosen', href: 'https://dosen.usni.ac.id' },
  { name: 'Portal Mahasiswa', href: 'https://mahasiswa.usni.ac.id' },
  { name: 'E-Learning', href: 'https://lms.usni.ac.id' },
  { name: 'Perpustakaan Digital', href: 'https://lib.usni.ac.id' },
  { name: 'Rumah Jurnal', href: 'https://jurnal.usni.ac.id' },
];

export default function Footer() {
  const [identity, setIdentity] = useState<WebsiteIdentity>(defaultIdentity);
  const currentYear = new Date().getFullYear();

  // Fetch identity from API
  useEffect(() => {
    fetch('/api/identity')
      .then((res) => res.json())
      .then((data: WebsiteIdentity | null) => {
        if (data) {
          setIdentity({ ...defaultIdentity, ...data });
        }
      })
      .catch((error) => {
        console.error('Error fetching identity:', error);
      });
  }, []);

  const socialLinks = [
    { name: 'Facebook', href: identity.facebookUrl || '#', icon: Facebook },
    { name: 'Instagram', href: identity.instagramUrl || '#', icon: Instagram },
    { name: 'Twitter', href: identity.twitterUrl || '#', icon: Twitter },
    { name: 'Youtube', href: identity.youtubeUrl || '#', icon: Youtube },
    { name: 'LinkedIn', href: identity.linkedinUrl || '#', icon: Linkedin },
  ];

  return (
    <footer id="kontak" className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              {identity.logoUrl ? (
                <img 
                  src={identity.logoUrl} 
                  alt={identity.siteName || 'BPM USNI'}
                  className="h-12 w-auto bg-white rounded-lg p-1"
                />
              ) : (
                <div className="bg-primary-foreground/20 rounded-lg p-2">
                  <span className="text-2xl font-bold">BPM</span>
                </div>
              )}
              <div>
                <h3 className="font-display font-bold text-lg">{identity.siteName || 'BPM USNI'}</h3>
                <p className="text-sm text-primary-foreground/70">
                  {identity.siteTagline || 'Badan Penjaminan Mutu'}
                </p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed mb-4">
              {identity.siteDescription || defaultIdentity.siteDescription}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.filter(link => link.href && link.href !== '#').map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-primary-foreground/10 rounded-lg hover:bg-primary-foreground/20 transition-colors"
                  title={link.name}
                >
                  <link.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Main Menu */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Menu Utama</h4>
            <ul className="space-y-3">
              {mainMenu.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-primary-foreground/80 hover:text-[#D9F3FC] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* System Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Sistem Informasi</h4>
            <ul className="space-y-3">
              {systemLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-foreground/80 hover:text-[#D9F3FC] transition-colors flex items-center gap-2"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-[#D9F3FC] flex-shrink-0" />
                <p className="text-sm text-primary-foreground/80">
                  {identity.contactAddress || defaultIdentity.contactAddress}
                </p>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#D9F3FC] flex-shrink-0" />
                <a
                  href={`tel:${identity.contactPhone?.replace(/[^0-9]/g, '') || '0217398393'}`}
                  className="text-sm text-primary-foreground/80 hover:text-[#D9F3FC] transition-colors"
                >
                  {identity.contactPhone || defaultIdentity.contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#D9F3FC] flex-shrink-0" />
                <a
                  href={`mailto:${identity.contactEmail || 'bpm@usni.ac.id'}`}
                  className="text-sm text-primary-foreground/80 hover:text-[#D9F3FC] transition-colors"
                >
                  {identity.contactEmail || defaultIdentity.contactEmail}
                </a>
              </li>
              {identity.operationalHours && (
                <li className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#D9F3FC] flex-shrink-0" />
                  <p className="text-sm text-primary-foreground/80">
                    {identity.operationalHours}
                  </p>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">
            {identity.footerText || `© ${currentYear} ${identity.siteName || 'BPM USNI'}. All rights reserved.`}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/admin/login"
              className="text-sm text-primary-foreground/60 hover:text-[#D9F3FC] transition-colors"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
