import React, { ReactElement } from "react";
import Table, { ColumnDef } from "../../components/Table/Table";
import { Pencil, Trash } from "lucide-react";
import ActionButton, { ActionItem } from "../../components/Button/ActionButton";
import Lang from "@/lang/typeLang";

export interface UserRow {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

interface UserTableProps {
  users: UserRow[];
  translations: Lang;
  onEdit: (user: UserRow) => void;
  onDelete: (userId: string) => void;
}

const UserTable = ({ users, translations, onEdit, onDelete }: UserTableProps): ReactElement => {
  const columns: ColumnDef<UserRow>[] = [
    {
      header: translations.messageAdminUserColumnFirstname,
      accessor: "firstname",
      className: "font-medium",
      headerClassName: "rounded-tl-2xl",
    },
    {
      header: translations.messageAdminUserColumnLastname,
      accessor: "lastname",
    },
    {
      header: translations.messageAdminUserColumnEmail,
      accessor: "email",
    },
    {
      header: translations.messageAdminUserColumnRole,
      accessor: "role",
    },
    {
      header: translations.messageAdminUserColumnAction,
      accessor: (row) => {
        const actions: ActionItem<UserRow>[] = [
          { icon: Pencil, label: "Edit", onClick: () => onEdit(row) },
          {
            icon: Trash,
            label: "Delete",
            onClick: () => onDelete(row.id),
            colorClass: "bg-red-500/90 hover:bg-red-500",
          },
        ];
        return <ActionButton row={row} actions={actions} />;
      },
      headerClassName: "rounded-tr-2xl",
    },
  ];

  return <Table columns={columns} data={users} />;
};

export default UserTable;
