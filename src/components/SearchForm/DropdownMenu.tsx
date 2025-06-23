import React, { useState } from "react";

interface Option {
  label: string;
  value: string;
  description?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  type?: "passengers" | "default";
}

export const DropdownMenu: React.FC<Props> = ({
  isOpen,
  onClose,
  options,
  value,
  onChange,
  type = "default",
}) => {
  const [passengers, setPassengers] = useState({
    adults: parseInt(value) || 1,
    children: 0,
    infantsInSeat: 0,
    infantsOnLap: 0,
  });

  if (!isOpen) return null;

  if (type === "passengers") {
    const updatePassengers = (
      field: keyof typeof passengers,
      delta: number
    ) => {
      const newPassengers = { ...passengers };
      newPassengers[field] = Math.max(0, newPassengers[field] + delta);

      // Ensure at least 1 adult
      if (field === "adults" && newPassengers.adults < 1) {
        newPassengers.adults = 1;
      }

      setPassengers(newPassengers);
      // Update total count (for now just adults)
      onChange(newPassengers.adults.toString());
    };

    return (
      <div className="absolute top-full left-0 mt-1 bg-[#303134] rounded-lg shadow-[0_1px_3px_0_rgba(0,0,0,0.3),0_4px_8px_3px_rgba(0,0,0,0.15)] min-w-[300px] z-50">
        <div className="p-4">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#e8eaed]">Adults</div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#3c4043] text-[#e8eaed] disabled:text-[#5f6368] transition-colors"
                  disabled={passengers.adults <= 1}
                  onClick={() => updatePassengers("adults", -1)}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 13H5v-2h14v2z" />
                  </svg>
                </button>
                <span className="text-[#e8eaed] w-4 text-center">
                  {passengers.adults}
                </span>
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#3c4043] text-[#e8eaed] transition-colors"
                  onClick={() => updatePassengers("adults", 1)}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#e8eaed]">Children</div>
                <div className="text-[#9aa0a6] text-sm">Aged 2-11</div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#3c4043] text-[#e8eaed] disabled:text-[#5f6368] transition-colors"
                  disabled={passengers.children <= 0}
                  onClick={() => updatePassengers("children", -1)}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 13H5v-2h14v2z" />
                  </svg>
                </button>
                <span className="text-[#e8eaed] w-4 text-center">
                  {passengers.children}
                </span>
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#3c4043] text-[#e8eaed] transition-colors"
                  onClick={() => updatePassengers("children", 1)}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#e8eaed]">Infants</div>
                <div className="text-[#9aa0a6] text-sm">In seat</div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#3c4043] text-[#e8eaed] disabled:text-[#5f6368] transition-colors"
                  disabled={passengers.infantsInSeat <= 0}
                  onClick={() => updatePassengers("infantsInSeat", -1)}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 13H5v-2h14v2z" />
                  </svg>
                </button>
                <span className="text-[#e8eaed] w-4 text-center">
                  {passengers.infantsInSeat}
                </span>
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#3c4043] text-[#e8eaed] transition-colors"
                  onClick={() => updatePassengers("infantsInSeat", 1)}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#e8eaed]">Infants</div>
                <div className="text-[#9aa0a6] text-sm">On lap</div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#3c4043] text-[#e8eaed] disabled:text-[#5f6368] transition-colors"
                  disabled={passengers.infantsOnLap <= 0}
                  onClick={() => updatePassengers("infantsOnLap", -1)}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 13H5v-2h14v2z" />
                  </svg>
                </button>
                <span className="text-[#e8eaed] w-4 text-center">
                  {passengers.infantsOnLap}
                </span>
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#3c4043] text-[#e8eaed] transition-colors"
                  onClick={() => updatePassengers("infantsOnLap", 1)}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="text-[#8ab4f8] hover:bg-[#3c4043] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 mt-1 bg-[#303134] rounded-lg shadow-[0_1px_3px_0_rgba(0,0,0,0.3),0_4px_8px_3px_rgba(0,0,0,0.15)] min-w-[200px] z-50">
      <div className="py-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              onChange(option.value);
              onClose();
            }}
            className={`w-full text-left px-4 py-2 hover:bg-[#3c4043] transition-colors ${
              value === option.value ? "text-[#8ab4f8]" : "text-[#e8eaed]"
            }`}
          >
            <div>{option.label}</div>
            {option.description && (
              <div className="text-sm text-[#9aa0a6]">{option.description}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
