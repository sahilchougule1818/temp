import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
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

export function SupplierDetail() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 1, name: 'Supplier A', contact: '1234567890', location: 'City A', supplies: 'Item X, Item Y' },
    { id: 2, name: 'Supplier B', contact: '0987654321', location: 'City B', supplies: 'Item Z' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null);

  const [supplierForm, setSupplierForm] = useState({
    name: '',
    contact: '',
    location: '',
    supplies: ''
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
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Supplier Detail</CardTitle>
            <Button
              variant="outline"
              onClick={handleEditSupplierRegister}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Record
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-end gap-2">
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
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th scope="col" className="w-3/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier Name</th>
                    <th scope="col" className="w-2/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th scope="col" className="w-2/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th scope="col" className="w-4/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplies</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {suppliers.map((supplier) => (
                    <tr key={supplier.id}>
                      <td className="w-1/12 px-4 py-4 text-sm font-medium text-gray-900">{supplier.id}</td>
                      <td className="w-3/12 px-4 py-4 text-sm font-medium text-gray-900">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {supplier.name}
                        </Badge>
                      </td>
                      <td className="w-2/12 px-4 py-4 text-sm text-gray-500">{supplier.contact}</td>
                      <td className="w-2/12 px-4 py-4 text-sm text-gray-500">{supplier.location}</td>
                      <td className="w-4/12 px-4 py-4 text-sm text-gray-500">{supplier.supplies}</td>
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
