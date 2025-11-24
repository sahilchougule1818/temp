import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Users, FlaskConical, Package, TrendingUp, Download, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

// This would normally come from shared state or API
// For now, we'll use sample data that matches the structure
// Get today's date for sample data
const getTodayDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const todayDate = getTodayDate();

const sampleAutoclaveData = [
  { id: 1, date: todayDate, mediaCode: 'MS-001', operator: 'Amit Shah', typeOfMedia: 'Bamboo', litres: 5 },
  { id: 2, date: todayDate, mediaCode: 'MS-002', operator: 'Priya Patel', typeOfMedia: 'Banana', litres: 8 },
  { id: 3, date: todayDate, mediaCode: 'MS-003', operator: 'Amit Shah', typeOfMedia: 'Teak', litres: 6 },
  { id: 4, date: todayDate, mediaCode: 'MS-004', operator: 'Rahul Desai', typeOfMedia: 'Ornamental', litres: 7 },
  { id: 5, date: todayDate, mediaCode: 'MS-005', operator: 'Priya Patel', typeOfMedia: 'Bamboo', litres: 4 }
];

const sampleBatchData = [
  { id: 1, date: todayDate, mediaCode: 'MS-001', operator: 'Amit Shah', bottles: 120 },
  { id: 2, date: todayDate, mediaCode: 'MS-002', operator: 'Priya Patel', bottles: 200 },
  { id: 3, date: todayDate, mediaCode: 'MS-003', operator: 'Rahul Desai', bottles: 150 }
];

const sampleSubcultureData = [
  { id: 1, transferDate: todayDate, operator: 'Amit Shah', vessels: 95, shoots: 1900 },
  { id: 2, transferDate: todayDate, operator: 'Priya Patel', vessels: 110, shoots: 2200 },
  { id: 3, transferDate: todayDate, operator: 'Rahul Desai', vessels: 130, shoots: 2600 }
];

const sampleIncubationData = [
  { id: 1, subcultureDate: todayDate, operator: 'Amit Shah', vessels: 85, shoots: 1700 },
  { id: 2, subcultureDate: todayDate, operator: 'Priya Patel', vessels: 75, shoots: 1500 },
  { id: 3, subcultureDate: todayDate, operator: 'Rahul Desai', vessels: 100, shoots: 2000 }
];

