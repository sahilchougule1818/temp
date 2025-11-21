import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Download, FileText, TrendingUp, Package, Users, Bug } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const weeklyProductionData = [
  { week: 'Week 1', indoor: 2400, outdoor: 4200, total: 6600 },
  { week: 'Week 2', indoor: 2800, outdoor: 4800, total: 7600 },
  { week: 'Week 3', indoor: 2600, outdoor: 4500, total: 7100 },
  { week: 'Week 4', indoor: 3200, outdoor: 5200, total: 8400 }
];

const monthlyIndoorData = [
  { month: 'Jan', stage1: 1200, stage2: 2400, stage3: 1800, stage4: 2100 },
  { month: 'Feb', stage1: 1400, stage2: 2600, stage3: 2000, stage4: 2300 },
  { month: 'Mar', stage1: 1100, stage2: 2200, stage3: 1600, stage4: 1900 }
];

const salesSummary = [
  { customer: 'Green Valley Nursery', orders: 8, quantity: 12000, revenue: 600000, status: 'Active' },
  { customer: 'Sunrise Farms', orders: 5, quantity: 8500, revenue: 425000, status: 'Active' },
  { customer: 'Botanical Gardens Ltd', orders: 6, quantity: 9200, revenue: 480000, status: 'Pending' },
  { customer: 'Flora Exports', orders: 12, quantity: 18500, revenue: 950000, status: 'Active' }
];

const operatorSummary = [
  { operator: 'Amit Shah', tasks: 45, batches: 12, efficiency: '95%', performance: 'Excellent' },
  { operator: 'Priya Patel', tasks: 38, batches: 10, efficiency: '92%', performance: 'Excellent' },
  { operator: 'Rahul Desai', tasks: 42, batches: 11, efficiency: '88%', performance: 'Good' },
  { operator: 'Neha Singh', tasks: 35, batches: 9, efficiency: '85%', performance: 'Good' }
];

