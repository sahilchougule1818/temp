import { Button } from '../ui/button';
import { Plus, Download, Filter } from 'lucide-react';
import { FilterBar } from '../common/FilterBar';
import { DataTable } from '../common/DataTable';

const shiftingData = [
  {
    id: 1,
    date: '2024-11-18',
    cropName: 'Rose',
    batch: 'B-2024-1145',
    oldLocation: 'T1 / Tray 5 / C10-C20',
    newLocation: 'T2 / Tray 12 / C1-C11',
    plants: 264,
    reason: 'Better light exposure',
    notes: 'Completed successfully'
  },
  {
    id: 2,
    date: '2024-11-17',
    cropName: 'Gerbera',
    batch: 'B-2024-1144',
    oldLocation: 'T3 / Tray 8 / C15-C25',
    newLocation: 'T1 / Tray 15 / C30-C40',
    plants: 264,
    reason: 'Mortality in old location',
    notes: 'Preventive shift'
  },
];

export function Shifting() {
  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'cropName', label: 'Crop Name' },
    { key: 'batch', label: 'Batch' },
    { key: 'oldLocation', label: 'Old Location' },
    { key: 'newLocation', label: 'New Location' },
    { key: 'plants', label: 'Plants' },
    { key: 'reason', label: 'Reason' },
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

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2>Shifting Register</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              className="bg-[#4CAF50] hover:bg-[#66BB6A]"
              onClick={() => console.log('Add Shift clicked - Form will open')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Shift
            </Button>
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={shiftingData}
          onEdit={(row) => console.log('Edit', row)}
          onDelete={(row) => console.log('Delete', row)}
        />
      </div>
    </div>
  );
}
