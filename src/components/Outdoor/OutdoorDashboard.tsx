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
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
            <Badge className="bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium border-0">Active</Badge>
          </div>
          <div className="text-2xl font-bold mb-0.5">24</div>
          <div className="text-xs text-gray-600">Batches in Primary</div>
        </Card>

        <Card className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <TreeDeciduous className="w-4 h-4" />
            </div>
            <Badge className="bg-blue-100 text-blue-700 px-2 py-0.5 text-xs font-medium border-0">Active</Badge>
          </div>
          <div className="text-2xl font-bold mb-0.5">18</div>
          <div className="text-xs text-gray-600">Batches in Secondary</div>
        </Card>

        <Card className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <Badge className="bg-amber-100 text-amber-700 px-2 py-0.5 text-xs font-medium border-0">Holding</Badge>
          </div>
          <div className="text-2xl font-bold mb-0.5">6</div>
          <div className="text-xs text-gray-600">Unsold Batches</div>
        </Card>

        <Card className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <Badge className="bg-red-100 text-red-700 px-2 py-0.5 text-xs font-medium border-0">Alert</Badge>
          </div>
          <div className="text-2xl font-bold mb-0.5">47</div>
          <div className="text-xs text-gray-600">Mortality Cases Today</div>
        </Card>
      </div>

      {/* Tunnel Schematic */}
      <Card className="p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-6">Tunnel Schematic Overview</h2>
        
        <div className="grid grid-cols-4 gap-6 mb-8">
          {tunnelData.map((tunnel) => (
            <div 
              key={tunnel.id}
              className={`p-5 rounded-2xl border-[3px] transition-all ${
                tunnel.status === 'mortality' 
                  ? 'border-red-400 bg-red-50/60 shadow-red-100 shadow-md' 
                  : 'border-green-400 bg-green-50/60 shadow-green-100 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">{tunnel.name}</h3>
                {tunnel.status === 'mortality' && (
                  <div className="bg-red-500 rounded-full p-1.5">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2 text-gray-700 font-medium">
                  <span>Occupancy</span>
                  <span className="font-bold">{tunnel.occupied}/{tunnel.capacity}</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all ${
                      tunnel.status === 'mortality' ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(tunnel.occupied / tunnel.capacity) * 100}%` }}
                  />
                </div>
              </div>

              {/* Tray Grid Preview */}
              <div className="grid grid-cols-5 gap-1.5 mb-4">
                {Array.from({ length: 20 }).map((_, i) => {
                  let trayClass = 'bg-gray-300';
                  
                  if (tunnel.status === 'mortality') {
                    trayClass = 'bg-red-400 shadow-sm';
                  } else {
                    const occupiedTrays = Math.floor((tunnel.occupied / tunnel.capacity) * 20);
                    trayClass = i < occupiedTrays ? 'bg-green-500 shadow-sm' : 'bg-gray-300';
                  }
                  
                  return (
                    <div
                      key={i}
                      className={`h-5 rounded-md ${trayClass} transition-all hover:scale-110`}
                    />
                  );
                })}
              </div>

              <div className="text-xs text-gray-600 text-center font-medium">
                Click to expand tray details
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-8 justify-center text-sm pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md bg-green-500 shadow-sm" />
            <span className="text-gray-700 font-medium">Occupied</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md bg-gray-300" />
            <span className="text-gray-700 font-medium">Empty</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md bg-red-400 shadow-sm" />
            <span className="text-gray-700 font-medium">Mortality Alert</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md bg-amber-400 shadow-sm" />
            <span className="text-gray-700 font-medium">Needs Attention</span>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Recent Transfers</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
              <div>
                <div className="font-medium text-sm">B-2024-1145</div>
                <div className="text-xs text-gray-600 mt-0.5">Primary → Secondary</div>
              </div>
              <div className="text-xs text-gray-500">2h ago</div>
            </div>
            <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
              <div>
                <div className="font-medium text-sm">B-2024-1144</div>
                <div className="text-xs text-gray-600 mt-0.5">T1 Tray 5 → T2 Tray 3</div>
              </div>
              <div className="text-xs text-gray-500">5h ago</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Mortality Alerts</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
              <div>
                <div className="font-medium text-sm text-red-900">T3 - Batch B-2024-1142</div>
                <div className="text-xs text-red-700 mt-0.5">47 plants - Fungal infection</div>
              </div>
              <Badge className="bg-red-600 text-white px-2 py-0.5 text-xs border-0">New</Badge>
            </div>
            <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
              <div>
                <div className="font-medium text-sm text-amber-900">T2 - Batch B-2024-1140</div>
                <div className="text-xs text-amber-700 mt-0.5">12 plants - Under observation</div>
              </div>
              <Badge className="bg-amber-600 text-white px-2 py-0.5 text-xs border-0">Monitoring</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
