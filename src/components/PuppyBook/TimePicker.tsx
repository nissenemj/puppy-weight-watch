import React, { useState } from 'react';
import { Clock, X } from '@/utils/iconImports';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TimePickerProps {
  onTimeAdded: (time: string) => void;
  time?: string;
  onTimeRemoved: () => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  onTimeAdded,
  time,
  onTimeRemoved
}) => {
  const [showInput, setShowInput] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');

  const addCurrentTime = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('fi-FI', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    onTimeAdded(timeString);
  };

  const addCustomTime = () => {
    if (selectedTime) {
      onTimeAdded(selectedTime);
      setSelectedTime('');
      setShowInput(false);
    }
  };

  if (time) {
    return (
      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
        <Clock className="w-3 h-3 text-blue-600" />
        <span className="text-xs text-blue-700 flex-1">Kello {time}</span>
        <button
          onClick={onTimeRemoved}
          className="w-4 h-4 text-blue-600 hover:text-red-600"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  if (showInput) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="text-xs h-8"
          />
          <Button
            size="sm"
            onClick={addCustomTime}
            disabled={!selectedTime}
            className="h-8 px-2 text-xs"
          >
            Lisää
          </Button>
        </div>
        <button
          onClick={() => setShowInput(false)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Peruuta
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={addCurrentTime}
        className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700"
      >
        <Clock className="w-3 h-3" />
        Nyt
      </button>
      <span className="text-xs text-gray-400">|</span>
      <button
        onClick={() => setShowInput(true)}
        className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700"
      >
        <Clock className="w-3 h-3" />
        Lisää aika
      </button>
    </div>
  );
};