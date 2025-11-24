import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Plus, Edit2, Trash2, Download } from 'lucide-react';
import { FilterBar } from '../common/FilterBar';
import { BackToMainDataButton } from '../common/BackToMainDataButton';
import { useSearchFilter } from '../../hooks/useSearchFilter';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

// Sample Media Preparation autoclave cycles data (in real app, this would come from shared state/context)
const mediaPrepAutoclaveCycles = [
  { id: 1, date: '2024-11-15', mediaCode: 'MS-001', operator: 'Amit Shah', typeOfMedia: 'Bamboo', autoclaveOn: '09:00', mediaLoading: '09:15', pressure: '10:00', off: '11:30', open: '12:00', mediaTotal: '3:00', remark: 'Normal cycle' },
  { id: 2, date: '2024-11-15', mediaCode: 'MS-002', operator: 'Priya Patel', typeOfMedia: 'Banana', autoclaveOn: '13:00', mediaLoading: '13:10', pressure: '13:45', off: '15:15', open: '15:45', mediaTotal: '2:45', remark: 'Good' },
  { id: 3, date: '2024-11-14', mediaCode: 'MS-003', operator: 'Rahul Desai', typeOfMedia: 'Teak', autoclaveOn: '08:30', mediaLoading: '08:45', pressure: '09:30', off: '11:00', open: '11:30', mediaTotal: '3:00', remark: '-' },
  { id: 4, date: '2024-11-14', mediaCode: 'MS-004', operator: 'Neha Singh', typeOfMedia: 'Ornamental', autoclaveOn: '14:00', mediaLoading: '14:15', pressure: '15:00', off: '16:30', open: '17:00', mediaTotal: '3:00', remark: 'Extended cycle' }
];

type SubcultureData = {
  id: number;
  transferDate: string;
  stageNumber: string;
  batchCode: string;
  mediaCode: string;
  cropName: string;
  vessels: number;
  shoots: number;
  operator: string;
  contamination: string;
  remark: string;
};

