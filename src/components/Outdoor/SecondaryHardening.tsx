import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Plus, Download, Filter, ArrowRight } from 'lucide-react';
import { FilterBar } from '../common/FilterBar';
import { DataTable } from '../common/DataTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card } from '../ui/card';

const secondaryData = [
  {
    id: 1,
    transferDate: '2024-11-18',
    cropName: 'Rose',
    batchName: 'B-2024-1145',
    from: 'T1 / Tray 12 / C1-C50',
    toBed: 'Bed B1',
    plants: 1200,
    notes: 'Transferred after 14 days primary'
  },
  {
    id: 2,
    transferDate: '2024-11-16',
    cropName: 'Gerbera',
    batchName: 'B-2024-1143',
    from: 'T2 / Tray 8 / C1-C40',
    toBed: 'Bed B3',
    plants: 960,
    notes: 'Good root development'
  },
];

export function SecondaryHardening() {
  const [showForm, setShowForm] = useState(false);

  const columns = [
    { key: 'transferDate', label: 'Transfer Date' },
    { key: 'cropName', label: 'Crop Name' },
    { key: 'batchName', label: 'Batch Name' },
    { key: 'from', label: 'From (Primary)' },
    { key: 'toBed', label: 'To Bed (Secondary)' },
    { key: 'plants', label: 'Plants' },
    { key: 'notes', label: 'Notes' },
  ];

  return (
    <div className="p-6 space-y-6">
      <FilterBar 
        showCropFilter 
        showBatchFilter 
        showDateRange
      />

      {showForm && (
        <Card className="p-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2>Transfer to Secondary Hardening</h2>
            <button 
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Transfer Date</Label>
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

            {/* From Section */}
            <div className="col-span-2 border-t pt-4 mt-2">
              <h3 className="mb-3 flex items-center gap-2">
                <span>From — Primary Location</span>
              </h3>
              <div className="grid grid-cols-3 gap-4">
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
                      <SelectItem value="tray12">Tray 12</SelectItem>
                      <SelectItem value="tray8">Tray 8</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Cavity</Label>
                  <Input placeholder="e.g., C1-C50" />
                </div>
              </div>
            </div>

            <div className="col-span-2 flex justify-center py-2">
              <ArrowRight className="w-6 h-6 text-[#4CAF50]" />
            </div>

            {/* To Section */}
            <div className="col-span-2 border-t pt-4">
              <h3 className="mb-3">To — Secondary Bed</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Bed</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="b1">Bed B1 (Available: 1500)</SelectItem>
                      <SelectItem value="b2">Bed B2 (Available: 1200)</SelectItem>
                      <SelectItem value="b3">Bed B3 (Available: 2000)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Number of Plants</Label>
                  <Input type="number" placeholder="e.g., 1200" />
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <Label>Notes</Label>
              <Textarea placeholder="Enter transfer notes..." />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button className="bg-[#4CAF50] hover:bg-[#66BB6A]">
              Save Transfer
            </Button>
          </div>
        </Card>
      )}

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2>Secondary Hardening Register</h2>
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
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Transfer
            </Button>
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={secondaryData}
          onEdit={(row) => console.log('Edit', row)}
          onDelete={(row) => console.log('Delete', row)}
        />
      </div>
    </div>
  );
}
