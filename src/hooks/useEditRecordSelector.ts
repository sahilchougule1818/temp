import { useMemo } from 'react';

export interface UseEditRecordSelectorProps<T> {
  data: T[];
  selectedDate: string;
  selectedIdentifier: string;
  dateField: keyof T;
  identifierField: keyof T;
}

export interface UseEditRecordSelectorReturn<T> {
  availableIdentifiers: string[];
  selectedRecord: T | null;
  hasRecordsForDate: boolean;
}

export function useEditRecordSelector<T>({
  data,
  selectedDate,
  selectedIdentifier,
  dateField,
  identifierField,
}: UseEditRecordSelectorProps<T>): UseEditRecordSelectorReturn<T> {
  const availableIdentifiers = useMemo(() => {
    if (!selectedDate) return [];
    const recordsForDate = data.filter(
      (record) => record[dateField] === selectedDate
    );
    return Array.from(
      new Set(recordsForDate.map((record) => String(record[identifierField])))
    );
  }, [data, selectedDate, dateField, identifierField]);

  const selectedRecord = useMemo(() => {
    if (!selectedDate || !selectedIdentifier) return null;
    return (
      data.find(
        (record) =>
          record[dateField] === selectedDate &&
          String(record[identifierField]) === selectedIdentifier
      ) || null
    );
  }, [data, selectedDate, selectedIdentifier, dateField, identifierField]);

  const hasRecordsForDate = useMemo(() => {
    if (!selectedDate) return false;
    return data.some((record) => record[dateField] === selectedDate);
  }, [data, selectedDate, dateField]);

  return {
    availableIdentifiers,
    selectedRecord,
    hasRecordsForDate,
  };
}
