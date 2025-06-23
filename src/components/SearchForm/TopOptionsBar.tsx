import React, { useState } from "react";
import { DropdownMenu } from "./DropdownMenu";
import { TripType, CabinClass } from "../../types";

interface Props {
  tripType: TripType;
  onTripTypeChange: (type: TripType) => void;
  passengers: number;
  onPassengersChange: (count: number) => void;
  cabinClass: CabinClass;
  onCabinClassChange: (cabinClass: CabinClass) => void;
}

export const TopOptionsBar: React.FC<Props> = ({
  tripType,
  onTripTypeChange,
  passengers,
  onPassengersChange,
  cabinClass,
  onCabinClassChange,
}) => {
  const [activeTripTypeDropdown, setActiveTripTypeDropdown] = useState(false);
  const [activePassengersDropdown, setActivePassengersDropdown] =
    useState(false);
  const [activeCabinClassDropdown, setActiveCabinClassDropdown] =
    useState(false);

  const tripTypeOptions = [
    { label: "Round trip", value: "round-trip" },
    { label: "One way", value: "one-way" },
    { label: "Multi-city", value: "multi-city" },
  ];

  const cabinClassOptions = [
    { label: "Economy", value: "economy" },
    { label: "Premium economy", value: "premium-economy" },
    { label: "Business", value: "business" },
    { label: "First", value: "first" },
  ];

  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <button
          type="button"
          onClick={() => setActiveTripTypeDropdown(!activeTripTypeDropdown)}
          className="flex items-center space-x-2 text-[#e8eaed] hover:bg-[#303134] rounded-full px-3 py-1.5"
        >
          <span>
            {tripTypeOptions.find((opt) => opt.value === tripType)?.label}
          </span>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5H7z" />
          </svg>
        </button>
        <DropdownMenu
          isOpen={activeTripTypeDropdown}
          onClose={() => setActiveTripTypeDropdown(false)}
          options={tripTypeOptions}
          value={tripType}
          onChange={(value) => onTripTypeChange(value as TripType)}
        />
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setActivePassengersDropdown(!activePassengersDropdown)}
          className="flex items-center space-x-2 text-[#e8eaed] hover:bg-[#303134] rounded-full px-3 py-1.5"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <span>{passengers}</span>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5H7z" />
          </svg>
        </button>
        <DropdownMenu
          isOpen={activePassengersDropdown}
          onClose={() => setActivePassengersDropdown(false)}
          options={[]}
          value={passengers.toString()}
          onChange={(value) => onPassengersChange(parseInt(value))}
          type="passengers"
        />
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setActiveCabinClassDropdown(!activeCabinClassDropdown)}
          className="flex items-center space-x-2 text-[#e8eaed] hover:bg-[#303134] rounded-full px-3 py-1.5"
        >
          <span>
            {cabinClassOptions.find((opt) => opt.value === cabinClass)?.label}
          </span>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5H7z" />
          </svg>
        </button>
        <DropdownMenu
          isOpen={activeCabinClassDropdown}
          onClose={() => setActiveCabinClassDropdown(false)}
          options={cabinClassOptions}
          value={cabinClass}
          onChange={(value) => onCabinClassChange(value as CabinClass)}
        />
      </div>
    </div>
  );
};
