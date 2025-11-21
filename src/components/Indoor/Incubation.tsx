import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
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

type IncubationData = {
  id: number;
  subcultureDate: string;
  stage: string;
  batchNumber: string;
  mediaCode: string;
  operator: string;
  species: string;
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
    { id: 1, subcultureDate: todayDate, stage: 'Stage 3', batchNumber: 'BTH-2024-001', mediaCode: 'MS-001', operator: 'Amit Shah', species: 'Banana', vessels: 120, shoots: 2400, temp: '25°C', humidity: '65%', photoperiod: '16/8', lightIntensity: '3000 lux' },
    { id: 2, subcultureDate: '2024-11-15', stage: 'Stage 2', batchNumber: 'BTH-2024-002', mediaCode: 'MS-002', operator: 'Priya Patel', species: 'Strawberry', vessels: 80, shoots: 1600, temp: '22°C', humidity: '70%', photoperiod: '16/8', lightIntensity: '2500 lux' },
    { id: 3, subcultureDate: '2024-11-14', stage: 'Stage 4', batchNumber: 'BTH-2024-003', mediaCode: 'MS-001', operator: 'Rahul Desai', species: 'Rose', vessels: 150, shoots: 3000, temp: '24°C', humidity: '60%', photoperiod: '14/10', lightIntensity: '3500 lux' }
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
  const [showAllIncubationRecords, setShowAllIncubationRecords] = useState(false);
  const [showAllContaminationRecords, setShowAllContaminationRecords] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'incubation' | 'contamination', id: number } | null>(null);
  
  // Incubation form state
  const [incubationForm, setIncubationForm] = useState({
    subcultureDate: '',
    stage: '',
    batchNumber: '',
    mediaCode: '',
    operator: '',
    species: '',
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

  // Get available media codes for selected date (from Media Preparation)
  const availableMediaCodes = useMemo(() => {
    if (!incubationForm.subcultureDate) return [];
    const cyclesForDate = mediaPrepAutoclaveCycles.filter(cycle => cycle.date === incubationForm.subcultureDate);
    return Array.from(new Set(cyclesForDate.map(cycle => cycle.mediaCode)));
  }, [incubationForm.subcultureDate]);

  // Get available batch numbers for selected date and media code
  const availableBatchNumbers = useMemo(() => {
    if (!incubationForm.subcultureDate || !incubationForm.mediaCode) return [];
    const batchesForDateAndMedia = incubationData.filter(item => 
      item.subcultureDate === incubationForm.subcultureDate && item.mediaCode === incubationForm.mediaCode
    );
    return Array.from(new Set(batchesForDateAndMedia.map(item => item.batchNumber)));
  }, [incubationForm.subcultureDate, incubationForm.mediaCode, incubationData]);

  // Get available batch numbers for contamination (from incubation data for selected date)
  const availableContaminationBatchNumbers = useMemo(() => {
    if (!contaminationForm.date) return [];
    const batchesForDate = incubationData.filter(item => item.subcultureDate === contaminationForm.date);
    return Array.from(new Set(batchesForDate.map(item => item.batchNumber)));
  }, [contaminationForm.date, incubationData]);

  const handleEditBatch = () => {
    if (activeTab === 'incubation') {
      setEditingIncubationId(null);
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;
      
      setIncubationForm({
        subcultureDate: todayStr,
        stage: '',
        batchNumber: '',
        mediaCode: '',
        operator: '',
        species: '',
        vessels: '',
        shoots: '',
        temp: '',
        humidity: '',
        photoperiod: '',
        lightIntensity: ''
      });
      setIsEditIncubationModalOpen(true);
    } else {
      setEditingContaminationId(null);
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;
      
      setContaminationForm({
        date: todayStr,
        batchNumber: '',
        vesselCount: '',
        type: '',
        possibleSource: '',
        disposalMethod: ''
      });
      setIsEditContaminationModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'incubation') {
      setIncubationData(incubationData.filter(item => item.id !== itemToDelete.id));
    } else {
      setContaminationData(contaminationData.filter(item => item.id !== itemToDelete.id));
    }
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
    if (isEditIncubationModalOpen) {
      setIsEditIncubationModalOpen(false);
      resetIncubationForm();
    }
    if (isEditContaminationModalOpen) {
      setIsEditContaminationModalOpen(false);
      resetContaminationForm();
    }
  };

  const resetIncubationForm = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    setEditingIncubationId(null);
    setIncubationForm({
      subcultureDate: todayStr,
      stage: '',
      batchNumber: '',
      mediaCode: '',
      operator: '',
      species: '',
      vessels: '',
      shoots: '',
      temp: '',
      humidity: '',
      photoperiod: '',
      lightIntensity: ''
    });
  };

  const resetContaminationForm = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    setEditingContaminationId(null);
    setContaminationForm({
      date: todayStr,
      batchNumber: '',
      vesselCount: '',
      type: '',
      possibleSource: '',
      disposalMethod: ''
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
  const filteredIncubationData = showAllIncubationRecords 
    ? incubationData 
    : (incubationData || []).filter(item => {
        const today = getToday();
        return item?.subcultureDate === today;
      });

  const filteredContaminationData = showAllContaminationRecords 
    ? contaminationData 
    : (contaminationData || []).filter(item => {
        const today = getToday();
        return item?.date === today;
      });

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Incubation Module</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleEditBatch}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Batch
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="incubation">Incubation Register</TabsTrigger>
              <TabsTrigger value="contamination">Contamination Register</TabsTrigger>
            </TabsList>

            <TabsContent value="incubation">
              <div className="space-y-4">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAllIncubationRecords(!showAllIncubationRecords)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {showAllIncubationRecords ? 'Show Today Only' : 'View All Records'}
                  </Button>
                  <Dialog open={isIncubationModalOpen} onOpenChange={(open) => {
                    setIsIncubationModalOpen(open);
                    if (!open) resetIncubationForm();
                  }}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700" onClick={() => resetIncubationForm()}>
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
                          <Select value={incubationForm.stage} onValueChange={(value) => setIncubationForm({...incubationForm, stage: value})}>
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
                          <Label>Species</Label>
                          <Input 
                            placeholder="Banana" 
                            value={incubationForm.species}
                            onChange={(e) => setIncubationForm({...incubationForm, species: e.target.value})}
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
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveIncubation}>
                          Save Record
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Edit Incubation Dialog */}
                <Dialog open={isEditIncubationModalOpen} onOpenChange={(open) => {
                  setIsEditIncubationModalOpen(open);
                  if (!open) {
                    resetIncubationForm();
                    setEditingIncubationId(null);
                  }
                }}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Incubation Record</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Subculture Date</Label>
                        <Input 
                          type="date" 
                          value={incubationForm.subcultureDate}
                          onChange={(e) => {
                            setIncubationForm({...incubationForm, subcultureDate: e.target.value, mediaCode: '', batchNumber: ''});
                            setEditingIncubationId(null);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Stage</Label>
                        <Select value={incubationForm.stage} onValueChange={(value) => setIncubationForm({...incubationForm, stage: value})}>
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
                        {incubationForm.subcultureDate ? (
                          <Select 
                            value={incubationForm.mediaCode} 
                            onValueChange={(value) => {
                              setIncubationForm({...incubationForm, mediaCode: value, batchNumber: ''});
                              setEditingIncubationId(null);
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
                        <Label>Batch Number</Label>
                        {incubationForm.subcultureDate && incubationForm.mediaCode ? (
                          <Select 
                            value={incubationForm.batchNumber} 
                            onValueChange={(value) => {
                              const found = incubationData.find(item => 
                                item.subcultureDate === incubationForm.subcultureDate && 
                                item.mediaCode === incubationForm.mediaCode && 
                                item.batchNumber === value
                              );
                              if (found) {
                                setIncubationForm({
                                  subcultureDate: found.subcultureDate,
                                  stage: found.stage,
                                  batchNumber: found.batchNumber,
                                  mediaCode: found.mediaCode,
                                  operator: found.operator,
                                  species: found.species,
                                  vessels: found.vessels.toString(),
                                  shoots: found.shoots.toString(),
                                  temp: found.temp,
                                  humidity: found.humidity,
                                  photoperiod: found.photoperiod,
                                  lightIntensity: found.lightIntensity
                                });
                                setEditingIncubationId(found.id);
                              } else {
                                setIncubationForm({...incubationForm, batchNumber: value});
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select batch number" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableBatchNumbers.map(batch => (
                                <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input placeholder="Select date and media code first" disabled />
                        )}
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
                        <Label>Species</Label>
                        <Input 
                          placeholder="Banana" 
                          value={incubationForm.species}
                          onChange={(e) => setIncubationForm({...incubationForm, species: e.target.value})}
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
                    <div className="flex justify-between gap-3">
                      <Button 
                        variant="destructive" 
                        onClick={() => {
                          if (editingIncubationId) {
                            setItemToDelete({ type: 'incubation', id: editingIncubationId });
                            setDeleteConfirmOpen(true);
                          }
                        }}
                        disabled={!editingIncubationId}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => {
                          setIsEditIncubationModalOpen(false);
                          resetIncubationForm();
                        }}>Cancel</Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveIncubation}>
                          Save Changes
                        </Button>
                      </div>
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
                        <th className="px-4 py-3 text-left text-xs text-gray-600 whitespace-nowrap">Species</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600 whitespace-nowrap">No. of Vessels</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600 whitespace-nowrap">No. of Shoots</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600 whitespace-nowrap">Temp</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600 whitespace-nowrap">Humidity</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600 whitespace-nowrap">Photo Period</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600 whitespace-nowrap">Light Intensity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIncubationData.map((item) => (
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
                          <td className="px-4 py-3 text-sm whitespace-nowrap">{item.species}</td>
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
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAllContaminationRecords(!showAllContaminationRecords)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {showAllContaminationRecords ? 'Show Today Only' : 'View All Records'}
                  </Button>
                  <Dialog open={isContaminationModalOpen} onOpenChange={(open) => {
                    setIsContaminationModalOpen(open);
                    if (!open) resetContaminationForm();
                  }}>
                    <DialogTrigger asChild>
                      <Button className="bg-red-600 hover:bg-red-700" onClick={() => resetContaminationForm()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Record Contamination
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl">
                      <DialogHeader>
                        <DialogTitle>Record Contamination</DialogTitle>
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
                          <Label>Type of Contamination</Label>
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
                        <Button className="bg-red-600 hover:bg-red-700" onClick={handleSaveContamination}>
                          Save Record
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Edit Contamination Dialog */}
                <Dialog open={isEditContaminationModalOpen} onOpenChange={(open) => {
                  setIsEditContaminationModalOpen(open);
                  if (!open) {
                    resetContaminationForm();
                    setEditingContaminationId(null);
                  }
                }}>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Edit Contamination Record</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input 
                          type="date" 
                          value={contaminationForm.date}
                          onChange={(e) => {
                            setContaminationForm({...contaminationForm, date: e.target.value, batchNumber: ''});
                            setEditingContaminationId(null);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Batch Number</Label>
                        {contaminationForm.date ? (
                          <Select 
                            value={contaminationForm.batchNumber} 
                            onValueChange={(value) => {
                              const found = contaminationData.find(item => 
                                item.date === contaminationForm.date && item.batchNumber === value
                              );
                              if (found) {
                                setContaminationForm({
                                  date: found.date,
                                  batchNumber: found.batchNumber,
                                  vesselCount: found.vesselCount.toString(),
                                  type: found.type,
                                  possibleSource: found.possibleSource,
                                  disposalMethod: found.disposalMethod
                                });
                                setEditingContaminationId(found.id);
                              } else {
                                setContaminationForm({...contaminationForm, batchNumber: value});
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select batch number" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableContaminationBatchNumbers.map(batch => (
                                <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input placeholder="Select date first" disabled />
                        )}
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
                        <Label>Type of Contamination</Label>
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
                    <div className="flex justify-between gap-3">
                      <Button 
                        variant="destructive" 
                        onClick={() => {
                          if (editingContaminationId) {
                            setItemToDelete({ type: 'contamination', id: editingContaminationId });
                            setDeleteConfirmOpen(true);
                          }
                        }}
                        disabled={!editingContaminationId}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => {
                          setIsEditContaminationModalOpen(false);
                          resetContaminationForm();
                        }}>Cancel</Button>
                        <Button className="bg-red-600 hover:bg-red-700" onClick={handleSaveContamination}>
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
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Date</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Batch Number</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Vessel Count</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Type of Contamination</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Possible Source</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Disposal Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContaminationData.map((item) => (
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