export function Subculturing() {
  // Get today's date
  const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDate = getTodayDate();

  const [subcultureData, setSubcultureData] = useState<SubcultureData[]>([
    { id: 1, transferDate: todayDate, stageNumber: 'Stage 3', batchCode: 'BTH-2024-001', mediaCode: 'MS-001', cropName: 'Banana', vessels: 120, shoots: 2400, operator: 'Amit Shah', contamination: 'None', remark: 'Good growth' },
    { id: 2, transferDate: '2024-11-15', stageNumber: 'Stage 2', batchCode: 'BTH-2024-002', mediaCode: 'MS-002', cropName: 'Bamboo', vessels: 80, shoots: 1600, operator: 'Priya Patel', contamination: '2 vessels', remark: 'Minor contamination' },
    { id: 3, transferDate: '2024-11-14', stageNumber: 'Stage 4', batchCode: 'BTH-2024-003', mediaCode: 'MS-001', cropName: 'Teak', vessels: 150, shoots: 3000, operator: 'Rahul Desai', contamination: 'None', remark: 'Excellent' },
    { id: 4, transferDate: '2024-11-14', stageNumber: 'Stage 1', batchCode: 'BTH-2024-004', mediaCode: 'MS-003', cropName: 'Ornamental', vessels: 100, shoots: 2000, operator: 'Neha Singh', contamination: 'None', remark: 'New batch' },
    { id: 5, transferDate: '2024-11-13', stageNumber: 'Stage 2', batchCode: 'BTH-2024-005', mediaCode: 'MS-002', cropName: 'Banana', vessels: 90, shoots: 1800, operator: 'Amit Shah', contamination: '1 vessel', remark: 'Monitoring' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');

  // Search filter (Crop Name → Batch Name)
  const subcultureFilter = useSearchFilter({
    sourceData: subcultureData,
    field1Accessor: (item) => item.cropName,
    field2Accessor: (item) => item.batchCode,
  });
  
  const [subcultureForm, setSubcultureForm] = useState({
    transferDate: '',
    stageNumber: '',
    batchCode: '',
    mediaCode: '',
    cropName: '',
    vessels: '',
    shoots: '',
    operator: '',
    contamination: '',
    remark: ''
  });

  const handleSave = () => {
    if (editingId) {
      setSubcultureData(subcultureData.map(item => 
        item.id === editingId 
          ? { ...item, ...subcultureForm, vessels: parseInt(subcultureForm.vessels) || 0, shoots: parseInt(subcultureForm.shoots) || 0 }
          : item
      ));
    } else {
      const maxId = subcultureData.length > 0 ? Math.max(...subcultureData.map(i => i.id)) : 0;
      const newId = maxId + 1;
      setSubcultureData([...subcultureData, { 
        id: newId, 
        ...subcultureForm, 
        vessels: parseInt(subcultureForm.vessels) || 0, 
        shoots: parseInt(subcultureForm.shoots) || 0 
      } as SubcultureData]);
    }
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    resetForm();
  };

  // Get all available dates from subcultureData (sorted)
  const availableDates = useMemo(() => {
    return Array.from(new Set(subcultureData.map(record => record.transferDate))).sort();
  }, [subcultureData]);

  // Get available batch names for selected date
  const availableBatches = useMemo(() => {
    if (!selectedDate) return [];
    return Array.from(new Set(subcultureData.filter(record => record.transferDate === selectedDate).map(record => record.batchCode)));
  }, [selectedDate, subcultureData]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedBatch('');
    setSubcultureForm({
      transferDate: '',
      stageNumber: '',
      batchCode: '',
      mediaCode: '',
      cropName: '',
      vessels: '',
      shoots: '',
      operator: '',
      contamination: '',
      remark: ''
    });
    setEditingId(null);
  };

  const handleBatchSelect = (batch: string) => {
    setSelectedBatch(batch);
  };

  const handleSearch = () => {
    const recordData = subcultureData.find(record => record.transferDate === selectedDate && record.batchCode === selectedBatch);
    if (recordData) {
      setSubcultureForm({
        transferDate: recordData.transferDate,
        stageNumber: recordData.stageNumber,
        batchCode: recordData.batchCode,
        mediaCode: recordData.mediaCode,
        cropName: recordData.cropName,
        vessels: String(recordData.vessels),
        shoots: String(recordData.shoots),
        operator: recordData.operator,
        contamination: recordData.contamination,
        remark: recordData.remark
      });
      setEditingId(recordData.id);
    }
  };

  const handleSaveChanges = () => {
    if (editingId) {
      setSubcultureData(subcultureData.map(item => 
        item.id === editingId 
          ? { ...item, ...subcultureForm, vessels: parseInt(subcultureForm.vessels) || 0, shoots: parseInt(subcultureForm.shoots) || 0 }
          : item
      ));
    }
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeleteEntry = () => {
    if (editingId) {
      setSubcultureData(subcultureData.filter(item => item.id !== editingId));
    }
    setIsEditModalOpen(false);
    setDeleteConfirmOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedDate('');
    setSelectedBatch('');
    setEditingId(null);
    setSubcultureForm({
      transferDate: '',
      stageNumber: '',
      batchCode: '',
      mediaCode: '',
      cropName: '',
      vessels: '',
      shoots: '',
      operator: '',
      contamination: '',
      remark: ''
    });
  };


  return (
    <div className="p-6 space-y-6">
      <FilterBar 
        field1={{
          label: 'Crop Name',
          value: subcultureFilter.selectedField1,
          onChange: subcultureFilter.handleField1Change,
          options: subcultureFilter.field1Options,
          placeholder: 'Select crop'
        }}
        field2={{
          label: 'Batch Name',
          value: subcultureFilter.selectedField2,
          onChange: subcultureFilter.handleField2Change,
          options: subcultureFilter.field2Options,
          placeholder: 'Select batch name'
        }}
        onSearch={subcultureFilter.handleSearch}
      />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Subculturing Register</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <BackToMainDataButton 
                isVisible={subcultureFilter.isFiltered}
                onClick={subcultureFilter.handleReset}
              />
              <Button 
                variant="outline" 
                onClick={() => {
                  resetForm();
                  setIsEditModalOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Dialog open={isModalOpen} onOpenChange={(open: boolean) => {
                setIsModalOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button 
                    variant={null as any}
                    style={{ backgroundColor: '#4CAF50', color: 'white' }}
                    className="hover:bg-[#66BB6A] font-medium shadow-sm"
                    onClick={() => resetForm()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Transfer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Subculture Transfer</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Transfer Date</Label>
                      <Input 
                        type="date" 
                        value={subcultureForm.transferDate}
                        onChange={(e) => setSubcultureForm({...subcultureForm, transferDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Stage Number</Label>
                      <Select value={subcultureForm.stageNumber} onValueChange={(value: string) => setSubcultureForm({...subcultureForm, stageNumber: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Stage 1">Stage 1</SelectItem>
                          <SelectItem value="Stage 2">Stage 2</SelectItem>
                          <SelectItem value="Stage 3">Stage 3</SelectItem>
                          <SelectItem value="Stage 4">Stage 4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Batch Name</Label>
                      <Input 
                        placeholder="BTH-2024-001" 
                        value={subcultureForm.batchCode}
                        onChange={(e) => setSubcultureForm({...subcultureForm, batchCode: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Media Code</Label>
                      <Input 
                        placeholder="MS-001" 
                        value={subcultureForm.mediaCode}
                        onChange={(e) => setSubcultureForm({...subcultureForm, mediaCode: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Crop Name</Label>
                      <Input 
                        placeholder="Banana" 
                        value={subcultureForm.cropName}
                        onChange={(e) => setSubcultureForm({...subcultureForm, cropName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Number of Vessels</Label>
                      <Input 
                        type="number" 
                        placeholder="120" 
                        value={subcultureForm.vessels}
                        onChange={(e) => setSubcultureForm({...subcultureForm, vessels: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>No. of Shoots</Label>
                      <Input 
                        type="number" 
                        placeholder="2400" 
                        value={subcultureForm.shoots}
                        onChange={(e) => setSubcultureForm({...subcultureForm, shoots: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Operator Name</Label>
                      <Input 
                        placeholder="Enter name" 
                        value={subcultureForm.operator}
                        onChange={(e) => setSubcultureForm({...subcultureForm, operator: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mortality</Label>
                      <Input 
                        placeholder="None or specify" 
                        value={subcultureForm.contamination}
                        onChange={(e) => setSubcultureForm({...subcultureForm, contamination: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Remark</Label>
                      <Textarea 
                        placeholder="Add any remarks..." 
                        value={subcultureForm.remark}
                        onChange={(e) => setSubcultureForm({...subcultureForm, remark: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}>Cancel</Button>
                    <Button 
                      variant={null as any}
                      style={{ backgroundColor: '#4CAF50', color: 'white' }}
                      className="hover:bg-[#66BB6A] font-medium shadow-sm"
                      onClick={handleSave}
                    >
                      Save Transfer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Edit Dialog */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Subculture Transfer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Select Date</Label>
                    <Input 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => handleDateSelect(e.target.value)}
                    />
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
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <Label>Transfer Date</Label>
                      <Input type="date" value={subcultureForm.transferDate} onChange={(e) => setSubcultureForm({...subcultureForm, transferDate: e.target.value})} />
                    </div>
                    <div>
                      <Label>Stage Number</Label>
                      <Select value={subcultureForm.stageNumber} onValueChange={(value: string) => setSubcultureForm({...subcultureForm, stageNumber: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Stage 1">Stage 1</SelectItem>
                          <SelectItem value="Stage 2">Stage 2</SelectItem>
                          <SelectItem value="Stage 3">Stage 3</SelectItem>
                          <SelectItem value="Stage 4">Stage 4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Batch Name</Label>
                      <Input value={subcultureForm.batchCode} onChange={(e) => setSubcultureForm({...subcultureForm, batchCode: e.target.value})} />
                    </div>
                    <div>
                      <Label>Media Code</Label>
                      <Input value={subcultureForm.mediaCode} onChange={(e) => setSubcultureForm({...subcultureForm, mediaCode: e.target.value})} />
                    </div>
                    <div>
                      <Label>Crop Name</Label>
                      <Input value={subcultureForm.cropName} onChange={(e) => setSubcultureForm({...subcultureForm, cropName: e.target.value})} />
                    </div>
                    <div>
                      <Label>Number of Vessels</Label>
                      <Input type="number" value={subcultureForm.vessels} onChange={(e) => setSubcultureForm({...subcultureForm, vessels: e.target.value})} />
                    </div>
                    <div>
                      <Label>No. of Shoots</Label>
                      <Input type="number" value={subcultureForm.shoots} onChange={(e) => setSubcultureForm({...subcultureForm, shoots: e.target.value})} />
                    </div>
                    <div>
                      <Label>Operator Name</Label>
                      <Input value={subcultureForm.operator} onChange={(e) => setSubcultureForm({...subcultureForm, operator: e.target.value})} />
                    </div>
                    <div>
                      <Label>Mortality</Label>
                      <Input value={subcultureForm.contamination} onChange={(e) => setSubcultureForm({...subcultureForm, contamination: e.target.value})} />
                    </div>
                    <div className="col-span-2">
                      <Label>Remark</Label>
                      <Textarea value={subcultureForm.remark} onChange={(e) => setSubcultureForm({...subcultureForm, remark: e.target.value})} />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => { setIsEditModalOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                {!editingId ? (
                  <Button 
                    variant={null as any}
                    style={{ backgroundColor: '#4CAF50', color: 'white' }}
                    className="hover:bg-[#66BB6A] font-medium shadow-sm"
                    onClick={handleSearch}
                    disabled={!selectedDate || !selectedBatch}
                  >
                    Search
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="destructive"
                      onClick={() => setDeleteConfirmOpen(true)}
                    >
                      Delete Entry
                    </Button>
                    <Button 
                      variant={null as any}
                      style={{ backgroundColor: '#4CAF50', color: 'white' }}
                      className="hover:bg-[#66BB6A] font-medium shadow-sm"
                      onClick={handleSaveChanges}
                    >
                      Save Changes
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Transfer Date</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Stage Number</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Batch Name</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Media Code</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Crop Name</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">No. of Vessels</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">No. of Shoots</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Operator Name</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Mortality</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Remark</th>
                </tr>
              </thead>
              <tbody>
                {subcultureFilter.visibleData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{item.transferDate}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant="outline">{item.stageNumber}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {item.batchCode}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {item.mediaCode}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{item.cropName}</td>
                    <td className="px-4 py-3 text-sm">{item.vessels}</td>
                    <td className="px-4 py-3 text-sm">{item.shoots}</td>
                    <td className="px-4 py-3 text-sm">{item.operator}</td>
                    <td className="px-4 py-3 text-sm">
                      {item.contamination === 'None' ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200">None</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 border-red-200">{item.contamination}</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEntry} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
