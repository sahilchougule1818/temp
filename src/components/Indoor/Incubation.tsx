import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
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

type IncubationData = {
  id: number;
  subcultureDate: string;
  stage: string;
  batchNumber: string;
  mediaCode: string;
  operator: string;
  cropName: string;
  vessels: number;
  shoots: number;
  temp: string;
  humidity: string;
  photoperiod: string;
  lightIntensity: string;
};

type ContaminationData = {
  id: number;
  date: string;
  batchNumber: string;
  vesselCount: number;
  type: string;
  possibleSource: string;
  disposalMethod: string;
};

export function Incubation() {
  // Get today's date
  const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDate = getTodayDate();

  const [incubationData, setIncubationData] = useState<IncubationData[]>([
    { id: 1, subcultureDate: todayDate, stage: 'Stage 3', batchNumber: 'BTH-2024-001', mediaCode: 'MS-001', operator: 'Amit Shah', cropName: 'Banana', vessels: 120, shoots: 2400, temp: '25°C', humidity: '65%', photoperiod: '16/8', lightIntensity: '3000 lux' },
    { id: 2, subcultureDate: '2024-11-15', stage: 'Stage 2', batchNumber: 'BTH-2024-002', mediaCode: 'MS-002', operator: 'Priya Patel', cropName: 'Bamboo', vessels: 80, shoots: 1600, temp: '22°C', humidity: '70%', photoperiod: '16/8', lightIntensity: '2500 lux' },
    { id: 3, subcultureDate: '2024-11-14', stage: 'Stage 4', batchNumber: 'BTH-2024-003', mediaCode: 'MS-001', operator: 'Rahul Desai', cropName: 'Teak', vessels: 150, shoots: 3000, temp: '24°C', humidity: '60%', photoperiod: '14/10', lightIntensity: '3500 lux' }
  ]);

  const [contaminationData, setContaminationData] = useState<ContaminationData[]>([
    { id: 1, date: todayDate, batchNumber: 'BTH-2024-001', vesselCount: 1, type: 'Bacterial', possibleSource: 'Media preparation', disposalMethod: 'Autoclaved and discarded' },
    { id: 2, date: '2024-11-15', batchNumber: 'BTH-2024-005', vesselCount: 1, type: 'Fungal', possibleSource: 'Laminar flow', disposalMethod: 'Incineration' },
    { id: 3, date: '2024-11-14', batchNumber: 'BTH-2024-001', vesselCount: 3, type: 'Bacterial', possibleSource: 'Handling', disposalMethod: 'Autoclaved' }
  ]);

  const [isIncubationModalOpen, setIsIncubationModalOpen] = useState(false);
  const [isContaminationModalOpen, setIsContaminationModalOpen] = useState(false);
  const [isEditIncubationModalOpen, setIsEditIncubationModalOpen] = useState(false);
  const [isEditContaminationModalOpen, setIsEditContaminationModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('incubation');
  const [editingIncubationId, setEditingIncubationId] = useState<number | null>(null);
  const [editingContaminationId, setEditingContaminationId] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedIncubationDate, setSelectedIncubationDate] = useState('');
  const [selectedIncubationBatch, setSelectedIncubationBatch] = useState('');
  const [selectedContaminationDate, setSelectedContaminationDate] = useState('');
  const [selectedContaminationBatch, setSelectedContaminationBatch] = useState('');

  // Search filters (Crop Name → Batch Number)
  const incubationFilter = useSearchFilter({
    sourceData: incubationData,
    field1Accessor: (item) => item.cropName,
    field2Accessor: (item) => item.batchNumber,
  });

  const contaminationFilter = useSearchFilter({
    sourceData: contaminationData,
    field1Accessor: (item) => item.type,
    field2Accessor: (item) => item.batchNumber,
  });
  
  // Incubation form state
  const [incubationForm, setIncubationForm] = useState({
    subcultureDate: '',
    stage: '',
    batchNumber: '',
    mediaCode: '',
    operator: '',
    cropName: '',
    vessels: '',
    shoots: '',
    temp: '',
    humidity: '',
    photoperiod: '',
    lightIntensity: ''
  });

  // Contamination form state
  const [contaminationForm, setContaminationForm] = useState({
    date: '',
    batchNumber: '',
    vesselCount: '',
    type: '',
    possibleSource: '',
    disposalMethod: ''
  });

  const handleSaveIncubation = () => {
    if (editingIncubationId) {
      setIncubationData(incubationData.map(item => 
        item.id === editingIncubationId 
          ? { ...item, ...incubationForm, vessels: parseInt(incubationForm.vessels) || 0, shoots: parseInt(incubationForm.shoots) || 0 }
          : item
      ));
    } else {
      const maxId = incubationData.length > 0 ? Math.max(...incubationData.map(i => i.id)) : 0;
      const newId = maxId + 1;
      setIncubationData([...incubationData, { 
        id: newId, 
        ...incubationForm, 
        vessels: parseInt(incubationForm.vessels) || 0, 
        shoots: parseInt(incubationForm.shoots) || 0 
      } as IncubationData]);
    }
    setIsIncubationModalOpen(false);
    setIsEditIncubationModalOpen(false);
    resetIncubationForm();
  };

  const handleSaveContamination = () => {
    if (editingContaminationId) {
      setContaminationData(contaminationData.map(item => 
        item.id === editingContaminationId 
          ? { ...item, ...contaminationForm, vesselCount: parseInt(contaminationForm.vesselCount) || 0 }
          : item
      ));
    } else {
      const maxId = contaminationData.length > 0 ? Math.max(...contaminationData.map(i => i.id)) : 0;
      const newId = maxId + 1;
      setContaminationData([...contaminationData, { 
        id: newId, 
        ...contaminationForm, 
        vesselCount: parseInt(contaminationForm.vesselCount) || 0 
      } as ContaminationData]);
    }
    setIsContaminationModalOpen(false);
    setIsEditContaminationModalOpen(false);
    resetContaminationForm();
  };

  // Incubation Edit: Get all available dates and batches
  const availableIncubationDates = useMemo(() => {
    return Array.from(new Set(incubationData.map(record => record.subcultureDate))).sort();
  }, [incubationData]);

  const availableIncubationBatches = useMemo(() => {
    if (!selectedIncubationDate) return [];
    return Array.from(new Set(incubationData.filter(record => record.subcultureDate === selectedIncubationDate).map(record => record.batchNumber)));
  }, [selectedIncubationDate, incubationData]);

  // Contamination Edit: Get all available dates and batches
  const availableContaminationDates = useMemo(() => {
    return Array.from(new Set(contaminationData.map(record => record.date))).sort();
  }, [contaminationData]);

  const availableContaminationBatches = useMemo(() => {
    if (!selectedContaminationDate) return [];
    return Array.from(new Set(contaminationData.filter(record => record.date === selectedContaminationDate).map(record => record.batchNumber)));
  }, [selectedContaminationDate, contaminationData]);

  // Incubation handlers
  const handleIncubationDateSelect = (date: string) => {
    setSelectedIncubationDate(date);
    setSelectedIncubationBatch('');
    setIncubationForm({
      subcultureDate: '',
      stage: '',
      batchNumber: '',
      mediaCode: '',
      operator: '',
      cropName: '',
      vessels: '',
      shoots: '',
      temp: '',
      humidity: '',
      photoperiod: '',
      lightIntensity: ''
    });
    setEditingIncubationId(null);
  };

  const handleIncubationBatchSelect = (batch: string) => {
    setSelectedIncubationBatch(batch);
    const recordData = incubationData.find(record => record.subcultureDate === selectedIncubationDate && record.batchNumber === batch);
    if (recordData) {
      setIncubationForm({
        subcultureDate: recordData.subcultureDate,
        stage: recordData.stage,
        batchNumber: recordData.batchNumber,
        mediaCode: recordData.mediaCode,
        operator: recordData.operator,
        cropName: recordData.cropName,
        vessels: String(recordData.vessels),
        shoots: String(recordData.shoots),
        temp: recordData.temp,
        humidity: recordData.humidity,
        photoperiod: recordData.photoperiod,
        lightIntensity: recordData.lightIntensity
      });
      setEditingIncubationId(recordData.id);
    }
  };

  const handleSaveIncubationChanges = () => {
    if (editingIncubationId) {
      setIncubationData(incubationData.map(item => 
        item.id === editingIncubationId 
          ? { ...item, ...incubationForm, vessels: parseInt(incubationForm.vessels) || 0, shoots: parseInt(incubationForm.shoots) || 0 }
          : item
      ));
    }
    setIsEditIncubationModalOpen(false);
    resetIncubationForm();
  };

  const handleDeleteIncubationEntry = () => {
    if (editingIncubationId) {
      setIncubationData(incubationData.filter(item => item.id !== editingIncubationId));
    }
    setIsEditIncubationModalOpen(false);
    setDeleteConfirmOpen(false);
    resetIncubationForm();
  };

  // Contamination handlers
  const handleContaminationDateSelect = (date: string) => {
    setSelectedContaminationDate(date);
    setSelectedContaminationBatch('');
    setContaminationForm({
      date: '',
      batchNumber: '',
      vesselCount: '',
      type: '',
      possibleSource: '',
      disposalMethod: ''
    });
    setEditingContaminationId(null);
  };

  const handleContaminationBatchSelect = (batch: string) => {
    setSelectedContaminationBatch(batch);
    const recordData = contaminationData.find(record => record.date === selectedContaminationDate && record.batchNumber === batch);
    if (recordData) {
      setContaminationForm({
        date: recordData.date,
        batchNumber: recordData.batchNumber,
        vesselCount: String(recordData.vesselCount),
        type: recordData.type,
        possibleSource: recordData.possibleSource,
        disposalMethod: recordData.disposalMethod
      });
      setEditingContaminationId(recordData.id);
    }
  };

  const handleSaveContaminationChanges = () => {
    if (editingContaminationId) {
      setContaminationData(contaminationData.map(item => 
        item.id === editingContaminationId 
          ? { ...item, ...contaminationForm, vesselCount: parseInt(contaminationForm.vesselCount) || 0 }
          : item
      ));
    }
    setIsEditContaminationModalOpen(false);
    resetContaminationForm();
  };

  const handleDeleteContaminationEntry = () => {
    if (editingContaminationId) {
      setContaminationData(contaminationData.filter(item => item.id !== editingContaminationId));
    }
    setIsEditContaminationModalOpen(false);
    setDeleteConfirmOpen(false);
    resetContaminationForm();
  };

  const handleDelete = () => {
    if (editingIncubationId) {
      handleDeleteIncubationEntry();
    } else if (editingContaminationId) {
      handleDeleteContaminationEntry();
    }
  };

  const resetIncubationForm = () => {
    setSelectedIncubationDate('');
    setSelectedIncubationBatch('');
    setEditingIncubationId(null);
    setIncubationForm({
      subcultureDate: '',
      stage: '',
      batchNumber: '',
      mediaCode: '',
      operator: '',
      cropName: '',
      vessels: '',
      shoots: '',
      temp: '',
      humidity: '',
      photoperiod: '',
      lightIntensity: ''
    });
  };

  const resetContaminationForm = () => {
    setSelectedContaminationDate('');
    setSelectedContaminationBatch('');
    setEditingContaminationId(null);
    setContaminationForm({
      date: '',
      batchNumber: '',
      vesselCount: '',
      type: '',
      possibleSource: '',
      disposalMethod: ''
    });
  };


  const currentFilter = activeTab === 'incubation' ? incubationFilter : contaminationFilter;

  return (
    <div className="p-6 space-y-6">
      <FilterBar 
        field1={{
          label: activeTab === 'incubation' ? 'Crop Name' : 'Type',
          value: currentFilter.selectedField1,
          onChange: currentFilter.handleField1Change,
          options: currentFilter.field1Options,
          placeholder: activeTab === 'incubation' ? 'Select crop' : 'Select type'
        }}
        field2={{
          label: activeTab === 'incubation' ? 'Batch Name' : 'Batch Number',
          value: currentFilter.selectedField2,
          onChange: currentFilter.handleField2Change,
          options: currentFilter.field2Options,
          placeholder: activeTab === 'incubation' ? 'Select batch' : 'Select batch'
        }}
        onSearch={currentFilter.handleSearch}
      />
      <Card>
        <CardHeader>
          <CardTitle>Incubation Module</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="incubation">Incubation Register</TabsTrigger>
              <TabsTrigger value="contamination">Mortality Record</TabsTrigger>
            </TabsList>

            <TabsContent value="incubation">
              <div className="space-y-4">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <BackToMainDataButton 
                    isVisible={incubationFilter.isFiltered}
                    onClick={incubationFilter.handleReset}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      resetIncubationForm();
                      setIsEditIncubationModalOpen(true);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Dialog open={isIncubationModalOpen} onOpenChange={(open: boolean) => {
                    setIsIncubationModalOpen(open);
                    if (!open) resetIncubationForm();
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant={null as any}
                        style={{ backgroundColor: '#4CAF50', color: 'white' }}
                        className="hover:bg-[#66BB6A] font-medium shadow-sm"
                        onClick={() => resetIncubationForm()}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Incubation Record
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Incubation Record</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                          <Label>Subculture Date</Label>
                          <Input 
                            type="date" 
                            value={incubationForm.subcultureDate}
                            onChange={(e) => setIncubationForm({...incubationForm, subcultureDate: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Stage</Label>
                          <Select value={incubationForm.stage} onValueChange={(value: string) => setIncubationForm({...incubationForm, stage: value})}>
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
                          <Label>Batch Number</Label>
                          <Input 
                            placeholder="BTH-2024-001" 
                            value={incubationForm.batchNumber}
                            onChange={(e) => setIncubationForm({...incubationForm, batchNumber: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Media Code</Label>
                          <Input 
                            placeholder="MS-001" 
                            value={incubationForm.mediaCode}
                            onChange={(e) => setIncubationForm({...incubationForm, mediaCode: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Operator Name</Label>
                          <Input 
                            placeholder="Enter name" 
                            value={incubationForm.operator}
                            onChange={(e) => setIncubationForm({...incubationForm, operator: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Crop Name</Label>
                          <Input 
                            placeholder="Banana" 
                            value={incubationForm.cropName}
                            onChange={(e) => setIncubationForm({...incubationForm, cropName: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>No. of Vessels</Label>
                          <Input 
                            type="number" 
                            placeholder="120" 
                            value={incubationForm.vessels}
                            onChange={(e) => setIncubationForm({...incubationForm, vessels: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>No. of Shoots</Label>
                          <Input 
                            type="number" 
                            placeholder="2400" 
                            value={incubationForm.shoots}
                            onChange={(e) => setIncubationForm({...incubationForm, shoots: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Temp</Label>
                          <Input 
                            placeholder="25°C" 
                            value={incubationForm.temp}
                            onChange={(e) => setIncubationForm({...incubationForm, temp: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Humidity</Label>
                          <Input 
                            placeholder="65%" 
                            value={incubationForm.humidity}
                            onChange={(e) => setIncubationForm({...incubationForm, humidity: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Photo Period</Label>
                          <Input 
                            placeholder="16/8" 
                            value={incubationForm.photoperiod}
                            onChange={(e) => setIncubationForm({...incubationForm, photoperiod: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Light Intensity</Label>
                          <Input 
                            placeholder="3000 lux" 
                            value={incubationForm.lightIntensity}
                            onChange={(e) => setIncubationForm({...incubationForm, lightIntensity: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => {
                          setIsIncubationModalOpen(false);
                          resetIncubationForm();
                        }}>Cancel</Button>
                        <Button 
                          variant={null as any}
                          style={{ backgroundColor: '#4CAF50', color: 'white' }}
                          className="hover:bg-[#66BB6A] font-medium shadow-sm"
                          onClick={handleSaveIncubation}
                        >
                          Save Record
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Edit Incubation Dialog */}
                <Dialog open={isEditIncubationModalOpen} onOpenChange={setIsEditIncubationModalOpen}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Incubation Record</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Select Date</Label>
                          <Select value={selectedIncubationDate} onValueChange={handleIncubationDateSelect}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select date" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableIncubationDates.map(date => (
                                <SelectItem key={date} value={date}>{date}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Select Batch Number</Label>
                          <Select value={selectedIncubationBatch} onValueChange={handleIncubationBatchSelect} disabled={!selectedIncubationDate}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select batch" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableIncubationBatches.map(batch => (
                                <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {editingIncubationId && (
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                          <div>
                            <Label>Subculture Date</Label>
                            <Input type="date" value={incubationForm.subcultureDate} onChange={(e) => setIncubationForm({...incubationForm, subcultureDate: e.target.value})} />
                          </div>
                          <div>
                            <Label>Stage</Label>
                            <Select value={incubationForm.stage} onValueChange={(value: string) => setIncubationForm({...incubationForm, stage: value})}>
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
                            <Label>Batch Number</Label>
                            <Input value={incubationForm.batchNumber} onChange={(e) => setIncubationForm({...incubationForm, batchNumber: e.target.value})} />
                          </div>
                          <div>
                            <Label>Media Code</Label>
                            <Input value={incubationForm.mediaCode} onChange={(e) => setIncubationForm({...incubationForm, mediaCode: e.target.value})} />
                          </div>
                          <div>
                            <Label>Operator Name</Label>
                            <Input value={incubationForm.operator} onChange={(e) => setIncubationForm({...incubationForm, operator: e.target.value})} />
                          </div>
                          <div>
                            <Label>Crop Name</Label>
                            <Input value={incubationForm.cropName} onChange={(e) => setIncubationForm({...incubationForm, cropName: e.target.value})} />
                          </div>
                          <div>
                            <Label>No. of Vessels</Label>
                            <Input type="number" value={incubationForm.vessels} onChange={(e) => setIncubationForm({...incubationForm, vessels: e.target.value})} />
                          </div>
                          <div>
                            <Label>No. of Shoots</Label>
                            <Input type="number" value={incubationForm.shoots} onChange={(e) => setIncubationForm({...incubationForm, shoots: e.target.value})} />
                          </div>
                          <div>
                            <Label>Temp</Label>
                            <Input value={incubationForm.temp} onChange={(e) => setIncubationForm({...incubationForm, temp: e.target.value})} />
                          </div>
                          <div>
                            <Label>Humidity</Label>
                            <Input value={incubationForm.humidity} onChange={(e) => setIncubationForm({...incubationForm, humidity: e.target.value})} />
                          </div>
                          <div>
                            <Label>Photo Period</Label>
                            <Input value={incubationForm.photoperiod} onChange={(e) => setIncubationForm({...incubationForm, photoperiod: e.target.value})} />
                          </div>
                          <div>
                            <Label>Light Intensity</Label>
                            <Input value={incubationForm.lightIntensity} onChange={(e) => setIncubationForm({...incubationForm, lightIntensity: e.target.value})} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => { setIsEditIncubationModalOpen(false); resetIncubationForm(); }}>
                        Cancel
                      </Button>
                      {editingIncubationId && (
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
                            onClick={handleSaveIncubationChanges}
                          >
                            Save Changes
                          </Button>
                        </>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="border rounded-lg overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs text-gray-600 whitespace-nowrap">Subculture Date</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600 whitespace-nowrap">Stage</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600 whitespace-nowrap">Batch Number</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600 whitespace-nowrap">Media Code</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600 whitespace-nowrap">Operator Name</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600 whitespace-nowrap">Crop Name</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600 whitespace-nowrap">No. of Vessels</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600 whitespace-nowrap">No. of Shoots</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600 whitespace-nowrap">Temp</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600 whitespace-nowrap">Humidity</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600 whitespace-nowrap">Photo Period</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600 whitespace-nowrap">Light Intensity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incubationFilter.visibleData.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm whitespace-nowrap">{item.subcultureDate}</td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">
                            <Badge variant="outline">{item.stage}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {item.batchNumber}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {item.mediaCode}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">{item.operator}</td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">{item.cropName}</td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">{item.vessels}</td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">{item.shoots}</td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">{item.temp}</td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">{item.humidity}</td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">{item.photoperiod}</td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">{item.lightIntensity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contamination">
              <div className="space-y-4">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <BackToMainDataButton 
                    isVisible={contaminationFilter.isFiltered}
                    onClick={contaminationFilter.handleReset}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      resetContaminationForm();
                      setIsEditContaminationModalOpen(true);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Dialog open={isContaminationModalOpen} onOpenChange={(open: boolean) => {
                    setIsContaminationModalOpen(open);
                    if (!open) resetContaminationForm();
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant={null as any}
                        style={{ backgroundColor: '#4CAF50', color: 'white' }}
                        className="hover:bg-[#66BB6A] font-medium shadow-sm"
                        onClick={() => resetContaminationForm()}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Record Mortality
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl">
                      <DialogHeader>
                        <DialogTitle>Record Mortality</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input 
                            type="date" 
                            value={contaminationForm.date}
                            onChange={(e) => setContaminationForm({...contaminationForm, date: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Batch Number</Label>
                          <Input 
                            placeholder="BTH-2024-001" 
                            value={contaminationForm.batchNumber}
                            onChange={(e) => setContaminationForm({...contaminationForm, batchNumber: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Vessel Count</Label>
                          <Input 
                            type="number" 
                            placeholder="2" 
                            value={contaminationForm.vesselCount}
                            onChange={(e) => setContaminationForm({...contaminationForm, vesselCount: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Type of Mortality</Label>
                          <Input 
                            placeholder="Bacterial / Fungal" 
                            value={contaminationForm.type}
                            onChange={(e) => setContaminationForm({...contaminationForm, type: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Possible Source</Label>
                          <Input 
                            placeholder="Media preparation, handling, etc." 
                            value={contaminationForm.possibleSource}
                            onChange={(e) => setContaminationForm({...contaminationForm, possibleSource: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Disposal Method</Label>
                          <Input 
                            placeholder="Autoclaved and discarded" 
                            value={contaminationForm.disposalMethod}
                            onChange={(e) => setContaminationForm({...contaminationForm, disposalMethod: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => {
                          setIsContaminationModalOpen(false);
                          resetContaminationForm();
                        }}>Cancel</Button>
                        <Button 
                          variant={null as any}
                          style={{ backgroundColor: '#4CAF50', color: 'white' }}
                          className="hover:bg-[#66BB6A] font-medium shadow-sm"
                          onClick={handleSaveContamination}
                        >
                          Save Record
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Edit Contamination Dialog */}
                <Dialog open={isEditContaminationModalOpen} onOpenChange={setIsEditContaminationModalOpen}>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Edit Mortality Record</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Select Date</Label>
                          <Select value={selectedContaminationDate} onValueChange={handleContaminationDateSelect}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select date" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableContaminationDates.map(date => (
                                <SelectItem key={date} value={date}>{date}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Select Batch Number</Label>
                          <Select value={selectedContaminationBatch} onValueChange={handleContaminationBatchSelect} disabled={!selectedContaminationDate}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select batch" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableContaminationBatches.map(batch => (
                                <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {editingContaminationId && (
                        <div className="grid gap-4 pt-4 border-t">
                          <div>
                            <Label>Date</Label>
                            <Input type="date" value={contaminationForm.date} onChange={(e) => setContaminationForm({...contaminationForm, date: e.target.value})} />
                          </div>
                          <div>
                            <Label>Batch Number</Label>
                            <Input value={contaminationForm.batchNumber} onChange={(e) => setContaminationForm({...contaminationForm, batchNumber: e.target.value})} />
                          </div>
                          <div>
                            <Label>Vessel Count</Label>
                            <Input type="number" value={contaminationForm.vesselCount} onChange={(e) => setContaminationForm({...contaminationForm, vesselCount: e.target.value})} />
                          </div>
                          <div>
                            <Label>Type of Mortality</Label>
                            <Input value={contaminationForm.type} onChange={(e) => setContaminationForm({...contaminationForm, type: e.target.value})} />
                          </div>
                          <div>
                            <Label>Possible Source</Label>
                            <Input value={contaminationForm.possibleSource} onChange={(e) => setContaminationForm({...contaminationForm, possibleSource: e.target.value})} />
                          </div>
                          <div>
                            <Label>Disposal Method</Label>
                            <Input value={contaminationForm.disposalMethod} onChange={(e) => setContaminationForm({...contaminationForm, disposalMethod: e.target.value})} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => { setIsEditContaminationModalOpen(false); resetContaminationForm(); }}>
                        Cancel
                      </Button>
                      {editingContaminationId && (
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
                            onClick={handleSaveContaminationChanges}
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
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Batch Number</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Vessel Count</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Type of Mortality</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Possible Source</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Disposal Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contaminationFilter.visibleData.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{item.date}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {item.batchNumber}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <Badge className="bg-red-100 text-red-700">{item.vesselCount}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <Badge className={item.type === 'Bacterial' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}>
                              {item.type}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">{item.possibleSource}</td>
                          <td className="px-4 py-3 text-sm">{item.disposalMethod}</td>
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
