import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { loadLedger, LedgerEntry, SALES_EVENTS } from './salesData';

export const LedgerSection: React.FC = () => {
  const [ledger, setLedger] = React.useState<LedgerEntry[]>([]);

  React.useEffect(() => {
    setLedger(loadLedger());

    if (typeof window === 'undefined') {
      return;
    }

    const handleRefresh = () => setLedger(loadLedger());
    window.addEventListener(SALES_EVENTS.ledger, handleRefresh);
    return () => window.removeEventListener(SALES_EVENTS.ledger, handleRefresh);
  }, []);

  const normalizedLedger = React.useMemo(() => {
    let runningBalance = 0;
    return ledger.map((entry) => {
      runningBalance += entry.debit - entry.credit;
      return { ...entry, balance: runningBalance };
    });
  }, [ledger]);

  const stats = React.useMemo(() => {
    const debit = normalizedLedger.reduce((acc, entry) => acc + entry.debit, 0);
    const credit = normalizedLedger.reduce((acc, entry) => acc + entry.credit, 0);
    const closing = normalizedLedger[normalizedLedger.length - 1]?.balance ?? 0;
    return { debit, credit, closing };
  }, [normalizedLedger]);

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4">
            <p className="text-xs text-emerald-700">Total Debits</p>
            <p className="text-2xl text-emerald-900 mt-1">₹{stats.debit.toLocaleString()}</p>
            <p className="text-xs text-emerald-600 mt-1">from bookings</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-xs text-blue-700">Total Credits</p>
            <p className="text-2xl text-blue-900 mt-1">₹{stats.credit.toLocaleString()}</p>
            <p className="text-xs text-blue-600 mt-1">from payments</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <p className="text-xs text-purple-700">Closing Balance</p>
            <p className="text-2xl text-purple-900 mt-1">₹{stats.closing.toLocaleString()}</p>
            <p className="text-xs text-purple-600 mt-1">current balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Ledger Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ledger Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Particulars</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Debit</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Credit</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Balance</th>
                </tr>
              </thead>
              <tbody>
                {normalizedLedger.map((entry) => (
                  <tr key={entry.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{entry.date}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="font-medium">{entry.particulars}</span>
                      {entry.referenceId && (
                        <p className="text-xs text-gray-500">Ref: {entry.referenceId}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-emerald-600">
                      {entry.debit ? `₹${entry.debit.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-600">
                      {entry.credit ? `₹${entry.credit.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold">₹{entry.balance.toLocaleString()}</td>
                  </tr>
                ))}
                {normalizedLedger.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                      Ledger is empty.
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

