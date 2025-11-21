import { Button } from '../ui/button';
import { Plus, Download, Filter } from 'lucide-react';
import { FilterBar } from '../common/FilterBar';
import { DataTable } from '../common/DataTable';

const fertilizationData = [
  {
    id: 1,
    date: '2024-11-18',
    cropName: 'Rose',
    batch: 'B-2024-1145',
    activityType: 'Fertilization',
    materialsUsed: 'NPK 19:19:19',
    quantity: '5kg',
    operator: 'Rajesh Kumar',
    notes: 'Foliar spray applied'
  },
  {
    id: 2,
    date: '2024-11-17',
    cropName: 'Gerbera',
    batch: 'B-2024-1144',
    activityType: 'Pest Control',
    materialsUsed: 'Neem Oil',
    quantity: '2L',
    operator: 'Priya Sharma',
    notes: 'Preventive application'
  },
  {
    id: 3,
    date: '2024-11-16',
    cropName: 'Carnation',
    batch: 'B-2024-1143',
    activityType: 'Pruning',
    materialsUsed: 'N/A',
    quantity: '-',
    operator: 'Amit Patel',
    notes: 'Dead leaves removed'
  },
];

export function Fertilization() {
  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'cropName', label: 'Crop Name' },
    { key: 'batch', label: 'Batch' },
    { key: 'activityType', label: 'Activity Type' },
    { key: 'materialsUsed', label: 'Materials Used' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'operator', label: 'Operator' },
    { key: 'notes', label: 'Notes' },
  ];

  return (
    <div className="p-6 space-y-6">
      <FilterBar 
        showCropFilter 
        showBatchFilter 
        showOperator
        showDateRange
      />

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2>Fertilization & Maintenance Register</h2>
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
              size="sm"
              className="bg-[#4CAF50] hover:bg-[#66BB6A] text-white"
              onClick={() => console.log('Add Activity clicked - Form will open')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={fertilizationData}
          onEdit={(row) => console.log('Edit', row)}
          onDelete={(row) => console.log('Delete', row)}
        />
      </div>
    </div>
  );
}
