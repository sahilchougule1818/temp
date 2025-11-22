import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Button } from '../../ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../ui/alert-dialog';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

type Supplier = {
  id: number;
  name: string;
  contact: string;
  location: string;
  supplies: string;
};

type PurchaseRecord = {
  id: number;
  dateOfPurchase: string;
  itemName: string;
  quantityPurchased: number;
  supplierName: string;
};

export function SupplierDetail() {
  const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDate = getTodayDate();

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 1, name: 'Supplier A', contact: '1234567890', location: 'City A', supplies: 'Item X, Item Y' },
    { id: 2, name: 'Supplier B', contact: '0987654321', location: 'City B', supplies: 'Item Z' },
  ]);

  const [purchaseRecords, setPurchaseRecords] = useState<PurchaseRecord[]>([
    { id: 1, dateOfPurchase: todayDate, itemName: 'Item A', quantityPurchased: 100, supplierName: 'Supplier A' },
    { id: 2, dateOfPurchase: '2024-11-15', itemName: 'Item B', quantityPurchased: 200, supplierName: 'Supplier B' },
  ]);

  const [activeTab, setActiveTab] = useState('purchase');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isEditPurchaseModalOpen, setIsEditPurchaseModalOpen] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState<number | null>(null);
  const [editingPurchaseId, setEditingPurchaseId] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null);
  const [purchaseToDelete, setPurchaseToDelete] = useState<number | null>(null);

  const [supplierForm, setSupplierForm] = useState({
    name: '',
    contact: '',
    location: '',
    supplies: ''
  });

  const [purchaseForm, setPurchaseForm] = useState({
    dateOfPurchase: todayDate,
    itemName: '',
    quantityPurchased: '',
    supplierName: ''
  });

  const resetSupplierForm = () => {
    setEditingSupplierId(null);
    setSupplierForm({
      name: '',
      contact: '',
      location: '',
      supplies: ''
    });
  };

  const handleSaveSupplier = () => {
    if (editingSupplierId) {
      setSuppliers(suppliers.map(sup =>
        sup.id === editingSupplierId ? { ...sup, ...supplierForm } : sup
      ));
    } else {
      const maxId = suppliers.length > 0 ? Math.max(...suppliers.map(s => s.id)) : 0;
      const newId = maxId + 1;
      setSuppliers([...suppliers, { id: newId, ...supplierForm }]);
    }
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    resetSupplierForm();
  };

  const handleEditSupplierRegister = () => {
    setEditingSupplierId(null); // Clear editing ID when opening main edit modal
    setSupplierForm({
      name: '',
      contact: '',
      location: '',
      supplies: ''
    });
    setIsEditModalOpen(true);
  };

  const handleSupplierSelect = (supplierName: string) => {
    // When a supplier is selected in the edit modal, find the full record to pre-fill the form
    const supplier = suppliers.find(sup => sup.name === supplierName);
    if (supplier) {
      setSupplierForm({
        name: supplier.name,
        contact: supplier.contact,
        location: supplier.location,
        supplies: supplier.supplies
      });
      setEditingSupplierId(supplier.id);
    } else {
      setEditingSupplierId(null);
      setSupplierForm(prev => ({ ...prev, name: supplierName, contact: '', location: '', supplies: '' }));
    }
  };

  const handleDelete = () => {
    if (supplierToDelete) {
      setSuppliers(suppliers.filter(sup => sup.id !== supplierToDelete));
      setDeleteConfirmOpen(false);
      setSupplierToDelete(null);
      setIsEditModalOpen(false); // Close edit modal if open after deleting
      resetSupplierForm();
    }
    if (purchaseToDelete) {
      setPurchaseRecords(purchaseRecords.filter(rec => rec.id !== purchaseToDelete));
      setDeleteConfirmOpen(false);
      setPurchaseToDelete(null);
      setIsEditPurchaseModalOpen(false);
      resetPurchaseForm();
    }
  };

  const resetPurchaseForm = () => {
    setEditingPurchaseId(null);
    setPurchaseForm({
      dateOfPurchase: todayDate,
      itemName: '',
      quantityPurchased: '',
      supplierName: ''
    });
  };

  const handleSavePurchase = () => {
    const newRecord = {
      ...purchaseForm,
      quantityPurchased: parseInt(purchaseForm.quantityPurchased) || 0
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

  const handleEditPurchaseRegister = () => {
    resetPurchaseForm();
    setIsEditPurchaseModalOpen(true);
  };

  const handlePurchaseDateSelect = (date: string) => {
    setPurchaseForm({ ...purchaseForm, dateOfPurchase: date, itemName: '' });
    if (isEditPurchaseModalOpen) {
      setEditingPurchaseId(null);
    }
  };

  const handlePurchaseItemSelect = (itemName: string) => {
    if (isEditPurchaseModalOpen && purchaseForm.dateOfPurchase) {
      const record = purchaseRecords.find(rec =>
        rec.dateOfPurchase === purchaseForm.dateOfPurchase && rec.itemName === itemName
      );
      if (record) {
        setPurchaseForm({
          dateOfPurchase: record.dateOfPurchase,
          itemName: record.itemName,
          quantityPurchased: String(record.quantityPurchased),
          supplierName: record.supplierName
        });
        setEditingPurchaseId(record.id);
      } else {
        setEditingPurchaseId(null);
        setPurchaseForm(prev => ({ ...prev, itemName, quantityPurchased: '', supplierName: '' }));
      }
    } else {
      setPurchaseForm({ ...purchaseForm, itemName });
    }
  };

  const availablePurchaseItemNames = Array.from(new Set(purchaseRecords.map(rec => rec.itemName)));
  const availablePurchaseDates = Array.from(new Set(purchaseRecords.map(rec => rec.dateOfPurchase))).sort();
  const availablePurchaseItemNamesForDate = purchaseForm.dateOfPurchase
    ? Array.from(new Set(purchaseRecords.filter(rec => rec.dateOfPurchase === purchaseForm.dateOfPurchase).map(rec => rec.itemName)))
    : [];

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Supplier Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="purchase">Purchase Register</TabsTrigger>
              <TabsTrigger value="suppliers">Supplier Details</TabsTrigger>
            </TabsList>

            <TabsContent value="suppliers">
          <div className="space-y-4">
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleEditSupplierRegister}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Dialog open={isModalOpen} onOpenChange={(open: boolean) => {
                setIsModalOpen(open);
                if (!open) resetSupplierForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => resetSupplierForm()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Data
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Supplier Record</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Supplier Name</Label>
                      <Input
                        placeholder="Enter supplier name"
                        value={supplierForm.name}
                        onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact</Label>
                      <Input
                        placeholder="Enter contact number"
                        value={supplierForm.contact}
                        onChange={(e) => setSupplierForm({ ...supplierForm, contact: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        placeholder="Enter location"
                        value={supplierForm.location}
                        onChange={(e) => setSupplierForm({ ...supplierForm, location: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Supplies</Label>
                      <Input
                        placeholder="e.g., Item A, Item B"
                        value={supplierForm.supplies}
                        onChange={(e) => setSupplierForm({ ...supplierForm, supplies: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => {
                      setIsModalOpen(false);
                      resetSupplierForm();
                    }}>Cancel</Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveSupplier}>
                      Save Record
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Edit Supplier Dialog */}
            <Dialog open={isEditModalOpen} onOpenChange={(open: boolean) => {
              setIsEditModalOpen(open);
              if (!open) {
                resetSupplierForm();
              }
            }}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Supplier Record</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Supplier Name</Label>
                    <Select value={supplierForm.name} onValueChange={handleSupplierSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier name" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map(supplier => (
                          <SelectItem key={supplier.id} value={supplier.name}>{supplier.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Contact</Label>
                    <Input
                      placeholder="Enter contact number"
                      value={supplierForm.contact}
                      onChange={(e) => setSupplierForm({ ...supplierForm, contact: e.target.value })}
                      disabled={!editingSupplierId} // Disable if no specific record is selected for editing
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="Enter location"
                      value={supplierForm.location}
                      onChange={(e) => setSupplierForm({ ...supplierForm, location: e.target.value })}
                      disabled={!editingSupplierId} // Disable if no specific record is selected for editing
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Supplies</Label>
                    <Input
                      placeholder="e.g., Item A, Item B"
                      value={supplierForm.supplies}
                      onChange={(e) => setSupplierForm({ ...supplierForm, supplies: e.target.value })}
                      disabled={!editingSupplierId} // Disable if no specific record is selected for editing
                    />
                  </div>
                </div>
                <div className="flex justify-between gap-3">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (editingSupplierId) {
                        setSupplierToDelete(editingSupplierId);
                        setDeleteConfirmOpen(true);
                      }
                    }}
                    disabled={!editingSupplierId}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => {
                      setIsEditModalOpen(false);
                      resetSupplierForm();
                    }}>Cancel</Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveSupplier} disabled={!editingSupplierId}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="w-1/12 px-4 py-3 text-left font-medium text-foreground">ID</th>
                    <th scope="col" className="w-3/12 px-4 py-3 text-left font-medium text-foreground">Supplier Name</th>
                    <th scope="col" className="w-2/12 px-4 py-3 text-left font-medium text-foreground">Contact</th>
                    <th scope="col" className="w-2/12 px-4 py-3 text-left font-medium text-foreground">Location</th>
                    <th scope="col" className="w-4/12 px-4 py-3 text-left font-medium text-foreground">Supplies</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {suppliers.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-muted/50">
                      <td className="w-1/12 px-4 py-4">{supplier.id}</td>
                      <td className="w-3/12 px-4 py-4">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {supplier.name}
                        </Badge>
                      </td>
                      <td className="w-2/12 px-4 py-4">{supplier.contact}</td>
                      <td className="w-2/12 px-4 py-4">{supplier.location}</td>
                      <td className="w-4/12 px-4 py-4">{supplier.supplies}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
            </TabsContent>

            <TabsContent value="purchase">
              <div className="space-y-4">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={handleEditPurchaseRegister}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Edit className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Dialog open={isPurchaseModalOpen} onOpenChange={(open: boolean) => {
                    setIsPurchaseModalOpen(open);
                    if (!open) resetPurchaseForm();
                  }}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700" onClick={() => resetPurchaseForm()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Data
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Purchase Record</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                          <Label>Date of Purchase</Label>
                          <Input
                            type="date"
                            value={purchaseForm.dateOfPurchase}
                            onChange={(e) => setPurchaseForm({ ...purchaseForm, dateOfPurchase: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Item Name</Label>
                          <Input
                            placeholder="Enter item name"
                            value={purchaseForm.itemName}
                            onChange={(e) => setPurchaseForm({ ...purchaseForm, itemName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Quantity Purchased</Label>
                          <Input
                            type="number"
                            placeholder="e.g., 100"
                            value={purchaseForm.quantityPurchased}
                            onChange={(e) => setPurchaseForm({ ...purchaseForm, quantityPurchased: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Supplier Name</Label>
                          <Select value={purchaseForm.supplierName} onValueChange={(value) => setPurchaseForm({ ...purchaseForm, supplierName: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select supplier" />
                            </SelectTrigger>
                            <SelectContent>
                              {suppliers.map(supplier => (
                                <SelectItem key={supplier.id} value={supplier.name}>{supplier.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => {
                          setIsPurchaseModalOpen(false);
                          resetPurchaseForm();
                        }}>Cancel</Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleSavePurchase}>
                          Save Record
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Dialog open={isEditPurchaseModalOpen} onOpenChange={(open: boolean) => {
                  setIsEditPurchaseModalOpen(open);
                  if (!open) resetPurchaseForm();
                }}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Purchase Record</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Date of Purchase</Label>
                        <Select value={purchaseForm.dateOfPurchase} onValueChange={handlePurchaseDateSelect}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select date" />
                          </SelectTrigger>
                          <SelectContent>
                            {availablePurchaseDates.map(date => (
                              <SelectItem key={date} value={date}>{date}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Item Name</Label>
                        {purchaseForm.dateOfPurchase ? (
                          <Select value={purchaseForm.itemName} onValueChange={handlePurchaseItemSelect}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                              {availablePurchaseItemNamesForDate.length > 0 ? (
                                availablePurchaseItemNamesForDate.map(name => (
                                  <SelectItem key={name} value={name}>{name}</SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-records" disabled>No records for this date</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input placeholder="Select date first" disabled />
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity Purchased</Label>
                        <Input
                          type="number"
                          placeholder="e.g., 100"
                          value={purchaseForm.quantityPurchased}
                          onChange={(e) => setPurchaseForm({ ...purchaseForm, quantityPurchased: e.target.value })}
                          disabled={!editingPurchaseId}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Supplier Name</Label>
                        <Select value={purchaseForm.supplierName} onValueChange={(value) => setPurchaseForm({ ...purchaseForm, supplierName: value })} disabled={!editingPurchaseId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select supplier" />
                          </SelectTrigger>
                          <SelectContent>
                            {suppliers.map(supplier => (
                              <SelectItem key={supplier.id} value={supplier.name}>{supplier.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-between gap-3">
                      <Button
                        variant="destructive"
                        onClick={() => {
                          if (editingPurchaseId) {
                            setPurchaseToDelete(editingPurchaseId);
                            setDeleteConfirmOpen(true);
                          }
                        }}
                        disabled={!editingPurchaseId}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => {
                          setIsEditPurchaseModalOpen(false);
                          resetPurchaseForm();
                        }}>Cancel</Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleSavePurchase} disabled={!editingPurchaseId}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-foreground">ID</th>
                        <th className="px-4 py-3 text-left font-medium text-foreground">Date of Purchase</th>
                        <th className="px-4 py-3 text-left font-medium text-foreground">Item Name</th>
                        <th className="px-4 py-3 text-left font-medium text-foreground">Quantity Purchased</th>
                        <th className="px-4 py-3 text-left font-medium text-foreground">Supplier Name</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {purchaseRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-muted/50">
                          <td className="px-4 py-4">{record.id}</td>
                          <td className="px-4 py-4">{record.dateOfPurchase}</td>
                          <td className="px-4 py-4">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {record.itemName}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">{record.quantityPurchased}</td>
                          <td className="px-4 py-4">{record.supplierName}</td>
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

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this supplier record.
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

export default SupplierDetail;
