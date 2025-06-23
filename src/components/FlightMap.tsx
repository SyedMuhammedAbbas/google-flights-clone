import React from "react";
import { Airport } from "../types";

interface Props {
  originAirport: Airport;
  destinationAirport: Airport;
}

export const FlightMap: React.FC<Props> = ({
  originAirport,
  destinationAirport,
}) => {
  if (!originAirport || !destinationAirport) {
    return (
      <div className="w-full h-[300px] rounded-2xl bg-[#303134] flex items-center justify-center mb-8">
        <div className="text-[#9aa0a6]">
          Select origin and destination to view route
        </div>
      </div>
    );
  }

  // Simple world map projection (rough approximation)
  const projectToSVG = (lat: number, lng: number) => {
    // Convert lat/lng to SVG coordinates (simplified mercator-like projection)
    const x = ((lng + 180) / 360) * 800; // 800 is SVG width
    const y = ((90 - lat) / 180) * 400; // 400 is SVG height
    return { x, y };
  };

  const origin = projectToSVG(originAirport.lat, originAirport.lng);
  const destination = projectToSVG(
    destinationAirport.lat,
    destinationAirport.lng
  );

  // Calculate distance for display
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const distance = Math.round(
    calculateDistance(
      originAirport.lat,
      originAirport.lng,
      destinationAirport.lat,
      destinationAirport.lng
    )
  );

  return (
    <div className="w-full mb-8">
      <div className="bg-[#303134] rounded-2xl p-6">
        <div className="mb-4">
          <h3 className="text-[#e8eaed] text-lg font-medium mb-2">
            Flight Route
          </h3>
          <p className="text-[#9aa0a6] text-sm">
            {originAirport.city} ({originAirport.code}) →{" "}
            {destinationAirport.city} ({destinationAirport.code})
          </p>
          <p className="text-[#9aa0a6] text-sm">Distance: ~{distance} km</p>
        </div>

        <div className="relative w-full h-[300px] bg-[#1f1f1f] rounded-xl overflow-hidden">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 400"
            className="absolute inset-0"
          >
            {/* World map outline (simplified) */}
            <defs>
              <pattern
                id="grid"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 50 0 L 0 0 0 50"
                  fill="none"
                  stroke="#404040"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>

            <rect width="800" height="400" fill="url(#grid)" />

            {/* Flight path */}
            <line
              x1={origin.x}
              y1={origin.y}
              x2={destination.x}
              y2={destination.y}
              stroke="#8ab4f8"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="animate-pulse"
            />

            {/* Origin marker */}
            <circle
              cx={origin.x}
              cy={origin.y}
              r="8"
              fill="#34a853"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text
              x={origin.x}
              y={origin.y - 15}
              textAnchor="middle"
              fill="#e8eaed"
              fontSize="12"
              fontWeight="bold"
            >
              {originAirport.code}
            </text>

            {/* Destination marker */}
            <circle
              cx={destination.x}
              cy={destination.y}
              r="8"
              fill="#ea4335"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text
              x={destination.x}
              y={destination.y - 15}
              textAnchor="middle"
              fill="#e8eaed"
              fontSize="12"
              fontWeight="bold"
            >
              {destinationAirport.code}
            </text>

            {/* Plane icon along the route */}
            <g
              transform={`translate(${(origin.x + destination.x) / 2}, ${
                (origin.y + destination.y) / 2
              })`}
            >
              <path
                d="M0,-6 L-2,-4 L-6,-4 L-6,-2 L-2,-2 L0,0 L2,-2 L6,-2 L6,-4 L2,-4 Z"
                fill="#8ab4f8"
                transform="rotate(45)"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
