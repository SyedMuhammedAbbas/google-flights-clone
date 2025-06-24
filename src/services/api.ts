import axios from "axios";
import { SearchParams, Airport, Flight } from "../types";

// ===== API CONFIGURATION =====
// Set to false to use only mock data (no API calls)
const ENABLE_API_CALLS = true;

// Set to true to prefer mock data over API when available
const PREFER_MOCK_DATA = true;

// Minimum characters before making API calls (higher = fewer calls)
const MIN_SEARCH_LENGTH = 3;

// Cache duration for airport searches (10 minutes)
const CACHE_DURATION = 10 * 60 * 1000;

// Function to update API key easily
export const updateApiKey = (newApiKey: string) => {
  api.defaults.headers["X-RapidAPI-Key"] = newApiKey;
};

const api = axios.create({
  baseURL: "https://sky-scrapper.p.rapidapi.com/api/v1",
  headers: {
    "X-RapidAPI-Key": "d3a9d9beb0msh79d63d3807f93bdp10e4bdjsn5d510508ce39",
    "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
  },
});

// Enhanced mock airports for better fallback coverage
const mockAirports: Airport[] = [
  {
    code: "KHI",
    name: "Jinnah International Airport",
    city: "Karachi",
    country: "Pakistan",
    displayCode: "KHI",
    entityId: "KHI",
    lat: 24.9008,
    lng: 67.1681,
  },
  {
    code: "LHE",
    name: "Allama Iqbal International Airport",
    city: "Lahore",
    country: "Pakistan",
    displayCode: "LHE",
    entityId: "LHE",
    lat: 31.5216,
    lng: 74.4036,
  },
  {
    code: "ISB",
    name: "Islamabad International Airport",
    city: "Islamabad",
    country: "Pakistan",
    displayCode: "ISB",
    entityId: "ISB",
    lat: 33.6162,
    lng: 73.0996,
  },
  {
    code: "DXB",
    name: "Dubai International Airport",
    city: "Dubai",
    country: "United Arab Emirates",
    displayCode: "DXB",
    entityId: "DXB",
    lat: 25.2532,
    lng: 55.3657,
  },
  {
    code: "LHR",
    name: "London Heathrow Airport",
    city: "London",
    country: "United Kingdom",
    displayCode: "LHR",
    entityId: "LHR",
    lat: 51.47,
    lng: -0.4543,
  },
  {
    code: "CDG",
    name: "Charles de Gaulle Airport",
    city: "Paris",
    country: "France",
    displayCode: "CDG",
    entityId: "CDG",
    lat: 49.0097,
    lng: 2.5479,
  },
  {
    code: "SIN",
    name: "Singapore Changi Airport",
    city: "Singapore",
    country: "Singapore",
    displayCode: "SIN",
    entityId: "SIN",
    lat: 1.3644,
    lng: 103.9915,
  },
  {
    code: "JFK",
    name: "John F. Kennedy International Airport",
    city: "New York",
    country: "United States",
    displayCode: "JFK",
    entityId: "JFK",
    lat: 40.6413,
    lng: -73.7781,
  },
  {
    code: "LAX",
    name: "Los Angeles International Airport",
    city: "Los Angeles",
    country: "United States",
    displayCode: "LAX",
    entityId: "LAX",
    lat: 33.9425,
    lng: -118.4081,
  },
  {
    code: "ORD",
    name: "O'Hare International Airport",
    city: "Chicago",
    country: "United States",
    displayCode: "ORD",
    entityId: "ORD",
    lat: 41.9742,
    lng: -87.9073,
  },
  {
    code: "NRT",
    name: "Narita International Airport",
    city: "Tokyo",
    country: "Japan",
    displayCode: "NRT",
    entityId: "NRT",
    lat: 35.7763,
    lng: 140.387,
  },
  {
    code: "ICN",
    name: "Incheon International Airport",
    city: "Seoul",
    country: "South Korea",
    displayCode: "ICN",
    entityId: "ICN",
    lat: 37.4602,
    lng: 126.4407,
  },
];

// In-memory cache to reduce API calls
const airportSearchCache = new Map<
  string,
  { data: Airport[]; timestamp: number }
>();

