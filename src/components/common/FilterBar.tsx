import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card } from '../ui/card';

interface FilterBarProps {
  batchValue?: string;
  cropValue?: string;
  onBatchChange?: (value: string) => void;
  onCropChange?: (value: string) => void;
  onSearch?: () => void;
  batches?: { value: string; label: string }[];
  crops?: { value: string; label: string }[];
}

export function FilterBar({ 
  batchValue, 
  cropValue, 
  onBatchChange, 
  onCropChange, 
  onSearch,
  batches = [
    { value: 'b2024-1145', label: 'B-2024-1145' },
    { value: 'b2024-1144', label: 'B-2024-1144' },
    { value: 'b2024-1143', label: 'B-2024-1143' },
    { value: 'b2024-1142', label: 'B-2024-1142' }
  ],
  crops = [
    { value: 'rose', label: 'Rose' },
    { value: 'gerbera', label: 'Gerbera' },
    { value: 'carnation', label: 'Carnation' },
    { value: 'orchid', label: 'Orchid' },
    { value: 'anthurium', label: 'Anthurium' }
  ]
}: FilterBarProps) {
  return (
    <Card className="p-4">
      <div className="flex gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm mb-1.5">Batch Name</label>
          <Select value={batchValue} onValueChange={onBatchChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select batch" />
            </SelectTrigger>
            <SelectContent>
              {batches.map((batch) => (
                <SelectItem key={batch.value} value={batch.value}>
                  {batch.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm mb-1.5">Crop Name</label>
          <Select value={cropValue} onValueChange={onCropChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select crop" />
            </SelectTrigger>
            <SelectContent>
              {crops.map((crop) => (
                <SelectItem key={crop.value} value={crop.value}>
                  {crop.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Button 
            variant={null as any}
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
            className="hover:bg-[#66BB6A] font-medium shadow-sm h-10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all px-4"
            onClick={onSearch}
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </Card>
  );
}
