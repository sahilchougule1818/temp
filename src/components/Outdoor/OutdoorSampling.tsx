import { Button } from '../ui/button';
import { Plus, Download, Filter, FileCheck, X, Upload } from 'lucide-react';
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
  return (
    <div className="p-6 space-y-6">
      <Card className="p-5 mb-6">
        <div className="grid grid-cols-5 gap-4">
          <div>
            <label className="block text-sm mb-1.5">Crop Name</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All crops" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                <SelectItem value="rose">Rose</SelectItem>
                <SelectItem value="gerbera">Gerbera</SelectItem>
                <SelectItem value="carnation">Carnation</SelectItem>
                <SelectItem value="orchid">Orchid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-1.5">Batch Name</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All batches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                <SelectItem value="b2024-1145">B-2024-1145</SelectItem>
                <SelectItem value="b2024-1142">B-2024-1142</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-1.5">Stage</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="primary">Primary Hardening</SelectItem>
                <SelectItem value="secondary">Secondary Hardening</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-1.5">Status</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="not-sent">Not Sent</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-1.5">Govt Certificate</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

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
              className="bg-[#4CAF50] hover:bg-[#66BB6A]"
              onClick={() => console.log('Add Sample clicked - Form will open')}
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
