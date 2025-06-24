import React, { useState } from "react";
import { SearchForm } from "./components/SearchForm";
import { FlightResults } from "./components/FlightResults";
import { FlightMap } from "./components/FlightMap";
import { SearchFormData } from "./types";
import "./App.css";
import flightsHero from "./assets/flights-hero.svg";

export const App: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchFormData>({
    origin: null,
    destination: null,
    departureDate: null,
    returnDate: null,
    passengers: 1,
    cabinClass: "economy",
    tripType: "one-way",
  });

  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (data: SearchFormData) => {
    setSearchParams(data);
    setHasSearched(true);
  };

  return (
    <div className="App bg-[#202124] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="text-center">
          <img src={flightsHero} alt="Flights" className="flights-logo" />
          <h1 className="heading-flights mb-8">Flights</h1>
          <SearchForm onSearch={handleSearch} />
        </div>

        {hasSearched && searchParams.origin && searchParams.destination && (
          <div className="mt-6 sm:mt-8 lg:mt-10 space-y-4 sm:space-y-6">
            {/* <FlightMap
              originAirport={searchParams.origin}
              destinationAirport={searchParams.destination}
            /> */}
            <FlightResults flights={searchParams.flights || []} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
