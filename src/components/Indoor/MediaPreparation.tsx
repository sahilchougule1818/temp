import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Plus, Edit2, Trash2, Download } from 'lucide-react';
import { FilterBar } from '../common/FilterBar';
import { BackToMainDataButton } from '../common/BackToMainDataButton';
import { useSearchFilter } from '../../hooks/useSearchFilter';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

type AutoclaveCycle = {
  id: number;
  date: string;
  mediaCode: string;
  operator: string;
  typeOfMedia: string;
  autoclaveOn: string;
  mediaLoading: string;
  pressure: string;
  off: string;
  open: string;
  mediaTotal: string;
  remark: string;
};

type MediaBatch = {
  id: number;
  date: string;
  mediaCode: string;
  operator: string;
  quantity: string;
  bottles: number;
  contamination: string;
};

export function MediaPreparation() {
  // Get today's date
  const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDate = getTodayDate();

  // State for data arrays
  const [autoclaveCycles, setAutoclaveCycles] = useState<AutoclaveCycle[]>([
    { id: 1, date: todayDate, mediaCode: 'MS-001', operator: 'Amit Shah', typeOfMedia: 'Bamboo', autoclaveOn: '09:00', mediaLoading: '09:15', pressure: '10:00', off: '11:30', open: '12:00', mediaTotal: '3:00', remark: 'Normal cycle' },
    { id: 2, date: '2024-11-15', mediaCode: 'MS-002', operator: 'Priya Patel', typeOfMedia: 'Banana', autoclaveOn: '13:00', mediaLoading: '13:10', pressure: '13:45', off: '15:15', open: '15:45', mediaTotal: '2:45', remark: 'Good' },
    { id: 3, date: '2024-11-14', mediaCode: 'MS-003', operator: 'Rahul Desai', typeOfMedia: 'Teak', autoclaveOn: '08:30', mediaLoading: '08:45', pressure: '09:30', off: '11:00', open: '11:30', mediaTotal: '3:00', remark: '-' },
    { id: 4, date: '2024-11-14', mediaCode: 'MS-004', operator: 'Neha Singh', typeOfMedia: 'Ornamental', autoclaveOn: '14:00', mediaLoading: '14:15', pressure: '15:00', off: '16:30', open: '17:00', mediaTotal: '3:00', remark: 'Extended cycle' }
  ]);

  const [mediaBatches, setMediaBatches] = useState<MediaBatch[]>([
    { id: 1, date: todayDate, mediaCode: 'MS-001', operator: 'Amit Shah', quantity: '5L', bottles: 120, contamination: 'None' },
    { id: 2, date: '2024-11-15', mediaCode: 'MS-002', operator: 'Priya Patel', quantity: '8L', bottles: 200, contamination: 'None' },
    { id: 3, date: '2024-11-14', mediaCode: 'MS-003', operator: 'Rahul Desai', quantity: '6L', bottles: 150, contamination: 'None' },
    { id: 4, date: '2024-11-14', mediaCode: 'MS-004', operator: 'Neha Singh', quantity: '7L', bottles: 175, contamination: '1 bottle' }
  ]);

  const [isAutoclaveModalOpen, setIsAutoclaveModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isEditAutoclaveModalOpen, setIsEditAutoclaveModalOpen] = useState(false);
  const [isEditBatchModalOpen, setIsEditBatchModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('autoclave');
  const [editingAutoclaveId, setEditingAutoclaveId] = useState<number | null>(null);
  const [editingBatchId, setEditingBatchId] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'autoclave' | 'batch', id: number } | null>(null);

  // Search filter for Autoclave Cycles (Type of Media → Media Code)
  const autoclaveFilter = useSearchFilter({
    sourceData: autoclaveCycles,
    field1Accessor: (item) => item.typeOfMedia,
    field2Accessor: (item) => item.mediaCode,
  });

  // Search filter for Media Batches (Type of Media → Media Code)  
  const batchFilter = useSearchFilter({
    sourceData: mediaBatches,
    field1Accessor: (item) => item.operator, // Using operator as first field for batches
    field2Accessor: (item) => item.mediaCode,
  });

  // Autoclave form state
  const [autoclaveForm, setAutoclaveForm] = useState({
    date: '',
    mediaCode: '',
    operator: '',
    typeOfMedia: '',
    autoclaveOn: '',
    mediaLoading: '',
    pressure: '',
    off: '',
    open: '',
    mediaTotal: '',
    remark: ''
  });

  // Batch form state
  const [batchForm, setBatchForm] = useState({
    date: '',
    mediaCode: '',
    operator: '',
    quantity: '',
    bottles: '',
    contamination: ''
  });

  // Get available media codes for selected date (from autoclave cycles)
  const availableMediaCodes = useMemo(() => {
    if (!autoclaveForm.date) return [];
    const cyclesForDate = autoclaveCycles.filter(cycle => cycle.date === autoclaveForm.date);
    return Array.from(new Set(cyclesForDate.map(cycle => cycle.mediaCode)));
  }, [autoclaveForm.date, autoclaveCycles]);

  // Get available media codes for batch form (from media batches)
  const availableMediaCodesForBatch = useMemo(() => {
    if (!batchForm.date) return [];
    const batchesForDate = mediaBatches.filter(batch => batch.date === batchForm.date);
    return Array.from(new Set(batchesForDate.map(batch => batch.mediaCode)));
  }, [batchForm.date, mediaBatches]);

  // Get media data when media code is selected
  const selectedMediaData = useMemo(() => {
    if (!autoclaveForm.date || !autoclaveForm.mediaCode) return null;
    return autoclaveCycles.find(cycle => 
      cycle.date === autoclaveForm.date && cycle.mediaCode === autoclaveForm.mediaCode
    );
  }, [autoclaveForm.date, autoclaveForm.mediaCode, autoclaveCycles]);

  // Handle media code selection (no auto-fill in edit mode)
  const handleMediaCodeSelect = (mediaCode: string) => {
    setAutoclaveForm({...autoclaveForm, mediaCode});
  };

  // Search function for edit mode
  const handleSearchAutoclave = () => {
    if (isEditAutoclaveModalOpen && autoclaveForm.date && autoclaveForm.mediaCode) {
      const mediaData = autoclaveCycles.find(cycle => 
        cycle.date === autoclaveForm.date && cycle.mediaCode === autoclaveForm.mediaCode
      );
      if (mediaData) {
        setAutoclaveForm({
          date: mediaData.date,
          mediaCode: mediaData.mediaCode,
          typeOfMedia: mediaData.typeOfMedia,
          operator: mediaData.operator,
          autoclaveOn: mediaData.autoclaveOn,
          mediaLoading: mediaData.mediaLoading,
          pressure: mediaData.pressure,
          off: mediaData.off,
          open: mediaData.open,
          mediaTotal: mediaData.mediaTotal,
          remark: mediaData.remark
        });
        setEditingAutoclaveId(mediaData.id);
      }
    }
  };

  // Handle batch media code selection (no auto-fill in edit mode)
  const handleBatchMediaCodeSelect = (mediaCode: string) => {
    setBatchForm({...batchForm, mediaCode});
  };

  // Search function for batch edit mode
  const handleSearchBatch = () => {
    if (isEditBatchModalOpen && batchForm.date && batchForm.mediaCode) {
      const batchData = mediaBatches.find(batch => 
        batch.date === batchForm.date && batch.mediaCode === batchForm.mediaCode
      );
      if (batchData) {
        setBatchForm({
          date: batchData.date,
          mediaCode: batchData.mediaCode,
          operator: batchData.operator,
          quantity: batchData.quantity,
          bottles: String(batchData.bottles),
          contamination: batchData.contamination
        });
        setEditingBatchId(batchData.id);
      }
    }
  };

  const handleDateChange = (date: string) => {
    setAutoclaveForm({...autoclaveForm, date, mediaCode: ''});
    if (isEditAutoclaveModalOpen) {
      setEditingAutoclaveId(null);
    }
  };

  const handleBatchDateChange = (date: string) => {
    setBatchForm({...batchForm, date, mediaCode: ''});
    if (isEditBatchModalOpen) {
      setEditingBatchId(null);
    }
  };

  const handleSaveAutoclave = () => {
    if (editingAutoclaveId) {
      setAutoclaveCycles(autoclaveCycles.map(cycle => 
        cycle.id === editingAutoclaveId 
          ? { ...cycle, ...autoclaveForm }
          : cycle
      ));
    } else {
      const maxId = autoclaveCycles.length > 0 ? Math.max(...autoclaveCycles.map(c => c.id)) : 0;
      const newId = maxId + 1;
      setAutoclaveCycles([...autoclaveCycles, { id: newId, ...autoclaveForm } as AutoclaveCycle]);
    }
    setIsAutoclaveModalOpen(false);
    setIsEditAutoclaveModalOpen(false);
    resetAutoclaveForm();
  };

  const handleSaveBatch = () => {
    if (editingBatchId) {
      setMediaBatches(mediaBatches.map(batch => 
        batch.id === editingBatchId 
          ? { ...batch, ...batchForm, bottles: parseInt(batchForm.bottles) || 0 }
          : batch
      ));
    } else {
      const maxId = mediaBatches.length > 0 ? Math.max(...mediaBatches.map(b => b.id)) : 0;
      const newId = maxId + 1;
      setMediaBatches([...mediaBatches, { 
        id: newId, 
        ...batchForm, 
        bottles: parseInt(batchForm.bottles) || 0 
      } as MediaBatch]);
    }
    setIsBatchModalOpen(false);
    setIsEditBatchModalOpen(false);
    resetBatchForm();
  };

  const handleEditBatch = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    if (activeTab === 'autoclave') {
      setEditingAutoclaveId(null);
      setAutoclaveForm({
        date: todayStr,
        mediaCode: '',
        operator: '',
        typeOfMedia: '',
        autoclaveOn: '',
        mediaLoading: '',
        pressure: '',
        off: '',
        open: '',
        mediaTotal: '',
        remark: ''
      });
      setIsEditAutoclaveModalOpen(true);
    } else {
      setEditingBatchId(null);
      setBatchForm({
        date: todayStr,
        mediaCode: '',
        operator: '',
        quantity: '',
        bottles: '',
        contamination: ''
      });
      setIsEditBatchModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'autoclave') {
      setAutoclaveCycles(autoclaveCycles.filter(c => c.id !== itemToDelete.id));
    } else {
      setMediaBatches(mediaBatches.filter(b => b.id !== itemToDelete.id));
    }
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
    if (isEditAutoclaveModalOpen) {
      setIsEditAutoclaveModalOpen(false);
      resetAutoclaveForm();
    }
    if (isEditBatchModalOpen) {
      setIsEditBatchModalOpen(false);
      resetBatchForm();
    }
  };

  const resetAutoclaveForm = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    setEditingAutoclaveId(null);
    setAutoclaveForm({
      date: todayStr,
      mediaCode: '',
      operator: '',
      typeOfMedia: '',
      autoclaveOn: '',
      mediaLoading: '',
      pressure: '',
      off: '',
      open: '',
      mediaTotal: '',
      remark: ''
    });
  };

  const resetBatchForm = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    setEditingBatchId(null);
    setBatchForm({
      date: todayStr,
      mediaCode: '',
      operator: '',
      quantity: '',
      bottles: '',
      contamination: ''
    });
  };


  const mediaCodeOptions = Array.from(new Set(autoclaveCycles.map(cycle => cycle.mediaCode))).map(code => ({
    value: code.toLowerCase().replace(/\s+/g, '-'),
    label: code
  }));

  // Get the current filter based on active tab
  const currentFilter = activeTab === 'autoclave' ? autoclaveFilter : batchFilter;

  return (
    <div className="p-6 space-y-6">
      <FilterBar 
        field1={{
          label: activeTab === 'autoclave' ? 'Type of Media' : 'Operator',
          value: currentFilter.selectedField1,
          onChange: currentFilter.handleField1Change,
          options: currentFilter.field1Options,
          placeholder: activeTab === 'autoclave' ? 'Select media type' : 'Select operator'
        }}
        field2={{
          label: 'Media Code',
          value: currentFilter.selectedField2,
          onChange: currentFilter.handleField2Change,
          options: currentFilter.field2Options,
          placeholder: 'Select media code'
        }}
        onSearch={currentFilter.handleSearch}
      />
      <Card>
        <CardHeader>
          <CardTitle>Media Preparation</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="autoclave">Autoclave Cycle Register</TabsTrigger>
              <TabsTrigger value="batch">Media Batch Register</TabsTrigger>
            </TabsList>

            <TabsContent value="autoclave">
              <div className="space-y-4">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <BackToMainDataButton 
                    isVisible={autoclaveFilter.isFiltered}
                    onClick={autoclaveFilter.handleReset}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditingAutoclaveId(null);
                      setAutoclaveForm({
                        date: '',
                        mediaCode: '',
                        operator: '',
                        typeOfMedia: '',
                        autoclaveOn: '',
                        mediaLoading: '',
                        pressure: '',
                        off: '',
                        open: '',
                        mediaTotal: '',
                        remark: ''
                      });
                      setIsEditAutoclaveModalOpen(true);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Dialog open={isAutoclaveModalOpen} onOpenChange={(open: boolean) => {
                    setIsAutoclaveModalOpen(open);
                    if (!open) resetAutoclaveForm();
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant={null as any}
                        style={{ backgroundColor: '#4CAF50', color: 'white' }}
                        className="hover:bg-[#66BB6A] font-medium shadow-sm"
                        onClick={() => resetAutoclaveForm()}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Cycle
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Autoclave Cycle</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input 
                            type="date" 
                            value={autoclaveForm.date}
                            onChange={(e) => handleDateChange(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Media Code</Label>
                          <Input 
                            placeholder="MS-001" 
                            value={autoclaveForm.mediaCode}
                            onChange={(e) => setAutoclaveForm({...autoclaveForm, mediaCode: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Operator Name</Label>
                          <Input 
                            placeholder="Enter name" 
                            value={autoclaveForm.operator}
                            onChange={(e) => setAutoclaveForm({...autoclaveForm, operator: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Type of Media</Label>
                          <Input 
                            placeholder="MS Medium" 
                            value={autoclaveForm.typeOfMedia}
                            onChange={(e) => setAutoclaveForm({...autoclaveForm, typeOfMedia: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Autoclave ON Time</Label>
                          <Input 
                            type="time" 
                            value={autoclaveForm.autoclaveOn}
                            onChange={(e) => setAutoclaveForm({...autoclaveForm, autoclaveOn: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Media Loading Time</Label>
                          <Input 
                            type="time" 
                            value={autoclaveForm.mediaLoading}
                            onChange={(e) => setAutoclaveForm({...autoclaveForm, mediaLoading: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Pressure Time</Label>
                          <Input 
                            type="time" 
                            value={autoclaveForm.pressure}
                            onChange={(e) => setAutoclaveForm({...autoclaveForm, pressure: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Off Time</Label>
                          <Input 
                            type="time" 
                            value={autoclaveForm.off}
                            onChange={(e) => setAutoclaveForm({...autoclaveForm, off: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Open Time</Label>
                          <Input 
                            type="time" 
                            value={autoclaveForm.open}
                            onChange={(e) => setAutoclaveForm({...autoclaveForm, open: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Media Total</Label>
                          <Input 
                            placeholder="3:00" 
                            value={autoclaveForm.mediaTotal}
                            onChange={(e) => setAutoclaveForm({...autoclaveForm, mediaTotal: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label>Remark</Label>
                          <Textarea 
                            placeholder="Add any remarks..." 
                            value={autoclaveForm.remark}
                            onChange={(e) => setAutoclaveForm({...autoclaveForm, remark: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => {
                          setIsAutoclaveModalOpen(false);
                          resetAutoclaveForm();
                        }}>Cancel</Button>
                        <Button 
                          variant={null as any}
                          style={{ backgroundColor: '#4CAF50', color: 'white' }}
                          className="hover:bg-[#66BB6A] font-medium shadow-sm"
                          onClick={handleSaveAutoclave}
                        >
                          Save Cycle
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Edit Dialog */}
                <Dialog open={isEditAutoclaveModalOpen} onOpenChange={(open: boolean) => {
                  setIsEditAutoclaveModalOpen(open);
                  if (!open) {
                    resetAutoclaveForm();
                    setEditingAutoclaveId(null);
                  }
                }}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Autoclave Cycle</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input 
                          type="date" 
                          value={autoclaveForm.date}
                          onChange={(e) => handleDateChange(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Media Code</Label>
                        {autoclaveForm.date ? (
                          <Select value={autoclaveForm.mediaCode} onValueChange={handleMediaCodeSelect}>
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
                          <Input 
                            placeholder="Select date first" 
                            disabled
                          />
                        )}
                      </div>
                      {editingAutoclaveId && (
                        <>
                          <div className="space-y-2">
                            <Label>Operator Name</Label>
                            <Input 
                              placeholder="Enter name" 
                              value={autoclaveForm.operator}
                              onChange={(e) => setAutoclaveForm({...autoclaveForm, operator: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Type of Media</Label>
                            <Input 
                              placeholder="MS Medium" 
                              value={autoclaveForm.typeOfMedia}
                              onChange={(e) => setAutoclaveForm({...autoclaveForm, typeOfMedia: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Autoclave ON Time</Label>
                            <Input 
                              type="time" 
                              value={autoclaveForm.autoclaveOn}
                              onChange={(e) => setAutoclaveForm({...autoclaveForm, autoclaveOn: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Media Loading Time</Label>
                            <Input 
                              type="time" 
                              value={autoclaveForm.mediaLoading}
                              onChange={(e) => setAutoclaveForm({...autoclaveForm, mediaLoading: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Pressure Time</Label>
                            <Input 
                              type="time" 
                              value={autoclaveForm.pressure}
                              onChange={(e) => setAutoclaveForm({...autoclaveForm, pressure: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Off Time</Label>
                            <Input 
                              type="time" 
                              value={autoclaveForm.off}
                              onChange={(e) => setAutoclaveForm({...autoclaveForm, off: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Open Time</Label>
                            <Input 
                              type="time" 
                              value={autoclaveForm.open}
                              onChange={(e) => setAutoclaveForm({...autoclaveForm, open: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Media Total</Label>
                            <Input 
                              placeholder="3:00" 
                              value={autoclaveForm.mediaTotal}
                              onChange={(e) => setAutoclaveForm({...autoclaveForm, mediaTotal: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label>Remark</Label>
                            <Textarea 
                              placeholder="Add any remarks..." 
                              value={autoclaveForm.remark}
                              onChange={(e) => setAutoclaveForm({...autoclaveForm, remark: e.target.value})}
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => {
                        setIsEditAutoclaveModalOpen(false);
                        resetAutoclaveForm();
                      }}>Cancel</Button>
                      {!editingAutoclaveId ? (
                        <Button 
                          variant={null as any}
                          style={{ backgroundColor: '#4CAF50', color: 'white' }}
                          className="hover:bg-[#66BB6A] font-medium shadow-sm"
                          onClick={handleSearchAutoclave}
                          disabled={!autoclaveForm.date || !autoclaveForm.mediaCode}
                        >
                          Search
                        </Button>
                      ) : (
                        <>
                          <Button 
                            variant="destructive" 
                            onClick={() => {
                              if (editingAutoclaveId) {
                                setItemToDelete({ type: 'autoclave', id: editingAutoclaveId });
                                setDeleteConfirmOpen(true);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                          <Button 
                            variant={null as any}
                            style={{ backgroundColor: '#4CAF50', color: 'white' }}
                            className="hover:bg-[#66BB6A] font-medium shadow-sm"
                            onClick={handleSaveAutoclave}
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
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Date</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Media Code</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Operator Name</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Type of Media</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Autoclave ON Time</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Media Loading Time</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Pressure Time</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Off Time</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Open Time</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Media Total</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {autoclaveFilter.visibleData.map((cycle) => (
                        <tr key={cycle.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{cycle.date}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {cycle.mediaCode}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">{cycle.operator}</td>
                          <td className="px-4 py-3 text-sm">{cycle.typeOfMedia}</td>
                          <td className="px-4 py-3 text-sm">{cycle.autoclaveOn}</td>
                          <td className="px-4 py-3 text-sm">{cycle.mediaLoading}</td>
                          <td className="px-4 py-3 text-sm">{cycle.pressure}</td>
                          <td className="px-4 py-3 text-sm">{cycle.off}</td>
                          <td className="px-4 py-3 text-sm">{cycle.open}</td>
                          <td className="px-4 py-3 text-sm">{cycle.mediaTotal}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{cycle.remark}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="batch">
              <div className="space-y-4">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <BackToMainDataButton 
                    isVisible={batchFilter.isFiltered}
                    onClick={batchFilter.handleReset}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditingBatchId(null);
                      setBatchForm({
                        date: '',
                        mediaCode: '',
                        operator: '',
                        quantity: '',
                        bottles: '',
                        contamination: ''
                      });
                      setIsEditBatchModalOpen(true);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Dialog open={isBatchModalOpen} onOpenChange={(open: boolean) => {
                    setIsBatchModalOpen(open);
                    if (!open) resetBatchForm();
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant={null as any}
                        style={{ backgroundColor: '#4CAF50', color: 'white' }}
                        className="hover:bg-[#66BB6A] font-medium shadow-sm"
                        onClick={() => resetBatchForm()}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Batch
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Media Batch</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input 
                            type="date" 
                            value={batchForm.date}
                            onChange={(e) => setBatchForm({...batchForm, date: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Media Code</Label>
                          <Input 
                            placeholder="MS-001" 
                            value={batchForm.mediaCode}
                            onChange={(e) => setBatchForm({...batchForm, mediaCode: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Operator Name</Label>
                          <Input 
                            placeholder="Enter name" 
                            value={batchForm.operator}
                            onChange={(e) => setBatchForm({...batchForm, operator: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Quantity of Media</Label>
                          <Input 
                            placeholder="5L" 
                            value={batchForm.quantity}
                            onChange={(e) => setBatchForm({...batchForm, quantity: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Number of Bottles Prepared</Label>
                          <Input 
                            type="number" 
                            placeholder="120" 
                            value={batchForm.bottles}
                            onChange={(e) => setBatchForm({...batchForm, bottles: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Particulars of Contaminations if Any</Label>
                          <Textarea 
                            placeholder="None or specify" 
                            value={batchForm.contamination}
                            onChange={(e) => setBatchForm({...batchForm, contamination: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => {
                          setIsBatchModalOpen(false);
                          resetBatchForm();
                        }}>Cancel</Button>
                        <Button 
                          variant={null as any}
                          style={{ backgroundColor: '#4CAF50', color: 'white' }}
                          className="hover:bg-[#66BB6A] font-medium shadow-sm"
                          onClick={handleSaveBatch}
                        >
                          Save Batch
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Edit Batch Dialog */}
                <Dialog open={isEditBatchModalOpen} onOpenChange={(open: boolean) => {
                  setIsEditBatchModalOpen(open);
                  if (!open) {
                    resetBatchForm();
                    setEditingBatchId(null);
                  }
                }}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Media Batch</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input 
                          type="date" 
                          value={batchForm.date}
                          onChange={(e) => handleBatchDateChange(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Media Code</Label>
                        {batchForm.date ? (
                          <Select value={batchForm.mediaCode} onValueChange={handleBatchMediaCodeSelect}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select media code" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableMediaCodesForBatch.length > 0 ? (
                                availableMediaCodesForBatch.map(code => (
                                  <SelectItem key={code} value={code}>{code}</SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-records" disabled>No records for this date</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input 
                            placeholder="Select a date first" 
                            value=""
                            disabled
                          />
                        )}
                      </div>
                      {editingBatchId && (
                        <>
                          <div className="space-y-2">
                            <Label>Operator Name</Label>
                            <Input 
                              placeholder="Enter name" 
                              value={batchForm.operator}
                              onChange={(e) => setBatchForm({...batchForm, operator: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Quantity of Media</Label>
                            <Input 
                              placeholder="5L" 
                              value={batchForm.quantity}
                              onChange={(e) => setBatchForm({...batchForm, quantity: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Number of Bottles Prepared</Label>
                            <Input 
                              type="number" 
                              placeholder="120" 
                              value={batchForm.bottles}
                              onChange={(e) => setBatchForm({...batchForm, bottles: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Particulars of Contaminations if Any</Label>
                            <Textarea 
                              placeholder="None or specify" 
                              value={batchForm.contamination}
                              onChange={(e) => setBatchForm({...batchForm, contamination: e.target.value})}
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => {
                        setIsEditBatchModalOpen(false);
                        resetBatchForm();
                      }}>Cancel</Button>
                      {!editingBatchId ? (
                        <Button 
                          variant={null as any}
                          style={{ backgroundColor: '#4CAF50', color: 'white' }}
                          className="hover:bg-[#66BB6A] font-medium shadow-sm"
                          onClick={handleSearchBatch}
                          disabled={!batchForm.date || !batchForm.mediaCode}
                        >
                          Search
                        </Button>
                      ) : (
                        <>
                          <Button 
                            variant="destructive" 
                            onClick={() => {
                              if (editingBatchId) {
                                setItemToDelete({ type: 'batch', id: editingBatchId });
                                setDeleteConfirmOpen(true);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                          <Button 
                            variant={null as any}
                            style={{ backgroundColor: '#4CAF50', color: 'white' }}
                            className="hover:bg-[#66BB6A] font-medium shadow-sm"
                            onClick={handleSaveBatch}
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
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Date</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Media Code</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Operator Name</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Quantity of Media</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Number of Bottles Prepared</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Particulars of Contaminations if Any</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchFilter.visibleData.map((batch) => (
                        <tr key={batch.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{batch.date}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {batch.mediaCode}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">{batch.operator}</td>
                          <td className="px-4 py-3 text-sm">{batch.quantity}</td>
                          <td className="px-4 py-3 text-sm">{batch.bottles}</td>
                          <td className="px-4 py-3 text-sm">
                            {batch.contamination === 'None' ? (
                              <Badge className="bg-green-100 text-green-700 border-green-200">None</Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700 border-red-200">{batch.contamination}</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
