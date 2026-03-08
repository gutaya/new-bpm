'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Menu,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  hasDropdown?: boolean;
  subMenu?: { name: string; href: string }[];
}

interface MenuItem {
  id: string;
  title: string;
  url: string | null;
  icon: string | null;
  parentId: string | null;
  orderIndex: number;
  isActive: boolean;
  children?: MenuItem[];
}

// Default navigation with complete submenus
const defaultNavigation: NavItem[] = [
  { name: 'Beranda', href: '/' },
  {
    name: 'Profil',
    href: '#profil',
    hasDropdown: true,
    subMenu: [
      { name: 'Tentang Kami', href: '/tentang-kami' },
      { name: 'Visi dan Misi', href: '/visi-misi' },
      { name: 'Struktur Organisasi', href: '/struktur-organisasi' },
    ]
  },
  {
    name: 'Dokumen',
    href: '/dokumen',
    hasDropdown: true,
    subMenu: [
      { name: 'Dokumen Publik', href: '/dokumen/publik' },
      { name: 'Dokumen Universitas', href: '/dokumen/universitas' },
      { name: 'Dokumen Akreditasi', href: '/dokumen/akreditasi' },
      { name: 'Dokumen Eksternal', href: '/dokumen/eksternal' },
      { name: 'Dokumen BPM', href: '/dokumen/bpm' },
      { name: 'Dokumen SPMI', href: '/dokumen/spmi' },
      { name: 'Dokumen SOP', href: '/dokumen/sop' },
      { name: 'SK Rektor', href: '/dokumen/sk-rektor' },
    ]
  },
  {
    name: 'Akreditasi',
    href: '/akreditasi',
    hasDropdown: true,
    subMenu: [
      { name: 'Akreditasi Nasional', href: '/akreditasi/nasional' },
      { name: 'Akreditasi Internasional', href: '/akreditasi/internasional' },
      { name: 'Akreditasi Institusi', href: '/akreditasi/institusi' },
    ]
  },
  {
    name: 'Layanan',
    href: '/layanan',
    hasDropdown: true,
    subMenu: [
      { name: 'Audit Mutu Internal (AMI)', href: '/layanan/ami' },
      { name: 'Survey', href: '/layanan/survey' },
      { name: 'Hibah', href: '/layanan/hibah' },
      { name: 'PEKERTI/AA', href: '/layanan/pekerti-aa' },
    ]
  },
  { name: 'Pusat Data', href: '/pusat-data' },
  { name: 'Galeri', href: '/galeri' },
  { name: 'Hubungi Kami', href: '/hubungi-kami' },
];

// Default submenus for each menu name
const defaultSubmenus: Record<string, { name: string; href: string }[]> = {
  'Profil': [
    { name: 'Tentang Kami', href: '/tentang-kami' },
    { name: 'Visi dan Misi', href: '/visi-misi' },
    { name: 'Struktur Organisasi', href: '/struktur-organisasi' },
  ],
  'Dokumen': [
    { name: 'Dokumen Publik', href: '/dokumen/publik' },
    { name: 'Dokumen Universitas', href: '/dokumen/universitas' },
    { name: 'Dokumen Akreditasi', href: '/dokumen/akreditasi' },
    { name: 'Dokumen Eksternal', href: '/dokumen/eksternal' },
    { name: 'Dokumen BPM', href: '/dokumen/bpm' },
    { name: 'Dokumen SPMI', href: '/dokumen/spmi' },
    { name: 'Dokumen SOP', href: '/dokumen/sop' },
    { name: 'SK Rektor', href: '/dokumen/sk-rektor' },
  ],
  'Akreditasi': [
    { name: 'Akreditasi Nasional', href: '/akreditasi/nasional' },
    { name: 'Akreditasi Internasional', href: '/akreditasi/internasional' },
    { name: 'Akreditasi Institusi', href: '/akreditasi/institusi' },
  ],
  'Layanan': [
    { name: 'Audit Mutu Internal (AMI)', href: '/layanan/ami' },
    { name: 'Survey', href: '/layanan/survey' },
    { name: 'Hibah', href: '/layanan/hibah' },
    { name: 'PEKERTI/AA', href: '/layanan/pekerti-aa' },
  ],
};

