import React from "react";
import { SearchParams } from "../../types";

interface Props {
  searchParams: SearchParams;
}

export const SearchSummaryBar: React.FC<Props> = ({ searchParams }) => {
  return (
    <div className="search-summary-bar">
      <div className="text-sm text-[#9aa0a6]">
        {searchParams.passengers} passenger
        {searchParams.passengers > 1 ? "s" : ""} • {searchParams.cabinClass}
      </div>
    </div>
  );
};