export const searchAirports = async (query: string): Promise<Airport[]> => {
  if (!query || query.length < MIN_SEARCH_LENGTH) {
    return [];
  }

  // Check cache first
  const cacheKey = query.toLowerCase();
  const cached = airportSearchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("Returning cached airport results for:", query);
    return cached.data;
  }

  // Filter mock data first - if we get good results, use them instead of API
  const lowerQuery = query.toLowerCase();
  const mockResults = mockAirports.filter(
    (airport) =>
      airport.name.toLowerCase().includes(lowerQuery) ||
      airport.city.toLowerCase().includes(lowerQuery) ||
      airport.code.toLowerCase().includes(lowerQuery)
  );

  // If we have good mock results or prefer mock data, use them instead of making API call
  if (mockResults.length >= 3 || PREFER_MOCK_DATA) {
    console.log("Using mock data for airport search:", query);
    // Cache the mock results
    airportSearchCache.set(cacheKey, {
      data: mockResults,
      timestamp: Date.now(),
    });
    return mockResults;
  }

  // Only make API call if we don't have good mock results and not preferring mock data
  try {
    console.log("Making API call for airport search:", query);
    const response = await api.get("/flights/searchAirport", {
      params: { query },
    });

    let apiResults: Airport[] = [];
    if (response.data?.data && Array.isArray(response.data.data)) {
      apiResults = response.data.data.map((airport: any) => ({
        code: airport.skyId || airport.iata || airport.code,
        name: airport.presentation?.title || airport.name,
        city: airport.presentation?.subtitle || airport.city,
        country: airport.navigation?.entityType || airport.country || "Unknown",
        displayCode: airport.skyId || airport.iata || airport.code,
        entityId:
          airport.navigation?.relevantFlightParams?.entityId ||
          airport.skyId ||
          airport.code,
        lat: airport.coordinates?.lat || 0,
        lng: airport.coordinates?.lng || 0,
      }));
    }

    // Combine API results with mock results and cache
    const combinedResults = [...apiResults, ...mockResults];
    airportSearchCache.set(cacheKey, {
      data: combinedResults,
      timestamp: Date.now(),
    });
    return combinedResults;
  } catch (error) {
    console.error("Error searching airports via API, using mock data:", error);
    // Cache mock results even on API failure
    airportSearchCache.set(cacheKey, {
      data: mockResults,
      timestamp: Date.now(),
    });
    return mockResults;
  }
};

