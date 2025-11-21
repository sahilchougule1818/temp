import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function FilterBar() {
  return (
    <div className="card">
      <div className="flex gap-4 items-end">
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

        <div>
          <Button 
            className="bg-[#2196F3] hover:bg-[#1976D2] text-white"
            onClick={() => console.log('Search clicked')}
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
