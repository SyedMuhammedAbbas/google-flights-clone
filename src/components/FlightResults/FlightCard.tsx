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
        <div className="px-6 py-4">
          <div className="flex items-center">
            <div className="w-24">
              <img
                src={firstSegment.carrier.logo}
                alt={firstSegment.carrier.name}
                className="h-8"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <div className="flex flex-col">
                  <span className="text-[#e8eaed] text-lg">
                    {formatTime(firstSegment.departure.time)}
                  </span>
                  <span className="text-[#9aa0a6] text-sm">
                    {firstSegment.departure.airport.code}
                  </span>
                </div>
                <div className="flex flex-col items-center flex-1">
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
                  <div className="text-[#9aa0a6] text-sm">
                    {firstSegment.carrier.name} {firstSegment.flightNumber}
                    {flight.segments.length > 1 && (
                      <>
                        <span className="mx-1 text-[#9aa0a6]">•</span>
                        <span className="text-[#9aa0a6] text-sm">
                          {lastSegment.carrier.name} {lastSegment.flightNumber}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[#e8eaed] text-lg">
                    {formatTime(lastSegment.arrival.time)}
                  </span>
                  <span className="text-[#9aa0a6] text-sm">
                    {lastSegment.arrival.airport.code}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-48 text-right">
              <div className="text-[#e8eaed] text-lg">
                ${flight.price.amount.toLocaleString()}
              </div>
              <div className="text-[#9aa0a6] text-sm">
                {flight.bookingAgency?.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-[#5f6368] bg-[#303134]">
      <div className="px-6 py-4">
        <div className="flex items-start">
          <div className="w-24">
            <img
              src={firstSegment.carrier.logo}
              alt={firstSegment.carrier.name}
              className="h-8"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-start">
              <div>
                <div className="text-[#e8eaed] text-lg">
                  {formatTime(firstSegment.departure.time)}
                </div>
                <div className="text-[#9aa0a6] text-sm">
                  {firstSegment.departure.airport.code}
                </div>
                <div className="text-[#9aa0a6] text-sm mt-1">
                  {firstSegment.departure.airport.name}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-center text-[#9aa0a6] text-sm">
                  {formatDuration(flight.totalDuration)}
                </div>
                <div className="text-center text-[#9aa0a6] text-sm">
                  {flight.stops === 0
                    ? "Nonstop"
                    : `${flight.stops} ${
                        flight.stops === 1 ? "stop" : "stops"
                      }`}
                </div>
                <div className="text-[#9aa0a6] text-sm mt-1">
                  {firstSegment.carrier.name} {firstSegment.flightNumber}
                  {flight.segments.length > 1 && (
                    <>
                      <span className="mx-1">•</span>
                      {lastSegment.carrier.name} {lastSegment.flightNumber}
                    </>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[#e8eaed] text-lg">
                  {formatTime(lastSegment.arrival.time)}
                </div>
                <div className="text-[#9aa0a6] text-sm">
                  {lastSegment.arrival.airport.code}
                </div>
                <div className="text-[#9aa0a6] text-sm mt-1">
                  {lastSegment.arrival.airport.name}
                </div>
              </div>
            </div>
          </div>
          <div className="w-48 text-right">
            <div className="text-[#e8eaed] text-lg">
              ${flight.price.amount.toLocaleString()}
            </div>
            <div className="text-[#9aa0a6] text-sm">
              {flight.bookingAgency?.name}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-[#5f6368] px-6 py-2 flex items-center justify-between">
        <div className="text-[#9aa0a6] text-sm">
          {flight.aircraft?.model} • {flight.cabinClass}
        </div>
        <button className="text-[#8ab4f8]">
          {isExpanded ? (
            <span onClick={() => setIsExpanded(false)}>Show less</span>
          ) : (
            <span onClick={() => setIsExpanded(true)}>Show more</span>
          )}
        </button>
      </div>
    </div>
  );
};
