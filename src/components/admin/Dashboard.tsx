'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Newspaper,
  Megaphone,
  Eye,
  ExternalLink,
  Award,
  Image,
  FolderOpen,
  MessageSquare,
  Users,
  TrendingUp,
  Activity,
  Clock,
  ArrowRight,
  Sparkles,
  Plus,
  BarChart3,
  LogOut,
} from 'lucide-react';

interface Stats {
  berita: number;
  pengumuman: number;
  dokumen: number;
  galeri: number;
  akreditasi: number;
  pesan: number;
  pengguna: number;
}

interface RecentItem {
  id: string;
  title: string;
  slug?: string;
  createdAt: string;
}

const AUTH_KEY = 'admin_user';

function clearStoredUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
}

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    berita: 0,
    pengumuman: 0,
    dokumen: 0,
    galeri: 0,
    akreditasi: 0,
    pesan: 0,
    pengguna: 0,
  });
  const [recentNews, setRecentNews] = useState<RecentItem[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [mounted, setMounted] = useState(false);

  // Visitor data for chart
  const visitorData = [
    { date: 'Sen', views: 180 },
    { date: 'Sel', views: 220 },
    { date: 'Rab', views: 260 },
    { date: 'Kam', views: 240 },
    { date: 'Jum', views: 320 },
    { date: 'Sab', views: 210 },
    { date: 'Min', views: 160 },
  ];

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('admin_user');
      if (stored) {
        const user = JSON.parse(stored);
        setUserName(user.name || '');
        setUserRole(user.role || 'editor');
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, newsRes, announcementsRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/berita?limit=5'),
          fetch('/api/admin/pengumuman?limit=5'),
        ]);

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        }

        if (newsRes.ok) {
          const data = await newsRes.json();
          setRecentNews(Array.isArray(data) ? data.slice(0, 5) : (data.items || []).slice(0, 5));
        }

        if (announcementsRes.ok) {
          const data = await announcementsRes.json();
          setRecentAnnouncements(Array.isArray(data) ? data.slice(0, 5) : (data.items || []).slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Total Berita',
      value: stats.berita,
      icon: Newspaper,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-500/10 to-blue-600/10',
      href: '/admin/berita',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Pengumuman',
      value: stats.pengumuman,
      icon: Megaphone,
      gradient: 'from-[#1B99F4] to-sky-500',
      bgGradient: 'from-[#1B99F4]/10 to-sky-500/10',
      href: '/admin/pengumuman',
      trend: '+5%',
      trendUp: true,
    },
    {
      title: 'Dokumen',
      value: stats.dokumen,
      icon: FolderOpen,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-500/10 to-teal-500/10',
      href: '/admin/dokumen',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Galeri',
      value: stats.galeri,
      icon: Image,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      href: '/admin/galeri',
      trend: '+3%',
      trendUp: true,
    },
    {
      title: 'Akreditasi',
      value: stats.akreditasi,
      icon: Award,
      gradient: 'from-teal-500 to-cyan-500',
      bgGradient: 'from-teal-500/10 to-cyan-500/10',
      href: '/admin/akreditasi',
      trend: 'Aktif',
      trendUp: true,
    },
    {
      title: 'Pesan Masuk',
      value: stats.pesan,
      icon: MessageSquare,
      gradient: 'from-rose-500 to-red-500',
      bgGradient: 'from-rose-500/10 to-red-500/10',
      href: '/admin/pesan',
      trend: stats.pesan > 0 ? 'Baru' : 'Kosong',
      trendUp: stats.pesan > 0,
    },
  ];

  const quickActions = [
    { title: 'Tambah Berita', href: '/admin/berita/tambah', icon: Newspaper, color: 'text-blue-500' },
    { title: 'Tambah Pengumuman', href: '/admin/pengumuman/tambah', icon: Megaphone, color: 'text-amber-500' },
    { title: 'Upload Dokumen', href: '/admin/dokumen/tambah', icon: FolderOpen, color: 'text-emerald-500' },
    { title: 'Upload Gambar', href: '/admin/galeri/tambah', icon: Image, color: 'text-purple-500' },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 11) return 'Selamat Pagi';
    if (hour >= 11 && hour < 15) return 'Selamat Siang';
    if (hour >= 15 && hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  // Get user role display name
  const getRoleDisplayName = () => {
    if (userRole === 'admin') return 'Administrator';
    return 'Editor';
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#1B99F4] via-[#1B99F4]/90 to-[#0d7dd9] p-4 md:p-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU6ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-white">
            <h1 className="text-xl md:text-2xl font-bold mb-1">
              {mounted ? `${getGreeting()}${userName ? `, ${userName}` : ''}` : 'Dashboard Admin'}
            </h1>
            <p className="text-white/80 text-sm">
              {mounted ? getRoleDisplayName() : 'Dashboard Admin'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" asChild className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Link href="/" target="_blank" className="gap-2">
                <Eye className="h-4 w-4" />
                Lihat Website
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
            <Button 
              variant="secondary" 
              className="bg-white text-[#1B99F4] hover:bg-white/90 gap-2"
              onClick={() => {
                clearStoredUser();
                router.push('/admin/login');
              }}
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="group hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.bgGradient}`}>
                        <Icon className={`h-4 w-4`} style={{ color: stat.gradient.includes('blue') ? '#3b82f6' : stat.gradient.includes('amber') ? '#f59e0b' : stat.gradient.includes('emerald') ? '#10b981' : stat.gradient.includes('purple') ? '#a855f7' : stat.gradient.includes('teal') ? '#14b8a6' : '#f43f5e' }} />
                      </div>
                      {stat.trend && (
                        <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${stat.trendUp ? 'bg-emerald-500/10 text-emerald-600' : 'bg-gray-500/10 text-gray-600'}`}>
                          {stat.trend}
                        </Badge>
                      )}
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">
                        {loading ? '...' : stat.value}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Visitor Statistics */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#1B99F4]" />
                Statistik Pengunjung
              </CardTitle>
              <CardDescription className="text-xs">Pengunjung minggu ini</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-[#1B99F4]/10 text-[#1B99F4] text-xs">
              <Activity className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </CardHeader>
          <CardContent className="pt-2">
            {/* Chart Container */}
            <div className="h-[160px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={visitorData} 
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1B99F4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#1B99F4" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#e2e8f0" 
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    labelStyle={{ color: '#1B99F4', fontWeight: 600 }}
                    formatter={(value: number) => [`${value} kunjungan`, 'Pengunjung']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#1B99F4" 
                    fill="url(#colorViews)" 
                    strokeWidth={2.5}
                    name="Kunjungan"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* Stats Summary */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-[#1B99F4]" />
                <span className="text-xs text-muted-foreground">Total:</span>
                <span className="font-semibold text-[#1B99F4] text-sm">1,200</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-xs text-emerald-600 font-medium">+15%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Aksi Cepat
            </CardTitle>
            <CardDescription className="text-xs">Tambah konten baru</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <Button variant="outline" className="w-full justify-start gap-2 h-9 hover:bg-muted/50 group text-sm">
                    <Icon className={`h-3.5 w-3.5 ${action.color} group-hover:scale-110 transition-transform`} />
                    <span>{action.title}</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent News */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-blue-500" />
              Berita Terbaru
            </CardTitle>
            <Link href="/admin/berita">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Lihat Semua
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1B99F4]" />
              </div>
            ) : recentNews.length === 0 ? (
              <div className="text-center py-8">
                <Newspaper className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Belum ada berita</p>
                <Link href="/admin/berita/tambah">
                  <Button size="sm" className="mt-3 bg-[#1B99F4] hover:bg-[#1B99F4]/90">
                    <Plus className="h-4 w-4 mr-1" />
                    Tambah Berita
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {recentNews.map((item, index) => (
                  <Link key={item.id} href={`/admin/berita/${item.id}`}>
                    <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors group">
                      <div className="w-6 h-6 rounded bg-blue-500/10 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-blue-500">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1 group-hover:text-[#1B99F4] transition-colors">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" />
                          {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-amber-500" />
              Pengumuman Terbaru
            </CardTitle>
            <Link href="/admin/pengumuman">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Lihat Semua
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500" />
              </div>
            ) : recentAnnouncements.length === 0 ? (
              <div className="text-center py-8">
                <Megaphone className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Belum ada pengumuman</p>
                <Link href="/admin/pengumuman/tambah">
                  <Button size="sm" className="mt-3 bg-amber-500 hover:bg-amber-500/90">
                    <Plus className="h-4 w-4 mr-1" />
                    Tambah Pengumuman
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {recentAnnouncements.map((item, index) => (
                  <Link key={item.id} href={`/admin/pengumuman/${item.id}`}>
                    <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors group">
                      <div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-amber-500">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1 group-hover:text-amber-500 transition-colors">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" />
                          {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
