'use client';

import { useState, useEffect, useReducer } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/sonner';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Menu,
  Loader2,
  LogOut,
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
  Globe,
  Quote,
  Link2,
  Image,
  Database,
  Layers,
  Target,
  Users2,
  Settings2,
  Mail,
  ChevronRight,
  User,
  Home,
} from 'lucide-react';

// Auth state reducer
type AuthState = {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  userRole: string;
  userName: string;
  userEmail: string;
};

type AuthAction = 
  | { type: 'LOADING' }
  | { type: 'AUTHENTICATED'; role: string; name: string; email: string }
  | { type: 'UNAUTHENTICATED' };

function authReducer(_state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOADING':
      return { status: 'loading', userRole: 'editor', userName: '', userEmail: '' };
    case 'AUTHENTICATED':
      return { status: 'authenticated', userRole: action.role, userName: action.name, userEmail: action.email };
    case 'UNAUTHENTICATED':
      return { status: 'unauthenticated', userRole: 'editor', userName: '', userEmail: '' };
    default:
      return _state;
  }
}

// Auth store
const AUTH_KEY = 'admin_user';

function getStoredUser() {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function clearStoredUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
}

// Icon component for graduation cap
function GraduationCap({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
}

// Menu configuration
interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface MenuGroup {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  items: MenuItem[];
  adminOnly?: boolean;
}

const menuGroups: MenuGroup[] = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, description: 'Panel utama admin' },
    ],
  },
  {
    name: 'Konten',
    icon: Newspaper,
    items: [
      { name: 'Berita', href: '/admin/berita', icon: Newspaper, description: 'Kelola berita dan artikel' },
      { name: 'Pengumuman', href: '/admin/pengumuman', icon: Megaphone, description: 'Kelola pengumuman' },
    ],
  },
  {
    name: 'Media',
    icon: Images,
    items: [
      { name: 'Album', href: '/admin/album', icon: Layers, description: 'Kelola album foto' },
      { name: 'Galeri', href: '/admin/galeri', icon: Images, description: 'Kelola galeri foto kegiatan' },
    ],
  },
  {
    name: 'Data',
    icon: FolderOpen,
    items: [
      { name: 'Dokumen', href: '/admin/dokumen', icon: FileText, description: 'Kelola dokumen' },
      { name: 'Kategori Dokumen', href: '/admin/kategori-dokumen', icon: Database, description: 'Kelola kategori dokumen' },
      { name: 'Akreditasi', href: '/admin/akreditasi', icon: Award, description: 'Kelola data akreditasi' },
    ],
  },
  {
    name: 'Website',
    icon: Globe,
    items: [
      { name: 'Halaman Statis', href: '/admin/halaman', icon: FileText, description: 'Kelola halaman statis' },
    ],
  },
  {
    name: 'Settings Website',
    icon: Settings2,
    items: [
      { name: 'Visi Misi', href: '/admin/visi-misi', icon: Target, description: 'Kelola visi dan misi' },
      { name: 'Tentang Kami', href: '/admin/tentang-kami', icon: FileText, description: 'Kelola halaman tentang kami' },
      { name: 'Struktur Organisasi', href: '/admin/struktur-organisasi', icon: Users2, description: 'Kelola struktur organisasi' },
      { name: 'Kutipan', href: '/admin/kutipan', icon: Quote, description: 'Kelola kutipan homepage' },
      { name: 'Quick Links', href: '/admin/quick-links', icon: Link2, description: 'Kelola link cepat' },
      { name: 'Pesan', href: '/admin/pesan', icon: Mail, description: 'Kelola pesan kontak' },
      { name: 'Slideshow', href: '/admin/slideshow', icon: Image, description: 'Kelola slideshow hero' },
      { name: 'Fakultas', href: '/admin/fakultas', icon: Building2, description: 'Kelola data fakultas' },
      { name: 'Program Studi', href: '/admin/prodi', icon: GraduationCap, description: 'Kelola program studi' },
    ],
  },
  {
    name: 'Settings',
    icon: Settings,
    adminOnly: true,
    items: [
      { name: 'Identitas', href: '/admin/identitas', icon: Globe, description: 'Kelola identitas website' },
      { name: 'Pengguna', href: '/admin/pengguna', icon: Users, description: 'Kelola pengguna admin' },
      { name: 'Menu', href: '/admin/menu', icon: Menu, description: 'Kelola menu navigasi' },
      { name: 'Pengaturan', href: '/admin/pengaturan', icon: Settings2, description: 'Pengaturan umum' },
      { name: 'Backup & Restore', href: '/admin/backup-restore', icon: Database, description: 'Backup dan restore database' },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authState, dispatchAuth] = useReducer(authReducer, {
    status: 'loading',
    userRole: 'editor',
    userName: '',
    userEmail: '',
  });

  // Handle client-side mounting
  useEffect(() => {
    const timer = setTimeout(() => {
      setHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Check auth status
  useEffect(() => {
    if (!hydrated) return;
    
    const user = getStoredUser();
    if (user && user.email && user.role) {
      dispatchAuth({ 
        type: 'AUTHENTICATED', 
        role: user.role || 'editor',
        name: user.name || 'Admin',
        email: user.email
      });
    } else {
      dispatchAuth({ type: 'UNAUTHENTICATED' });
    }
  }, [hydrated]);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (hydrated && authState.status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [hydrated, authState.status, router]);

  const isAdmin = authState.userRole === 'admin';

  const handleLogout = () => {
    clearStoredUser();
    router.push('/admin/login');
  };

  const isMenuActive = (href: string) => pathname === href;
  const isGroupActive = (items: MenuItem[]) => items.some(item => pathname === item.href);

  // Loading state
  if (!hydrated || authState.status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1B99F4]/5 via-background to-[#1B99F4]/10">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#1B99F4]" />
          <p className="text-muted-foreground">Memuat Admin Panel...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show redirect message
  if (authState.status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1B99F4]/5 via-background to-[#1B99F4]/10">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#1B99F4]" />
          <p className="text-muted-foreground">Mengalihkan ke halaman login...</p>
        </div>
      </div>
    );
  }

  const userInitials = authState.userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/admin" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 rounded-lg bg-[#1B99F4] flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg hidden sm:inline-block">Admin Panel</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center flex-1 px-4">
              <NavigationMenu>
                <NavigationMenuList className="gap-0.5">
                  {menuGroups.map((group) => {
                    // Hide admin-only menus for non-admin users
                    if (group.adminOnly && !isAdmin) return null;

                    const GroupIcon = group.icon;
                    const isActive = isGroupActive(group.items);

                    // Single item without dropdown
                    if (group.items.length === 1) {
                      const item = group.items[0];
                      return (
                        <NavigationMenuItem key={group.name}>
                          <Link href={item.href} legacyBehavior passHref>
                            <NavigationMenuLink
                              className={cn(
                                "group inline-flex h-9 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                "hover:bg-accent hover:text-accent-foreground",
                                isActive && "bg-accent text-accent-foreground"
                              )}
                            >
                              <GroupIcon className="h-4 w-4 mr-2" />
                              {group.name}
                            </NavigationMenuLink>
                          </Link>
                        </NavigationMenuItem>
                      );
                    }

                    // Multiple items with dropdown
                    return (
                      <NavigationMenuItem key={group.name}>
                        <NavigationMenuTrigger
                          className={cn(
                            "h-9 px-3 text-sm font-medium",
                            isActive && "bg-accent text-accent-foreground"
                          )}
                        >
                          <GroupIcon className="h-4 w-4 mr-2" />
                          {group.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[280px] gap-1 p-2">
                            {group.items.map((item) => {
                              const ItemIcon = item.icon;
                              return (
                                <li key={item.href}>
                                  <Link href={item.href} legacyBehavior passHref>
                                    <NavigationMenuLink
                                      className={cn(
                                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
                                        "hover:bg-accent hover:text-accent-foreground",
                                        "focus:bg-accent focus:text-accent-foreground",
                                        isMenuActive(item.href) && "bg-[#1B99F4] text-white hover:bg-[#1B99F4]/90"
                                      )}
                                    >
                                      <div className="flex items-center gap-2">
                                        <ItemIcon className="h-4 w-4" />
                                        <div className="text-sm font-medium leading-none">{item.name}</div>
                                      </div>
                                      {item.description && (
                                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1.5">
                                          {item.description}
                                        </p>
                                      )}
                                    </NavigationMenuLink>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Visit Website Button */}
              <Button 
                variant="outline" 
                size="sm"
                asChild
                className="hidden sm:flex gap-2"
              >
                <Link href="/">
                  <Home className="h-4 w-4" />
                  <span className="hidden md:inline">Kunjungi Website</span>
                </Link>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-[#1B99F4] text-white text-sm font-medium">
                        {userInitials || 'AD'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{authState.userName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{authState.userEmail}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/" className="cursor-pointer">
                      <Home className="mr-2 h-4 w-4" />
                      <span>Kunjungi Website</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Toggle */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80">
                  <div className="flex flex-col h-full">
                    {/* Mobile Menu Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/30">
                      <div className="w-10 h-10 rounded-lg bg-[#1B99F4] flex items-center justify-center">
                        <LayoutDashboard className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">Admin Panel</p>
                        <p className="text-xs text-muted-foreground">BPM USNI</p>
                      </div>
                    </div>

                    {/* Mobile Menu Content */}
                    <ScrollArea className="flex-1">
                      <nav className="p-3 space-y-1">
                        {menuGroups.map((group) => {
                          // Hide admin-only menus for non-admin users
                          if (group.adminOnly && !isAdmin) return null;

                          const GroupIcon = group.icon;
                          const isActive = isGroupActive(group.items);

                          return (
                            <div key={group.name} className="space-y-1">
                              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {group.name}
                              </p>
                              {group.items.map((item) => {
                                const ItemIcon = item.icon;
                                return (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                                      "hover:bg-accent hover:text-accent-foreground",
                                      isMenuActive(item.href)
                                        ? "bg-[#1B99F4] text-white hover:bg-[#1B99F4]/90"
                                        : "text-foreground"
                                    )}
                                  >
                                    <ItemIcon className="h-4 w-4" />
                                    <span className="flex-1">{item.name}</span>
                                    {isMenuActive(item.href) && (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                  </Link>
                                );
                              })}
                            </div>
                          );
                        })}
                      </nav>
                    </ScrollArea>

                    {/* Mobile Menu Footer */}
                    <div className="p-4 border-t border-border">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-[#1B99F4] text-white text-sm">
                            {userInitials || 'AD'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{authState.userName}</p>
                          <p className="text-xs text-muted-foreground truncate">{authState.userEmail}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Keluar
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      <Toaster />
    </div>
  );
}
