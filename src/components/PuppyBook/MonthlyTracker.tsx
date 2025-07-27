import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from '@/utils/iconImports';
import MonthlyContent from './MonthlyContent';

interface MonthlyTrackerProps {
  bookId: string;
  birthDate?: string;
  selectedMonth: number;
  onMonthChange: (month: number) => void;
}

const MonthlyTracker: React.FC<MonthlyTrackerProps> = ({ 
  bookId, 
  birthDate,
  selectedMonth, 
  onMonthChange 
}) => {
  const months = Array.from({ length: 13 }, (_, i) => i); // 0-12 months

  const getMonthLabel = (month: number) => {
    if (month === 0) return 'Syntymä - 1kk';
    return `${month}. kuukausi`;
  };

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-sans font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Calendar className="w-7 h-7 text-orange-500" />
          Pennun kuukausiseuranta 📅
        </h2>
        
        {/* Month Selector */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onMonthChange(Math.max(0, selectedMonth - 1))}
            disabled={selectedMonth === 0}
            className="p-2 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h3 className="text-xl font-semibold text-gray-800">
            {getMonthLabel(selectedMonth)}
          </h3>
          
          <button
            onClick={() => onMonthChange(Math.min(12, selectedMonth + 1))}
            disabled={selectedMonth === 12}
            className="p-2 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        {/* Month Dots */}
        <div className="flex justify-center space-x-2">
          {months.map((month) => (
            <button
              key={month}
              onClick={() => onMonthChange(month)}
              className={`w-3 h-3 rounded-full transition-all ${
                selectedMonth === month
                  ? 'bg-orange-500 scale-125'
                  : 'bg-gray-300 hover:bg-orange-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Monthly Content */}
      <MonthlyContent monthNumber={selectedMonth} bookId={bookId} birthDate={birthDate} />
    </div>
  );
};

export default MonthlyTracker;