export const searchNearbyAirports = async (
  lat: number,
  lng: number
): Promise<Airport[]> => {
  try {
    const response = await api.get("/flights/getNearByAirports", {
      params: { lat, lng },
    });

    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data.map((airport: any) => ({
        code: airport.skyId || airport.iata || airport.code,
        name: airport.navigation?.localizedName || airport.name,
        city: airport.presentation?.title || airport.city,
        country: airport.navigation?.entityType || airport.country || "Unknown",
        displayCode: airport.skyId || airport.iata || airport.code,
        entityId:
          airport.navigation?.relevantFlightParams?.entityId ||
          airport.skyId ||
          airport.code,
        lat: airport.coordinates?.lat || 0,
        lng: airport.coordinates?.lng || 0,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error searching nearby airports:", error);
    return [];
  }
};

export interface FlightSearchParams {
  originSkyId: string;
  destinationSkyId: string;
  originEntityId: string;
  destinationEntityId: string;
  date: string;
  cabinClass: "economy" | "premium_economy" | "business" | "first";
  adults: number;
  sortBy: "best" | "cheapest";
  currency?: string;
  market?: string;
  countryCode?: string;
}

export interface FlightSearchResponse {
  data: {
    flights: Array<{
      id: string;
      price: {
        amount: number;
        currency: string;
      };
      segments: Array<{
        departure: {
          airport: {
            code: string;
            name: string;
          };
          time: string;
        };
        arrival: {
          airport: {
            code: string;
            name: string;
          };
          time: string;
        };
        duration: {
          hours: number;
          minutes: number;
        };
        carrier: {
          name: string;
          code: string;
          logo: string;
        };
        flightNumber: string;
        aircraft: {
          model: string;
        };
      }>;
      totalDuration: {
        hours: number;
        minutes: number;
      };
      emissions: {
        amount: number;
        unit: string;
      };
    }>;
  };
}

// Mock flight data for development and fallback
const generateMockFlights = (
  originCode: string,
  destinationCode: string,
  date: string
): FlightSearchResponse => {
  const airlines = [
    {
      name: "Emirates",
      code: "EK",
      logo: "https://logos-world.net/wp-content/uploads/2020/03/Emirates-Logo.png",
    },
    {
      name: "Qatar Airways",
      code: "QR",
      logo: "https://logos-world.net/wp-content/uploads/2020/03/Qatar-Airways-Logo.png",
    },
    {
      name: "Singapore Airlines",
      code: "SQ",
      logo: "https://logos-world.net/wp-content/uploads/2020/03/Singapore-Airlines-Logo.png",
    },
    {
      name: "British Airways",
      code: "BA",
      logo: "https://logos-world.net/wp-content/uploads/2020/03/British-Airways-Logo.png",
    },
    {
      name: "Lufthansa",
      code: "LH",
      logo: "https://logos-world.net/wp-content/uploads/2020/03/Lufthansa-Logo.png",
    },
    {
      name: "Turkish Airlines",
      code: "TK",
      logo: "https://logos-world.net/wp-content/uploads/2020/03/Turkish-Airlines-Logo.png",
    },
    {
      name: "Air France",
      code: "AF",
      logo: "https://logos-world.net/wp-content/uploads/2020/03/Air-France-Logo.png",
    },
    {
      name: "KLM",
      code: "KL",
      logo: "https://logos-world.net/wp-content/uploads/2020/03/KLM-Logo.png",
    },
  ];

  const aircraft = [
    "Boeing 777-300ER",
    "Airbus A380-800",
    "Boeing 787-9",
    "Airbus A350-900",
    "Boeing 777-200LR",
    "Airbus A330-300",
    "Boeing 767-300ER",
    "Airbus A321neo",
  ];

  const getRandomAirport = (code: string) => {
    const airportMap: { [key: string]: { name: string; city: string } } = {
      KHI: { name: "Jinnah International Airport", city: "Karachi" },
      LHE: { name: "Allama Iqbal International Airport", city: "Lahore" },
      ISB: { name: "Islamabad International Airport", city: "Islamabad" },
      DXB: { name: "Dubai International Airport", city: "Dubai" },
      LHR: { name: "London Heathrow Airport", city: "London" },
      CDG: { name: "Charles de Gaulle Airport", city: "Paris" },
      SIN: { name: "Singapore Changi Airport", city: "Singapore" },
      JFK: { name: "John F. Kennedy International Airport", city: "New York" },
      LAX: { name: "Los Angeles International Airport", city: "Los Angeles" },
      ORD: { name: "O'Hare International Airport", city: "Chicago" },
      NRT: { name: "Narita International Airport", city: "Tokyo" },
      ICN: { name: "Incheon International Airport", city: "Seoul" },
    };
    return airportMap[code] || { name: `${code} Airport`, city: "Unknown" };
  };

  const originAirport = getRandomAirport(originCode);
  const destinationAirport = getRandomAirport(destinationCode);

  const flights = Array.from({ length: 8 }, (_, index) => {
    const airline = airlines[index % airlines.length];
    const basePrice = 300 + Math.random() * 1200;
    const hours = 2 + Math.random() * 12;
    const minutes = Math.floor(Math.random() * 60);

    // Create departure time
    const departureDate = new Date(date);
    departureDate.setHours(
      6 + Math.floor(Math.random() * 16),
      Math.floor(Math.random() * 60)
    );

    // Create arrival time
    const arrivalDate = new Date(departureDate);
    arrivalDate.setHours(arrivalDate.getHours() + Math.floor(hours));
    arrivalDate.setMinutes(arrivalDate.getMinutes() + minutes);

    const isDirectFlight = Math.random() > 0.3; // 70% chance of direct flight
    const segments = isDirectFlight
      ? [
          {
            departure: {
              airport: {
                code: originCode,
                name: originAirport.name,
              },
              time: departureDate.toISOString(),
            },
            arrival: {
              airport: {
                code: destinationCode,
                name: destinationAirport.name,
              },
              time: arrivalDate.toISOString(),
            },
            duration: {
              hours: Math.floor(hours),
              minutes: minutes,
            },
            carrier: airline,
            flightNumber: `${airline.code}${Math.floor(
              100 + Math.random() * 900
            )}`,
            aircraft: {
              model: aircraft[Math.floor(Math.random() * aircraft.length)],
            },
          },
        ]
      : [
          // First segment
          {
            departure: {
              airport: {
                code: originCode,
                name: originAirport.name,
              },
              time: departureDate.toISOString(),
            },
            arrival: {
              airport: {
                code: "DXB", // Dubai as common stopover
                name: "Dubai International Airport",
              },
              time: new Date(
                departureDate.getTime() + hours * 0.6 * 60 * 60 * 1000
              ).toISOString(),
            },
            duration: {
              hours: Math.floor(hours * 0.6),
              minutes: Math.floor(minutes * 0.6),
            },
            carrier: airline,
            flightNumber: `${airline.code}${Math.floor(
              100 + Math.random() * 900
            )}`,
            aircraft: {
              model: aircraft[Math.floor(Math.random() * aircraft.length)],
            },
          },
          // Second segment (after layover)
          {
            departure: {
              airport: {
                code: "DXB",
                name: "Dubai International Airport",
              },
              time: new Date(
                departureDate.getTime() + (hours * 0.6 + 1.5) * 60 * 60 * 1000
              ).toISOString(), // 1.5 hour layover
            },
            arrival: {
              airport: {
                code: destinationCode,
                name: destinationAirport.name,
              },
              time: arrivalDate.toISOString(),
            },
            duration: {
              hours: Math.floor(hours * 0.4),
              minutes: Math.floor(minutes * 0.4),
            },
            carrier: airline,
            flightNumber: `${airline.code}${Math.floor(
              100 + Math.random() * 900
            )}`,
            aircraft: {
              model: aircraft[Math.floor(Math.random() * aircraft.length)],
            },
          },
        ];

    return {
      id: `flight_${index}_${Date.now()}`,
      price: {
        amount: Math.round(basePrice),
        currency: "USD",
      },
      segments,
      totalDuration: {
        hours: Math.floor(hours),
        minutes: minutes,
      },
      emissions: {
        amount: Math.round(180 + Math.random() * 120), // CO2 kg
        unit: "kg",
      },
      stops: segments.length - 1,
      aircraft: {
        type: "Commercial",
        model: aircraft[Math.floor(Math.random() * aircraft.length)],
      },
      cabinClass: "economy" as const,
      bookingAgency: {
        name: "Expedia",
        logo: "https://via.placeholder.com/20x20?text=E",
      },
    };
  });

  return {
    data: {
      flights: flights.sort((a, b) => a.price.amount - b.price.amount), // Sort by price
    },
  };
};

export const searchFlights = async (
  params: FlightSearchParams
): Promise<FlightSearchResponse> => {
  // If API is disabled or mock data is preferred, return mock data immediately
  if (!ENABLE_API_CALLS || PREFER_MOCK_DATA) {
    console.log(
      "🛩️ Using mock flight data for:",
      params.originSkyId,
      "->",
      params.destinationSkyId
    );
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay
    return generateMockFlights(
      params.originSkyId,
      params.destinationSkyId,
      params.date
    );
  }

  try {
    console.log("🌐 Making API call for flight search");
    const response = await api.get("/flights/searchFlights", {
      params: {
        ...params,
        adults: params.adults.toString(),
      },
    });

    // If API response is valid, return it
    if (response.data?.data?.flights) {
      console.log("✅ API flight search successful");
      return response.data;
    } else {
      console.log("⚠️ API returned invalid data, falling back to mock data");
      return generateMockFlights(
        params.originSkyId,
        params.destinationSkyId,
        params.date
      );
    }
  } catch (error) {
    console.error(
      "❌ Error searching flights via API, using mock data:",
      error
    );
    // Return mock data on API failure
    return generateMockFlights(
      params.originSkyId,
      params.destinationSkyId,
      params.date
    );
  }
};

// Fetch airline logos separately if needed
export const getAirlineLogo = async (airlineCode: string): Promise<string> => {
  try {
    const response = await api.get(`/airlines/${airlineCode}/logo`, {
      responseType: "blob",
    });
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("Error fetching airline logo:", error);
    // Return a fallback placeholder image URL
    return `https://via.placeholder.com/40x40?text=${airlineCode}`;
  }
};
