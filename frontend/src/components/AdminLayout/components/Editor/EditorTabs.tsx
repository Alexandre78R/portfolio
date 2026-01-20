import React, { ReactElement } from "react";
import { Box } from "@mui/material";

export type EditorMode = "editor" | "split";
export type TabType = "mode" | "toggle";

export interface TabOption {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly type: TabType;
  readonly ariaLabel: string;
  readonly value?: EditorMode;
}

export interface EditorTabsProps {
  readonly mode: EditorMode;
  readonly showCode: boolean;
  readonly tabs: ReadonlyArray<TabOption>;
  readonly onModeChange: (mode: EditorMode) => void;
  readonly onShowCodeChange: (showCode: boolean) => void;
}

const isTabActive = (
  tab: TabOption,
  mode: EditorMode,
  showCode: boolean
): boolean => {
  if (tab.type === "toggle") {
    return showCode;
  }
  return tab.value === mode;
};

const EditorTabs: React.FC<EditorTabsProps> = ({
  mode,
  showCode,
  tabs,
  onModeChange,
  onShowCodeChange,
}: EditorTabsProps): ReactElement => {

  const handleTabClick = (tab: TabOption): void => {
    if (tab.type === "toggle") {
      onShowCodeChange(!showCode);
    } else if (tab.value) {
      onModeChange(tab.value);
    }
  };

  return (
    <Box className="flex gap-4 border-b border-gray-600 px-4 py-2">
      {tabs.map((tab: TabOption): ReactElement => {
        const active: boolean = isTabActive(tab, mode, showCode);

        return (
          <button
            key={tab.id}
            onClick={(): void => handleTabClick(tab)}
            className={`cursor-pointer bg-none border-none text-sm font-medium transition-colors px-0 py-0 ${
              active
                ? tab.type === "toggle"
                  ? "border-b-2 border-green-500 text-green-500 pb-2"
                  : "border-b-2 border-blue-500 text-blue-500 pb-2"
                : "text-gray-400 hover:text-gray-300"
            } ${tab.type === "toggle" ? "ml-auto" : ""}`}
            aria-label={tab.ariaLabel}
            data-testid={`editor-tab-${tab.id}`}
          >
            {tab.icon} {tab.label}
          </button>
        );
      })}
    </Box>
  );
};

export default EditorTabs;
