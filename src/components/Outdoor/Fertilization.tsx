import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Plus, Download, Eye } from 'lucide-react';
import { FilterBar } from '../common/FilterBar';
import { DataTable } from '../common/DataTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllRecords, setShowAllRecords] = useState(false);
  
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

  const filteredData = showAllRecords ? fertilizationData : fertilizationData.filter(record => {
    const recordDate = new Date(record.date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - recordDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });

  return (
    <div className="p-6 space-y-6">
      <FilterBar />

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2>Fertilization & Maintenance Register</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAllRecords(!showAllRecords)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showAllRecords ? 'Show Today Only' : 'View All Records'}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="sm"
                  className="bg-[#4CAF50] hover:bg-[#66BB6A] text-white border-0"
                  style={{ backgroundColor: '#4CAF50', color: 'white' }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Activity
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Fertilization/Maintenance Activity</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 py-4">
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
                    <Label>Activity Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fertilization">Fertilization</SelectItem>
                        <SelectItem value="pest-control">Pest Control</SelectItem>
                        <SelectItem value="pruning">Pruning</SelectItem>
                        <SelectItem value="watering">Watering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Materials Used</Label>
                    <Input placeholder="e.g., NPK 19:19:19" />
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input placeholder="e.g., 5kg" />
                  </div>
                  <div>
                    <Label>Operator</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rajesh">Rajesh Kumar</SelectItem>
                        <SelectItem value="priya">Priya Sharma</SelectItem>
                        <SelectItem value="amit">Amit Patel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Label>Notes</Label>
                    <Textarea placeholder="Enter notes..." />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-[#4CAF50] hover:bg-[#66BB6A]"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Save Activity
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={filteredData}
          onEdit={(row) => console.log('Edit', row)}
          onDelete={(row) => console.log('Delete', row)}
        />
      </div>
    </div>
  );
}
