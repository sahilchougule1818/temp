import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

// Sample Media Preparation autoclave cycles data (in real app, this would come from shared state/context)
const mediaPrepAutoclaveCycles = [
  { id: 1, date: '2024-11-15', mediaCode: 'MS-001', operator: 'Amit Shah', typeOfMedia: 'MS Medium', autoclaveOn: '09:00', mediaLoading: '09:15', pressure: '10:00', off: '11:30', open: '12:00', mediaTotal: '3:00', remark: 'Normal cycle' },
  { id: 2, date: '2024-11-15', mediaCode: 'MS-002', operator: 'Priya Patel', typeOfMedia: 'B5 Medium', autoclaveOn: '13:00', mediaLoading: '13:10', pressure: '13:45', off: '15:15', open: '15:45', mediaTotal: '2:45', remark: 'Good' },
  { id: 3, date: '2024-11-14', mediaCode: 'MS-003', operator: 'Rahul Desai', typeOfMedia: 'WPM Medium', autoclaveOn: '08:30', mediaLoading: '08:45', pressure: '09:30', off: '11:00', open: '11:30', mediaTotal: '3:00', remark: '-' },
  { id: 4, date: '2024-11-14', mediaCode: 'MS-004', operator: 'Neha Singh', typeOfMedia: 'MS Medium', autoclaveOn: '14:00', mediaLoading: '14:15', pressure: '15:00', off: '16:30', open: '17:00', mediaTotal: '3:00', remark: 'Extended cycle' }
];

