import { Button } from '../ui/button';
import { Plus, Download, Filter, AlertTriangle } from 'lucide-react';
import { FilterBar } from '../common/FilterBar';
import { DataTable } from '../common/DataTable';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

const mortalityData = [
  {
    id: 1,
    date: '2024-11-18',
    cropName: 'Rose',
    batch: 'B-2024-1142',
    location: 'T3 / Tray 6 / C12-C20',
    mortalityType: 'Fungal',
    affectedPlants: 47,
    actionTaken: 'Removed & disposed, area sterilized',
    notes: 'High humidity suspected cause'
  },
  {
    id: 2,
    date: '2024-11-17',
    cropName: 'Gerbera',
    batch: 'B-2024-1140',
    location: 'T2 / Tray 10 / C5-C8',
    mortalityType: 'Bacterial',
    affectedPlants: 12,
    actionTaken: 'Isolated and treated',
    notes: 'Under monitoring'
  },
  {
    id: 3,
    date: '2024-11-16',
    cropName: 'Carnation',
    batch: 'B-2024-1138',
    location: 'T1 / Tray 3 / C15-C18',
    mortalityType: 'Physiological',
    affectedPlants: 8,
    actionTaken: 'Adjusted watering schedule',
    notes: 'Water stress identified'
  },
];

export function Mortality() {
  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'cropName', label: 'Crop Name' },
    { key: 'batch', label: 'Batch' },
    { key: 'location', label: 'Location' },
    { key: 'mortalityType', label: 'Mortality Type' },
    { key: 'affectedPlants', label: 'Affected Plants' },
    { key: 'actionTaken', label: 'Action Taken' },
    { key: 'notes', label: 'Notes' },
  ];

  return (
    <div className="p-6 space-y-6">
      <FilterBar 
        showCropFilter 
        showBatchFilter 
        showTunnel
        showDateRange
      />

      {/* Alert Banner */}
      <Card className="p-4 mt-6 bg-red-50 border-red-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-red-900">Mortality Alert</h3>
              <Badge className="bg-red-600">High Priority</Badge>
            </div>
            <p className="text-sm text-red-700 mb-2">
              <strong>67 plants</strong> affected by mortality this week across 3 locations. 
              Immediate action required for Tunnel T3.
            </p>
            <div className="flex gap-4 text-sm">
              <div>
                <span className="text-red-600">Fungal: </span>
                <span className="font-medium">47</span>
              </div>
              <div>
                <span className="text-red-600">Bacterial: </span>
                <span className="font-medium">12</span>
              </div>
              <div>
                <span className="text-red-600">Physiological: </span>
                <span className="font-medium">8</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2>Outdoor Mortality Register</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-[#4CAF50] hover:bg-[#66BB6A]">
              <Plus className="w-4 h-4 mr-2" />
              Report Mortality
            </Button>
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={mortalityData}
          onEdit={(row) => console.log('Edit', row)}
          onDelete={(row) => console.log('Delete', row)}
        />
      </div>
    </div>
  );
}
