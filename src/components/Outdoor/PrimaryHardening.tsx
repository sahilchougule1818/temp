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

const primaryData = [
  {
    id: 1,
    date: '2024-11-18',
    cropName: 'Rose',
    batchName: 'B-2024-1145',
    tunnel: 'T1',
    tray: 'Tray 12',
    cavity: 'C1-C50',
    plants: 1200,
    workers: 4,
    waitingPeriod: 14,
    notes: 'Good acclimatization'
  },
  {
    id: 2,
    date: '2024-11-17',
    cropName: 'Gerbera',
    batchName: 'B-2024-1144',
    tunnel: 'T2',
    tray: 'Tray 8',
    cavity: 'C1-C40',
    plants: 960,
    workers: 3,
    waitingPeriod: 14,
    notes: 'Monitoring growth'
  },
];

export function PrimaryHardening() {
  const [showForm, setShowForm] = useState(false);

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'cropName', label: 'Crop Name' },
    { key: 'batchName', label: 'Batch Name' },
    { key: 'tunnel', label: 'Tunnel' },
    { key: 'tray', label: 'Tray' },
    { key: 'cavity', label: 'Cavity' },
    { key: 'plants', label: 'Plants' },
    { key: 'workers', label: 'Workers' },
    { key: 'waitingPeriod', label: 'Days' },
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

      {showForm && (
        <Card className="p-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2>Add Primary Hardening Entry</h2>
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
              <Label>Batch Name</Label>
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
              <Label>Tunnel</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select tunnel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="t1">Tunnel T1</SelectItem>
                  <SelectItem value="t2">Tunnel T2</SelectItem>
                  <SelectItem value="t3">Tunnel T3</SelectItem>
                  <SelectItem value="t4">Tunnel T4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tray</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select tray" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tray1">Tray 1 (Available: 50)</SelectItem>
                  <SelectItem value="tray2">Tray 2 (Available: 40)</SelectItem>
                  <SelectItem value="tray3">Tray 3 (Available: 60)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cavity Range</Label>
              <Input placeholder="e.g., C1-C50" />
            </div>
            <div>
              <Label>Number of Plants</Label>
              <Input type="number" placeholder="e.g., 1200" />
            </div>
            <div>
              <Label>Number of Workers</Label>
              <Input type="number" placeholder="e.g., 4" />
            </div>
            <div>
              <Label>Waiting Period (days)</Label>
              <Input type="number" placeholder="e.g., 14" />
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
              Save Entry
            </Button>
          </div>
        </Card>
      )}

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2>Primary Hardening Register</h2>
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
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={primaryData}
          onEdit={(row) => console.log('Edit', row)}
          onDelete={(row) => console.log('Delete', row)}
        />
      </div>
    </div>
  );
}
