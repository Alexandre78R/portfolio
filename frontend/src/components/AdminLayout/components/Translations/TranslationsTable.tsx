import React, { ReactElement, useCallback } from "react";
import { Edit2 } from "lucide-react";
import Table, { type ColumnDef } from "@/components/AdminLayout/components/Table/Table";
import ActionButton, { type ActionItem } from "@/components/AdminLayout/components/Button/ActionButton";

/**
 * Interface for translation item displayed in the table
 */
interface TranslationItemDTO {
  readonly key: string;
  readonly value: string;
}

/**
 * Props for TranslationsTable component
 */
interface TranslationsTableProps {
  readonly translations: readonly TranslationItemDTO[];
  readonly onEdit: (translation: TranslationItemDTO) => void;
  readonly translations_context: Record<string, string>;
}

/**
 * Translations table component
 * @description Displays translations in a table format with edit action
 */
const TranslationsTable = ({
  translations,
  onEdit,
  translations_context,
}: TranslationsTableProps): ReactElement => {
  /**
   * Handle edit button click
   */
  const handleEditClick = useCallback(
    (translation: TranslationItemDTO): void => {
      onEdit(translation);
    },
    [onEdit]
  );

  const columnKeyLabel: string = translations_context.messageAdminTranslationsTableColumnKey || "Clé";
  const columnFRLabel: string = translations_context.messageAdminTranslationsTableColumnFR || "Français";
  const columnENLabel: string = translations_context.messageAdminTranslationsTableColumnEN || "Anglais";
  const columnActionLabel: string = translations_context.messageAdminTranslationsTableColumnAction || "Actions";
  const editButtonLabel: string = translations_context.messageAdminTranslationsEditButton || "Modifier";

  const actions: ActionItem<TranslationItemDTO>[] = [
    {
      icon: Edit2,
      label: editButtonLabel,
      onClick: (row: TranslationItemDTO): void => handleEditClick(row),
    },
  ];

  const columns: ColumnDef<TranslationItemDTO>[] = [
    {
      header: columnKeyLabel,
      accessor: (row: TranslationItemDTO): React.ReactNode => row.key,
      className: "font-mono break-words max-w-xs text-sm text-gray-900 dark:text-gray-100",
      headerClassName: "text-gray-900 dark:text-gray-100",
    },
    {
      header: columnFRLabel,
      accessor: (row: TranslationItemDTO): React.ReactNode => row.value,
      className: "break-words max-w-xs text-sm text-gray-900 dark:text-gray-100",
      headerClassName: "text-gray-900 dark:text-gray-100",
    },
    {
      header: columnENLabel,
      accessor: (row: TranslationItemDTO): React.ReactNode => row.value,
      className: "break-words max-w-xs text-sm text-gray-900 dark:text-gray-100",
      headerClassName: "text-gray-900 dark:text-gray-100",
    },
    {
      header: columnActionLabel,
      accessor: (row: TranslationItemDTO): React.ReactNode => (
        <ActionButton row={row} actions={actions} />
      ),
      className: "text-sm",
      headerClassName: "text-gray-900 dark:text-gray-100",
    },
  ];

  return <Table columns={columns} data={translations} />;
};

TranslationsTable.displayName = "TranslationsTable";

export default TranslationsTable;
