'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Newspaper,
  Megaphone,
  Images,
  FolderOpen,
  Award,
  Building2,
  Settings,
  Users,
  FileText,
  Menu,
  ChevronLeft,
  ChevronRight,
  Globe,
  Quote,
  Link2,
  Image,
  Database,
  Layers,
  Target,
  Users2,
  Palette,
  FolderCog,
  ChevronDown,
  Settings2,
  Mail,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  userRole: string;
}

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
  adminOnly?: boolean;
}

const menuGroups: MenuGroup[] = [
  {
    title: 'Utama',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Konten',
    items: [
      { name: 'Berita', href: '/admin/berita', icon: Newspaper },
      { name: 'Pengumuman', href: '/admin/pengumuman', icon: Megaphone },
    ]
  },
  {
    title: 'Media',
    items: [
      { 
        name: 'Galeri Foto Kegiatan', 
        href: '#', 
        icon: Images,
        children: [
          { name: 'Album', href: '/admin/album', icon: Layers },
          { name: 'Galeri', href: '/admin/galeri', icon: Images },
        ]
      },
    ]
  },
  {
    title: 'Data',
    items: [
      { name: 'Dokumen', href: '/admin/dokumen', icon: FolderOpen },
      { 
        name: 'Akreditasi', 
        href: '/admin/akreditasi', 
        icon: Award,
      },
    ]
  },
  {
    title: 'Website',
    items: [
      { name: 'Halaman Statis', href: '/admin/halaman', icon: FileText },
    ]
  },
  {
    title: 'Settings Website',
    items: [
      { 
        name: 'Settings Website', 
        href: '#', 
        icon: Settings2,
        children: [
          { name: 'Visi Misi', href: '/admin/visi-misi', icon: Target },
          { name: 'Tentang Kami', href: '/admin/tentang-kami', icon: FileText },
          { name: 'Struktur Organisasi', href: '/admin/struktur-organisasi', icon: Users2 },
          { name: 'Kutipan', href: '/admin/kutipan', icon: Quote },
          { name: 'Quick Links', href: '/admin/quick-links', icon: Link2 },
          { name: 'Pesan', href: '/admin/pesan', icon: Mail },
          { name: 'Slideshow', href: '/admin/slideshow', icon: Image },
          { name: 'Fakultas', href: '/admin/fakultas', icon: Building2 },
          { name: 'Program Studi', href: '/admin/prodi', icon: GraduationCap },
        ]
      },
    ]
  },
  {
    title: 'Settings',
    adminOnly: true,
    items: [
      { 
        name: 'Settings', 
        href: '#', 
        icon: Settings,
        children: [
          { name: 'Identitas', href: '/admin/identitas', icon: Globe },
          { name: 'Pengguna', href: '/admin/pengguna', icon: Users },
          { name: 'Menu', href: '/admin/menu', icon: Menu },
          { name: 'Pengaturan', href: '/admin/pengaturan', icon: Settings2 },
        ]
      },
    ]
  },
];

function GraduationCap({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
}

export default function AdminSidebar({ collapsed, setCollapsed, userRole }: SidebarProps) {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const isAdmin = userRole === 'admin';

  const toggleMenu = (name: string) => {
    setExpandedMenus(prev => 
      prev.includes(name) 
        ? prev.filter(m => m !== name)
        : [...prev, name]
    );
  };

  const isMenuActive = (item: MenuItem): boolean => {
    if (item.href === pathname) return true;
    if (item.children) {
      return item.children.some(child => child.href === pathname);
    }
    return false;
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Palette className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Admin Panel</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("h-8 w-8", collapsed && "mx-auto")}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Menu */}
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <nav className="p-2 space-y-2">
          {menuGroups.map((group) => {
            // Hide admin-only menus for non-admin users
            if (group.adminOnly && !isAdmin) return null;

            return (
              <div key={group.title} className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isMenuActive(item);
                  const hasChildren = item.children && item.children.length > 0;
                  const isExpanded = expandedMenus.includes(item.name);

                  return (
                    <div key={item.name}>
                      {hasChildren ? (
                        <>
                          <button
                            onClick={() => toggleMenu(item.name)}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full",
                              "hover:bg-primary/10 hover:text-primary",
                              isActive && "bg-primary/10 text-primary",
                              collapsed && "justify-center"
                            )}
                            title={collapsed ? item.name : undefined}
                          >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            {!collapsed && (
                              <>
                                <span className="truncate flex-1 text-left">{item.name}</span>
                                <ChevronDown 
                                  className={cn(
                                    "h-4 w-4 transition-transform duration-200",
                                    isExpanded && "rotate-180"
                                  )} 
                                />
                              </>
                            )}
                          </button>
                          
                          {/* Sub Menu */}
                          {!collapsed && isExpanded && item.children && (
                            <div className="ml-4 mt-1 space-y-1 border-l border-border pl-2">
                              {item.children.map((child) => {
                                const ChildIcon = child.icon;
                                const childIsActive = pathname === child.href;
                                
                                return (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    className={cn(
                                      "flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors text-sm",
                                      "hover:bg-primary/10 hover:text-primary",
                                      childIsActive 
                                        ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" 
                                        : "text-muted-foreground"
                                    )}
                                  >
                                    <ChildIcon className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">{child.name}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                            "hover:bg-primary/10 hover:text-primary",
                            isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                            collapsed && "justify-center"
                          )}
                          title={collapsed ? item.name : undefined}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          {!collapsed && <span className="truncate">{item.name}</span>}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
