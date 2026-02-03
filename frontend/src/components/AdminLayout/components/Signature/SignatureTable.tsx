import React, { ReactElement } from "react";
import Table, { ColumnDef } from "../../components/Table/Table";
import { Pencil, Trash } from "lucide-react";
import ActionButton, { ActionItem } from "../../components/Button/ActionButton";
import Lang from "@/lang/typeLang";
import { sanitizeHtml } from "@/utils/sanitizeHtml";

export interface SignatureRow {
  id: number;
  name: string;
  description: string;
}

interface SignatureTableProps {
  signatures: SignatureRow[];
  translations: Lang;
  onEdit: (signature: SignatureRow) => void;
  onDelete: (signatureId: number) => void;
}

const SignatureTable: React.FC<SignatureTableProps> = ({
  signatures,
  translations,
  onEdit,
  onDelete,
}: SignatureTableProps): ReactElement => {
  const columns: ColumnDef<SignatureRow>[] = [
    {
      header: translations.messageAdminSignatureColumnName,
      accessor: "name",
      className: "px-4 py-3",
    },
    {
      header: translations.messageAdminSignatureColumnDescription,
      accessor: (row) => (
        <div 
          className="prose prose-sm max-w-md" 
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(row.description) }}
        />
      ),
      className: "px-4 py-3",
    },
    {
      header: translations.messageAdminSignatureColumnAction,
      accessor: (row) => {
        const actions: ActionItem<SignatureRow>[] = [
          {
            icon: Pencil,
            label: "Edit",
            onClick: () => onEdit(row),
          },
          {
            icon: Trash,
            label: "Delete",
            onClick: () => onDelete(row.id),
            colorClass: "bg-red-500/90 hover:bg-red-500",
          },
        ];

        return <ActionButton row={row} actions={actions} />;
      },
      className: "px-4 py-3 text-center",
    },
  ];

  return <Table columns={columns} data={signatures} />;
};

export default SignatureTable;
