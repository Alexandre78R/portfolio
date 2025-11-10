import React from "react";
import { Eye, Download, Trash } from "lucide-react";
import ActionButton, { ActionItem } from "../Button/ActionButton";
import { BackupFileInfo } from "../../Pages/BackUp/BackUpList";

interface BackupActionsProps {
  row: BackupFileInfo;
  onDelete: (fileName: string) => void;
}

const BackupActions = ({
  row,
  onDelete,
}: BackupActionsProps): React.ReactElement => {
  const actions: ActionItem<BackupFileInfo>[] = [
    {
      icon: Eye,
      label: "View",
      onClick: () =>
        window.open(
          `${process.env.NEXT_PUBLIC_API_URL}/api/backups/${row.fileName}`,
          "_blank"
        ),
    },
    {
      icon: Download,
      label: "Download",
      onClick: () =>
        window.open(
          `${process.env.NEXT_PUBLIC_API_URL}/api/backups/${row.fileName}/download`,
          "_blank"
        ),
    },
    {
      icon: Trash,
      label: "Delete",
      onClick: () => onDelete(row.fileName),
      colorClass: "bg-red-500/90 hover:bg-red-500",
    },
  ];

  return <ActionButton row={row} actions={actions} />;
};

export default BackupActions;