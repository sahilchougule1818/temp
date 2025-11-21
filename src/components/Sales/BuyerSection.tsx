import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Separator } from '../ui/separator';
import { loadBookings, Booking, SALES_EVENTS, createBookingRecord, appendLedgerEntry } from './salesData';

type BookingFormValues = {
  customerName: string;
  bookingDate: string;
  deliveryDate: string;
  productType: string;
  quantity: number;
  rate: number;
};

const defaultFormValues: BookingFormValues = {
  customerName: '',
  bookingDate: '',
  deliveryDate: '',
  productType: '',
  quantity: 0,
  rate: 0,
};

export const BuyerSection: React.FC = () => {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const form = useForm<BookingFormValues>({
    defaultValues: defaultFormValues,
  });

  const watchQuantity = form.watch('quantity') || 0;
  const watchRate = form.watch('rate') || 0;
  const estimatedTotal = Number(watchQuantity) * Number(watchRate);

  React.useEffect(() => {
    setBookings(loadBookings());

    if (typeof window === 'undefined') {
      return;
    }

    const handleRefresh = () => setBookings(loadBookings());
    window.addEventListener(SALES_EVENTS.bookings, handleRefresh);
    return () => window.removeEventListener(SALES_EVENTS.bookings, handleRefresh);
  }, []);

  const onSubmit = (values: BookingFormValues) => {
    const record = createBookingRecord({
      ...values,
      quantity: Number(values.quantity),
      rate: Number(values.rate),
    });

    appendLedgerEntry({
      date: values.bookingDate,
      particulars: `Booking - ${values.customerName}`,
      debit: record.totalAmount,
      referenceId: record.id,
    });

    setBookings((prev) => [...prev, record]);
    setIsDialogOpen(false);
    form.reset(defaultFormValues);
  };

  const today = new Date().toISOString().slice(0, 10);
  // Filter bookings where current date is between bookingDate and deliveryDate
  const activeBookings = bookings.filter(
    (booking) => booking.bookingDate <= today && booking.deliveryDate >= today
  );
  const pendingDeliveries = activeBookings.length;
  const totalValue = bookings.reduce((acc, booking) => acc + booking.totalAmount, 0);

  const totalQuantity = bookings.reduce((acc, booking) => acc + booking.quantity, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <p className="text-xs text-green-700">Active Bookings</p>
            <p className="text-2xl text-green-900 mt-1">{pendingDeliveries}</p>
            <p className="text-xs text-green-600 mt-1">scheduled</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-xs text-blue-700">Total Quantity</p>
            <p className="text-2xl text-blue-900 mt-1">{totalQuantity.toLocaleString()}</p>
            <p className="text-xs text-blue-600 mt-1">plants booked</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <p className="text-xs text-purple-700">Order Value</p>
            <p className="text-2xl text-purple-900 mt-1">₹{totalValue.toLocaleString()}</p>
            <p className="text-xs text-purple-600 mt-1">total amount</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Buyer Bookings</CardTitle>
              <CardDescription>Capture new plant bookings and monitor delivery commitments.</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  Create Booking
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>New Booking</DialogTitle>
                <DialogDescription>Record booking details and automatically update the ledger.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="customerName"
                      rules={{ required: 'Customer name is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Green Valley Farms" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="productType"
                      rules={{ required: 'Product is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Banana G9" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bookingDate"
                      rules={{ required: 'Booking date is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Booking Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deliveryDate"
                      rules={{ required: 'Delivery date is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quantity"
                      rules={{
                        required: 'Quantity is required',
                        min: { value: 1, message: 'Quantity must be greater than zero' },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input 
                              type="text" 
                              inputMode="numeric"
                              placeholder="Enter quantity (e.g., 500)" 
                              {...field} 
                              value={field.value || ''}
                              onChange={(event) => {
                                const value = event.target.value.replace(/[^0-9]/g, '');
                                field.onChange(value ? parseInt(value, 10) : 0);
                              }} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rate"
                      rules={{
                        required: 'Rate is required',
                        min: { value: 1, message: 'Rate must be greater than zero' },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rate (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              type="text" 
                              inputMode="decimal"
                              placeholder="Enter rate (e.g., 12.50)" 
                              {...field} 
                              value={field.value || ''}
                              onChange={(event) => {
                                const value = event.target.value.replace(/[^0-9.]/g, '');
                                field.onChange(value ? parseFloat(value) : 0);
                              }} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Amount</p>
                      <p className="text-2xl font-semibold">₹{estimatedTotal.toLocaleString()}</p>
                    </div>
                    <DialogFooter className="gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        Save Booking
                      </Button>
                    </DialogFooter>
                  </div>
                </form>
              </Form>
            </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Booking ID</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Customer</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Product</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Booking Date</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Delivery Date</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Rate</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Total</th>
                </tr>
              </thead>
              <tbody>
                {bookings
                  .filter((booking) => booking.bookingDate <= today && booking.deliveryDate >= today)
                  .map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {booking.id}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{booking.customerName}</td>
                    <td className="px-4 py-3 text-sm">{booking.productType}</td>
                    <td className="px-4 py-3 text-sm">{booking.bookingDate}</td>
                    <td className="px-4 py-3 text-sm">{booking.deliveryDate}</td>
                    <td className="px-4 py-3 text-sm">{booking.quantity.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">₹{booking.rate.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm font-semibold">₹{booking.totalAmount.toLocaleString()}</td>
                  </tr>
                ))}
                {bookings.filter((booking) => booking.bookingDate <= today && booking.deliveryDate >= today).length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                      No bookings recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

