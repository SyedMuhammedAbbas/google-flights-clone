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
    "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
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

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api";

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

export const searchFlights = async (
  params: FlightSearchParams
): Promise<FlightSearchResponse> => {
  try {
    const response = await axios.request({
      method: "GET",
      url: "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights",
      params: {
        ...params,
        adults: params.adults.toString(),
      },
      headers: {
        "x-rapidapi-key": "e7a2a20f25msh991b4b82a689cb0p18bc85jsn6afe0a9e6055",
        "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching flights:", error);
    throw error;
  }
};

// Fetch airline logos separately if needed
export const getAirlineLogo = async (airlineCode: string): Promise<string> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/airlines/${airlineCode}/logo`,
      {
        responseType: "blob",
      }
    );
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("Error fetching airline logo:", error);
    throw error;
  }
};
