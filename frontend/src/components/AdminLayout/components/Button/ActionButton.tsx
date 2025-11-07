import React, { ReactElement } from "react";
import { LucideIcon } from "lucide-react"; 
import clsx from "clsx";

export interface ActionItem<T> {
  icon: LucideIcon;
  label?: string;
  onClick: (row: T) => void;
  colorClass?: string;
}

interface ActionButtonProps<T> {
  row: T;
  actions: ActionItem<T>[];
  gap?: string;
}

const ActionButton = <T,>({ row, actions, gap = "gap-2" }: ActionButtonProps<T>): ReactElement => {
  return (
    <div className={clsx("flex items-center", gap)}>
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <button
            key={index}
            onClick={() => action.onClick(row)}
            className={clsx(
              "inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors",
              action.colorClass ?? "bg-primary/90 hover:bg-primary"
            )}
            title={action.label}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
};

export default ActionButton;