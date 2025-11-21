import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import {
  Package,
  ArrowUp, // Changed to ArrowUp from LineChart as per screenshot
  AlertTriangle,
  Clock,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'; // Added table components

export function InventoryDashboard() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-end mb-6"> {/* Align search bar to the right */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search batches, orders, reports..."
            className="pl-9 pr-3 py-2 border rounded-md w-full text-sm shadow-sm" /* Added text-sm and shadow-sm */
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-2 mb-6">
        {/* Total Stock Card */}
        <Card className="flex flex-col justify-between p-4 border rounded-lg shadow-sm w-full sm:w-[calc(50%-theme(spacing.2)/2)] lg:w-[calc(25%-theme(spacing.2)*3/4)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-3"> {/* Reduced mb-4 to mb-3 */}
            <CardTitle className="text-sm font-normal text-gray-500">Total Stock</CardTitle> {/* font-normal, text-gray-500 */}
            <div className="bg-blue-500/10 rounded-full p-2"> {/* Icon background */}
              <Package className="h-5 w-5 text-blue-600" /> {/* Smaller icon, darker blue */}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-2xl font-bold text-gray-900">11,455</div> {/* Darker text */}
            <p className="text-xs text-gray-500 mt-1">plants available</p>
          </CardContent>
        </Card>

        {/* Ready to Dispatch Card */}
        <Card className="flex flex-col justify-between p-4 border rounded-lg shadow-sm w-full sm:w-[calc(50%-theme(spacing.2)/2)] lg:w-[calc(25%-theme(spacing.2)*3/4)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-3"> {/* Reduced mb-4 to mb-3 */}
            <CardTitle className="text-sm font-normal text-gray-500">Ready to Dispatch</CardTitle> {/* font-normal, text-gray-500 */}
            <div className="bg-green-500/10 rounded-full p-2"> {/* Icon background */}
              <ArrowUp className="h-5 w-5 text-green-600" /> {/* Smaller icon, darker green */}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-2xl font-bold text-gray-900">5,555</div> {/* Darker text */}
            <p className="mt-1 text-xs text-green-600 font-semibold">excellent quality</p>
          </CardContent>
        </Card>

        {/* Damaged Stock Card */}
        <Card className="flex flex-col justify-between p-4 border rounded-lg shadow-sm w-full sm:w-[calc(50%-theme(spacing.2)/2)] lg:w-[calc(25%-theme(spacing.2)*3/4)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-3"> {/* Reduced mb-4 to mb-3 */}
            <CardTitle className="text-sm font-normal text-gray-500">Damaged Stock</CardTitle> {/* font-normal, text-gray-500 */}
            <div className="bg-red-500/10 rounded-full p-2"> {/* Icon background */}
              <AlertTriangle className="h-5 w-5 text-red-600" /> {/* Smaller icon, darker red */}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-2xl font-bold text-gray-900">2,800</div> {/* Darker text */}
            <p className="mt-1 text-xs text-red-600 font-semibold">poor health</p>
          </CardContent>
        </Card>

        {/* Ageing Stock Card */}
        <Card className="flex flex-col justify-between p-4 border rounded-lg shadow-sm w-full sm:w-[calc(50%-theme(spacing.2)/2)] lg:w-[calc(25%-theme(spacing.2)*3/4)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-3"> {/* Reduced mb-4 to mb-3 */}
            <CardTitle className="text-sm font-normal text-gray-500">Ageing Stock</CardTitle> {/* font-normal, text-gray-500 */}
            <div className="bg-yellow-500/10 rounded-full p-2"> {/* Icon background */}
              <Clock className="h-5 w-5 text-yellow-600" /> {/* Smaller icon, darker yellow */}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-2xl font-bold text-gray-900">3,100</div> {/* Darker text */}
            <p className="mt-1 text-xs text-yellow-600 font-semibold">priority dispatch</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales & Inventory - Batch-wise Inventory */}
      <Card className="mb-6 rounded-lg shadow-sm border">
        <CardHeader className="p-6 pb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="font-semibold text-gray-900">Sales & Inventory</span>
            <span className="text-gray-400">{'>'}</span>
            <span className="text-green-600 font-semibold">Inventory</span>
          </div>
          <CardTitle className="text-xl font-bold mt-2 text-gray-900">Batch-wise Inventory</CardTitle> {/* Darker title */}
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 rounded-t-lg">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tl-lg">Batch</TableHead> {/* font-semibold, text-gray-700 */}
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Crop</TableHead> {/* font-semibold, text-gray-700 */}
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Quantity</TableHead> {/* font-semibold, text-gray-700 */}
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</TableHead> {/* font-semibold, text-gray-700 */}
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</TableHead> {/* font-semibold, text-gray-700 */}
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Age (days)</TableHead> {/* font-semibold, text-gray-700 */}
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tr-lg">Health</TableHead> {/* font-semibold, text-gray-700 */}
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                <TableRow>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-semibold"> {/* font-semibold */}
                    <Button variant="link" className="p-0 h-auto text-blue-600 font-semibold">BTH-2024-001</Button>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Banana</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2,305</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Holding Area</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge className="bg-green-100 text-green-700 font-semibold hover:bg-green-100">Ready</Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">10</TableCell> {/* text-gray-700 */}
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge className="bg-green-100 text-green-700 font-semibold hover:bg-green-100">Excellent</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-semibold"> {/* font-semibold */}
                    <Button variant="link" className="p-0 h-auto text-blue-600 font-semibold">BTH-2024-003</Button>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Rose</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">1,750</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Holding Area</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge className="bg-green-100 text-green-700 font-semibold hover:bg-green-100">Ready</Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">18</TableCell> {/* text-gray-700 */}
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge className="bg-blue-100 text-blue-700 font-semibold hover:bg-blue-100">Good</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-semibold"> {/* font-semibold */}
                    <Button variant="link" className="p-0 h-auto text-blue-600 font-semibold">BTH-2024-006</Button>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Strawberry</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">3,100</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Holding Area</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge className="bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-100">Ageing</Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">26</TableCell> {/* text-gray-700 */}
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge className="bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-100">Fair</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-semibold"> {/* font-semibold */}
                    <Button variant="link" className="p-0 h-auto text-blue-600 font-semibold">BTH-2024-009</Button>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Gerbera</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">1,500</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Holding Area</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge className="bg-green-100 text-green-700 font-semibold hover:bg-green-100">Ready</Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">5</TableCell> {/* text-gray-700 */}
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge className="bg-green-100 text-green-700 font-semibold hover:bg-green-100">Excellent</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-semibold"> {/* font-semibold */}
                    <Button variant="link" className="p-0 h-auto text-blue-600 font-semibold">BTH-2024-012</Button>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Banana</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2,800</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Holding Area</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge className="bg-red-100 text-red-700 font-semibold hover:bg-red-100">Damaged</Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">31</TableCell> {/* text-gray-700 */}
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge className="bg-red-100 text-red-700 font-semibold hover:bg-red-100">Poor</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Location-wise Inventory */}
      <Card className="rounded-lg shadow-sm border">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-xl font-bold text-gray-900">Location-wise Inventory</CardTitle> {/* Darker title */}
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 rounded-t-lg">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tl-lg">Location</TableHead> {/* font-semibold, text-gray-700 */}
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Batches</TableHead> {/* font-semibold, text-gray-700 */}
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Quantity</TableHead> {/* font-semibold, text-gray-700 */}
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tr-lg">Status</TableHead> {/* font-semibold, text-gray-700 */}
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                <TableRow>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Holding Area - Section A</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">3 batches</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">5,555 plants</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge className="bg-green-100 text-green-700 font-semibold hover:bg-green-100">Active</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Holding Area - Section B</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2 batches</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">5,500 plants</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge className="bg-green-100 text-green-700 font-semibold hover:bg-green-100">Active</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Dispatch Zone</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">1 batch</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">1,200 plants</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge className="bg-blue-100 text-blue-700 font-semibold hover:bg-blue-100">Loading</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
