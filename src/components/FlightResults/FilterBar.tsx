import React from "react";
import {
  MdTune,
  MdKeyboardArrowDown,
  MdInfoOutline,
  MdSwapVert,
} from "react-icons/md";
import { Icon } from "../shared/Icon";

interface Props {
  sortBy: "best" | "cheapest";
  setSortBy: (sortBy: "best" | "cheapest") => void;
  cheapestPrice: number;
}

interface FilterOption {
  label: string;
  value: string;
  showArrow?: boolean;
}

const filterOptions: FilterOption[] = [
  { label: "Stops", value: "stops", showArrow: true },
  { label: "Airlines", value: "airlines", showArrow: true },
  { label: "Bags", value: "bags", showArrow: true },
  { label: "Price", value: "price", showArrow: true },
  { label: "Times", value: "times", showArrow: true },
  { label: "Emissions", value: "emissions", showArrow: true },
  {
    label: "Connecting airports",
    value: "connecting-airports",
    showArrow: true,
  },
  { label: "Duration", value: "duration", showArrow: true },
];

export const FilterBar: React.FC<Props> = ({
  sortBy,
  setSortBy,
  cheapestPrice,
}) => {
  return (
    <div>
      {/* Top Filter Bar */}
      <div className="flex items-center gap-2 mb-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-[#303134] rounded-full text-[#8ab4f8] hover:bg-[#3c4043] transition-colors">
          <Icon icon={MdTune} className="text-xl" />
          <span className="text-sm font-medium">All filters</span>
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              className="flex items-center gap-1 px-4 py-2 bg-[#303134] rounded-full text-[#e8eaed] hover:bg-[#3c4043] transition-colors text-sm font-medium"
            >
              <span>{option.label}</span>
              {option.showArrow && (
                <Icon
                  icon={MdKeyboardArrowDown}
                  className="text-lg opacity-70"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Best/Cheapest Toggle */}
      <div className="flex rounded-xl overflow-hidden mb-6 outline outline-1 outline-[#8ab4f8]">
        <button
          className={`flex-1 py-4 px-6 text-left relative ${
            sortBy === "best"
              ? "bg-[#394457] text-[#e8eaed]"
              : "bg-[#202124] text-[#9aa0a6]"
          }`}
          onClick={() => setSortBy("best")}
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">Best</span>
            <Icon icon={MdInfoOutline} className="text-[#9aa0a6] text-lg" />
          </div>
          {sortBy === "best" && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8ab4f8]"></div>
          )}
        </button>
        <button
          className={`flex-1 py-4 px-6 text-left relative ${
            sortBy === "cheapest"
              ? "bg-[#394457] text-[#e8eaed]"
              : "bg-[#202124] text-[#9aa0a6]"
          }`}
          onClick={() => setSortBy("cheapest")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">Cheapest</span>
              <Icon icon={MdInfoOutline} className="text-lg" />
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-[#9aa0a6]">from</span>
              <span className="text-[#34a853] font-medium">
                PKR {cheapestPrice.toLocaleString()}
              </span>
              <Icon icon={MdInfoOutline} className="text-[#9aa0a6] text-base" />
            </div>
          </div>
          {sortBy === "cheapest" && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8ab4f8]"></div>
          )}
        </button>
      </div>

      {/* Description Text */}
      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex items-center gap-1 text-[#8ab4f8]">
          <span className="font-medium">Top flights</span>
          <Icon icon={MdInfoOutline} className="text-lg" />
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="text-[#9aa0a6]">
            Ranked based on price and convenience
          </span>
          <Icon icon={MdInfoOutline} className="text-[#9aa0a6] text-lg" />
          <span className="text-[#9aa0a6] mx-2">•</span>
          <span className="text-[#9aa0a6]">
            Prices include required taxes + fees for 1 adult. Optional charges
            and{" "}
            <button className="text-[#8ab4f8] hover:underline font-medium">
              bag fees
            </button>{" "}
            may apply.
          </span>
          <span className="text-[#9aa0a6] mx-2">•</span>
          <button className="text-[#8ab4f8] hover:underline font-medium">
            Passenger assistance
          </button>
          <span className="text-[#9aa0a6]">info</span>
          <div className="border-l border-[#3c4043] ml-4 pl-4">
            <button className="flex items-center gap-1 text-[#8ab4f8]">
              <span className="font-medium">Sorted by top flights</span>
              <Icon icon={MdSwapVert} className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
