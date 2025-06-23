export interface Carrier {
  id: string;
  name: string;
  displayCode: string;
  displayCodeType: string;
  logo: string;
  altId: string;
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  entityId: string;
  displayCode: string;
  lat: number;
  lng: number;
}

export interface Duration {
  hours: number;
  minutes: number;
}

export interface Price {
  amount: number;
  currency: string;
}

export interface FlightSegment {
  id?: string;
  origin: Airport;
  destination: Airport;
  duration: Duration;
  dayChange?: number;
  departureTime: Date;
  arrivalTime: Date;
  flightNumber: string;
  carrier: {
    name: string;
    code: string;
    logo: string;
  };
  departure: {
    airport: Airport;
    time: string;
  };
  arrival: {
    airport: Airport;
    time: string;
  };
}

export interface Agent {
  id: string;
  name: string;
  isCarrier: boolean;
  bookingProposition: string;
  url: string;
  price: number;
  rating?: {
    value: number;
    count: number;
  };
}

export interface PricingOption {
  agents: Agent[];
  isDirectDBookUrl: boolean;
  quoteAge: number;
  totalPrice: number;
}

export interface Flight {
  id: string;
  segments: FlightSegment[];
  totalDuration: Duration;
  price: Price;
  stops: number;
  airline?: string;
  airlineLogo?: string;
  flightNumber?: string;
  origin?: string;
  destination?: string;
  emissions?: {
    amount: number;
    unit: string;
  };
  aircraft?: {
    type: string;
    model: string;
  };
  cabinClass?: CabinClass;
  bookingAgency?: {
    name: string;
    logo: string;
  };
}

export interface SearchParams {
  tripType: TripType;
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengers: number;
  cabinClass: CabinClass;
}

export interface Airline {
  name: string;
  logo: string;
}

export type TripType = "one-way" | "round-trip" | "multi-city";
export type CabinClass = "economy" | "premium_economy" | "business" | "first";

export interface SearchFormData {
  origin: Airport | null;
  destination: Airport | null;
  departureDate: Date | null;
  returnDate: Date | null;
  passengers: number;
  cabinClass: CabinClass;
  tripType: TripType;
  flights?: Flight[];
}

export interface AirportSuggestion {
  code: string;
  name: string;
  entityId: string;
  city: string;
  country: string;
}
