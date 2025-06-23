import React, { useState } from "react";

interface Props {
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  onStartDateSelect: (date: Date) => void;
  onEndDateSelect?: (date: Date) => void;
  onClose: () => void;
}

export const Calendar: React.FC<Props> = ({
  selectedStartDate,
  selectedEndDate,
  onStartDateSelect,
  onEndDateSelect,
  onClose,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Native JavaScript replacements for date-fns functions
  const startOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const endOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  const eachDayOfInterval = (start: Date, end: Date) => {
    const days = [];
    const current = new Date(start);
    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const addMonths = (date: Date, amount: number) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + amount);
    return result;
  };

  const subMonths = (date: Date, amount: number) => {
    return addMonths(date, -amount);
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isWithinInterval = (date: Date, start: Date, end: Date) => {
    return date >= start && date <= end;
  };

  const isBefore = (date1: Date, date2: Date) => {
    return date1 < date2;
  };

  const isAfter = (date1: Date, date2: Date) => {
    return date1 > date2;
  };

  const format = (date: Date, formatStr: string) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    const day = date.getDate();

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    if (formatStr === "MMMM yyyy") {
      return `${monthNames[month]} ${year}`;
    }
    if (formatStr === "yyyy-MM-dd") {
      return `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
    }
    if (formatStr === "d") {
      return String(day);
    }
    return date.toISOString();
  };

  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval(start, end);
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isAfter(today, date);
  };

  const isDateSelected = (date: Date) => {
    if (!selectedStartDate) return false;
    if (!selectedEndDate) return isSameDay(date, selectedStartDate);
    return isWithinInterval(date, selectedStartDate, selectedEndDate);
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      onStartDateSelect(date);
      if (onEndDateSelect) {
        // Clear end date when starting new selection
        onEndDateSelect(date);
      }
    } else if (onEndDateSelect) {
      if (isBefore(date, selectedStartDate)) {
        onStartDateSelect(date);
        onEndDateSelect(selectedStartDate);
      } else {
        onEndDateSelect(date);
      }
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const renderDays = (month: Date) => {
    const days = getDaysInMonth(month);
    const firstDayOfMonth = days[0].getDay();
    const daysInPreviousMonth = Array(firstDayOfMonth).fill(null);

    return (
      <div className="grid grid-cols-7 gap-1">
        {daysInPreviousMonth.map((_, index) => (
          <div key={`empty-${index}`} className="h-8" />
        ))}
        {days.map((day: Date) => {
          const isDisabled = isDateDisabled(day);
          const isSelected = isDateSelected(day);

          return (
            <button
              key={format(day, "yyyy-MM-dd")}
              type="button"
              disabled={isDisabled}
              onClick={() => handleDateClick(day)}
              className={`
                h-8 w-8 rounded-full text-sm flex items-center justify-center
                ${
                  isDisabled
                    ? "text-[#5f6368] cursor-not-allowed"
                    : "text-[#e8eaed] hover:bg-[#3c4043]"
                }
                ${
                  isSelected
                    ? "bg-[#8ab4f8] text-[#202124] hover:bg-[#8ab4f8]"
                    : ""
                }
              `}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-[#303134] rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-2 hover:bg-[#3c4043] rounded-full"
        >
          <svg
            className="w-5 h-5 text-[#e8eaed]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        <div className="text-[#e8eaed] font-medium">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-2 hover:bg-[#3c4043] rounded-full"
        >
          <svg
            className="w-5 h-5 text-[#e8eaed]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-[#9aa0a6] text-sm"
          >
            {day}
          </div>
        ))}
      </div>

      {renderDays(currentMonth)}

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="text-[#8ab4f8] hover:bg-[#3c4043] px-4 py-2 rounded-lg text-sm font-medium"
        >
          Done
        </button>
      </div>
    </div>
  );
};
