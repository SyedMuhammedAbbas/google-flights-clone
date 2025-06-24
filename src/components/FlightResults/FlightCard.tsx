import React, { useState } from "react";
import { Flight } from "../../types";

interface Props {
  flight: Flight;
}

export const FlightCard: React.FC<Props> = ({ flight }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const firstSegment = flight.segments[0];
  const lastSegment = flight.segments[flight.segments.length - 1];

  const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (duration: { hours: number; minutes: number }) => {
    const hours = duration.hours > 0 ? `${duration.hours}h ` : "";
    const minutes = duration.minutes > 0 ? `${duration.minutes}m` : "";
    return `${hours}${minutes}`;
  };

  if (!isExpanded) {
    return (
      <div className="border-b border-[#5f6368] hover:bg-[#303134] transition-colors">
        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            {/* Airline Logo */}
            <div className="w-16 sm:w-20 lg:w-24 flex-shrink-0">
              <img
                src={firstSegment.carrier.logo}
                alt={firstSegment.carrier.name}
                className="h-6 sm:h-7 lg:h-8 w-auto object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.nextElementSibling!.textContent =
                    firstSegment.carrier.code;
                }}
              />
              <div className="text-[#9aa0a6] text-xs sm:text-sm font-medium hidden"></div>
            </div>

            {/* Flight Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                {/* Departure */}
                <div className="flex flex-col sm:min-w-0 sm:flex-shrink-0">
                  <span className="text-[#e8eaed] text-base sm:text-lg font-medium">
                    {formatTime(firstSegment.departure.time)}
                  </span>
                  <span className="text-[#9aa0a6] text-xs sm:text-sm">
                    {firstSegment.departure.airport.code}
                  </span>
                </div>

                {/* Flight Info */}
                <div className="flex flex-col items-start sm:items-center flex-1 min-w-0">
                  <div className="text-[#9aa0a6] text-xs sm:text-sm">
                    {formatDuration(flight.totalDuration)}
                  </div>
                  <div className="text-[#9aa0a6] text-xs sm:text-sm">
                    {flight.stops === 0
                      ? "Nonstop"
                      : `${flight.stops} ${
                          flight.stops === 1 ? "stop" : "stops"
                        }`}
                  </div>
                  <div className="text-[#9aa0a6] text-xs sm:text-sm truncate w-full sm:text-center">
                    {firstSegment.carrier.name} {firstSegment.flightNumber}
                    {flight.segments.length > 1 && (
                      <>
                        <span className="mx-1 text-[#9aa0a6] hidden sm:inline">
                          •
                        </span>
                        <span className="block sm:inline text-[#9aa0a6] text-xs sm:text-sm">
                          {lastSegment.carrier.name} {lastSegment.flightNumber}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Arrival */}
                <div className="flex flex-col sm:items-end sm:min-w-0 sm:flex-shrink-0">
                  <span className="text-[#e8eaed] text-base sm:text-lg font-medium">
                    {formatTime(lastSegment.arrival.time)}
                  </span>
                  <span className="text-[#9aa0a6] text-xs sm:text-sm">
                    {lastSegment.arrival.airport.code}
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex justify-between items-center sm:flex-col sm:items-end sm:w-32 lg:w-40 sm:text-right flex-shrink-0">
              <div className="text-[#e8eaed] text-lg sm:text-xl lg:text-2xl font-medium">
                ${flight.price.amount.toLocaleString()}
              </div>
              <div className="text-[#9aa0a6] text-xs sm:text-sm">
                {flight.bookingAgency?.name || "Book now"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-[#5f6368] bg-[#303134]">
      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex flex-col lg:flex-row lg:items-start gap-3 lg:gap-4">
          {/* Airline Logo */}
          <div className="w-16 sm:w-20 lg:w-24 flex-shrink-0">
            <img
              src={firstSegment.carrier.logo}
              alt={firstSegment.carrier.name}
              className="h-6 sm:h-7 lg:h-8 w-auto object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.nextElementSibling!.textContent =
                  firstSegment.carrier.code;
              }}
            />
            <div className="text-[#9aa0a6] text-xs sm:text-sm font-medium hidden"></div>
          </div>

          {/* Expanded Flight Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Departure Details */}
              <div className="flex-1">
                <div className="text-[#e8eaed] text-lg sm:text-xl font-medium">
                  {formatTime(firstSegment.departure.time)}
                </div>
                <div className="text-[#9aa0a6] text-sm">
                  {firstSegment.departure.airport.code}
                </div>
                <div className="text-[#9aa0a6] text-xs sm:text-sm mt-1 break-words">
                  {firstSegment.departure.airport.name}
                </div>
              </div>

              {/* Flight Path */}
              <div className="flex-1 text-center hidden sm:block">
                <div className="text-[#9aa0a6] text-sm">
                  {formatDuration(flight.totalDuration)}
                </div>
                <div className="text-[#9aa0a6] text-sm">
                  {flight.stops === 0
                    ? "Nonstop"
                    : `${flight.stops} ${
                        flight.stops === 1 ? "stop" : "stops"
                      }`}
                </div>
                <div className="text-[#9aa0a6] text-xs sm:text-sm mt-1">
                  {firstSegment.carrier.name} {firstSegment.flightNumber}
                  {flight.segments.length > 1 && (
                    <>
                      <span className="mx-1">•</span>
                      {lastSegment.carrier.name} {lastSegment.flightNumber}
                    </>
                  )}
                </div>
              </div>

              {/* Arrival Details */}
              <div className="flex-1 sm:text-right">
                <div className="text-[#e8eaed] text-lg sm:text-xl font-medium">
                  {formatTime(lastSegment.arrival.time)}
                </div>
                <div className="text-[#9aa0a6] text-sm">
                  {lastSegment.arrival.airport.code}
                </div>
                <div className="text-[#9aa0a6] text-xs sm:text-sm mt-1 break-words">
                  {lastSegment.arrival.airport.name}
                </div>
              </div>
            </div>

            {/* Mobile Flight Path Info */}
            <div className="sm:hidden mt-3 pt-3 border-t border-[#5f6368]">
              <div className="text-[#9aa0a6] text-sm">
                Duration: {formatDuration(flight.totalDuration)} •{" "}
                {flight.stops === 0
                  ? "Nonstop"
                  : `${flight.stops} ${flight.stops === 1 ? "stop" : "stops"}`}
              </div>
              <div className="text-[#9aa0a6] text-xs mt-1">
                {firstSegment.carrier.name} {firstSegment.flightNumber}
                {flight.segments.length > 1 && (
                  <>
                    {" • "}
                    {lastSegment.carrier.name} {lastSegment.flightNumber}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div className="flex justify-between items-center lg:flex-col lg:items-end lg:w-32 xl:w-40 lg:text-right flex-shrink-0">
            <div className="text-[#e8eaed] text-lg sm:text-xl lg:text-2xl font-medium">
              ${flight.price.amount.toLocaleString()}
            </div>
            <div className="text-[#9aa0a6] text-xs sm:text-sm">
              {flight.bookingAgency?.name || "Book now"}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#5f6368] px-3 sm:px-4 lg:px-6 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="text-[#9aa0a6] text-xs sm:text-sm">
          {flight.aircraft?.model} • {flight.cabinClass}
        </div>
        <button
          className="text-[#8ab4f8] text-sm font-medium hover:underline text-left sm:text-right"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      </div>
    </div>
  );
};
