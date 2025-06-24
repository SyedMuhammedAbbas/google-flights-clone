import React, { useState, useEffect, useRef, useCallback } from "react";
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

  // Debounce timers
  const originTimerRef = useRef<NodeJS.Timeout>();
  const destinationTimerRef = useRef<NodeJS.Timeout>();

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

  // Debounced search functions
  const debouncedOriginSearch = useCallback(
    (value: string) => {
      if (originTimerRef.current) {
        clearTimeout(originTimerRef.current);
      }

      originTimerRef.current = setTimeout(() => {
        onOriginSearch(value);
      }, 500); // Increased delay to reduce API calls
    },
    [onOriginSearch]
  );

  const debouncedDestinationSearch = useCallback(
    (value: string) => {
      if (destinationTimerRef.current) {
        clearTimeout(destinationTimerRef.current);
      }

      destinationTimerRef.current = setTimeout(() => {
        onDestinationSearch(value);
      }, 500); // Increased delay to reduce API calls
    },
    [onDestinationSearch]
  );

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (originTimerRef.current) clearTimeout(originTimerRef.current);
      if (destinationTimerRef.current)
        clearTimeout(destinationTimerRef.current);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0">
      <div className="relative flex-1 group">
        <div className="relative flex items-center h-[48px]">
          <div className="absolute left-3 sm:left-4">
            <Icon
              icon={MdLocationOn}
              className="text-[#9aa0a6] text-lg sm:text-xl"
            />
          </div>
          <input
            type="text"
            placeholder="Where from?"
            value={originInput}
            onChange={(e) => {
              setOriginInput(e.target.value);
              debouncedOriginSearch(e.target.value);
            }}
            onFocus={handleOriginFocus}
            onBlur={handleOriginBlur}
            className="w-full h-[48px] bg-transparent text-[#e8eaed] pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 outline-none text-sm sm:text-base placeholder:text-[#9aa0a6] hover:bg-[#303134] focus:bg-[#303134] transition-colors rounded-[8px] border border-[#5f6368] focus:border-white min-h-[48px]"
          />
        </div>
        {originSuggestions.length > 0 && isFocused === "origin" && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#303134] rounded-[8px] shadow-[0_1px_3px_0_rgba(0,0,0,0.3),0_4px_8px_3px_rgba(0,0,0,0.15)] overflow-hidden max-h-80 overflow-y-auto z-50">
            {originSuggestions.map((airport) => (
              <div
                key={airport.code}
                className="px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-[#3c4043] cursor-pointer transition-colors border-b border-[#5f6368] last:border-b-0"
                onClick={() => {
                  onOriginSelect(airport);
                  setIsFocused(null);
                }}
              >
                <div className="flex items-center">
                  <Icon
                    icon={MdLocationOn}
                    className="text-[#9aa0a6] text-lg sm:text-xl mr-2 sm:mr-3"
                  />
                  <div>
                    <div className="text-[#e8eaed] text-sm sm:text-[15px] font-medium">
                      {airport.city}
                    </div>
                    <div className="text-xs sm:text-[13px] text-[#9aa0a6]">
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
        className="p-1.5 sm:p-2 mx-1 sm:mx-2 rounded-full hover:bg-[#303134] transition-colors self-center order-first sm:order-none"
        onClick={() => {
          if (origin && destination) {
            const temp = origin;
            onOriginSelect(destination);
            onDestinationSelect(temp);
          }
        }}
      >
        <Icon
          icon={MdSwapHoriz}
          className="text-[#9aa0a6] text-lg sm:text-xl"
        />
      </button>

      <div className="relative flex-1 group">
        <div className="relative flex items-center h-[48px]">
          <div className="absolute left-3 sm:left-4">
            <Icon
              icon={MdLocationOn}
              className="text-[#9aa0a6] text-lg sm:text-xl"
            />
          </div>
          <input
            type="text"
            placeholder="Where to?"
            value={destinationInput}
            onChange={(e) => {
              setDestinationInput(e.target.value);
              debouncedDestinationSearch(e.target.value);
            }}
            onFocus={handleDestinationFocus}
            onBlur={handleDestinationBlur}
            className="w-full h-[48px] bg-transparent text-[#e8eaed] pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 outline-none text-sm sm:text-base placeholder:text-[#9aa0a6] hover:bg-[#303134] focus:bg-[#303134] transition-colors rounded-[8px] border border-[#5f6368] focus:border-white min-h-[48px]"
          />
        </div>
        {destinationSuggestions.length > 0 && isFocused === "destination" && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#303134] rounded-[8px] shadow-[0_1px_3px_0_rgba(0,0,0,0.3),0_4px_8px_3px_rgba(0,0,0,0.15)] z-50 overflow-hidden max-h-80 overflow-y-auto">
            {destinationSuggestions.map((airport) => (
              <div
                key={airport.code}
                className="px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-[#3c4043] cursor-pointer transition-colors border-b border-[#5f6368] last:border-b-0"
                onClick={() => {
                  onDestinationSelect(airport);
                  setIsFocused(null);
                }}
              >
                <div className="flex items-center">
                  <Icon
                    icon={MdLocationOn}
                    className="text-[#9aa0a6] text-lg sm:text-xl mr-2 sm:mr-3"
                  />
                  <div>
                    <div className="text-[#e8eaed] text-sm sm:text-[15px] font-medium">
                      {airport.city}
                    </div>
                    <div className="text-xs sm:text-[13px] text-[#9aa0a6]">
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
