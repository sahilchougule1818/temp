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
      <Card className="p-6 bg-white border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-5">Tunnel Schematic Overview</h2>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          {tunnelData.map((tunnel) => (
            <div 
              key={tunnel.id}
              className={`p-4 rounded-lg border-2 ${
                tunnel.status === 'mortality' 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-green-300 bg-green-50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-base">{tunnel.name}</h3>
                {tunnel.status === 'mortality' && (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1.5 text-gray-700">
                  <span>Occupancy</span>
                  <span className="font-semibold">{tunnel.occupied}/{tunnel.capacity}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      tunnel.status === 'mortality' ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(tunnel.occupied / tunnel.capacity) * 100}%` }}
                  />
                </div>
              </div>

              {/* Tray Grid Preview */}
              <div className="grid grid-cols-5 gap-1 mb-3">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-4 rounded ${
                      i < (tunnel.occupied / 5)
                        ? tunnel.status === 'mortality' 
                          ? 'bg-red-400' 
                          : 'bg-green-400'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <div className="text-xs text-gray-500 text-center">
                Click to expand tray details
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-6 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-400" />
            <span className="text-gray-700">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200" />
            <span className="text-gray-700">Empty</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-400" />
            <span className="text-gray-700">Mortality Alert</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-400" />
            <span className="text-gray-700">Needs Attention</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
