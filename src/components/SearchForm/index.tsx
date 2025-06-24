import React, { useState, useEffect, useRef } from "react";
import { LocationInputs } from "./LocationInputs";
import { DateSelector } from "./DateSelector";
import { TopOptionsBar } from "./TopOptionsBar";
import { DropdownMenu } from "./DropdownMenu";
import { SearchFormData, Airport, CabinClass, TripType } from "../../types";
import { searchAirports, searchFlights } from "../../services/api";

interface Props {
  onSearch: (data: SearchFormData) => void;
}

const emptyAirport: Airport = {
  code: "",
  name: "",
  entityId: "",
  city: "",
  country: "",
  displayCode: "",
  lat: 0,
  lng: 0,
};

export const SearchForm: React.FC<Props> = ({ onSearch }) => {
  const [formData, setFormData] = useState<SearchFormData>({
    origin: null,
    destination: null,
    departureDate: null,
    returnDate: null,
    passengers: 1,
    cabinClass: "economy",
    tripType: "one-way",
  });

  const [originSuggestions, setOriginSuggestions] = useState<Airport[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    Airport[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);

  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tripTypeOptions = [
    { label: "Round trip", value: "round-trip" },
    { label: "One way", value: "one-way" },
    { label: "Multi-city", value: "multi-city" },
  ];

  const cabinClassOptions = [
    { label: "Economy", value: "economy" },
    { label: "Premium economy", value: "premium_economy" },
    { label: "Business", value: "business" },
    { label: "First", value: "first" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAirportSearch = async (query: string, isOrigin: boolean) => {
    if (query.length < 2) {
      if (isOrigin) setOriginSuggestions([]);
      else setDestinationSuggestions([]);
      return;
    }

    try {
      const results = await searchAirports(query);
      if (isOrigin) {
        setOriginSuggestions(results);
      } else {
        setDestinationSuggestions(results);
      }
    } catch (error) {
      console.error("Error searching airports:", error);
    }
  };

  const handleAirportSelect = (airport: Airport, isOrigin: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [isOrigin ? "origin" : "destination"]: airport,
    }));
    if (isOrigin) setOriginSuggestions([]);
    else setDestinationSuggestions([]);
  };

  const handleDateChange = (date: Date, isReturn = false) => {
    setFormData((prev) => ({
      ...prev,
      [isReturn ? "returnDate" : "departureDate"]: date,
    }));
  };

  const handlePassengersChange = (passengers: number) => {
    setFormData((prev) => ({
      ...prev,
      passengers,
    }));
  };

  const handleCabinClassChange = (cabinClass: CabinClass) => {
    setFormData((prev) => ({
      ...prev,
      cabinClass,
    }));
  };

  const handleTripTypeChange = (tripType: TripType) => {
    setFormData((prev) => ({
      ...prev,
      tripType,
      returnDate: tripType === "one-way" ? null : prev.returnDate,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.origin || !formData.destination || !formData.departureDate) {
      alert("Please select origin, destination, and departure date");
      return;
    }

    setIsSearching(true);

    try {
      // Format date for API (YYYY-MM-DD)
      const formatDateForAPI = (date: Date) => {
        return date.toISOString().split("T")[0];
      };

      const searchParams = {
        originSkyId: formData.origin.code,
        destinationSkyId: formData.destination.code,
        originEntityId: formData.origin.entityId,
        destinationEntityId: formData.destination.entityId,
        date: formatDateForAPI(formData.departureDate),
        cabinClass: formData.cabinClass,
        adults: formData.passengers,
        sortBy: "best" as const,
        currency: "USD",
        market: "US",
        countryCode: "US",
      };

      // Call the search API
      const response = await searchFlights(searchParams);

      // Transform the API response to match our Flight interface
      const flights =
        response.data?.flights?.map((flight: any) => ({
          id: flight.id,
          segments:
            flight.segments?.map((segment: any) => ({
              id: segment.id,
              origin: formData.origin!,
              destination: formData.destination!,
              duration: segment.duration || { hours: 0, minutes: 0 },
              departureTime: new Date(segment.departure?.time || Date.now()),
              arrivalTime: new Date(segment.arrival?.time || Date.now()),
              flightNumber: segment.flightNumber || "",
              carrier: segment.carrier || {
                name: "Unknown",
                code: "UN",
                logo: "",
              },
              departure: {
                airport: segment.departure?.airport || formData.origin!,
                time: segment.departure?.time || "",
              },
              arrival: {
                airport: segment.arrival?.airport || formData.destination!,
                time: segment.arrival?.time || "",
              },
            })) || [],
          totalDuration: flight.totalDuration || { hours: 0, minutes: 0 },
          price: {
            amount: flight.price?.amount || 0,
            currency: flight.price?.currency || "USD",
          },
          stops: flight.segments?.length - 1 || 0,
        })) || [];

      // Pass the search data with flights to parent
      onSearch({
        ...formData,
        flights: flights,
      });
    } catch (error) {
      console.error("Error searching flights:", error);
      alert("Error searching flights. Please try again.");
      // Still call onSearch with empty flights array to show the interface
      onSearch({
        ...formData,
        flights: [],
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleDropdownToggle = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleDropdownClose = () => {
    setOpenDropdown(null);
  };

  const getTripTypeLabel = () => {
    const option = tripTypeOptions.find(
      (opt) => opt.value === formData.tripType
    );
    return option ? option.label : "One way";
  };

  const getCabinClassLabel = () => {
    const option = cabinClassOptions.find(
      (opt) => opt.value === formData.cabinClass
    );
    return option ? option.label : "Economy";
  };

  return (
    <div>
      <div
        className="w-full max-w-7xl mx-auto py-6 sm:py-8 lg:py-10 px-3 sm:px-4 lg:px-8 mt-4 sm:mt-6 lg:mt-10 bg-[#36373a] rounded-[8px] "
        style={{
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, .3), 0 4px 8px 3px rgba(0, 0, 0, .15)",
        }}
      >
        <div className="flex flex-col space-y-3 sm:space-y-4">
          {/* Top options bar with dropdowns */}
          <div
            ref={dropdownRef}
            className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 relative"
          >
            {/* Trip Type Dropdown */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-2 text-[#e8eaed] hover:bg-[#303134] rounded-[8px] px-2 sm:px-3 py-2 sm:py-4 text-xs sm:text-sm transition-colors whitespace-nowrap"
                onClick={() => handleDropdownToggle("tripType")}
              >
                <span>{getTripTypeLabel()}</span>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7 10l5 5 5-5H7z" />
                </svg>
              </button>
              <DropdownMenu
                isOpen={openDropdown === "tripType"}
                onClose={handleDropdownClose}
                options={tripTypeOptions}
                value={formData.tripType}
                onChange={(value) => {
                  handleTripTypeChange(value as TripType);
                  handleDropdownClose();
                }}
              />
            </div>

            {/* Passengers Dropdown */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-2 text-[#e8eaed] hover:bg-[#303134] rounded-[8px] px-2 sm:px-3 py-2 sm:py-4 text-xs sm:text-sm transition-colors whitespace-nowrap"
                onClick={() => handleDropdownToggle("passengers")}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <span>{formData.passengers}</span>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7 10l5 5 5-5H7z" />
                </svg>
              </button>
              <DropdownMenu
                isOpen={openDropdown === "passengers"}
                onClose={handleDropdownClose}
                options={[]}
                value={formData.passengers.toString()}
                onChange={(value) => {
                  handlePassengersChange(parseInt(value));
                  handleDropdownClose();
                }}
                type="passengers"
              />
            </div>

            {/* Cabin Class Dropdown */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-2 text-[#e8eaed] hover:bg-[#303134] rounded-[8px] px-2 sm:px-3 py-2 sm:py-4 text-xs sm:text-sm transition-colors whitespace-nowrap"
                onClick={() => handleDropdownToggle("cabinClass")}
              >
                <span>{getCabinClassLabel()}</span>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7 10l5 5 5-5H7z" />
                </svg>
              </button>
              <DropdownMenu
                isOpen={openDropdown === "cabinClass"}
                onClose={handleDropdownClose}
                options={cabinClassOptions}
                value={formData.cabinClass}
                onChange={(value) => {
                  handleCabinClassChange(value as CabinClass);
                  handleDropdownClose();
                }}
              />
            </div>
          </div>

          <form className="relative">
            <div className="overflow-visible relative z-10">
              <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 p-1">
                <div className="flex-[2] w-full">
                  <LocationInputs
                    origin={formData.origin}
                    destination={formData.destination}
                    originSuggestions={originSuggestions}
                    destinationSuggestions={destinationSuggestions}
                    onOriginSearch={(query) => handleAirportSearch(query, true)}
                    onDestinationSearch={(query) =>
                      handleAirportSearch(query, false)
                    }
                    onOriginSelect={(airport) =>
                      handleAirportSelect(airport, true)
                    }
                    onDestinationSelect={(airport) =>
                      handleAirportSelect(airport, false)
                    }
                  />
                </div>

                <div className="flex-1 w-full border rounded-[8px] border-[#5f6368]">
                  <DateSelector
                    departureDate={formData.departureDate}
                    returnDate={formData.returnDate}
                    onDepartureDateChange={(date) => handleDateChange(date)}
                    onReturnDateChange={
                      formData.tripType === "round-trip"
                        ? (date) => handleDateChange(date, true)
                        : undefined
                    }
                    onCalendarOpen={handleDropdownClose}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="flex w-full justify-center -mt-3 sm:-mt-4 lg:-mt-5 z-10 px-3 sm:px-4">
        <button
          onClick={handleSubmit}
          disabled={isSearching}
          className="bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#202124] font-medium px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.3)] text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
        >
          <div className="flex items-center justify-center space-x-2">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <span>{isSearching ? "Searching..." : "Search"}</span>
          </div>
        </button>
      </div>
    </div>
  );
};
