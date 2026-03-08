import AdminLayout from '@/components/admin/AdminLayout';
import Dashboard from '@/components/admin/Dashboard';

export const metadata = {
  title: 'Dashboard - Admin Panel BPM USNI',
  description: 'Dashboard Admin Panel BPM USNI',
};

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
}
