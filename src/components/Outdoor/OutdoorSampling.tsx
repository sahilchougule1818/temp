import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Plus, Download, Filter, FileCheck, X, Upload } from 'lucide-react';
import { FilterBar } from '../common/FilterBar';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const outdoorSamplingData = [
  {
    id: 1,
    sampleDate: '2024-11-18',
    cropName: 'Rose',
    batchName: 'B-2024-1145',
    stage: 'Primary Hardening',
    tunnelNo: 'T3',
    trayNo: 'TR-45',
    sentDate: '2024-11-19',
    receivedDate: '-',
    status: 'Sent',
    govtCertificate: 'Pending',
    certificateNo: '-',
    reason: '-'
  },
  {
    id: 2,
    sampleDate: '2024-11-16',
    cropName: 'Gerbera',
    batchName: 'B-2024-1142',
    stage: 'Secondary Hardening',
    tunnelNo: 'T7',
    trayNo: '-',
    sentDate: '2024-11-17',
    receivedDate: '2024-11-19',
    status: 'Received',
    govtCertificate: 'Yes',
    certificateNo: 'CERT-2024-G-788',
    reason: '-'
  },
  {
    id: 3,
    sampleDate: '2024-11-14',
    cropName: 'Carnation',
    batchName: 'B-2024-1138',
    stage: 'Primary Hardening',
    tunnelNo: 'T2',
    trayNo: 'TR-28',
    sentDate: '2024-11-15',
    receivedDate: '2024-11-18',
    status: 'Rejected',
    govtCertificate: 'No',
    certificateNo: '-',
    reason: 'Signs of viral infection detected'
  },
  {
    id: 4,
    sampleDate: '2024-11-12',
    cropName: 'Orchid',
    batchName: 'B-2024-1135',
    stage: 'Secondary Hardening',
    tunnelNo: 'T5',
    trayNo: '-',
    sentDate: '-',
    receivedDate: '-',
    status: 'Not Sent',
    govtCertificate: 'No',
    certificateNo: '-',
    reason: 'Sample collection pending'
  },
  {
    id: 5,
    sampleDate: '2024-11-10',
    cropName: 'Rose',
    batchName: 'B-2024-1130',
    stage: 'Primary Hardening',
    tunnelNo: 'T1',
    trayNo: 'TR-12',
    sentDate: '2024-11-11',
    receivedDate: '2024-11-14',
    status: 'Received',
    govtCertificate: 'Yes',
    certificateNo: 'CERT-2024-R-456',
    reason: '-'
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

export function OutdoorSampling() {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <div className="p-6 space-y-6">
      <FilterBar />

      {showForm && (
        <Card className="p-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2>Add Sample Entry</h2>
            <button 
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
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
                  <SelectItem value="primary">Primary Hardening</SelectItem>
                  <SelectItem value="secondary">Secondary Hardening</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tunnel No</Label>
              <Input placeholder="e.g., T3" />
            </div>
            <div>
              <Label>Tray No</Label>
              <Input placeholder="e.g., TR-45" />
            </div>
            <div>
              <Label>Sent Date</Label>
              <Input type="date" />
            </div>
            <div className="col-span-2">
              <Label>Reason (if rejected)</Label>
              <Input placeholder="Optional" />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button className="bg-[#4CAF50] hover:bg-[#66BB6A]">
              Save Sample
            </Button>
          </div>
        </Card>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-xs text-gray-600 mb-0.5">Total Outdoor Samples</div>
          <div className="text-2xl font-bold">35</div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-xs text-gray-600 mb-0.5">Pending Lab Results</div>
          <div className="text-2xl font-bold text-blue-600">8</div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-xs text-gray-600 mb-0.5">Certified</div>
          <div className="text-2xl font-bold text-green-600">24</div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-xs text-gray-600 mb-0.5">Rejected</div>
          <div className="text-2xl font-bold text-red-600">3</div>
        </Card>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2>Outdoor Sampling Register</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
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
              Add Sample
            </Button>
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
                  <TableHead>Tunnel No</TableHead>
                  <TableHead>Tray/Bed No</TableHead>
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
                {outdoorSamplingData.map((sample) => (
                  <TableRow key={sample.id}>
                    <TableCell>{sample.sampleDate}</TableCell>
                    <TableCell>{sample.cropName}</TableCell>
                    <TableCell className="font-medium">{sample.batchName}</TableCell>
                    <TableCell>{sample.stage}</TableCell>
                    <TableCell>
                      <span className="font-mono text-xs">{sample.tunnelNo}</span>
                    </TableCell>
                    <TableCell>
                      {sample.trayNo !== '-' ? (
                        <span className="font-mono text-xs">{sample.trayNo}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
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
