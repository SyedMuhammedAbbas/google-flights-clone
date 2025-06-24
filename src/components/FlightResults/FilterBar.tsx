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
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#303134] rounded-full text-[#8ab4f8] hover:bg-[#3c4043] transition-colors flex-shrink-0">
          <Icon icon={MdTune} className="text-lg sm:text-xl" />
          <span className="text-xs sm:text-sm font-medium">All filters</span>
        </button>

        {/* Horizontal scrolling filter options */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1">
          <div className="flex items-center gap-2 flex-nowrap">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-[#303134] rounded-full text-[#e8eaed] hover:bg-[#3c4043] transition-colors text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0"
              >
                <span>{option.label}</span>
                {option.showArrow && (
                  <Icon
                    icon={MdKeyboardArrowDown}
                    className="text-base sm:text-lg opacity-70"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Best/Cheapest Toggle */}
      <div className="flex rounded-xl overflow-hidden mb-4 sm:mb-6 outline outline-1 outline-[#8ab4f8]">
        <button
          className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-left relative ${
            sortBy === "best"
              ? "bg-[#394457] text-[#e8eaed]"
              : "bg-[#202124] text-[#9aa0a6]"
          }`}
          onClick={() => setSortBy("best")}
        >
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm sm:text-base">Best</span>
            <Icon
              icon={MdInfoOutline}
              className="text-[#9aa0a6] text-base sm:text-lg"
            />
          </div>
          {sortBy === "best" && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8ab4f8]"></div>
          )}
        </button>
        <button
          className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-left relative ${
            sortBy === "cheapest"
              ? "bg-[#394457] text-[#e8eaed]"
              : "bg-[#202124] text-[#9aa0a6]"
          }`}
          onClick={() => setSortBy("cheapest")}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm sm:text-base">Cheapest</span>
              <Icon icon={MdInfoOutline} className="text-base sm:text-lg" />
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
              <span className="text-[#9aa0a6]">from</span>
              <span className="text-[#34a853] font-medium">
                ${cheapestPrice.toLocaleString()}
              </span>
              <Icon
                icon={MdInfoOutline}
                className="text-[#9aa0a6] text-sm sm:text-base"
              />
            </div>
          </div>
          {sortBy === "cheapest" && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8ab4f8]"></div>
          )}
        </button>
      </div>

      {/* Description Text - Hidden on mobile, shown on tablet+ */}
      <div className="hidden lg:flex items-center justify-between text-sm mb-4">
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

      {/* Simplified mobile description */}
      <div className="lg:hidden text-xs sm:text-sm text-[#9aa0a6] mb-4 text-center">
        <span>Prices include taxes + fees for 1 adult</span>
        <span className="mx-2">•</span>
        <button className="text-[#8ab4f8] hover:underline">
          Additional fees may apply
        </button>
      </div>
    </div>
  );
};
