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

type CleaningData = {
  id: number;
  date: string;
  operator: string;
  area: string;
};

type DeepCleaningData = {
  id: number;
  machineName: string;
  cleanedBy: string;
  date: string;
  sign: string;
};

export function CleaningRecord() {
  // Get today's date
  const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDate = getTodayDate();

  const [cleaningData, setCleaningData] = useState<CleaningData[]>([
    { id: 1, date: todayDate, operator: 'Amit Shah', area: 'Laminar Flow 1' },
    { id: 2, date: '2024-11-15', operator: 'Priya Patel', area: 'Culture Room A' },
    { id: 3, date: '2024-11-14', operator: 'Rahul Desai', area: 'Laminar Flow 2' },
    { id: 4, date: '2024-11-14', operator: 'Neha Singh', area: 'Transfer Room' },
    { id: 5, date: '2024-11-13', operator: 'Amit Shah', area: 'Incubation Room B' }
  ]);

  const [deepCleaningData, setDeepCleaningData] = useState<DeepCleaningData[]>([
    { id: 1, machineName: 'Autoclave Unit 1', cleanedBy: 'Amit Shah', date: todayDate, sign: 'A. Shah' },
    { id: 2, machineName: 'Laminar Flow Cabinet 2', cleanedBy: 'Priya Patel', date: '2024-11-15', sign: 'P. Patel' },
    { id: 3, machineName: 'Incubator A', cleanedBy: 'Rahul Desai', date: '2024-11-14', sign: 'R. Desai' },
    { id: 4, machineName: 'Media Preparation Station', cleanedBy: 'Neha Singh', date: '2024-11-14', sign: 'N. Singh' }
  ]);

  const [isCleaningModalOpen, setIsCleaningModalOpen] = useState(false);
  const [isDeepCleaningModalOpen, setIsDeepCleaningModalOpen] = useState(false);
  const [isEditCleaningModalOpen, setIsEditCleaningModalOpen] = useState(false);
  const [isEditDeepCleaningModalOpen, setIsEditDeepCleaningModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('cleaning');
  const [editingCleaningId, setEditingCleaningId] = useState<number | null>(null);
  const [editingDeepCleaningId, setEditingDeepCleaningId] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'cleaning' | 'deepCleaning', id: number } | null>(null);
  

  // Search filters (Date → Area Cleaned)
  const cleaningFilter = useSearchFilter({
    sourceData: cleaningData,
    field1Accessor: (item) => item.date,
    field2Accessor: (item) => item.area,
  });

  const deepCleaningFilter = useSearchFilter({
    sourceData: deepCleaningData,
    field1Accessor: (item) => item.date,
    field2Accessor: (item) => item.machineName,
  });
  
  const [cleaningForm, setCleaningForm] = useState({
    date: '',
    operator: '',
    area: ''
  });

  const [deepCleaningForm, setDeepCleaningForm] = useState({
    machineName: '',
    cleanedBy: '',
    date: '',
    sign: ''
  });

  const handleSaveCleaning = () => {
    if (editingCleaningId) {
      setCleaningData(cleaningData.map(item => 
        item.id === editingCleaningId 
          ? { ...item, ...cleaningForm }
          : item
      ));
    } else {
      const maxId = cleaningData.length > 0 ? Math.max(...cleaningData.map(i => i.id)) : 0;
      const newId = maxId + 1;
      setCleaningData([...cleaningData, { id: newId, ...cleaningForm } as CleaningData]);
    }
    setIsCleaningModalOpen(false);
    setIsEditCleaningModalOpen(false);
    resetCleaningForm();
  };

  const handleSaveDeepCleaning = () => {
    if (editingDeepCleaningId) {
      setDeepCleaningData(deepCleaningData.map(item => 
        item.id === editingDeepCleaningId 
          ? { ...item, ...deepCleaningForm }
          : item
      ));
    } else {
      const maxId = deepCleaningData.length > 0 ? Math.max(...deepCleaningData.map(i => i.id)) : 0;
      const newId = maxId + 1;
      setDeepCleaningData([...deepCleaningData, { id: newId, ...deepCleaningForm } as DeepCleaningData]);
    }
    setIsDeepCleaningModalOpen(false);
    setIsEditDeepCleaningModalOpen(false);
    resetDeepCleaningForm();
  };

  // Get available operators for selected date (from cleaning data)
  const availableOperators = useMemo(() => {
    if (!cleaningForm.date) return [];
    const recordsForDate = cleaningData.filter(item => item.date === cleaningForm.date);
    return Array.from(new Set(recordsForDate.map(item => item.operator)));
  }, [cleaningForm.date, cleaningData]);

  // Get available areas for selected date and operator
  const availableAreas = useMemo(() => {
    if (!cleaningForm.date || !cleaningForm.operator) return [];
    const recordsForDateAndOperator = cleaningData.filter(item => 
      item.date === cleaningForm.date && item.operator === cleaningForm.operator
    );
    return Array.from(new Set(recordsForDateAndOperator.map(item => item.area)));
  }, [cleaningForm.date, cleaningForm.operator, cleaningData]);

  // Get available machines for selected date (from deep cleaning data)
  const availableMachines = useMemo(() => {
    if (!deepCleaningForm.date) return [];
    const recordsForDate = deepCleaningData.filter(item => item.date === deepCleaningForm.date);
    return Array.from(new Set(recordsForDate.map(item => item.machineName)));
  }, [deepCleaningForm.date, deepCleaningData]);

  const handleDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'cleaning') {
      setCleaningData(cleaningData.filter(item => item.id !== itemToDelete.id));
    } else {
      setDeepCleaningData(deepCleaningData.filter(item => item.id !== itemToDelete.id));
    }
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
    if (isEditCleaningModalOpen) {
      setIsEditCleaningModalOpen(false);
      resetCleaningForm();
    }
    if (isEditDeepCleaningModalOpen) {
      setIsEditDeepCleaningModalOpen(false);
      resetDeepCleaningForm();
    }
  };

  const resetCleaningForm = () => {
    setEditingCleaningId(null);
    setCleaningForm({
      date: '',
      operator: '',
      area: ''
    });
  };

  const resetDeepCleaningForm = () => {
    setEditingDeepCleaningId(null);
    setDeepCleaningForm({
      machineName: '',
      cleanedBy: '',
      date: '',
      sign: ''
    });
  };


  const currentFilter = activeTab === 'cleaning' ? cleaningFilter : deepCleaningFilter;

  return (
    <div className="p-6 space-y-6">
      <FilterBar 
        field1={{
          label: 'Date',
          value: currentFilter.selectedField1,
          onChange: currentFilter.handleField1Change,
          options: currentFilter.field1Options,
          placeholder: 'Select date'
        }}
        field2={{
          label: activeTab === 'cleaning' ? 'Area Cleaned' : 'Machine Name',
          value: currentFilter.selectedField2,
          onChange: currentFilter.handleField2Change,
          options: currentFilter.field2Options,
          placeholder: activeTab === 'cleaning' ? 'Select area' : 'Select machine'
        }}
        onSearch={currentFilter.handleSearch}
      />
      <Card>
        <CardHeader>
          <CardTitle>Cleaning Register</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="cleaning">Cleaning Record</TabsTrigger>
              <TabsTrigger value="deepCleaning">Deep Cleaning Record</TabsTrigger>
            </TabsList>

            <TabsContent value="cleaning">
              <div className="space-y-4">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <BackToMainDataButton 
                    isVisible={cleaningFilter.isFiltered}
                    onClick={cleaningFilter.handleReset}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      resetCleaningForm();
                      setIsEditCleaningModalOpen(true);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Dialog open={isCleaningModalOpen} onOpenChange={(open: boolean) => {
                    setIsCleaningModalOpen(open);
                    if (!open) resetCleaningForm();
                  }}>
              <DialogTrigger asChild>
                      <Button 
                        variant={null as any}
                        style={{ backgroundColor: '#4CAF50', color: 'white' }}
                        className="hover:bg-[#66BB6A] font-medium shadow-sm"
                        onClick={() => resetCleaningForm()}
                      >
                  <Plus className="w-4 h-4 mr-2" />
                        Add Cleaning Record
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                        <DialogTitle>Add Cleaning Record</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                          <Input 
                            type="date" 
                            value={cleaningForm.date}
                            onChange={(e) => setCleaningForm({...cleaningForm, date: e.target.value})}
                          />
                  </div>
                  <div className="space-y-2">
                    <Label>Operator Name</Label>
                          <Input 
                            placeholder="Enter name" 
                            value={cleaningForm.operator}
                            onChange={(e) => setCleaningForm({...cleaningForm, operator: e.target.value})}
                          />
                  </div>
                  <div className="space-y-2">
                    <Label>Area Cleaned</Label>
                          <Select value={cleaningForm.area} onValueChange={(value: string) => setCleaningForm({...cleaningForm, area: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                              <SelectItem value="Laminar Flow 1">Laminar Flow 1</SelectItem>
                              <SelectItem value="Laminar Flow 2">Laminar Flow 2</SelectItem>
                              <SelectItem value="Culture Room A">Culture Room A</SelectItem>
                              <SelectItem value="Culture Room B">Culture Room B</SelectItem>
                              <SelectItem value="Transfer Room">Transfer Room</SelectItem>
                              <SelectItem value="Incubation Room A">Incubation Room A</SelectItem>
                              <SelectItem value="Incubation Room B">Incubation Room B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => {
                          setIsCleaningModalOpen(false);
                          resetCleaningForm();
                        }}>Cancel</Button>
                        <Button 
                          variant={null as any}
                          style={{ backgroundColor: '#4CAF50', color: 'white' }}
                          className="hover:bg-[#66BB6A] font-medium shadow-sm"
                          onClick={handleSaveCleaning}
                        >
                          Save Record
                        </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

                {/* Edit Cleaning Dialog */}
                <Dialog open={isEditCleaningModalOpen} onOpenChange={(open: boolean) => {
                  setIsEditCleaningModalOpen(open);
                  if (!open) {
                    resetCleaningForm();
                    setEditingCleaningId(null);
                  }
                }}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Cleaning Record</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input 
                          type="date" 
                          value={cleaningForm.date}
                          onChange={(e) => {
                            setCleaningForm({...cleaningForm, date: e.target.value, operator: '', area: ''});
                            setEditingCleaningId(null);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Operator Name</Label>
                        {cleaningForm.date ? (
                          <Select 
                            value={cleaningForm.operator} 
                            onValueChange={(value: string) => {
                              setCleaningForm({...cleaningForm, operator: value, area: ''});
                              setEditingCleaningId(null);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select operator" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableOperators.map(operator => (
                                <SelectItem key={operator} value={operator}>{operator}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input placeholder="Select date first" disabled />
                        )}
            </div>
                      <div className="space-y-2">
                        <Label>Area Cleaned</Label>
                        {cleaningForm.date && cleaningForm.operator ? (
                          <Select 
                            value={cleaningForm.area} 
                            onValueChange={(value: string) => {
                              const found = cleaningData.find(item => 
                                item.date === cleaningForm.date && 
                                item.operator === cleaningForm.operator && 
                                item.area === value
                              );
                              if (found) {
                                setCleaningForm({
                                  date: found.date,
                                  operator: found.operator,
                                  area: found.area
                                });
                                setEditingCleaningId(found.id);
                              } else {
                                setCleaningForm({...cleaningForm, area: value});
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                              {availableAreas.length > 0 ? (
                                availableAreas.map(area => (
                                  <SelectItem key={area} value={area}>{area}</SelectItem>
                                ))
                              ) : (
                                <>
                                  <SelectItem value="Laminar Flow 1">Laminar Flow 1</SelectItem>
                                  <SelectItem value="Laminar Flow 2">Laminar Flow 2</SelectItem>
                                  <SelectItem value="Culture Room A">Culture Room A</SelectItem>
                                  <SelectItem value="Culture Room B">Culture Room B</SelectItem>
                                  <SelectItem value="Transfer Room">Transfer Room</SelectItem>
                                  <SelectItem value="Incubation Room A">Incubation Room A</SelectItem>
                                  <SelectItem value="Incubation Room B">Incubation Room B</SelectItem>
                                </>
                              )}
              </SelectContent>
            </Select>
                        ) : (
                          <Input placeholder="Select date and operator first" disabled />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between gap-3">
                      <Button 
                        variant="destructive" 
                        onClick={() => {
                          if (editingCleaningId) {
                            setItemToDelete({ type: 'cleaning', id: editingCleaningId });
                            setDeleteConfirmOpen(true);
                          }
                        }}
                        disabled={!editingCleaningId}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => {
                          setIsEditCleaningModalOpen(false);
                          resetCleaningForm();
                        }}>Cancel</Button>
                        <Button 
                          variant={null as any}
                          style={{ backgroundColor: '#4CAF50', color: 'white' }}
                          className="hover:bg-[#66BB6A] font-medium shadow-sm"
                          onClick={handleSaveCleaning}
                        >
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
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Operator Name</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Area Cleaned</th>
                </tr>
              </thead>
              <tbody>
                      {cleaningFilter.visibleData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{item.date}</td>
                    <td className="px-4 py-3 text-sm">{item.operator}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {item.area}
                      </Badge>
                    </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="deepCleaning">
              <div className="space-y-4">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <BackToMainDataButton 
                    isVisible={deepCleaningFilter.isFiltered}
                    onClick={deepCleaningFilter.handleReset}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      resetDeepCleaningForm();
                      setIsEditDeepCleaningModalOpen(true);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Dialog open={isDeepCleaningModalOpen} onOpenChange={(open: boolean) => {
                    setIsDeepCleaningModalOpen(open);
                    if (!open) resetDeepCleaningForm();
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant={null as any}
                        style={{ backgroundColor: '#4CAF50', color: 'white' }}
                        className="hover:bg-[#66BB6A] font-medium shadow-sm"
                        onClick={() => resetDeepCleaningForm()}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Deep Cleaning Record
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Deep Cleaning Record</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label>Name of Machine</Label>
                          <Input 
                            placeholder="Enter machine name" 
                            value={deepCleaningForm.machineName}
                            onChange={(e) => setDeepCleaningForm({...deepCleaningForm, machineName: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Who Cleaned</Label>
                          <Input 
                            placeholder="Enter name" 
                            value={deepCleaningForm.cleanedBy}
                            onChange={(e) => setDeepCleaningForm({...deepCleaningForm, cleanedBy: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input 
                            type="date" 
                            value={deepCleaningForm.date}
                            onChange={(e) => setDeepCleaningForm({...deepCleaningForm, date: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Sign</Label>
                          <Input 
                            placeholder="Enter signature" 
                            value={deepCleaningForm.sign}
                            onChange={(e) => setDeepCleaningForm({...deepCleaningForm, sign: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => {
                          setIsDeepCleaningModalOpen(false);
                          resetDeepCleaningForm();
                        }}>Cancel</Button>
                        <Button 
                          variant={null as any}
                          style={{ backgroundColor: '#4CAF50', color: 'white' }}
                          className="hover:bg-[#66BB6A] font-medium shadow-sm"
                          onClick={handleSaveDeepCleaning}
                        >
                          Save Record
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Edit Deep Cleaning Dialog */}
                <Dialog open={isEditDeepCleaningModalOpen} onOpenChange={(open: boolean) => {
                  setIsEditDeepCleaningModalOpen(open);
                  if (!open) {
                    resetDeepCleaningForm();
                    setEditingDeepCleaningId(null);
                  }
                }}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Deep Cleaning Record</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input 
                          type="date" 
                          value={deepCleaningForm.date}
                          onChange={(e) => {
                            setDeepCleaningForm({...deepCleaningForm, date: e.target.value, machineName: ''});
                            setEditingDeepCleaningId(null);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Name of Machine</Label>
                        {deepCleaningForm.date ? (
                          <Select 
                            value={deepCleaningForm.machineName} 
                            onValueChange={(value: string) => {
                              const found = deepCleaningData.find(item => 
                                item.date === deepCleaningForm.date && item.machineName === value
                              );
                              if (found) {
                                setDeepCleaningForm({
                                  machineName: found.machineName,
                                  cleanedBy: found.cleanedBy,
                                  date: found.date,
                                  sign: found.sign
                                });
                                setEditingDeepCleaningId(found.id);
                              } else {
                                setDeepCleaningForm({...deepCleaningForm, machineName: value});
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select machine" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableMachines.map(machine => (
                                <SelectItem key={machine} value={machine}>{machine}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input placeholder="Select date first" disabled />
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Who Cleaned</Label>
                        <Input 
                          placeholder="Enter name" 
                          value={deepCleaningForm.cleanedBy}
                          onChange={(e) => setDeepCleaningForm({...deepCleaningForm, cleanedBy: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Sign</Label>
                        <Input 
                          placeholder="Enter signature" 
                          value={deepCleaningForm.sign}
                          onChange={(e) => setDeepCleaningForm({...deepCleaningForm, sign: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between gap-3">
                      <Button 
                        variant="destructive" 
                        onClick={() => {
                          if (editingDeepCleaningId) {
                            setItemToDelete({ type: 'deepCleaning', id: editingDeepCleaningId });
                            setDeleteConfirmOpen(true);
                          }
                        }}
                        disabled={!editingDeepCleaningId}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => {
                          setIsEditDeepCleaningModalOpen(false);
                          resetDeepCleaningForm();
                        }}>Cancel</Button>
                        <Button 
                          variant={null as any}
                          style={{ backgroundColor: '#4CAF50', color: 'white' }}
                          className="hover:bg-[#66BB6A] font-medium shadow-sm"
                          onClick={handleSaveDeepCleaning}
                        >
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
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Name of Machine</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Who Cleaned</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Date</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Sign</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deepCleaningFilter.visibleData.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{item.machineName}</td>
                          <td className="px-4 py-3 text-sm">{item.cleanedBy}</td>
                          <td className="px-4 py-3 text-sm">{item.date}</td>
                          <td className="px-4 py-3 text-sm">{item.sign}</td>
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