type SubcultureData = {
  id: number;
  transferDate: string;
  stageNumber: string;
  batchCode: string;
  mediaCode: string;
  species: string;
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
    { id: 1, transferDate: todayDate, stageNumber: 'Stage 3', batchCode: 'BTH-2024-001', mediaCode: 'MS-001', species: 'Banana', vessels: 120, shoots: 2400, operator: 'Amit Shah', contamination: 'None', remark: 'Good growth' },
    { id: 2, transferDate: '2024-11-15', stageNumber: 'Stage 2', batchCode: 'BTH-2024-002', mediaCode: 'MS-002', species: 'Strawberry', vessels: 80, shoots: 1600, operator: 'Priya Patel', contamination: '2 vessels', remark: 'Minor contamination' },
    { id: 3, transferDate: '2024-11-14', stageNumber: 'Stage 4', batchCode: 'BTH-2024-003', mediaCode: 'MS-001', species: 'Rose', vessels: 150, shoots: 3000, operator: 'Rahul Desai', contamination: 'None', remark: 'Excellent' },
    { id: 4, transferDate: '2024-11-14', stageNumber: 'Stage 1', batchCode: 'BTH-2024-004', mediaCode: 'MS-003', species: 'Gerbera', vessels: 100, shoots: 2000, operator: 'Neha Singh', contamination: 'None', remark: 'New batch' },
    { id: 5, transferDate: '2024-11-13', stageNumber: 'Stage 2', batchCode: 'BTH-2024-005', mediaCode: 'MS-002', species: 'Banana', vessels: 90, shoots: 1800, operator: 'Amit Shah', contamination: '1 vessel', remark: 'Monitoring' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  const [subcultureForm, setSubcultureForm] = useState({
    transferDate: '',
    stageNumber: '',
    batchCode: '',
    mediaCode: '',
    species: '',
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

  // Get available media codes for selected date (from Media Preparation)
  const availableMediaCodes = useMemo(() => {
    if (!subcultureForm.transferDate) return [];
    const cyclesForDate = mediaPrepAutoclaveCycles.filter(cycle => cycle.date === subcultureForm.transferDate);
    return Array.from(new Set(cyclesForDate.map(cycle => cycle.mediaCode)));
  }, [subcultureForm.transferDate]);

  // Get available batch codes for selected date and media code
  const availableBatchesForEdit = useMemo(() => {
    if (!subcultureForm.transferDate || !subcultureForm.mediaCode) return [];
    const batchesForDateAndMedia = subcultureData.filter(item => 
      item.transferDate === subcultureForm.transferDate && item.mediaCode === subcultureForm.mediaCode
    );
    // Return objects with id, and a display string for the dropdown
    return batchesForDateAndMedia.map(item => ({
      id: item.id,
      display: `${item.transferDate} - ${item.batchCode}`
    }));
  }, [subcultureForm.transferDate, subcultureForm.mediaCode, subcultureData]);

  const handleEditBatch = () => {
    setEditingId(null);
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    setSubcultureForm({
      transferDate: todayStr,
      stageNumber: '',
      batchCode: '',
      mediaCode: '',
      species: '',
      vessels: '',
      shoots: '',
      operator: '',
      contamination: '',
      remark: ''
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    if (editingId) {
      setSubcultureData(subcultureData.filter(item => item.id !== editingId));
      setDeleteConfirmOpen(false);
      setIsEditModalOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    setEditingId(null);
    setSubcultureForm({
      transferDate: todayStr,
      stageNumber: '',
      batchCode: '',
      mediaCode: '',
      species: '',
      vessels: '',
      shoots: '',
      operator: '',
      contamination: '',
      remark: ''
    });
  };

  // Get today's date in YYYY-MM-DD format (use function to get current date each time)
  const getToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Filter data based on showAllRecords
  const filteredData = showAllRecords 
    ? subcultureData 
    : (subcultureData || []).filter(item => {
        const today = getToday();
        return item?.transferDate === today;
      });

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Subculturing Register</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowAllRecords(!showAllRecords)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {showAllRecords ? 'Show Today Only' : 'View All Records'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleEditBatch}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Batch
              </Button>
              <Dialog open={isModalOpen} onOpenChange={(open: boolean) => {
                setIsModalOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => resetForm()}>
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
                      <Label>Batch Code</Label>
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
                      <Label>Species</Label>
                      <Input 
                        placeholder="Banana" 
                        value={subcultureForm.species}
                        onChange={(e) => setSubcultureForm({...subcultureForm, species: e.target.value})}
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
                      <Label>Contamination</Label>
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
                    <Button className="bg-green-600 hover:bg-green-700" onClick={handleSave}>
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
          <Dialog open={isEditModalOpen} onOpenChange={(open: boolean) => {
            setIsEditModalOpen(open);
            if (!open) {
              resetForm();
              setEditingId(null);
            }
          }}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Subculture Transfer</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Transfer Date</Label>
                  <Input 
                    type="date" 
                    value={subcultureForm.transferDate}
                    onChange={(e) => {
                      setSubcultureForm({...subcultureForm, transferDate: e.target.value, mediaCode: '', batchCode: ''});
                      setEditingId(null);
                    }}
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
                  <Label>Media Code</Label>
                  {subcultureForm.transferDate ? (
                    <Select 
                      value={subcultureForm.mediaCode} 
                      onValueChange={(value: string) => {
                        setSubcultureForm({...subcultureForm, mediaCode: value, batchCode: ''});
                        setEditingId(null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select media code" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableMediaCodes.map(code => (
                          <SelectItem key={code} value={code}>{code}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input placeholder="Select date first" disabled />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Batch Code</Label>
                  {subcultureForm.transferDate && subcultureForm.mediaCode ? (
                    <Select 
                      value={editingId ? editingId.toString() : ''} // Use editingId as value to uniquely identify selected item
                      onValueChange={(value: string) => {
                        const selectedId = parseInt(value);
                        const found = subcultureData.find(item => item.id === selectedId);
                        if (found) {
                          setSubcultureForm({
                            transferDate: found.transferDate,
                            stageNumber: found.stageNumber,
                            batchCode: found.batchCode,
                            mediaCode: found.mediaCode,
                            species: found.species,
                            vessels: found.vessels.toString(),
                            shoots: found.shoots.toString(),
                            operator: found.operator,
                            contamination: found.contamination,
                            remark: found.remark
                          });
                          setEditingId(found.id);
                        } else {
                          // If no item found, reset batchCode and editingId
                          setSubcultureForm({...subcultureForm, batchCode: ''});
                          setEditingId(null);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select batch code" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBatchesForEdit.map(batch => (
                          <SelectItem key={batch.id} value={batch.id.toString()}>{batch.display}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input placeholder="Select date and media code first" disabled />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Species</Label>
                  <Input 
                    placeholder="Banana" 
                    value={subcultureForm.species}
                    onChange={(e) => setSubcultureForm({...subcultureForm, species: e.target.value})}
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
                  <Label>Contamination</Label>
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
              <div className="flex justify-between gap-3">
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    if (editingId) {
                      setDeleteConfirmOpen(true);
                    }
                  }}
                  disabled={!editingId}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => {
                    setIsEditModalOpen(false);
                    resetForm();
                  }}>Cancel</Button>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Transfer Date</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Stage Number</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Batch Code</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Media Code</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Species</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">No. of Vessels</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">No. of Shoots</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Operator Name</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Contamination</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Remark</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
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
                    <td className="px-4 py-3 text-sm">{item.species}</td>
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
