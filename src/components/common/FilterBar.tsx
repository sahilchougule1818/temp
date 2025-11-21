import { Search, Calendar } from 'lucide-react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface FilterBarProps {
  showCropFilter?: boolean;
  showBatchFilter?: boolean;
  showDateRange?: boolean;
  showOperator?: boolean;
  showStage?: boolean;
  showTunnel?: boolean;
  showStatus?: boolean;
}

export function FilterBar({
  showCropFilter = false,
  showBatchFilter = false,
  showDateRange = false,
  showOperator = false,
  showStage = false,
  showTunnel = false,
  showStatus = false,
}: FilterBarProps) {
  return (
    <div className="card">
      <div className="flex flex-wrap gap-4">
        {showCropFilter && (
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm mb-1.5">Crop Name</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rose">Rose</SelectItem>
                <SelectItem value="gerbera">Gerbera</SelectItem>
                <SelectItem value="carnation">Carnation</SelectItem>
                <SelectItem value="orchid">Orchid</SelectItem>
                <SelectItem value="anthurium">Anthurium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {showBatchFilter && (
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm mb-1.5">Batch Name</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="b2024-1145">B-2024-1145</SelectItem>
                <SelectItem value="b2024-1144">B-2024-1144</SelectItem>
                <SelectItem value="b2024-1143">B-2024-1143</SelectItem>
                <SelectItem value="b2024-1142">B-2024-1142</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {showDateRange && (
          <>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm mb-1.5">From Date</label>
              <Input type="date" />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm mb-1.5">To Date</label>
              <Input type="date" />
            </div>
          </>
        )}

        {showOperator && (
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm mb-1.5">Operator</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rajesh">Rajesh Kumar</SelectItem>
                <SelectItem value="priya">Priya Sharma</SelectItem>
                <SelectItem value="amit">Amit Patel</SelectItem>
                <SelectItem value="sneha">Sneha Reddy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {showStage && (
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm mb-1.5">Stage</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stage1">Stage 1</SelectItem>
                <SelectItem value="stage2">Stage 2</SelectItem>
                <SelectItem value="stage3">Stage 3</SelectItem>
                <SelectItem value="stage4">Stage 4</SelectItem>
                <SelectItem value="stage5">Stage 5</SelectItem>
                <SelectItem value="stage6">Stage 6</SelectItem>
                <SelectItem value="stage7">Stage 7</SelectItem>
                <SelectItem value="stage8">Stage 8</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {showTunnel && (
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm mb-1.5">Tunnel</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select tunnel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="t1">Tunnel T1</SelectItem>
                <SelectItem value="t2">Tunnel T2</SelectItem>
                <SelectItem value="t3">Tunnel T3</SelectItem>
                <SelectItem value="t4">Tunnel T4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {showStatus && (
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm mb-1.5">Status</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex-1 min-w-[240px]">
          <label className="block text-sm mb-1.5">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input className="pl-9" placeholder="Search..." />
          </div>
        </div>
      </div>
    </div>
  );
}
