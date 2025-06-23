import React, { useState } from "react";
import { Calendar } from "./Calendar";
import { Icon } from "../shared/Icon";
import { BsCalendar3 } from "react-icons/bs";

interface Props {
  departureDate: Date | null;
  returnDate: Date | null;
  onDepartureDateChange: (date: Date) => void;
  onReturnDateChange?: (date: Date) => void;
}

export const DateSelector: React.FC<Props> = ({
  departureDate,
  returnDate,
  onDepartureDateChange,
  onReturnDateChange,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return "";

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const weekday = weekdays[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();

    return `${weekday}, ${month} ${day}`;
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsCalendarOpen(true)}
        className="w-full h-full flex items-center space-x-3 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg"
      >
        <Icon icon={BsCalendar3} className="text-[#9aa0a6]" />
        <div className="flex-1 text-left">
          <div className="text-xs text-[#9aa0a6]">Departure</div>
          <div className="text-[#e8eaed]">
            {departureDate ? formatDate(departureDate) : "Add date"}
          </div>
        </div>
        {onReturnDateChange && (
          <>
            <div className="h-8 w-px bg-[#5f6368]" />
            <div className="flex-1 text-left">
              <div className="text-xs text-[#9aa0a6]">Return</div>
              <div className="text-[#e8eaed]">
                {returnDate ? formatDate(returnDate) : "Add date"}
              </div>
            </div>
          </>
        )}
      </button>

      {isCalendarOpen && (
        <div className="absolute top-full left-0 mt-1 z-50">
          <Calendar
            selectedStartDate={departureDate}
            selectedEndDate={returnDate}
            onStartDateSelect={onDepartureDateChange}
            onEndDateSelect={onReturnDateChange}
            onClose={() => setIsCalendarOpen(false)}
          />
        </div>
      )}
    </div>
  );
};
