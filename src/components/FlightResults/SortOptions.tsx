import React from "react";

interface Props {
  sortBy: "best" | "cheapest";
  setSortBy: (sortBy: "best" | "cheapest") => void;
  cheapestPrice: number;
}

// This component is now empty since its functionality has been moved to FilterBar
export const SortOptions: React.FC<Props> = () => {
  return null;
};