export function Reports() {
  return (
    <div className="p-6 space-y-6">
      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Date From</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Date To</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Crop</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Crops" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crops</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="strawberry">Strawberry</SelectItem>
                  <SelectItem value="rose">Rose</SelectItem>
                  <SelectItem value="gerbera">Gerbera</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Batch</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Batches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  <SelectItem value="BTH-2024-001">BTH-2024-001</SelectItem>
                  <SelectItem value="BTH-2024-002">BTH-2024-002</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Operator</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Operators" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Operators</SelectItem>
                  <SelectItem value="amit">Amit Shah</SelectItem>
                  <SelectItem value="priya">Priya Patel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline">Reset</Button>
            <Button className="bg-green-600 hover:bg-green-700">Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reports</CardTitle>
            <Button variant="outline" className="flex gap-2">
              <Download className="w-4 h-4" />
              Export Current Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="production">
            <TabsList className="mb-6">
              <TabsTrigger value="production">Weekly Production</TabsTrigger>
              <TabsTrigger value="indoor">Monthly Indoor</TabsTrigger>
              <TabsTrigger value="outdoor">Outdoor Movement</TabsTrigger>
              <TabsTrigger value="sales">Sales Summary</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="operator">Operator Summary</TabsTrigger>
              <TabsTrigger value="contamination">Contamination</TabsTrigger>
            </TabsList>

            {/* Weekly Production Report */}
            <TabsContent value="production">
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="text-xs text-green-700">Total Production</p>
                          <p className="text-xl text-green-900">29,700</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="text-xs text-blue-700">Indoor</p>
                          <p className="text-xl text-blue-900">11,000</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Package className="w-8 h-8 text-purple-600" />
                        <div>
                          <p className="text-xs text-purple-700">Outdoor</p>
                          <p className="text-xl text-purple-900">18,700</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-amber-600" />
                        <div>
                          <p className="text-xs text-amber-700">Avg/Week</p>
                          <p className="text-xl text-amber-900">7,425</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyProductionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="week" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="indoor" fill="#4CAF50" name="Indoor" />
                    <Bar dataKey="outdoor" fill="#81C784" name="Outdoor" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            {/* Monthly Indoor Report */}
            <TabsContent value="indoor">
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyIndoorData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="stage1" stroke="#4CAF50" name="Stage 1" />
                    <Line type="monotone" dataKey="stage2" stroke="#66BB6A" name="Stage 2" />
                    <Line type="monotone" dataKey="stage3" stroke="#81C784" name="Stage 3" />
                    <Line type="monotone" dataKey="stage4" stroke="#A5D6A7" name="Stage 4" />
                  </LineChart>
                </ResponsiveContainer>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Month</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Stage 1</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Stage 2</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Stage 3</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Stage 4</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyIndoorData.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{item.month}</td>
                          <td className="px-4 py-3 text-sm">{item.stage1.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm">{item.stage2.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm">{item.stage3.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm">{item.stage4.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm">
                            {(item.stage1 + item.stage2 + item.stage3 + item.stage4).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Sales Summary Report */}
            <TabsContent value="sales">
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <p className="text-xs text-green-700">Total Revenue</p>
                      <p className="text-xl text-green-900">₹24.55L</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <p className="text-xs text-blue-700">Total Orders</p>
                      <p className="text-xl text-blue-900">31</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                      <p className="text-xs text-purple-700">Avg Order Value</p>
                      <p className="text-xl text-purple-900">₹79K</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="p-4">
                      <p className="text-xs text-amber-700">Active Customers</p>
                      <p className="text-xl text-amber-900">4</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Customer</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Orders</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Revenue</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesSummary.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{item.customer}</td>
                          <td className="px-4 py-3 text-sm">{item.orders}</td>
                          <td className="px-4 py-3 text-sm">{item.quantity.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm">₹{(item.revenue / 1000).toFixed(0)}K</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge className={item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                              {item.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Operator Summary Report */}
            <TabsContent value="operator">
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="text-xs text-blue-700">Total Operators</p>
                          <p className="text-xl text-blue-900">4</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <p className="text-xs text-green-700">Total Tasks</p>
                      <p className="text-xl text-green-900">160</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                      <p className="text-xs text-purple-700">Avg Efficiency</p>
                      <p className="text-xl text-purple-900">90%</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="p-4">
                      <p className="text-xs text-amber-700">Excellent Performers</p>
                      <p className="text-xl text-amber-900">2</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Operator</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Tasks Completed</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Batches Handled</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Efficiency</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {operatorSummary.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{item.operator}</td>
                          <td className="px-4 py-3 text-sm">{item.tasks}</td>
                          <td className="px-4 py-3 text-sm">{item.batches}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge className="bg-green-100 text-green-700">{item.efficiency}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <Badge className={item.performance === 'Excellent' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                              {item.performance}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Contamination Summary */}
            <TabsContent value="contamination">
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Bug className="w-8 h-8 text-red-600" />
                        <div>
                          <p className="text-xs text-red-700">Total Cases</p>
                          <p className="text-xl text-red-900">15</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="p-4">
                      <p className="text-xs text-amber-700">Indoor</p>
                      <p className="text-xl text-amber-900">9</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="p-4">
                      <p className="text-xs text-orange-700">Outdoor</p>
                      <p className="text-xl text-orange-900">6</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <p className="text-xs text-green-700">Resolved</p>
                      <p className="text-xl text-green-900">13</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-600 mb-4">Contamination breakdown and detailed logs can be viewed in respective modules.</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-sm">Bacterial</span>
                        <Badge className="bg-red-100 text-red-700">8 cases</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-sm">Fungal</span>
                        <Badge className="bg-orange-100 text-orange-700">4 cases</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-sm">Pest Infestation</span>
                        <Badge className="bg-amber-100 text-amber-700">3 cases</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Placeholder tabs */}
            <TabsContent value="outdoor">
              <Card>
                <CardContent className="p-6 text-center text-gray-600">
                  <p>Outdoor movement report - showing batch transfers, primary to secondary hardening statistics</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory">
              <Card>
                <CardContent className="p-6 text-center text-gray-600">
                  <p>Inventory summary report - current stock levels, batch status, ageing analysis</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
