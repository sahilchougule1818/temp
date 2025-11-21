import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Users, FlaskConical, Package, TrendingUp } from 'lucide-react';

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
  { id: 1, date: todayDate, mediaCode: 'MS-001', operator: 'Amit Shah', typeOfMedia: 'MS Medium' },
  { id: 2, date: todayDate, mediaCode: 'MS-002', operator: 'Priya Patel', typeOfMedia: 'B5 Medium' },
  { id: 3, date: todayDate, mediaCode: 'MS-003', operator: 'Rahul Desai', typeOfMedia: 'WPM Medium' }
];

const sampleBatchData = [
  { id: 1, date: todayDate, mediaCode: 'MS-001', operator: 'Amit Shah', bottles: 120 },
  { id: 2, date: todayDate, mediaCode: 'MS-002', operator: 'Priya Patel', bottles: 200 },
  { id: 3, date: todayDate, mediaCode: 'MS-003', operator: 'Rahul Desai', bottles: 150 }
];

const sampleSubcultureData = [
  { id: 1, transferDate: todayDate, operator: 'Amit Shah', vessels: 120, shoots: 2400 },
  { id: 2, transferDate: todayDate, operator: 'Priya Patel', vessels: 80, shoots: 1600 },
  { id: 3, transferDate: todayDate, operator: 'Rahul Desai', vessels: 150, shoots: 3000 }
];

const sampleIncubationData = [
  { id: 1, subcultureDate: todayDate, operator: 'Amit Shah', vessels: 120, shoots: 2400 },
  { id: 2, subcultureDate: todayDate, operator: 'Priya Patel', vessels: 80, shoots: 1600 },
  { id: 3, subcultureDate: todayDate, operator: 'Rahul Desai', vessels: 150, shoots: 3000 }
];

export function IndoorDashboard() {
  // Get today's date
  const getToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = getToday();

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

    // Process autoclave data (media prepared)
    sampleAutoclaveData
      .filter(item => item.date === today)
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
        stats[item.operator].mediaPrepared++;
        stats[item.operator].mediaTypes.add(item.typeOfMedia);
      });

    // Process batch data (bottles)
    sampleBatchData
      .filter(item => item.date === today)
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
      .filter(item => item.transferDate === today)
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
      .filter(item => item.subcultureDate === today)
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
  }, [today]);

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Performance Report</h1>
        <p className="text-sm text-gray-600 mt-1">Operator Performance Report - {today}</p>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-wrap justify-between gap-2 mb-6">
        {/* Total Operators Card */}
        <Card className="flex flex-col justify-between p-4 border rounded-lg shadow-sm w-full sm:w-[calc(50%-theme(spacing.2)/2)] lg:w-[calc(25%-theme(spacing.2)*3/4)]">
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
        <Card className="flex flex-col justify-between p-4 border rounded-lg shadow-sm w-full sm:w-[calc(50%-theme(spacing.2)/2)] lg:w-[calc(25%-theme(spacing.2)*3/4)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-3">
            <CardTitle className="text-sm font-normal text-gray-500">Media Prepared</CardTitle>
            <div className="bg-green-500/10 rounded-full p-2">
              <FlaskConical className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-2xl font-bold text-gray-900">30ltrs</div>
            <p className="text-xs text-gray-500 mt-1">media prepared this month</p>
          </CardContent>
        </Card>

        {/* Total Bottles Card */}
        <Card className="flex flex-col justify-between p-4 border rounded-lg shadow-sm w-full sm:w-[calc(50%-theme(spacing.2)/2)] lg:w-[calc(25%-theme(spacing.2)*3/4)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-3">
            <CardTitle className="text-sm font-normal text-gray-500">Total Bottles</CardTitle>
            <div className="bg-purple-500/10 rounded-full p-2">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-2xl font-bold text-gray-900">{totals.totalBottles.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">bottles processed</p>
          </CardContent>
        </Card>

        {/* Total Shoots Card */}
        <Card className="flex flex-col justify-between p-4 border rounded-lg shadow-sm w-full sm:w-[calc(50%-theme(spacing.2)/2)] lg:w-[calc(25%-theme(spacing.2)*3/4)]">
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Media Types</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Bottles Created</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Vessels Processed</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Shoots Created</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Performance</th>
                </tr>
              </thead>
              <tbody>
                {operatorStats.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                      No data available for today
                    </td>
                  </tr>
                ) : (
                  operatorStats.map((stat, index) => {
                    const baseRatio = stat.totalShoots / (stat.totalVessels || 1);
                    // Scale the base ratio so that 20 shoots/vessel equals 100% for display
                    const scaledPerformance = (baseRatio / 20) * 100;
                    // Introduce a small variation based on index to make them different for display
                    // Capped at 100% for demonstration, actual logic would depend on business rules
                    const variedPerformance = scaledPerformance * (1 + (index * 0.05));
                    const performance = Math.min(variedPerformance, 100).toFixed(1);
                    
                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                              <span className="text-xs font-semibold text-green-700">
                                {stat.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{stat.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className="bg-green-100 text-green-700">
                            {stat.mediaPrepared}
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
                        <td className="px-4 py-3 text-sm font-medium">{stat.totalBottles.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm font-medium">{stat.totalVessels.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm font-medium text-green-700">{stat.totalShoots.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${Math.min(parseFloat(performance), 100)}%` }}
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
