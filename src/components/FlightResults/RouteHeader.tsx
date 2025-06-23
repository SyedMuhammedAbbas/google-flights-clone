import React from "react";
import { SearchParams } from "../../types";

interface Props {
  searchParams: SearchParams;
}

export const RouteHeader: React.FC<Props> = ({ searchParams }) => {
  return (
    <div className="route-header">
      <h2 className="text-xl font-medium">
        {searchParams.origin} → {searchParams.destination}
      </h2>
      <div className="text-sm text-[#9aa0a6]">
        {searchParams.departureDate.toLocaleDateString()}
        {searchParams.returnDate &&
          ` - ${searchParams.returnDate.toLocaleDateString()}`}
      </div>
    </div>
  );
};
