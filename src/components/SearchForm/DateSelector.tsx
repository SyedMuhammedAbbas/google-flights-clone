import React, { useState, useEffect } from "react";
import { Calendar } from "./Calendar";
import { Icon } from "../shared/Icon";
import { BsCalendar3 } from "react-icons/bs";

interface Props {
  departureDate: Date | null;
  returnDate: Date | null;
  onDepartureDateChange: (date: Date) => void;
  onReturnDateChange?: (date: Date) => void;
  onCalendarOpen?: () => void;
}

export const DateSelector: React.FC<Props> = ({
  departureDate,
  returnDate,
  onDepartureDateChange,
  onReturnDateChange,
  onCalendarOpen,
}) => {
  const [isDepartureCalendarOpen, setIsDepartureCalendarOpen] = useState(false);
  const [isReturnCalendarOpen, setIsReturnCalendarOpen] = useState(false);

  // Close modals on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDepartureCalendarOpen(false);
        setIsReturnCalendarOpen(false);
      }
    };

    if (isDepartureCalendarOpen || isReturnCalendarOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isDepartureCalendarOpen, isReturnCalendarOpen]);

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

  // If round trip, show separate date inputs
  if (onReturnDateChange) {
    return (
      <>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          {/* Departure Date */}
          <div className="relative flex-1 h-[48px]">
            <button
              type="button"
              onClick={() => {
                onCalendarOpen?.();
                setIsDepartureCalendarOpen(true);
              }}
              className="w-full h-[48px] flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg  hover:bg-[#303134] transition-colors border-r-0 sm:border-r border-[#5f6368] rounded-r-none sm:rounded-r-none"
            >
              <Icon
                icon={BsCalendar3}
                className="text-[#9aa0a6] text-lg sm:text-xl"
              />
              <div className="flex-1 text-left">
                {/* <div className="text-xs text-[#9aa0a6]">Departure</div> */}
                <div className="text-[#e8eaed] text-sm sm:text-base">
                  {departureDate ? formatDate(departureDate) : "Add date"}
                </div>
              </div>
            </button>
          </div>

          {/* Return Date */}
          <div className="relative flex-1 h-[48px]">
            <button
              type="button"
              onClick={() => {
                onCalendarOpen?.();
                setIsReturnCalendarOpen(true);
              }}
              className="w-full h-[48px] flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg hover:bg-[#303134] transition-colors rounded-l-none sm:rounded-l-none"
            >
              <Icon
                icon={BsCalendar3}
                className="text-[#9aa0a6] text-lg sm:text-xl"
              />
              <div className="flex-1 text-left">
                {/* <div className="text-xs text-[#9aa0a6]">Return</div> */}
                <div className="text-[#e8eaed] text-sm sm:text-base">
                  {returnDate ? formatDate(returnDate) : "Add date"}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Modal Overlays */}
        {isDepartureCalendarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            style={{ zIndex: 999999 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsDepartureCalendarOpen(false);
              }
            }}
          >
            <div className="bg-[#202124] rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[#e8eaed] text-lg font-medium">
                    Select departure date
                  </h3>
                  <button
                    onClick={() => setIsDepartureCalendarOpen(false)}
                    className="text-[#9aa0a6] hover:text-[#e8eaed] transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <Calendar
                  selectedStartDate={departureDate}
                  selectedEndDate={null}
                  onStartDateSelect={(date) => {
                    onDepartureDateChange(date);
                  }}
                  onEndDateSelect={undefined}
                  onClose={() => setIsDepartureCalendarOpen(false)}
                />
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setIsDepartureCalendarOpen(false)}
                    className="bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#202124] font-medium px-6 py-2 rounded-full transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isReturnCalendarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            style={{ zIndex: 999999 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsReturnCalendarOpen(false);
              }
            }}
          >
            <div className="bg-[#202124] rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[#e8eaed] text-lg font-medium">
                    Select return date
                  </h3>
                  <button
                    onClick={() => setIsReturnCalendarOpen(false)}
                    className="text-[#9aa0a6] hover:text-[#e8eaed] transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <Calendar
                  selectedStartDate={departureDate}
                  selectedEndDate={returnDate}
                  onStartDateSelect={onDepartureDateChange}
                  onEndDateSelect={(date) => {
                    onReturnDateChange(date);
                  }}
                  onClose={() => setIsReturnCalendarOpen(false)}
                />
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setIsReturnCalendarOpen(false)}
                    className="bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#202124] font-medium px-6 py-2 rounded-full transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // One-way trip - single date input
  return (
    <>
      <div className="relative h-[48px]">
        <button
          type="button"
          onClick={() => {
            onCalendarOpen?.();
            setIsDepartureCalendarOpen(true);
          }}
          className="w-full h-[48px] flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg hover:bg-[#303134] transition-colors"
        >
          <Icon
            icon={BsCalendar3}
            className="text-[#9aa0a6] text-lg sm:text-xl"
          />
          <div className="flex-1 text-left">
            <div className="text-xs text-[#9aa0a6]">Departure</div>
            <div className="text-[#e8eaed] text-sm sm:text-base">
              {departureDate ? formatDate(departureDate) : "Add date"}
            </div>
          </div>
        </button>
      </div>

      {/* Modal Overlay */}
      {isDepartureCalendarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          style={{ zIndex: 999999 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsDepartureCalendarOpen(false);
            }
          }}
        >
          <div className="bg-[#202124] rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[#e8eaed] text-lg font-medium">
                  Select departure date
                </h3>
                <button
                  onClick={() => setIsDepartureCalendarOpen(false)}
                  className="text-[#9aa0a6] hover:text-[#e8eaed] transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <Calendar
                selectedStartDate={departureDate}
                selectedEndDate={null}
                onStartDateSelect={(date) => {
                  onDepartureDateChange(date);
                }}
                onEndDateSelect={undefined}
                onClose={() => setIsDepartureCalendarOpen(false)}
              />
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setIsDepartureCalendarOpen(false)}
                  className="bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#202124] font-medium px-6 py-2 rounded-full transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
