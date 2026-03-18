'use client';

import { useState, useEffect, useReducer } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/sonner';
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
  Home,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Newspaper,
  Megaphone,
  FileText,
  Image,
  FolderOpen,
  Award,
  Building2,
  GraduationCap,
  Settings,
  MessageSquare,
  Users,
  Database,
  Globe,
  Target,
  Info,
  Network,
  Quote,
  Link2,
  Mail,
  Shield,
  X,
  User,
} from 'lucide-react';

// Website Identity interface
interface WebsiteIdentity {
  siteName: string | null;
  siteTagline: string | null;
  logoUrl: string | null;
}

// Auth state reducer
type AuthState = {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  userId: string;
  userRole: string;
  userName: string;
  userEmail: string;
};

type AuthAction = 
  | { type: 'LOADING' }
  | { type: 'AUTHENTICATED'; id: string; role: string; name: string; email: string }
  | { type: 'UNAUTHENTICATED' };

function authReducer(_state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOADING':
      return { status: 'loading', userId: '', userRole: 'editor', userName: '', userEmail: '' };
    case 'AUTHENTICATED':
      return { status: 'authenticated', userId: action.id, userRole: action.role, userName: action.name, userEmail: action.email };
    case 'UNAUTHENTICATED':
      return { status: 'unauthenticated', userId: '', userRole: 'editor', userName: '', userEmail: '' };
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

// Menu configuration with icons
interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
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
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    name: 'Konten',
    icon: Newspaper,
    items: [
      { name: 'Berita', href: '/admin/berita', icon: Newspaper },
      { name: 'Pengumuman', href: '/admin/pengumuman', icon: Megaphone },
      { name: 'Halaman Statis', href: '/admin/halaman', icon: FileText },
    ],
  },
  {
    name: 'Media',
    icon: Image,
    items: [
      { name: 'Album', href: '/admin/album', icon: FolderOpen },
      { name: 'Galeri', href: '/admin/galeri', icon: Image },
      { name: 'Slideshow', href: '/admin/slideshow', icon: Image },
    ],
  },
  {
    name: 'Data',
    icon: Database,
    items: [
      { name: 'Dokumen', href: '/admin/dokumen', icon: FolderOpen },
      { name: 'Akreditasi', href: '/admin/akreditasi', icon: Award },
      { name: 'Fakultas', href: '/admin/fakultas', icon: Building2 },
      { name: 'Program Studi', href: '/admin/prodi', icon: GraduationCap },
    ],
  },
  {
    name: 'Pengaturan Web',
    icon: Settings,
    items: [
      { name: 'Identitas Website', href: '/admin/identitas', icon: Globe },
      { name: 'Menu Navigasi', href: '/admin/menu', icon: Network },
      { name: 'Visi & Misi', href: '/admin/visi-misi', icon: Target },
      { name: 'Tentang Kami', href: '/admin/tentang-kami', icon: Info },
      { name: 'Struktur Organisasi', href: '/admin/struktur-organisasi', icon: Network },
      { name: 'Kutipan', href: '/admin/kutipan', icon: Quote },
      { name: 'Quick Links', href: '/admin/quick-links', icon: Link2 },
    ],
  },

  {
    name: 'Admin',
    icon: Shield,
    adminOnly: true,
    items: [
      { name: 'Pengguna', href: '/admin/pengguna', icon: Users },
      { name: 'Pengaturan', href: '/admin/pengaturan', icon: Settings },
      { name: 'Backup & Restore', href: '/admin/backup-restore', icon: Database },
    ],
  },
];

