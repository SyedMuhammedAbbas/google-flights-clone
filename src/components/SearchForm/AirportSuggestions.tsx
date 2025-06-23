import React, { useEffect, useState } from "react";

interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

interface Props {
  query: string;
  onSelect: (airport: Airport) => void;
}

export const AirportSuggestions: React.FC<Props> = ({ query, onSelect }) => {
  const [suggestions, setSuggestions] = useState<Airport[]>([]);

  // Mock data - replace with actual API call
  const mockAirports: Airport[] = [
    {
      code: "KHI",
      name: "Jinnah International Airport",
      city: "Karachi",
      country: "Pakistan",
    },
    {
      code: "LHE",
      name: "Allama Iqbal International Airport",
      city: "Lahore",
      country: "Pakistan",
    },
    {
      code: "ISB",
      name: "Islamabad International Airport",
      city: "Islamabad",
      country: "Pakistan",
    },
    {
      code: "PEW",
      name: "Bacha Khan International Airport",
      city: "Peshawar",
      country: "Pakistan",
    },
    {
      code: "UET",
      name: "Quetta International Airport",
      city: "Quetta",
      country: "Pakistan",
    },
  ];

  useEffect(() => {
    // Filter airports based on query
    const filtered = mockAirports.filter(
      (airport) =>
        airport.name.toLowerCase().includes(query.toLowerCase()) ||
        airport.city.toLowerCase().includes(query.toLowerCase()) ||
        airport.code.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered);
  }, [query]);

  return (
    <div className="absolute z-50 w-full mt-1 bg-[#303134] border border-[#5f6368] rounded-lg shadow-lg max-h-96 overflow-y-auto">
      {suggestions.map((airport) => (
        <button
          key={airport.code}
          className="w-full px-4 py-3 text-left hover:bg-[#3c4043] transition-colors"
          onClick={() => onSelect(airport)}
        >
          <div className="flex items-center">
            <div className="mr-3">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-[#9aa0a6] fill-current"
              >
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
            </div>
            <div>
              <div className="text-[#e8eaed]">{airport.city}</div>
              <div className="text-sm text-[#9aa0a6]">
                {airport.name} ({airport.code})
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
