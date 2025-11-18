import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { formatCurrency } from '../../lib/utils';
import { Users, Calendar, DollarSign, TrendingUp, Clock, XCircle } from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  totalAppointments: number;
  totalClients: number;
  completedAppointments: number;
  cancelledAppointments: number;
  upcomingAppointments: number;
  averageAppointmentValue: number;
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.get('/analytics/dashboard');
      return response.data;
    },
  });

  const statCards = [
    {
      title: 'Total Revenue',
      value: stats ? formatCurrency(stats.totalRevenue) : '$0',
      icon: DollarSign,
      change: '+12.5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Clients',
      value: stats?.totalClients.toString() || '0',
      icon: Users,
      change: '+8.2%',
      changeType: 'positive' as const,
    },
    {
      title: 'Appointments',
      value: stats?.totalAppointments.toString() || '0',
      icon: Calendar,
      change: '+15.3%',
      changeType: 'positive' as const,
    },
    {
      title: 'Avg. Value',
      value: stats ? formatCurrency(stats.averageAppointmentValue) : '$0',
      icon: TrendingUp,
      change: '+5.1%',
      changeType: 'positive' as const,
    },
  ];

  const quickStats = [
    {
      label: 'Upcoming',
      value: stats?.upcomingAppointments || 0,
      icon: Clock,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Completed',
      value: stats?.completedAppointments || 0,
      icon: Calendar,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: 'Cancelled',
      value: stats?.cancelledAppointments || 0,
      icon: XCircle,
      color: 'text-red-600 bg-red-50',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className="p-3 bg-primary-50 rounded-full">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span
                  className={`font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="ml-2 text-gray-500">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Appointment Overview</h3>
        <div className="grid grid-cols-3 gap-4">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Appointments</h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">No recent appointments</p>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Services</h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">No data available</p>
          </div>
        </div>
      </div>
    </div>
  );
}
