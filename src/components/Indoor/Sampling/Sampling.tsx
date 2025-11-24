import { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Plus, Download, FileCheck, X, Upload, Edit2 } from 'lucide-react';
import { FilterBar } from '../../common/FilterBar';
import { BackToMainDataButton } from '../../common/BackToMainDataButton';
import { useSearchFilter } from '../../../hooks/useSearchFilter';
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
  const samplingFilter = useSearchFilter({
    sourceData: samplingData,
    field1Accessor: (record) => record.cropName,
    field2Accessor: (record) => record.batchName
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    sampleDate: '',
    cropName: '',
    batchName: '',
    stage: '',
    sentDate: '',
    receivedDate: '',
    status: '',
    govtCertificate: '',
    certificateNo: '',
    reason: ''
  });

  const availableDates = Array.from(new Set(samplingData.map(record => record.sampleDate))).sort();

  const availableBatches = selectedDate 
    ? Array.from(new Set(samplingData.filter(record => record.sampleDate === selectedDate).map(record => record.batchName)))
    : [];

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedBatch('');
    setFormData({
      sampleDate: '',
      cropName: '',
      batchName: '',
      stage: '',
      sentDate: '',
      receivedDate: '',
      status: '',
      govtCertificate: '',
      certificateNo: '',
      reason: ''
    });
    setEditingId(null);
  };

  const handleBatchSelect = (batch: string) => {
    setSelectedBatch(batch);
    const recordData = samplingData.find(record => record.sampleDate === selectedDate && record.batchName === batch);
    if (recordData) {
      setFormData({
        sampleDate: recordData.sampleDate,
        cropName: recordData.cropName,
        batchName: recordData.batchName,
        stage: recordData.stage,
        sentDate: recordData.sentDate,
        receivedDate: recordData.receivedDate,
        status: recordData.status,
        govtCertificate: recordData.govtCertificate,
        certificateNo: recordData.certificateNo,
        reason: recordData.reason
      });
      setEditingId(recordData.id);
    }
  };

  const resetForm = () => {
    setSelectedDate('');
    setSelectedBatch('');
    setEditingId(null);
    setFormData({
      sampleDate: '',
      cropName: '',
      batchName: '',
      stage: '',
      sentDate: '',
      receivedDate: '',
      status: '',
      govtCertificate: '',
      certificateNo: '',
      reason: ''
    });
  };

  const filteredData = samplingFilter.visibleData;
  
  return (
    <div className="p-6 space-y-6">
      <FilterBar 
        field1={{
          label: 'Crop Name',
          value: samplingFilter.selectedField1,
          onChange: samplingFilter.handleField1Change,
          options: samplingFilter.field1Options,
          placeholder: 'Select crop'
        }}
        field2={{
          label: 'Batch Name',
          value: samplingFilter.selectedField2,
          onChange: samplingFilter.handleField2Change,
          options: samplingFilter.field2Options,
          placeholder: 'Select batch'
        }}
        onSearch={samplingFilter.handleSearch}
      />

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
            <BackToMainDataButton 
              isVisible={samplingFilter.isFiltered}
              onClick={samplingFilter.handleReset}
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit
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

        {/* Edit Dialog */}
        <Dialog open={isEditModalOpen} onOpenChange={(open: boolean) => {
          setIsEditModalOpen(open);
          if (!open) resetForm();
        }}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Sampling Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Select Date</Label>
                  <Select value={selectedDate} onValueChange={handleDateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDates.map(date => (
                        <SelectItem key={date} value={date}>{date}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Select Batch Name</Label>
                  <Select value={selectedBatch} onValueChange={handleBatchSelect} disabled={!selectedDate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBatches.map(batch => (
                        <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {editingId && (
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <Label>Sample Date</Label>
                    <Input type="date" value={formData.sampleDate} onChange={(e) => setFormData({...formData, sampleDate: e.target.value})} />
                  </div>
                  <div>
                    <Label>Crop Name</Label>
                    <Input value={formData.cropName} onChange={(e) => setFormData({...formData, cropName: e.target.value})} />
                  </div>
                  <div>
                    <Label>Batch Name</Label>
                    <Input value={formData.batchName} onChange={(e) => setFormData({...formData, batchName: e.target.value})} />
                  </div>
                  <div>
                    <Label>Stage</Label>
                    <Select value={formData.stage} onValueChange={(value) => setFormData({...formData, stage: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Stage 6">Stage 6</SelectItem>
                        <SelectItem value="Primary">Primary</SelectItem>
                        <SelectItem value="Stage 8">Stage 8</SelectItem>
                        <SelectItem value="Secondary">Secondary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Sent Date</Label>
                    <Input type="date" value={formData.sentDate} onChange={(e) => setFormData({...formData, sentDate: e.target.value})} />
                  </div>
                  <div>
                    <Label>Received Date</Label>
                    <Input type="date" value={formData.receivedDate} onChange={(e) => setFormData({...formData, receivedDate: e.target.value})} />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not Sent">Not Sent</SelectItem>
                        <SelectItem value="Sent">Sent</SelectItem>
                        <SelectItem value="Received">Received</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Govt Certificate</Label>
                    <Select value={formData.govtCertificate} onValueChange={(value) => setFormData({...formData, govtCertificate: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Certificate No</Label>
                    <Input value={formData.certificateNo} onChange={(e) => setFormData({...formData, certificateNo: e.target.value})} />
                  </div>
                  <div className="col-span-3">
                    <Label>Reason (if rejected)</Label>
                    <Input value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} />
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between gap-3">
              <Button 
                variant="destructive"
                onClick={() => {
                  console.log('Deleting entry:', editingId);
                  setIsEditModalOpen(false);
                  resetForm();
                }}
                disabled={!editingId}
              >
                Delete Entry
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => {
                  setIsEditModalOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button 
                  variant={null as any}
                  style={{ backgroundColor: '#4CAF50', color: 'white' }}
                  className="hover:bg-[#66BB6A] font-medium shadow-sm"
                  onClick={() => {
                    console.log('Saving changes:', formData);
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                  disabled={!editingId}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

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
