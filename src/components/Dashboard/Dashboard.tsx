import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FlaskConical, Sprout, Package, ShoppingCart, AlertTriangle, Users } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '../ui/button';

const weeklyProductionData = [
  { day: 'Mon', bottles: 450, plants: 3200 },
  { day: 'Tue', bottles: 520, plants: 3800 },
  { day: 'Wed', bottles: 480, plants: 3400 },
  { day: 'Thu', bottles: 550, plants: 4100 },
  { day: 'Fri', bottles: 600, plants: 4500 },
  { day: 'Sat', bottles: 420, plants: 3100 },
  { day: 'Sun', bottles: 380, plants: 2800 }
];

const stageWiseData = [
  { stage: 'Stage 1', count: 1200 },
  { stage: 'Stage 2', count: 2400 },
  { stage: 'Stage 3', count: 1800 },
  { stage: 'Stage 4', count: 3200 },
  { stage: 'Primary', count: 5600 },
  { stage: 'Secondary', count: 4200 }
];

const salesTrendData = [
  { month: 'Jan', sales: 45000 },
  { month: 'Feb', sales: 52000 },
  { month: 'Mar', sales: 48000 },
  { month: 'Apr', sales: 61000 },
  { month: 'May', sales: 55000 },
  { month: 'Jun', sales: 67000 }
];

const COLORS = ['#4CAF50', '#81C784', '#A5D6A7', '#C8E6C9', '#66BB6A', '#8BC34A'];

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Indoor Bottles</p>
                <p className="text-2xl text-gray-900 mt-1">8,240</p>
                <p className="text-xs text-green-600 mt-1">+12% this week</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Outdoor Batches</p>
                <p className="text-2xl text-gray-900 mt-1">24</p>
                <p className="text-xs text-green-600 mt-1">6 active</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Sprout className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Stock</p>
                <p className="text-2xl text-gray-900 mt-1">45,680</p>
                <p className="text-xs text-gray-600 mt-1">plants ready</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl text-gray-900 mt-1">8</p>
                <p className="text-xs text-amber-600 mt-1">2 urgent</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contaminated</p>
                <p className="text-2xl text-gray-900 mt-1">12</p>
                <p className="text-xs text-red-600 mt-1">today</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Workers Active</p>
                <p className="text-2xl text-gray-900 mt-1">18</p>
                <p className="text-xs text-gray-600 mt-1">of 24 total</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Production</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyProductionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bottles" stroke="#4CAF50" strokeWidth={2} />
                <Line type="monotone" dataKey="plants" stroke="#81C784" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stage-wise Plant Count</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stageWiseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="stage" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="count" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Trend (6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#4CAF50" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <Button className="bg-green-600 hover:bg-green-700 h-auto py-4 flex flex-col gap-2">
              <FlaskConical className="w-6 h-6" />
              <span>Add Media Batch</span>
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 h-auto py-4 flex flex-col gap-2">
              <FlaskConical className="w-6 h-6" />
              <span>Add Subculture</span>
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 h-auto py-4 flex flex-col gap-2">
              <Sprout className="w-6 h-6" />
              <span>Add Primary Hardening</span>
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 h-auto py-4 flex flex-col gap-2">
              <ShoppingCart className="w-6 h-6" />
              <span>Add Sales Entry</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
