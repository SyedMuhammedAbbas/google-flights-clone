import React, { useState, useEffect } from "react";
import { MdLocationOn, MdSwapHoriz } from "react-icons/md";
import { Icon } from "../shared/Icon";
import { Airport } from "../../types";

interface Props {
  origin: Airport | null;
  destination: Airport | null;
  originSuggestions: Airport[];
  destinationSuggestions: Airport[];
  onOriginSearch: (query: string) => void;
  onDestinationSearch: (query: string) => void;
  onOriginSelect: (airport: Airport) => void;
  onDestinationSelect: (airport: Airport) => void;
}

export const LocationInputs: React.FC<Props> = ({
  origin,
  destination,
  originSuggestions,
  destinationSuggestions,
  onOriginSearch,
  onDestinationSearch,
  onOriginSelect,
  onDestinationSelect,
}) => {
  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [isFocused, setIsFocused] = useState<"origin" | "destination" | null>(
    null
  );

  useEffect(() => {
    if (!isFocused) {
      setOriginInput(formatAirportDisplay(origin));
      setDestinationInput(formatAirportDisplay(destination));
    }
  }, [origin, destination, isFocused]);

  const formatAirportDisplay = (airport: Airport | null) => {
    return airport?.code ? `${airport.city} ${airport.code}` : "";
  };

  const handleOriginFocus = () => {
    setIsFocused("origin");
    setOriginInput("");
  };

  const handleDestinationFocus = () => {
    setIsFocused("destination");
    setDestinationInput("");
  };

  const handleOriginBlur = () => {
    setTimeout(() => {
      if (isFocused === "origin") {
        setIsFocused(null);
        setOriginInput(formatAirportDisplay(origin));
      }
    }, 200); // Delay to allow clicking on suggestions
  };

  const handleDestinationBlur = () => {
    setTimeout(() => {
      if (isFocused === "destination") {
        setIsFocused(null);
        setDestinationInput(formatAirportDisplay(destination));
      }
    }, 200); // Delay to allow clicking on suggestions
  };

  return (
    <div className="flex-1 flex items-stretch">
      <div className="relative flex-1 group">
        <div className="relative flex items-center h-full">
          <div className="absolute left-4">
            <Icon icon={MdLocationOn} className="text-[#9aa0a6] text-xl" />
          </div>
          <input
            type="text"
            placeholder="Where from?"
            value={originInput}
            onChange={(e) => {
              setOriginInput(e.target.value);
              onOriginSearch(e.target.value);
            }}
            onFocus={handleOriginFocus}
            onBlur={handleOriginBlur}
            className="w-full h-full bg-transparent text-[#e8eaed] pl-12 pr-4 py-3 outline-none text-base placeholder:text-[#9aa0a6] hover:bg-[#303134] focus:bg-[#303134] transition-colors rounded-[8px] border border-[#5f6368] focus:border-white"
          />
        </div>
        {originSuggestions.length > 0 && isFocused === "origin" && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#303134] rounded-[8px] shadow-[0_1px_3px_0_rgba(0,0,0,0.3),0_4px_8px_3px_rgba(0,0,0,0.15)] z-30 overflow-hidden max-h-80 overflow-y-auto">
            {originSuggestions.map((airport) => (
              <div
                key={airport.code}
                className="px-4 py-3 hover:bg-[#3c4043] cursor-pointer transition-colors border-b border-[#5f6368] last:border-b-0"
                onClick={() => {
                  onOriginSelect(airport);
                  setIsFocused(null);
                }}
              >
                <div className="flex items-center">
                  <Icon
                    icon={MdLocationOn}
                    className="text-[#9aa0a6] text-xl mr-3"
                  />
                  <div>
                    <div className="text-[#e8eaed] text-[15px] font-medium">
                      {airport.city}
                    </div>
                    <div className="text-[13px] text-[#9aa0a6]">
                      {airport.name} ({airport.code})
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        className="p-2 mx-2 rounded-full hover:bg-[#303134] transition-colors self-center"
        onClick={() => {
          if (origin && destination) {
            const temp = origin;
            onOriginSelect(destination);
            onDestinationSelect(temp);
          }
        }}
      >
        <Icon icon={MdSwapHoriz} className="text-[#9aa0a6] text-xl" />
      </button>

      <div className="relative flex-1 group">
        <div className="relative flex items-center h-full">
          <div className="absolute left-4">
            <Icon icon={MdLocationOn} className="text-[#9aa0a6] text-xl" />
          </div>
          <input
            type="text"
            placeholder="Where to?"
            value={destinationInput}
            onChange={(e) => {
              setDestinationInput(e.target.value);
              onDestinationSearch(e.target.value);
            }}
            onFocus={handleDestinationFocus}
            onBlur={handleDestinationBlur}
            className="w-full h-full bg-transparent text-[#e8eaed] pl-12 pr-4 py-3 outline-none text-base placeholder:text-[#9aa0a6] hover:bg-[#303134] focus:bg-[#303134] transition-colors rounded-[8px] border border-[#5f6368] focus:border-white"
          />
        </div>
        {destinationSuggestions.length > 0 && isFocused === "destination" && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#303134] rounded-[8px] shadow-[0_1px_3px_0_rgba(0,0,0,0.3),0_4px_8px_3px_rgba(0,0,0,0.15)] z-30 overflow-hidden max-h-80 overflow-y-auto">
            {destinationSuggestions.map((airport) => (
              <div
                key={airport.code}
                className="px-4 py-3 hover:bg-[#3c4043] cursor-pointer transition-colors border-b border-[#5f6368] last:border-b-0"
                onClick={() => {
                  onDestinationSelect(airport);
                  setIsFocused(null);
                }}
              >
                <div className="flex items-center">
                  <Icon
                    icon={MdLocationOn}
                    className="text-[#9aa0a6] text-xl mr-3"
                  />
                  <div>
                    <div className="text-[#e8eaed] text-[15px] font-medium">
                      {airport.city}
                    </div>
                    <div className="text-[13px] text-[#9aa0a6]">
                      {airport.name} ({airport.code})
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
