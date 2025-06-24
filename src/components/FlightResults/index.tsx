import React, { useState } from "react";
import { FilterBar } from "./FilterBar";
import { FlightCard } from "./FlightCard";
import { Flight } from "../../types";

interface Props {
  flights: Flight[];
}

export const FlightResults: React.FC<Props> = ({ flights }) => {
  const [sortBy, setSortBy] = useState<"cheapest" | "best">("cheapest");

  const cheapestPrice = Math.min(
    ...flights.map((flight) => flight.price.amount)
  );

  const getNumStops = (flight: Flight) => flight.segments.length - 1;

  const sortedFlights = [...flights].sort((a, b) => {
    if (sortBy === "cheapest") {
      return a.price.amount - b.price.amount;
    } else {
      // "best" - sort by a combination of price and duration
      const aScore =
        a.price.amount / cheapestPrice +
        getNumStops(a) +
        (a.totalDuration.hours * 60 + a.totalDuration.minutes) / 60;
      const bScore =
        b.price.amount / cheapestPrice +
        getNumStops(b) +
        (b.totalDuration.hours * 60 + b.totalDuration.minutes) / 60;
      return aScore - bScore;
    }
  });

  return (
    <div className="bg-[#202124] text-white">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
        <FilterBar
          sortBy={sortBy}
          setSortBy={setSortBy}
          cheapestPrice={cheapestPrice}
        />
        <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-[#202124]">
          {sortedFlights.map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
        </div>
      </div>
    </div>
  );
};
