import React from "react";

type ToggleButtonProps = {
  toggleChecked: () => void;
  option1: React.ReactNode;
  option2: React.ReactNode;
  isChecked: boolean;
  "data-testid"?: string;
};

const ToggleButton: React.FC<ToggleButtonProps> = ({
  toggleChecked,
  option1,
  option2,
  isChecked,
  "data-testid": dataTestId,
}): React.ReactElement => {
  return (
    <div
      className="relative inline-block"
      onClick={toggleChecked}
      data-testid={dataTestId}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          toggleChecked();
        }
      }}
    >
      <label htmlFor="toggleButton" className="cursor-pointer">
        <div className="w-12 h-6 bg-gray-300 rounded-full shadow-inner relative">
          <p
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-20 w-6 text-xs font-bold text-center ${
              !isChecked ? "text-white" : "text-gray-500"
            }`}
          >
            {option1}
          </p>
          <p
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-20 w-6 text-xs font-bold text-center ${
              !isChecked ? "text-gray-500" : "text-white"
            }`}
          >
            {option2}
          </p>
          <div
            className={`absolute left-0 w-6 h-6 rounded-full bg-primary z-10 shadow-md transition-transform duration-300 ${
              isChecked ? "transform translate-x-full" : ""
            }`}
          />
        </div>
      </label>
    </div>
  );
};

ToggleButton.displayName = "ToggleButton";

export default ToggleButton;
