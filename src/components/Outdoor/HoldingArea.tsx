import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Plus, Download, Eye } from 'lucide-react';
import { FilterBar } from '../common/FilterBar';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

const holdingData = [
  {
    id: 1,
    batchName: 'B-2024-1145',
    cropName: 'Rose',
    quantity: 1200,
    dateEntered: '2024-11-15',
    daysInHolding: 3,
    remarks: 'Awaiting sales order'
  },
  {
    id: 2,
    batchName: 'B-2024-1140',
    cropName: 'Gerbera',
    quantity: 850,
    dateEntered: '2024-11-10',
    daysInHolding: 8,
    remarks: 'Customer delayed pickup'
  },
  {
    id: 3,
    batchName: 'B-2024-1135',
    cropName: 'Carnation',
    quantity: 650,
    dateEntered: '2024-10-28',
    daysInHolding: 21,
    remarks: 'Excess inventory - needs clearance'
  },
  {
    id: 4,
    batchName: 'B-2024-1132',
    cropName: 'Orchid',
    quantity: 420,
    dateEntered: '2024-10-15',
    daysInHolding: 34,
    remarks: 'Long-term holding - quality check needed'
  },
];

function getAgeBadge(days: number) {
  if (days <= 7) {
    return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Fresh (0-7 days)</Badge>;
  } else if (days <= 21) {
    return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Moderate (8-21 days)</Badge>;
  } else {
    return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Ageing (22+ days)</Badge>;
  }
}

export function HoldingArea() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllRecords, setShowAllRecords] = useState(false);
  
  return (
    <div className="p-6 space-y-6">
      <FilterBar />

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-xs text-gray-600 mb-0.5">Total Batches</div>
          <div className="text-2xl font-bold">6</div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-xs text-gray-600 mb-0.5">Fresh (0-7 days)</div>
          <div className="text-2xl font-bold text-green-600">2</div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-xs text-gray-600 mb-0.5">Moderate (8-21 days)</div>
          <div className="text-2xl font-bold text-amber-600">2</div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-xs text-gray-600 mb-0.5">Ageing (22+ days)</div>
          <div className="text-2xl font-bold text-red-600">2</div>
        </Card>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2>Holding Area Register</h2>
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
                  Add to Holding
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add to Holding Area</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 py-4">
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
                    <Label>Quantity</Label>
                    <Input type="number" placeholder="e.g., 1200" />
                  </div>
                  <div>
                    <Label>Date Entered</Label>
                    <Input type="date" />
                  </div>
                  <div className="col-span-2">
                    <Label>Remarks</Label>
                    <Textarea placeholder="Enter remarks..." />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-[#4CAF50] hover:bg-[#66BB6A]">
                    Save to Holding
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Batch Name</TableHead>
                  <TableHead>Crop</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Date Entered</TableHead>
                  <TableHead>Days in Holding</TableHead>
                  <TableHead>Age Status</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdingData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.batchName}</TableCell>
                    <TableCell>{row.cropName}</TableCell>
                    <TableCell>{row.quantity}</TableCell>
                    <TableCell>{row.dateEntered}</TableCell>
                    <TableCell className="font-semibold">{row.daysInHolding} days</TableCell>
                    <TableCell>{getAgeBadge(row.daysInHolding)}</TableCell>
                    <TableCell>{row.remarks}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
