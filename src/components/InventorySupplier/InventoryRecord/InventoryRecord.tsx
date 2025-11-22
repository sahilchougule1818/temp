import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Button } from '../../ui/button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../ui/alert-dialog';
import { Badge } from '../../ui/badge';

type PurchaseRecord = {
  id: number;
  dateOfPurchase: string;
  itemName: string;
  quantityPurchased: number;
  currentStock: number;
};

type WithdrawalRecord = {
  id: number;
  itemName: string;
  previousStock: number;
  withdrawQuantity: number;
  currentStock: number;
  dateOfWithdrawal: string;
};

export function InventoryRecord() {
  const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDate = getTodayDate();

  const [purchaseRecords, setPurchaseRecords] = useState<PurchaseRecord[]>([
    { id: 1, dateOfPurchase: todayDate, itemName: 'Item A', quantityPurchased: 100, currentStock: 500 },
    { id: 2, dateOfPurchase: '2024-11-15', itemName: 'Item B', quantityPurchased: 200, currentStock: 800 },
  ]);

  const [withdrawalRecords, setWithdrawalRecords] = useState<WithdrawalRecord[]>([
    { id: 1, itemName: 'Item A', previousStock: 500, withdrawQuantity: 50, currentStock: 450, dateOfWithdrawal: todayDate },
    { id: 2, itemName: 'Item C', previousStock: 300, withdrawQuantity: 30, currentStock: 270, dateOfWithdrawal: '2024-11-15' },
  ]);

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [isEditPurchaseModalOpen, setIsEditPurchaseModalOpen] = useState(false);
  const [isEditWithdrawalModalOpen, setIsEditWithdrawalModalOpen] = useState(false);
  const [editingPurchaseId, setEditingPurchaseId] = useState<number | null>(null);
  const [editingWithdrawalId, setEditingWithdrawalId] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'purchase' | 'withdrawal', id: number } | null>(null);
  const [showAllPurchaseRecords, setShowAllPurchaseRecords] = useState(false);
  const [showAllWithdrawalRecords, setShowAllWithdrawalRecords] = useState(false);
  const [activeTab, setActiveTab] = useState('purchase');

  const [purchaseForm, setPurchaseForm] = useState({
    dateOfPurchase: todayDate,
    itemName: '',
    quantityPurchased: '',
    currentStock: ''
  });

  const [withdrawalForm, setWithdrawalForm] = useState({
    itemName: '',
    previousStock: '',
    withdrawQuantity: '',
    currentStock: '',
    dateOfWithdrawal: todayDate
  });

  const availableItemNames = useMemo(() => {
    const allNames = [
      ...purchaseRecords.map(rec => rec.itemName),
      ...withdrawalRecords.map(rec => rec.itemName)
    ];
    return Array.from(new Set(allNames));
  }, [purchaseRecords, withdrawalRecords]);

  const handlePurchaseItemSelect = (itemName: string) => {
    // When an item is selected in the edit modal, find the full record to pre-fill the form
    if (isEditPurchaseModalOpen && purchaseForm.dateOfPurchase) {
      const record = purchaseRecords.find(rec =>
        rec.dateOfPurchase === purchaseForm.dateOfPurchase && rec.itemName === itemName
      );
      if (record) {
        setPurchaseForm({
          dateOfPurchase: record.dateOfPurchase,
          itemName: record.itemName,
          quantityPurchased: String(record.quantityPurchased),
          currentStock: String(record.currentStock)
        });
        setEditingPurchaseId(record.id);
      } else {
        // If no record found for selected date and item, reset editing ID and clear quantities
        setEditingPurchaseId(null);
        setPurchaseForm(prev => ({ ...prev, itemName, quantityPurchased: '', currentStock: '' }));
      }
    } else {
      setPurchaseForm({ ...purchaseForm, itemName });
    }
  };

  const handleWithdrawalItemSelect = (itemName: string) => {
    // When an item is selected in the edit modal, find the full record to pre-fill the form
    if (isEditWithdrawalModalOpen && withdrawalForm.dateOfWithdrawal) {
      const record = withdrawalRecords.find(rec =>
        rec.dateOfWithdrawal === withdrawalForm.dateOfWithdrawal && rec.itemName === itemName
      );
      if (record) {
        setWithdrawalForm({
          itemName: record.itemName,
          previousStock: String(record.previousStock),
          withdrawQuantity: String(record.withdrawQuantity),
          currentStock: String(record.currentStock),
          dateOfWithdrawal: record.dateOfWithdrawal
        });
        setEditingWithdrawalId(record.id);
      } else {
        // If no record found for selected date and item, reset editing ID and clear quantities
        setEditingWithdrawalId(null);
        setWithdrawalForm(prev => ({ ...prev, itemName, previousStock: '', withdrawQuantity: '', currentStock: '' }));
      }
    } else {
      // Auto-populate Previous Stock from the most recent withdrawal record for this item
      const latestRecord = withdrawalRecords
        .filter(rec => rec.itemName === itemName)
        .sort((a, b) => new Date(b.dateOfWithdrawal).getTime() - new Date(a.dateOfWithdrawal).getTime())[0];
      
      const previousStock = latestRecord ? String(latestRecord.currentStock) : '';
      
      setWithdrawalForm({ 
        ...withdrawalForm, 
        itemName,
        previousStock
      });
    }
  };

  const handlePurchaseDateChange = (date: string) => {
    setPurchaseForm({ ...purchaseForm, dateOfPurchase: date, itemName: '' });
    // Reset editing ID when date changes in edit mode to ensure a new item is selected for the new date
    if (isEditPurchaseModalOpen) {
      setEditingPurchaseId(null);
    }
  };

  const handleWithdrawalDateChange = (date: string) => {
    setWithdrawalForm({ ...withdrawalForm, dateOfWithdrawal: date, itemName: '' });
    // Reset editing ID when date changes in edit mode
    if (isEditWithdrawalModalOpen) {
      setEditingWithdrawalId(null);
    }
  };

  const handleSavePurchase = () => {
    const newRecord = {
      ...purchaseForm,
      quantityPurchased: parseInt(purchaseForm.quantityPurchased) || 0,
      currentStock: parseInt(purchaseForm.currentStock) || 0
    };

    if (editingPurchaseId) {
      setPurchaseRecords(purchaseRecords.map(rec =>
        rec.id === editingPurchaseId ? { ...rec, ...newRecord } : rec
      ));
    } else {
      const maxId = purchaseRecords.length > 0 ? Math.max(...purchaseRecords.map(r => r.id)) : 0;
      const newId = maxId + 1;
      setPurchaseRecords([...purchaseRecords, { id: newId, ...newRecord }]);
    }
    setIsPurchaseModalOpen(false);
    setIsEditPurchaseModalOpen(false);
    resetPurchaseForm();
  };

  const handleSaveWithdrawal = () => {
    const prevStock = parseInt(withdrawalForm.previousStock) || 0;
    const withdrawQty = parseInt(withdrawalForm.withdrawQuantity) || 0;
    const newCurrentStock = prevStock - withdrawQty;

    const newRecord = {
      ...withdrawalForm,
      previousStock: prevStock,
      withdrawQuantity: withdrawQty,
      currentStock: newCurrentStock
    };

    if (editingWithdrawalId) {
      setWithdrawalRecords(withdrawalRecords.map(rec =>
        rec.id === editingWithdrawalId ? { ...rec, ...newRecord } : rec
      ));
    } else {
      const maxId = withdrawalRecords.length > 0 ? Math.max(...withdrawalRecords.map(r => r.id)) : 0;
      const newId = maxId + 1;
      setWithdrawalRecords([...withdrawalRecords, { id: newId, ...newRecord }]);
    }
    setIsWithdrawalModalOpen(false);
    setIsEditWithdrawalModalOpen(false);
    resetWithdrawalForm();
  };

  const handleEditRegister = () => {
    if (activeTab === 'purchase') {
      setEditingPurchaseId(null); // Clear editing ID when opening main edit modal
      setPurchaseForm({
        dateOfPurchase: todayDate,
        itemName: '',
        quantityPurchased: '',
        currentStock: ''
      });
      setIsEditPurchaseModalOpen(true);
    } else {
      setEditingWithdrawalId(null); // Clear editing ID when opening main edit modal
      setWithdrawalForm({
        itemName: '',
        previousStock: '',
        withdrawQuantity: '',
        currentStock: '',
        dateOfWithdrawal: todayDate
      });
      setIsEditWithdrawalModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'purchase') {
      setPurchaseRecords(purchaseRecords.filter(rec => rec.id !== itemToDelete.id));
    } else {
      setWithdrawalRecords(withdrawalRecords.filter(rec => rec.id !== itemToDelete.id));
    }
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
    // After deletion, if an edit modal was open, ensure it closes and resets
    if (isEditPurchaseModalOpen) {
      setIsEditPurchaseModalOpen(false);
      resetPurchaseForm();
    }
    if (isEditWithdrawalModalOpen) {
      setIsEditWithdrawalModalOpen(false);
      resetWithdrawalForm();
    }
  };

  const resetPurchaseForm = () => {
    setEditingPurchaseId(null);
    setPurchaseForm({
      dateOfPurchase: todayDate,
      itemName: '',
      quantityPurchased: '',
      currentStock: ''
    });
  };

  const resetWithdrawalForm = () => {
    setEditingWithdrawalId(null);
    setWithdrawalForm({
      itemName: '',
      previousStock: '',
      withdrawQuantity: '',
      currentStock: '',
      dateOfWithdrawal: todayDate
    });
  };

  const filteredPurchaseData = showAllPurchaseRecords
    ? purchaseRecords
    : purchaseRecords.filter(item => item.dateOfPurchase === todayDate);

  const filteredWithdrawalData = showAllWithdrawalRecords
    ? withdrawalRecords
    : withdrawalRecords.filter(item => item.dateOfWithdrawal === todayDate);

  // Get available item names for the selected date for purchase edit modal
  const availablePurchaseItemNamesForDate = useMemo(() => {
    if (!purchaseForm.dateOfPurchase) return [];
    const recordsForDate = purchaseRecords.filter(rec => rec.dateOfPurchase === purchaseForm.dateOfPurchase);
    return Array.from(new Set(recordsForDate.map(rec => rec.itemName)));
  }, [purchaseForm.dateOfPurchase, purchaseRecords]);

  // Get available item names for the selected date for withdrawal edit modal
  const availableWithdrawalItemNamesForDate = useMemo(() => {
    if (!withdrawalForm.dateOfWithdrawal) return [];
    const recordsForDate = withdrawalRecords.filter(rec => rec.dateOfWithdrawal === withdrawalForm.dateOfWithdrawal);
    return Array.from(new Set(recordsForDate.map(rec => rec.itemName)));
  }, [withdrawalForm.dateOfWithdrawal, withdrawalRecords]);


  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Inventory Record</CardTitle>
            <Button
              variant="outline"
              onClick={handleEditRegister}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Record
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Inventory Withdrawal Register</h2>
          </div>

              <div className="space-y-4">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Dialog open={isWithdrawalModalOpen} onOpenChange={(open: boolean) => {
                    setIsWithdrawalModalOpen(open);
                    if (!open) resetWithdrawalForm();
                  }}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700" onClick={() => resetWithdrawalForm()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Data
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Inventory Withdrawal Record</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                          <Label>Date of Withdrawal</Label>
                          <Input
                            type="date"
                            value={withdrawalForm.dateOfWithdrawal}
                            onChange={(e) => setWithdrawalForm({ ...withdrawalForm, dateOfWithdrawal: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Item Name</Label>
                          <Input
                            placeholder="Enter item name"
                            value={withdrawalForm.itemName}
                            onChange={(e) => setWithdrawalForm({ ...withdrawalForm, itemName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Previous Stock</Label>
                          <Input
                            type="number"
                            placeholder="e.g., 500"
                            value={withdrawalForm.previousStock}
                            onChange={(e) => setWithdrawalForm({ ...withdrawalForm, previousStock: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Withdraw Quantity</Label>
                          <Input
                            type="number"
                            placeholder="e.g., 50"
                            value={withdrawalForm.withdrawQuantity}
                            onChange={(e) => setWithdrawalForm({ ...withdrawalForm, withdrawQuantity: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Current Stock (After Withdrawal)</Label>
                          <Input
                            value={
                              (parseInt(withdrawalForm.previousStock) || 0) -
                              (parseInt(withdrawalForm.withdrawQuantity) || 0)
                            }
                            disabled
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => {
                          setIsWithdrawalModalOpen(false);
                          resetWithdrawalForm();
                        }}>Cancel</Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveWithdrawal}>
                          Save Record
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Edit Withdrawal Dialog */}
                <Dialog open={isEditWithdrawalModalOpen} onOpenChange={(open: boolean) => {
                  setIsEditWithdrawalModalOpen(open);
                  if (!open) {
                    resetWithdrawalForm();
                  }
                }}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Inventory Withdrawal Record</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Date of Withdrawal</Label>
                        <Input
                          type="date"
                          value={withdrawalForm.dateOfWithdrawal}
                          onChange={(e) => handleWithdrawalDateChange(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Item Name</Label>
                        {withdrawalForm.dateOfWithdrawal ? (
                          <Select value={withdrawalForm.itemName} onValueChange={handleWithdrawalItemSelect}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select item name" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableWithdrawalItemNamesForDate.length > 0 ? (
                                availableWithdrawalItemNamesForDate.map(name => (
                                  <SelectItem key={name} value={name}>{name}</SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-records" disabled>No records for this date</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            placeholder="Select date first"
                            disabled
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Previous Stock</Label>
                        <Input
                          type="number"
                          placeholder="e.g., 500"
                          value={withdrawalForm.previousStock}
                          onChange={(e) => setWithdrawalForm({ ...withdrawalForm, previousStock: e.target.value })}
                          disabled={!editingWithdrawalId} // Disable if no specific record is selected for editing
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Withdraw Quantity</Label>
                        <Input
                          type="number"
                          placeholder="e.g., 50"
                          value={withdrawalForm.withdrawQuantity}
                          onChange={(e) => setWithdrawalForm({ ...withdrawalForm, withdrawQuantity: e.target.value })}
                          disabled={!editingWithdrawalId} // Disable if no specific record is selected for editing
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Current Stock (After Withdrawal)</Label>
                        <Input
                          value={
                            (parseInt(withdrawalForm.previousStock) || 0) -
                            (parseInt(withdrawalForm.withdrawQuantity) || 0)
                          }
                          disabled
                        />
                      </div>
                    </div>
                    <div className="flex justify-between gap-3">
                      <Button
                        variant="destructive"
                        onClick={() => {
                          if (editingWithdrawalId) {
                            setItemToDelete({ type: 'withdrawal', id: editingWithdrawalId });
                            setDeleteConfirmOpen(true);
                          }
                        }}
                        disabled={!editingWithdrawalId}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => {
                          setIsEditWithdrawalModalOpen(false);
                          resetWithdrawalForm();
                        }}>Cancel</Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveWithdrawal} disabled={!editingWithdrawalId}>
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
                        <th className="px-4 py-3 text-left text-xs text-gray-600">ID</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Item Name</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Previous Stock</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Withdraw Quantity</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Current Stock (After Withdrawal)</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Date of Withdrawal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWithdrawalData.map((record) => (
                        <tr key={record.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{record.id}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {record.itemName}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">{record.previousStock}</td>
                          <td className="px-4 py-3 text-sm">{record.withdrawQuantity}</td>
                          <td className="px-4 py-3 text-sm">{record.currentStock}</td>
                          <td className="px-4 py-3 text-sm">{record.dateOfWithdrawal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
        </CardContent>
      </Card>

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
