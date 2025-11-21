import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Plus, Download, Filter } from 'lucide-react';
import { FilterBar } from '../common/FilterBar';
import { DataTable } from '../common/DataTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card } from '../ui/card';

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
  const [showForm, setShowForm] = useState(false);
  
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
      <FilterBar />

      {showForm && (
        <Card className="p-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2>Add Shift Entry</h2>
            <button 
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Date</Label>
              <Input type="date" />
            </div>
            <div>
              <Label>Crop Name</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rose">Rose</SelectItem>
                  <SelectItem value="gerbera">Gerbera</SelectItem>
                  <SelectItem value="carnation">Carnation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Batch</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="b2024-1145">B-2024-1145</SelectItem>
                  <SelectItem value="b2024-1144">B-2024-1144</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Old Location</Label>
              <Input placeholder="e.g., T1 / Tray 5 / C10-C20" />
            </div>
            <div>
              <Label>New Location</Label>
              <Input placeholder="e.g., T2 / Tray 12 / C1-C11" />
            </div>
            <div>
              <Label>Number of Plants</Label>
              <Input type="number" placeholder="e.g., 264" />
            </div>
            <div className="col-span-3">
              <Label>Reason for Shift</Label>
              <Input placeholder="e.g., Better light exposure" />
            </div>
            <div className="col-span-3">
              <Label>Notes</Label>
              <Textarea placeholder="Enter notes..." />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button className="bg-[#4CAF50] hover:bg-[#66BB6A]">
              Save Shift
            </Button>
          </div>
        </Card>
      )}

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
              size="sm"
              className="bg-[#4CAF50] hover:bg-[#66BB6A] text-white border-0"
              onClick={() => setShowForm(true)}
              style={{ backgroundColor: '#4CAF50', color: 'white' }}
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
