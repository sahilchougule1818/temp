// Shared data structure for Media Preparation autoclave cycles
// This allows other modules to access media codes by date

export type AutoclaveCycleData = {
  id: number;
  date: string;
  mediaCode: string;
  operator: string;
  typeOfMedia: string;
  autoclaveOn: string;
  mediaLoading: string;
  pressure: string;
  off: string;
  open: string;
  mediaTotal: string;
  remark: string;
};

// This will be updated by Media Preparation module
// For now, we'll use a simple approach where each module maintains its own reference
// In a real app, this would be in a context or global state

export const getMediaCodesByDate = (autoclaveCycles: AutoclaveCycleData[], date: string): string[] => {
  if (!date) return [];
  const cyclesForDate = autoclaveCycles.filter(cycle => cycle.date === date);
  return Array.from(new Set(cyclesForDate.map(cycle => cycle.mediaCode)));
};

