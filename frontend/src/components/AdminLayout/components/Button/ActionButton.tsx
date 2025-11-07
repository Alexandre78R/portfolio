import React from "react";
import clsx from "clsx";

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export interface ActionItem<T> {
  icon: IconComponent;
  label?: string;
  onClick: (row: T) => void;
  colorClass?: string;
}

interface ActionButtonProps<T> {
  row: T;
  actions: ActionItem<T>[];
  gap?: string;
}

function ActionButton<T>({
  row,
  actions,
  gap = "gap-2",
}: ActionButtonProps<T>): React.ReactElement {
  return (
    <div className={clsx("flex items-center", gap)}>
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <button
            key={index}
            type="button"
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
}

export default ActionButton;