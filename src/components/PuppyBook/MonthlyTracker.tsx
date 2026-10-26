import React from "react";
import { ChevronLeft, ChevronRight, Calendar } from "@/utils/iconImports";
import MonthlyContent from "./MonthlyContent";

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
  onMonthChange,
}) => {
  const months = Array.from({ length: 13 }, (_, i) => i); // 0-12 months

  const getMonthLabel = (month: number) => {
    if (month === 0) return "Syntymästä 1 kuukauteen";
    return `${month}. kuukausi`;
  };

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="journal-months">
        <h2 className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-[#245246]" aria-hidden="true" />
          Pennun kuukausiseuranta
        </h2>

        {/* Month Selector */}
        <div className="journal-month-switch">
          <button
            type="button"
            aria-label="Edellinen kuukausi"
            onClick={() => onMonthChange(Math.max(0, selectedMonth - 1))}
            disabled={selectedMonth === 0}
            className="journal-icon-button"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>

          <h3
            className="text-base text-center font-semibold"
            aria-live="polite"
          >
            {getMonthLabel(selectedMonth)}
          </h3>

          <button
            type="button"
            aria-label="Seuraava kuukausi"
            onClick={() => onMonthChange(Math.min(12, selectedMonth + 1))}
            disabled={selectedMonth === 12}
            className="journal-icon-button"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div
          className="journal-month-grid"
          role="group"
          aria-label="Valitse seurantakuukausi"
        >
          {months.map((month) => (
            <button
              type="button"
              key={month}
              onClick={() => onMonthChange(month)}
              aria-label={getMonthLabel(month)}
              aria-pressed={selectedMonth === month}
            >
              {month} kk
            </button>
          ))}
        </div>
      </div>

      {/* Monthly Content */}
      <MonthlyContent
        monthNumber={selectedMonth}
        bookId={bookId}
        birthDate={birthDate}
      />
    </div>
  );
};

export default MonthlyTracker;
