import axios from "axios";
import { SearchParams, Airport, Flight } from "../types";

const api = axios.create({
  baseURL: "https://sky-scrapper.p.rapidapi.com/api/v1",
  headers: {
    "X-RapidAPI-Key": "0d38e68f2fmsh897acf006969a6cp12ffb6jsnff5bb76bfc6e",
    "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
  },
});

// Fallback mock airports in case API fails
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
];

export const searchAirports = async (query: string): Promise<Airport[]> => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const response = await api.get("/flights/searchAirport", {
      params: { query },
    });

    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data.map((airport: any) => ({
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

    // If API response is empty or invalid, fall back to mock filtering
    console.warn("API returned invalid data, falling back to mock airports");
    const lowerQuery = query.toLowerCase();
    return mockAirports.filter(
      (airport) =>
        airport.name.toLowerCase().includes(lowerQuery) ||
        airport.city.toLowerCase().includes(lowerQuery) ||
        airport.code.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error(
      "Error searching airports via API, falling back to mock data:",
      error
    );
    // Fallback to mock data filtering when API fails
    const lowerQuery = query.toLowerCase();
    return mockAirports.filter(
      (airport) =>
        airport.name.toLowerCase().includes(lowerQuery) ||
        airport.city.toLowerCase().includes(lowerQuery) ||
        airport.code.toLowerCase().includes(lowerQuery)
    );
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
