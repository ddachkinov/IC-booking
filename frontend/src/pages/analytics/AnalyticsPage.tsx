import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { formatCurrency } from '../../lib/utils';

export default function AnalyticsPage() {
  const { data: topServices } = useQuery({
    queryKey: ['top-services'],
    queryFn: async () => {
      const response = await api.get('/analytics/top-services');
      return response.data;
    },
  });

  const { data: staffPerformance } = useQuery({
    queryKey: ['staff-performance'],
    queryFn: async () => {
      const response = await api.get('/analytics/staff-performance');
      return response.data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Detailed insights and performance metrics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Services</h3>
          {topServices && topServices.length > 0 ? (
            <div className="space-y-3">
              {topServices.map((service: any, index: number) => (
                <div key={service.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400 font-medium">#{index + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{service.name}</p>
                      <p className="text-xs text-gray-500">{service.appointmentCount} appointments</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(service.revenue)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No data available</p>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Staff Performance</h3>
          {staffPerformance && staffPerformance.length > 0 ? (
            <div className="space-y-3">
              {staffPerformance.map((staff: any, index: number) => (
                <div key={staff.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400 font-medium">#{index + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{staff.name}</p>
                      <p className="text-xs text-gray-500">
                        {staff.appointmentCount} appointments • {staff.completionRate.toFixed(1)}% completion
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(staff.revenue)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
