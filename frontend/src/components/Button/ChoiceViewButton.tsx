import { useState, useEffect } from "react";
import { useChoiceView } from "@/context/ChoiceView/ChoiceViewContext";
import ToggleButton from "./ToggleButton";
import TerminalIcon from "@mui/icons-material/Terminal";
import MouseIcon from "@mui/icons-material/Mouse";

const ChoiceViewButton: React.FC = (): React.ReactElement => {
  const { selectedView, setSelectedView } = useChoiceView();

  const [isCheckedView, setIsCheckedView]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);

  useEffect(() => {
    setIsCheckedView(selectedView !== "text");
  }, [selectedView]);

  const toggleCheckedView: () => void = (): void => {
    setIsCheckedView(!isCheckedView);
    setSelectedView(selectedView === "text" ? "terminal" : "text");
  };

  return (
    <ToggleButton
      toggleChecked={toggleCheckedView}
      option1={<MouseIcon fontSize="small" />}
      option2={<TerminalIcon fontSize="small" />}
      isChecked={isCheckedView}
    />
  );
};

export default ChoiceViewButton;