// Horizontal Navigation Item Component
function HorizontalNavItem({
  group,
  activePath,
  isAdmin,
  onNavigate,
}: {
  group: MenuGroup;
  activePath: string;
  isAdmin: boolean;
  onNavigate?: () => void;
}) {
  const isMenuActive = (href: string) => activePath === href;
  const hasActiveChild = group.items.some(item => isMenuActive(item.href));
  const [isOpen, setIsOpen] = useState(false);

  // Single item - direct link
  if (group.items.length === 1) {
    const item = group.items[0];
    const isActive = isMenuActive(item.href);
    const Icon = item.icon;

    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
          isActive
            ? "bg-[#1B99F4] text-white"
            : "text-foreground hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]"
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{item.name}</span>
      </Link>
    );
  }

  // Multiple items - dropdown
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
            hasActiveChild
              ? "bg-[#1B99F4]/10 text-[#1B99F4]"
              : "text-foreground hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]"
          )}
        >
          <group.icon className="h-4 w-4" />
          <span>{group.name}</span>
          <ChevronDown className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-56 p-1"
        sideOffset={4}
      >
        {group.items.map((item, index) => {
          const isActive = isMenuActive(item.href);
          const Icon = item.icon;

          return (
            <DropdownMenuItem
              key={item.href}
              asChild
              className={cn(
                "cursor-pointer px-3 py-2.5 rounded-md",
                isActive 
                  ? "bg-[#1B99F4] text-white focus:bg-[#1B99F4] focus:text-white" 
                  : "hover:bg-[#1B99F4]/10 hover:text-[#1B99F4] focus:bg-[#1B99F4]/10 focus:text-[#1B99F4]"
              )}
            >
              <Link href={item.href} onClick={() => setIsOpen(false)}>
                <Icon className="mr-2.5 h-4 w-4" />
                <span>{item.name}</span>
                {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Mobile Menu Component
function MobileMenu({
  isOpen,
  onClose,
  isAdmin,
  activePath,
  identity,
}: {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  activePath: string;
  identity: WebsiteIdentity;
}) {
  const isMenuActive = (href: string) => activePath === href;
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Dashboard']);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="p-0 w-80 max-w-[85vw]">
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-[#1B99F4] to-[#1B99F4]/80">
            <div className="flex items-center gap-3">
              {identity.logoUrl ? (
                <img
                  src={identity.logoUrl}
                  alt={identity.siteName || 'Logo'}
                  className="h-9 w-auto"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">BPM</span>
                </div>
              )}
              <div>
                <p className="font-semibold text-white">Admin Panel</p>
                <p className="text-xs text-white/80">{identity.siteTagline}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Content */}
          <ScrollArea className="flex-1">
            <nav className="p-2">
              {menuGroups.map((group) => {
                if (group.adminOnly && !isAdmin) return null;

                const hasActiveChild = group.items.some(item => isMenuActive(item.href));
                const isExpanded = expandedGroups.includes(group.name);

                return (
                  <div key={group.name} className="mb-1">
                    {/* Group Header */}
                    <button
                      onClick={() => toggleGroup(group.name)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        hasActiveChild
                          ? "bg-[#1B99F4]/10 text-[#1B99F4]"
                          : "text-foreground hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <group.icon className="h-4 w-4" />
                        <span>{group.name}</span>
                      </div>
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )} />
                    </button>

                    {/* Group Items */}
                    {isExpanded && (
                      <div className="mt-1 pl-4 space-y-0.5">
                        {group.items.map((item) => {
                          const isActive = isMenuActive(item.href);
                          const Icon = item.icon;

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={onClose}
                              className={cn(
                                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                                isActive
                                  ? "bg-[#1B99F4] text-white"
                                  : "text-muted-foreground hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]"
                              )}
                            >
                              <Icon className="h-4 w-4" />
                              <span>{item.name}</span>
                              {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t border-border bg-muted/30 space-y-2">
            {/* Pesan Masuk Link */}
            <Link
              href="/admin/pesan"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium bg-accent hover:bg-[#1B99F4]/10 hover:text-[#1B99F4] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Pesan Masuk</span>
              </div>
              {/* Badge would need to be passed as prop, skip for mobile */}
            </Link>
            <Button variant="outline" className="w-full justify-start gap-2 hover:bg-[#1B99F4]/10 hover:text-[#1B99F4] hover:border-[#1B99F4]/30" asChild>
              <a href="/" target="_blank" rel="noopener noreferrer">
                <Home className="h-4 w-4" />
                Lihat Website
              </a>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

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
    userId: '',
    userRole: 'editor',
    userName: '',
    userEmail: '',
  });
  const [identity, setIdentity] = useState<WebsiteIdentity>({
    siteName: 'BPM USNI',
    siteTagline: 'Badan Penjaminan Mutu',
    logoUrl: null,
  });
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch website identity
  useEffect(() => {
    fetch('/api/identity')
      .then((res) => res.json())
      .then((data: WebsiteIdentity | null) => {
        if (data) {
          setIdentity({
            siteName: data.siteName || 'BPM USNI',
            siteTagline: data.siteTagline || 'Badan Penjaminan Mutu',
            logoUrl: data.logoUrl,
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching identity:', error);
      });
  }, []);

  // Fetch unread message count
  useEffect(() => {
    if (!hydrated || authState.status !== 'authenticated') return;

    const fetchUnreadCount = () => {
      fetch('/api/admin/messages/unread-count')
        .then((res) => res.json())
        .then((data) => {
          if (data.count !== undefined) {
            setUnreadCount(data.count);
          }
        })
        .catch((error) => {
          console.error('Error fetching unread count:', error);
        });
    };

    fetchUnreadCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [hydrated, authState.status]);

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
        id: user.id || '',
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
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-14 items-center justify-between px-4">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>

            {/* Logo */}
            <Link href="/admin" className="flex items-center gap-2.5">
              {identity.logoUrl ? (
                <img
                  src={identity.logoUrl}
                  alt={identity.siteName || 'Logo'}
                  className="h-8 w-auto"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-[#1B99F4] flex items-center justify-center">
                  <span className="text-white font-bold text-xs">BPM</span>
                </div>
              )}
              <div className="hidden sm:block">
                <p className="font-bold text-sm leading-tight">{identity.siteName || 'Admin Panel'}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{identity.siteTagline}</p>
              </div>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1.5">
            {/* Visit Website Button */}
            <Button 
              variant="outline" 
              size="sm"
              asChild
              className="hidden md:flex gap-2 hover:bg-[#1B99F4]/10 hover:text-[#1B99F4] hover:border-[#1B99F4]/30"
            >
              <a href="/" target="_blank" rel="noopener noreferrer">
                <Home className="h-4 w-4" />
                <span>Lihat Website</span>
              </a>
            </Button>

            {/* Message Notification */}
            <Link href="/admin/pesan">
              <Button 
                variant="ghost" 
                size="icon"
                className="relative h-9 w-9 hover:bg-[#1B99F4]/10 hover:text-[#1B99F4]"
              >
                <Mail className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className={cn(
                    "absolute -top-0.5 -right-0.5 flex items-center justify-center rounded-full text-[10px] font-bold text-white",
                    unreadCount > 99 ? "min-w-5 h-5 px-1" : "w-5 h-5",
                    "bg-red-500"
                  )}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
                <span className="sr-only">Pesan Masuk</span>
              </Button>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-[#1B99F4]/10">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#1B99F4] text-white text-xs font-medium">
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
                {authState.userId && (
                  <DropdownMenuItem asChild className="hover:bg-[#1B99F4]/10 hover:text-[#1B99F4] focus:bg-[#1B99F4]/10 focus:text-[#1B99F4]">
                    <Link href={`/admin/pengguna/${authState.userId}`} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild className="hover:bg-[#1B99F4]/10 hover:text-[#1B99F4] focus:bg-[#1B99F4]/10 focus:text-[#1B99F4]">
                  <a href="/" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Lihat Website</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive hover:text-destructive hover:bg-red-50 focus:text-destructive focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Horizontal Navigation Bar */}
      <nav className="sticky top-14 z-40 w-full border-b border-border bg-background">
        <div className="hidden lg:flex items-center px-4 h-12 gap-1 overflow-x-auto">
          {menuGroups.map((group) => {
            if (group.adminOnly && !isAdmin) return null;
            return (
              <HorizontalNavItem
                key={group.name}
                group={group}
                activePath={pathname}
                isAdmin={isAdmin}
              />
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isAdmin={isAdmin}
        activePath={pathname}
        identity={identity}
      />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        {children}
      </main>

      <Toaster />
    </div>
  );
}
