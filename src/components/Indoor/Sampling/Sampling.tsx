import { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Plus, Download, FileCheck, X, Upload } from 'lucide-react';
import { FilterBar } from '../../common/FilterBar';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Card } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';

const samplingData = [
  {
    id: 1,
    sampleDate: '2024-11-15',
    cropName: 'Rose',
    batchName: 'B-2024-1145',
    stage: 'Stage 6',
    sentDate: '2024-11-16',
    receivedDate: '2024-11-18',
    status: 'Received',
    govtCertificate: 'Yes',
    certificateNo: 'CERT-2024-R-445',
    reason: '-'
  },
  {
    id: 2,
    sampleDate: '2024-11-12',
    cropName: 'Gerbera',
    batchName: 'B-2024-1144',
    stage: 'Primary',
    sentDate: '2024-11-13',
    receivedDate: '-',
    status: 'Sent',
    govtCertificate: 'Pending',
    certificateNo: '-',
    reason: '-'
  },
  {
    id: 3,
    sampleDate: '2024-11-10',
    cropName: 'Carnation',
    batchName: 'B-2024-1140',
    stage: 'Stage 8',
    sentDate: '2024-11-11',
    receivedDate: '2024-11-14',
    status: 'Rejected',
    govtCertificate: 'No',
    certificateNo: '-',
    reason: 'Incomplete sample documentation'
  },
  {
    id: 4,
    sampleDate: '2024-11-08',
    cropName: 'Orchid',
    batchName: 'B-2024-1138',
    stage: 'Secondary',
    sentDate: '-',
    receivedDate: '-',
    status: 'Not Sent',
    govtCertificate: 'No',
    certificateNo: '-',
    reason: 'Sample collection pending'
  },
];

function getStatusBadge(status: string) {
  const statusMap: { [key: string]: string } = {
    'Received': 'bg-green-100 text-green-700',
    'Sent': 'bg-blue-100 text-blue-700',
    'Rejected': 'bg-red-100 text-red-700',
    'Not Sent': 'bg-gray-100 text-gray-700',
  };
  return <Badge className={statusMap[status] || 'bg-gray-100 text-gray-700'}>{status}</Badge>;
}

function getCertificateBadge(certificate: string) {
  if (certificate === 'Yes') {
    return <Badge className="bg-green-100 text-green-700"><FileCheck className="w-3 h-3 mr-1" />Yes</Badge>;
  } else if (certificate === 'Pending') {
    return <Badge className="bg-amber-100 text-amber-700">Pending</Badge>;
  } else {
    return <Badge className="bg-gray-100 text-gray-700"><X className="w-3 h-3 mr-1" />No</Badge>;
  }
}

export function Sampling() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredData = samplingData;
  
  return (
    <div className="p-6 space-y-6">
      <FilterBar />

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-xs text-gray-600 mb-0.5">Total Samples</div>
          <div className="text-2xl font-bold">48</div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-xs text-gray-600 mb-0.5">Pending Lab Results</div>
          <div className="text-2xl font-bold text-blue-600">12</div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-xs text-gray-600 mb-0.5">Certified</div>
          <div className="text-2xl font-bold text-green-600">32</div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-xs text-gray-600 mb-0.5">Rejected</div>
          <div className="text-2xl font-bold text-red-600">4</div>
        </Card>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2>Sampling Register</h2>
          <div className="flex gap-2">
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
                  Add Sample
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Sample Entry</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 py-4">
                  <div>
                    <Label>Sample Date</Label>
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
                    <Label>Stage</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stage1">Stage 1-2</SelectItem>
                        <SelectItem value="stage3">Stage 3-4</SelectItem>
                        <SelectItem value="stage5">Stage 5-6</SelectItem>
                        <SelectItem value="stage7">Stage 7-8</SelectItem>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Sent Date</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Received Date</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-sent">Not Sent</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="received">Received</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Govt Certificate</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Certificate No</Label>
                    <Input placeholder="e.g., CERT-2024-R-445" />
                  </div>
                  <div className="col-span-3">
                    <Label>Reason (if rejected)</Label>
                    <Input placeholder="Optional" />
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
                    Save Sample
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
                  <TableHead>Sample Date</TableHead>
                  <TableHead>Crop Name</TableHead>
                  <TableHead>Batch Name</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Sent Date</TableHead>
                  <TableHead>Received Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Govt Certificate</TableHead>
                  <TableHead>Certificate No</TableHead>
                  <TableHead>Reason (if rejected)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((sample) => (
                  <TableRow key={sample.id}>
                    <TableCell>{sample.sampleDate}</TableCell>
                    <TableCell>{sample.cropName}</TableCell>
                    <TableCell className="font-medium">{sample.batchName}</TableCell>
                    <TableCell>{sample.stage}</TableCell>
                    <TableCell>{sample.sentDate}</TableCell>
                    <TableCell>{sample.receivedDate}</TableCell>
                    <TableCell>{getStatusBadge(sample.status)}</TableCell>
                    <TableCell>{getCertificateBadge(sample.govtCertificate)}</TableCell>
                    <TableCell>
                      {sample.certificateNo !== '-' ? (
                        <span className="font-mono text-xs">{sample.certificateNo}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {sample.reason !== '-' ? (
                        <span className="text-sm text-red-600">{sample.reason}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        {sample.govtCertificate === 'No' && sample.status !== 'Rejected' && (
                          <Button variant="ghost" size="sm" className="text-[#4CAF50]">
                            <Upload className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
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