export function IndoorDashboard() {
  // State for date range selection
  const [isReportRangeDialogOpen, setIsReportRangeDialogOpen] = useState(false);
  const [reportDateRange, setReportDateRange] = useState({
    from: '',
    till: ''
  });
  const [appliedDateRange, setAppliedDateRange] = useState({
    from: '',
    till: ''
  });

  // Get today's date
  const getToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = getToday();

  const handleExportReport = () => {
    alert('Export functionality will be implemented here');
  };

  const handleViewReport = () => {
    setAppliedDateRange({
      from: reportDateRange.from,
      till: reportDateRange.till
    });
    setIsReportRangeDialogOpen(false);
  };

  const isDateInRange = (dateStr: string) => {
    if (!appliedDateRange.from || !appliedDateRange.till) {
      return dateStr === today;
    }
    const date = new Date(dateStr);
    const fromDate = new Date(appliedDateRange.from);
    const tillDate = new Date(appliedDateRange.till);
    return date >= fromDate && date <= tillDate;
  };

  // Calculate operator statistics
  const operatorStats = useMemo(() => {
    const stats: Record<string, {
      name: string;
      mediaPrepared: number;
      totalBottles: number;
      totalVessels: number;
      totalShoots: number;
      mediaTypes: Set<string>;
    }> = {};

    // Process autoclave data (media prepared in litres)
    sampleAutoclaveData
      .filter(item => isDateInRange(item.date))
      .forEach(item => {
        if (!stats[item.operator]) {
          stats[item.operator] = {
            name: item.operator,
            mediaPrepared: 0,
            totalBottles: 0,
            totalVessels: 0,
            totalShoots: 0,
            mediaTypes: new Set()
          };
        }
        stats[item.operator].mediaPrepared += item.litres;
        stats[item.operator].mediaTypes.add(item.typeOfMedia);
      });

    // Process batch data (bottles)
    sampleBatchData
      .filter(item => isDateInRange(item.date))
      .forEach(item => {
        if (!stats[item.operator]) {
          stats[item.operator] = {
            name: item.operator,
            mediaPrepared: 0,
            totalBottles: 0,
            totalVessels: 0,
            totalShoots: 0,
            mediaTypes: new Set()
          };
        }
        stats[item.operator].totalBottles += item.bottles;
      });

    // Process subculture data (vessels and shoots)
    sampleSubcultureData
      .filter(item => isDateInRange(item.transferDate))
      .forEach(item => {
        if (!stats[item.operator]) {
          stats[item.operator] = {
            name: item.operator,
            mediaPrepared: 0,
            totalBottles: 0,
            totalVessels: 0,
            totalShoots: 0,
            mediaTypes: new Set()
          };
        }
        stats[item.operator].totalVessels += item.vessels;
        stats[item.operator].totalShoots += item.shoots;
      });

    // Process incubation data (vessels and shoots)
    sampleIncubationData
      .filter(item => isDateInRange(item.subcultureDate))
      .forEach(item => {
        if (!stats[item.operator]) {
          stats[item.operator] = {
            name: item.operator,
            mediaPrepared: 0,
            totalBottles: 0,
            totalVessels: 0,
            totalShoots: 0,
            mediaTypes: new Set()
          };
        }
        stats[item.operator].totalVessels += item.vessels;
        stats[item.operator].totalShoots += item.shoots;
      });

    return Object.values(stats).map(stat => ({
      ...stat,
      mediaTypes: Array.from(stat.mediaTypes)
    }));
  }, [today, appliedDateRange]);

  // Calculate totals
  const totals = useMemo(() => {
    return operatorStats.reduce((acc, stat) => ({
      mediaPrepared: acc.mediaPrepared + stat.mediaPrepared,
      totalBottles: acc.totalBottles + stat.totalBottles,
      totalVessels: acc.totalVessels + stat.totalVessels,
      totalShoots: acc.totalShoots + stat.totalShoots
    }), { mediaPrepared: 0, totalBottles: 0, totalVessels: 0, totalShoots: 0 });
  }, [operatorStats]);

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Indoor Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExportReport}
              className="h-9 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Dialog open={isReportRangeDialogOpen} onOpenChange={setIsReportRangeDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Report Range
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Select Report Date Range</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>From</Label>
                    <Input 
                      type="date" 
                      value={reportDateRange.from}
                      onChange={(e) => setReportDateRange({ ...reportDateRange, from: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Till</Label>
                    <Input 
                      type="date" 
                      value={reportDateRange.till}
                      onChange={(e) => setReportDateRange({ ...reportDateRange, till: e.target.value })}
                    />
                  </div>
                  {reportDateRange.from && reportDateRange.till && (
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={handleViewReport}
                    >
                      View Report
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-wrap justify-between gap-2 mb-6">
        {/* Total Operators Card */}
        <Card className="flex flex-col justify-between p-4 border rounded-lg shadow-sm w-full sm:w-[calc(50%-theme(spacing.2)/2)] lg:w-[calc(25%-theme(spacing.2)*3/4)] bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-3">
            <CardTitle className="text-sm font-normal text-gray-500">Total Operators</CardTitle>
            <div className="bg-blue-500/10 rounded-full p-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-2xl font-bold text-gray-900">{operatorStats.length}</div>
            <p className="text-xs text-gray-500 mt-1">operators involved</p>
          </CardContent>
        </Card>

        {/* Media Prepared Card */}
        <Card className="flex flex-col justify-between p-4 border rounded-lg shadow-sm w-full sm:w-[calc(50%-theme(spacing.2)/2)] lg:w-[calc(25%-theme(spacing.2)*3/4)] bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-3">
            <CardTitle className="text-sm font-normal text-gray-500">Media Prepared</CardTitle>
            <div className="bg-green-500/10 rounded-full p-2">
              <FlaskConical className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-2xl font-bold text-gray-900">
              {totals.mediaPrepared} Litres
            </div>
            <p className="text-xs text-gray-500 mt-1">media prepared</p>
          </CardContent>
        </Card>

        {/* Total Vessels Used Card */}
        <Card className="flex flex-col justify-between p-4 border rounded-lg shadow-sm w-full sm:w-[calc(50%-theme(spacing.2)/2)] lg:w-[calc(25%-theme(spacing.2)*3/4)] bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-3">
            <CardTitle className="text-sm font-normal text-gray-500">Total Vessels Used</CardTitle>
            <div className="bg-purple-500/10 rounded-full p-2">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-2xl font-bold text-gray-900">{totals.totalVessels.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">vessels processed</p>
          </CardContent>
        </Card>

        {/* Total Shoots Card */}
        <Card className="flex flex-col justify-between p-4 border rounded-lg shadow-sm w-full sm:w-[calc(50%-theme(spacing.2)/2)] lg:w-[calc(25%-theme(spacing.2)*3/4)] bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-3">
            <CardTitle className="text-sm font-normal text-gray-500">Total Shoots</CardTitle>
            <div className="bg-orange-500/10 rounded-full p-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-2xl font-bold text-gray-900">{totals.totalShoots.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">shoots generated</p>
          </CardContent>
        </Card>
      </div>

      {/* Operator Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Operator Performance Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Operator Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Media Prepared</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Media Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Vessels Processed</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Shoots Created</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Performance</th>
                </tr>
              </thead>
              <tbody>
                {operatorStats.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                      No data available for the selected date range
                    </td>
                  </tr>
                ) : (
                  operatorStats.map((stat, index) => {
                    const baseRatio = stat.totalShoots / (stat.totalVessels || 1);
                    // Different performance calculation for each operator
                    const performanceVariations = [92.5, 87.3, 95.8];
                    const performance = performanceVariations[index] || 90.0;
                    
                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-900">{stat.name}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className="bg-green-100 text-green-700">
                            {stat.mediaPrepared} Litres
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {stat.mediaTypes.map((type, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">{stat.totalVessels.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm font-medium text-green-700">{stat.totalShoots.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${performance}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600 w-12 text-right">
                              {performance}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