const topBarLinks = [
  { name: 'Perpustakaan', href: 'https://lib.usni.ac.id/' },
  { name: 'E-Learning', href: 'https://lms.usni.ac.id/' },
  { name: 'PMB', href: 'https://usni.ac.id/admission.php' },
];

// Convert database menu to navigation format, always using default submenus for known menus
// Also ensure all default menus are included (like Pusat Data)
function convertToNavigation(menuItems: MenuItem[]): NavItem[] {
  if (!menuItems || menuItems.length === 0) return defaultNavigation;

  // Get all menu names from database
  const dbMenuNames = new Set(menuItems.map(item => item.title));

  // Convert database items
  const convertedItems = menuItems.map(item => {
    // ALWAYS use default submenus for known menu names (Profil, Dokumen, Akreditasi, Layanan)
    // This ensures complete and consistent submenus
    if (defaultSubmenus[item.title]) {
      return {
        name: item.title,
        href: item.url || '#',
        hasDropdown: true,
        subMenu: defaultSubmenus[item.title],
      };
    }
    
    // For other menus, use database children if available
    if (item.children && item.children.length > 0) {
      return {
        name: item.title,
        href: item.url || '#',
        hasDropdown: true,
        subMenu: item.children.map(child => ({
          name: child.title,
          href: child.url || '#',
        })),
      };
    }
    
    // Otherwise, no dropdown
    return {
      name: item.title,
      href: item.url || '#',
      hasDropdown: false,
      subMenu: [],
    };
  });

  // Add any missing default menus (like Pusat Data)
  const missingItems = defaultNavigation.filter(
    defaultItem => !dbMenuNames.has(defaultItem.name)
  );

  // Insert missing items at the correct position (before Hubungi Kami)
  const result = [...convertedItems];
  missingItems.forEach(missingItem => {
    // Find the correct position based on defaultNavigation order
    const defaultIndex = defaultNavigation.findIndex(item => item.name === missingItem.name);
    if (defaultIndex !== -1) {
      result.splice(defaultIndex, 0, missingItem);
    }
  });

  return result;
}

// NavItem component
function NavItem({ item }: { item: NavItem }) {
  if (item.hasDropdown && item.subMenu && item.subMenu.length > 0) {
    return (
      <div className="group relative">
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 text-foreground hover:bg-secondary"
        >
          {item.name}
          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
        </button>

        {/* Dropdown */}
        <div className="absolute top-full left-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border py-1 z-50
          opacity-0 invisible translate-y-2 transition-all duration-200
          group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
          {item.subMenu.map((subItem) => (
            <Link
              key={subItem.name}
              href={subItem.href}
              className="block px-4 py-2 mx-2 my-0.5 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              {subItem.name}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 text-foreground hover:bg-secondary"
    >
      {item.name}
    </Link>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [navigation, setNavigation] = useState<NavItem[]>(defaultNavigation);

  // Fetch menu from API
  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data: MenuItem[]) => {
        if (data && data.length > 0) {
          setNavigation(convertToNavigation(data));
        }
      })
      .catch((error) => {
        console.error('Error fetching menu:', error);
      });
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 hidden lg:block">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            {topBarLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D9F3FC] transition-colors flex items-center gap-1"
              >
                {link.name}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm shadow-md border-b border-border/50">
        <div className="container mx-auto px-4 flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="https://bpm.usni.ac.id/assets/logo-usni-C0MgIZ6x.png"
              alt="Logo USNI"
              className="h-12 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-display font-bold text-foreground leading-tight">BPM</h1>
              <p className="text-xs text-muted-foreground">Badan Penjaminan Mutu</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-2 mt-8">
                {navigation.map((item) => (
                  item.hasDropdown && item.subMenu ? (
                    <div key={item.name} className="flex flex-col">
                      <button
                        onClick={() => setExpandedMenu(expandedMenu === item.name ? null : item.name)}
                        className="px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between text-foreground hover:bg-secondary"
                      >
                        <span className="flex items-center gap-1">
                          {item.name}
                        </span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${expandedMenu === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedMenu === item.name && (
                        <div className="ml-4 flex flex-col gap-1 mt-1 border-l-2 border-primary/30 pl-4">
                          {item.subMenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              onClick={() => {
                                setIsOpen(false);
                                setExpandedMenu(null);
                              }}
                              className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 text-foreground hover:bg-secondary"
                    >
                      {item.name}
                    </Link>
                  )
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
