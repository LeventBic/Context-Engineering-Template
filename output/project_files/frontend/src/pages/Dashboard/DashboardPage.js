import React from 'react';
import { FiTrendingUp, FiPackage, FiTool, FiAlertTriangle, FiPlusCircle, FiShoppingCart, FiBarChart2 } from 'react-icons/fi';

const stats = [
  {
    name: 'Toplam Ürün',
    value: '1,247',
    icon: <FiPackage className="h-7 w-7 text-primary-600" />,
    change: '+12%',
    changeType: 'positive',
  },
  {
    name: 'Düşük Stok',
    value: '23',
    icon: <FiAlertTriangle className="h-7 w-7 text-warning-600" />,
    change: '-5%',
    changeType: 'negative',
  },
  {
    name: 'Aktif Sipariş',
    value: '8',
    icon: <FiShoppingCart className="h-7 w-7 text-red-600" />,
    change: '+3%',
    changeType: 'positive',
  },
  {
    name: 'Toplam Değer',
    value: '₺125,430',
    icon: <FiTrendingUp className="h-7 w-7 text-green-600" />,
    change: '+8%',
    changeType: 'positive',
  },
];

const recentActivities = [
  { id: 1, text: 'Ürün stoku güncellendi', time: '2 dakika önce' },
  { id: 2, text: 'Yeni sipariş oluşturuldu', time: '10 dakika önce' },
  { id: 3, text: 'Stok seviyesi kritik', time: '1 saat önce' },
  { id: 4, text: 'Ürün eklendi', time: '2 saat önce' },
];

const lowStockAlerts = [
  { id: 1, name: 'Çelik Levha 2mm', current: 15, min: 100, unit: 'kg' },
  { id: 2, name: 'Plastik Granül ABS', current: 20, min: 200, unit: 'kg' },
  { id: 3, name: 'Vida M6x20', current: 950, min: 1000, unit: 'adet' },
];

const topProducts = [
  { id: 1, name: 'Hidrolik Silindir HS-100', sales: 120 },
  { id: 2, name: 'Pnömatik Valf PV-25', sales: 95 },
  { id: 3, name: 'Kompresör Tankı KT-50', sales: 80 },
];

const DashboardPage = () => {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card flex items-center p-6 shadow-md bg-white rounded-lg">
            <div className="mr-4">{stat.icon}</div>
            <div>
              <div className="text-2xl font-bold text-secondary-900">{stat.value}</div>
              <div className="text-sm text-secondary-500">{stat.name}</div>
              <div className={`text-xs mt-1 font-medium ${stat.changeType === 'positive' ? 'text-success-600' : 'text-error-600'}`}>{stat.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="card">
          <div className="card-header flex items-center mb-4">
            <FiBarChart2 className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-secondary-900">Son Aktiviteler</h3>
          </div>
          <div className="space-y-4">
            {recentActivities.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-secondary-900">{item.text}</p>
                  <p className="text-xs text-secondary-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card">
          <div className="card-header flex items-center mb-4">
            <FiAlertTriangle className="h-5 w-5 text-warning-600 mr-2" />
            <h3 className="text-lg font-semibold text-secondary-900">Düşük Stok Uyarıları</h3>
          </div>
          <div className="space-y-4">
            {lowStockAlerts.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FiPackage className="h-5 w-5 text-warning-600" />
                  <div>
                    <p className="text-sm font-medium text-secondary-900">{item.name}</p>
                    <p className="text-xs text-secondary-500">Mevcut: {item.current} {item.unit}, Minimum: {item.min} {item.unit}</p>
                  </div>
                </div>
                <button className="btn-warning text-xs py-1 px-2">İncele</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Level Chart (Mock) */}
        <div className="card">
          <div className="card-header flex items-center mb-4">
            <FiBarChart2 className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-secondary-900">Stok Seviyesi (Örnek)</h3>
          </div>
          <div className="h-48 flex items-center justify-center">
            <div className="w-full h-32 bg-gradient-to-r from-primary-100 to-primary-300 rounded-lg flex items-center justify-center text-primary-700 font-bold text-lg opacity-60">
              [Burada stok seviyesi bar chart olacak]
            </div>
          </div>
        </div>
        {/* Top Products */}
        <div className="card">
          <div className="card-header flex items-center mb-4">
            <FiTrendingUp className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-secondary-900">En Çok Satan Ürünler</h3>
          </div>
          <div className="space-y-3">
            {topProducts.map((item, idx) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold mr-3">{idx + 1}</span>
                  <span className="text-secondary-900 font-medium">{item.name}</span>
                </div>
                <span className="text-secondary-500 text-sm">{item.sales} satış</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;