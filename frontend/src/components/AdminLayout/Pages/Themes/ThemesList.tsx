import React, { useState, ReactElement } from "react";
import { useGetThemesListQuery } from "@/types/graphql";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import TextAdmin from "../../components/Text/TextAdmin";
import { useLang } from "@/context/Lang/LangContext";
import Table, { ColumnDef } from "../../components/Table/Table";
import { Pencil, Trash } from "lucide-react";
import Lang from "@/lang/typeLang";
import ThemeDeleteDialog from "./ThemeDeleteDialog";
import ThemeEditModal from "./ThemeEditModal";
import ActionButton, { ActionItem } from "../../components/Button/ActionButton";

export interface ThemeRow {
  id: string;
  name: string;
  nameEN: string;
  nameFR: string;
  visible: boolean,
}

const ThemeList = (): ReactElement => {
  const { data, loading, error, refetch } = useGetThemesListQuery({
    fetchPolicy: "cache-and-network",
  });

  const { translations }: { translations: Lang } = useLang();

  const [editTheme, setEditTheme] = useState<ThemeRow | null>(null);
  const [deleteThemeId, setDeleteThemeId] = useState<string | null>(null);

  if (loading) return <LoadingCustom />;

  if (error || !data?.themeList?.themes) {
    return (
      <p className="p-4 text-primary">
        {translations.messageAdminThemeListNotFound}
      </p>
    );
  }

  const themes: ThemeRow[] = data.themeList.themes
    .filter((theme): theme is NonNullable<typeof theme> => !!theme)
    .map((theme) => ({
      id: theme.id,
      name: theme.name,
      nameEN: theme.nameEN ?? theme.name,
      nameFR: theme.nameFR ?? theme.name,
      visible: theme.visible,
    }));

  const columns: ColumnDef<ThemeRow>[] = [
    {
      header: translations.messageAdminThemeColumnName,
      accessor: "name",
      className: "font-medium",
      headerClassName: "rounded-tl-2xl",
    },
    {
      header: translations.messageAdminThemeColumnNameEN,
      accessor: "nameEN",
    },
    {
      header: translations.messageAdminThemeColumnNameFR,
      accessor: "nameFR",
    },
    {
      header: "visible",
      accessor: (row) => (row.visible ? "✅" : "❌"),
    },
    {
      header: translations.messageAdminThemeColumnAction,
      accessor: (row) => {
        const actions: ActionItem<ThemeRow>[] = [
          { icon: Pencil, label: "Edit", onClick: () => setEditTheme(row) },
          { icon: Trash, label: "Delete", onClick: () => setDeleteThemeId(row.id), colorClass: "bg-red-500/90 hover:bg-red-500" },
        ];
        return <ActionButton row={row} actions={actions} />;
      },
      headerClassName: "rounded-tr-2xl",
    },
  ];

  return (
    <div className="space-y-10">
      <TextAdmin type="h1">
        {translations.messageAdminThemeListTitle}
      </TextAdmin>

      <Table columns={columns} data={themes} />

      {/* EDIT */}
      <ThemeEditModal
        theme={editTheme}
        onClose={() => setEditTheme(null)}
        onRefresh={refetch}
      />

      {/* DELETE */}
      <ThemeDeleteDialog
        themeId={deleteThemeId}
        onClose={() => setDeleteThemeId(null)}
        onRefresh={refetch}
      />
    </div>
  );
};

export default ThemeList;