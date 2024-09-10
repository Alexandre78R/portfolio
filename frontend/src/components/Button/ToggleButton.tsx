type Props = {
  toggleChecked: () => void;
  option1: string | React.ReactNode;
  option2: string | React.ReactNode;
  isChecked: boolean;
};

const ToggleButton: React.FC<Props> = ({
  toggleChecked,
  option1,
  option2,
  isChecked,
}): React.ReactElement => {
  return (
    <div className="relative inline-block" onClick={toggleChecked}>
      <label htmlFor="toggleButton" className="cursor-pointer">
        <div className="w-12 h-6 bg-gray-300 rounded-full shadow-inner">
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
          ></div>
        </div>
      </label>
    </div>
  );
};

export default ToggleButton;
