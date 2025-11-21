import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { TreeDeciduous, AlertTriangle, Package, Sprout } from 'lucide-react';

const tunnelData = [
  { id: 'T1', name: 'Tunnel T1', occupied: 85, capacity: 100, status: 'normal' },
  { id: 'T2', name: 'Tunnel T2', occupied: 92, capacity: 100, status: 'normal' },
  { id: 'T3', name: 'Tunnel T3', occupied: 78, capacity: 100, status: 'mortality' },
  { id: 'T4', name: 'Tunnel T4', occupied: 65, capacity: 100, status: 'normal' },
];

export function OutdoorDashboard() {
  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="p-6 h-40 bg-gray-50 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
              <Sprout className="w-6 h-6" />
            </div>
            <Badge className="bg-green-100 text-green-700 px-3 py-1 text-xs">Active</Badge>
          </div>
          <div className="text-3xl font-bold text-right">24</div>
          <div className="text-sm text-gray-500 text-right">Batches in Primary</div>
        </Card>

        <Card className="p-6 h-40 bg-gray-50 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <TreeDeciduous className="w-6 h-6" />
            </div>
            <Badge className="bg-blue-100 text-blue-700 px-3 py-1 text-xs">Active</Badge>
          </div>
          <div className="text-3xl font-bold text-right">18</div>
          <div className="text-sm text-gray-500 text-right">Batches in Secondary</div>
        </Card>

        <Card className="p-6 h-40 bg-gray-50 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <Badge className="bg-amber-100 text-amber-700 px-3 py-1 text-xs">Holding</Badge>
          </div>
          <div className="text-3xl font-bold text-right">6</div>
          <div className="text-sm text-gray-500 text-right">Unsold Batches</div>
        </Card>

        <Card className="p-6 h-40 bg-gray-50 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <Badge className="bg-red-100 text-red-700 px-3 py-1 text-xs">Alert</Badge>
          </div>
          <div className="text-3xl font-bold text-right">47</div>
          <div className="text-sm text-gray-500 text-right">Mortality Cases Today</div>
        </Card>
      </div>

      {/* Tunnel Schematic */}
      <Card className="p-8 rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-6">Tunnel Schematic Overview</h2>
        
        <div className="grid grid-cols-4 gap-6">
          {tunnelData.map((tunnel) => (
            <div 
              key={tunnel.id}
              className={`p-5 rounded-xl shadow-md ${
                tunnel.status === 'mortality' 
                  ? 'border border-red-300 bg-red-50' 
                  : 'border border-green-300 bg-green-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{tunnel.name}</h3>
                {tunnel.status === 'mortality' && (
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                )}
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1 text-gray-600">
                  <span>Occupancy</span>
                  <span className="font-semibold">{tunnel.occupied}/{tunnel.capacity}</span>
                </div>
                <div className="w-full h-3 bg-white rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      tunnel.status === 'mortality' ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(tunnel.occupied / tunnel.capacity) * 100}%` }}
                  />
                </div>
              </div>

              {/* Tray Grid Preview */}
              <div className="grid grid-cols-5 gap-1 pt-2">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-5 rounded ${
                      i < (tunnel.occupied / 5)
                        ? tunnel.status === 'mortality' 
                          ? 'bg-red-400' 
                          : 'bg-green-400'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <div className="mt-4 text-xs text-gray-500 text-right">
                Click to expand tray details
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 flex gap-8 justify-center text-sm font-medium">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-400" />
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-300" />
            <span>Empty</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-400" />
            <span>Mortality Alert</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-400" />
            <span>Needs Attention</span>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-2 gap-6 mt-10">
        <Card className="p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Recent Transfers</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">B-2024-1145</div>
                <div className="text-sm text-gray-600">Primary → Secondary</div>
              </div>
              <div className="text-sm text-gray-500">2h ago</div>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">B-2024-1144</div>
                <div className="text-sm text-gray-600">T1 Tray 5 → T2 Tray 3</div>
              </div>
              <div className="text-sm text-gray-500">5h ago</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Mortality Alerts</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div>
                <div className="font-medium text-red-900">T3 - Batch B-2024-1142</div>
                <div className="text-sm text-red-700">47 plants - Fungal infection</div>
              </div>
              <Badge className="bg-red-600 px-3 py-1 text-xs">New</Badge>
            </div>
            <div className="flex justify-between items-center p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div>
                <div className="font-medium text-amber-900">T2 - Batch B-2024-1140</div>
                <div className="text-sm text-amber-700">12 plants - Under observation</div>
              </div>
              <Badge className="bg-amber-600 px-3 py-1 text-xs">Monitoring</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
