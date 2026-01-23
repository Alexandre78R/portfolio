import React, {
  useState,
  ChangeEvent,
  FormEvent,
  ReactElement,
} from "react";
import { useGetThemesListQuery } from "@/types/graphql";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import TextAdmin from "../../components/Text/TextAdmin";
import { useLang } from "@/context/Lang/LangContext";
import Table, { ColumnDef } from "../../components/Table/Table";
import { Pencil, Trash, X } from "lucide-react";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import ButtonCustom from "@/components/Button/Button";
import Lang from "@/lang/typeLang";
import ModalCustom from "@/components/ModalCustom/ModalCustom";

export interface ThemeRow {
  id: string;
  name: string;
  nameEN: string;
  nameFR: string;
}

const ThemeList = (): ReactElement => {
  const { data, loading, error } = useGetThemesListQuery({
    fetchPolicy: "cache-and-network",
  });

  const { translations }: { translations: Lang } = useLang();

  const [openDeleteDialog, setOpenDeleteDialog] =
    useState<boolean>(false);
  const [selectedThemeId, setSelectedThemeId] =
    useState<string | null>(null);

  const [openEditModal, setOpenEditModal] =
    useState<boolean>(false);
  const [editTheme, setEditTheme] =
    useState<ThemeRow | null>(null);

  const handleOpenEdit = (theme: ThemeRow): void => {
    setEditTheme(theme);
    setOpenEditModal(true);
  };

  const handleEditChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    if (!editTheme) return;

    setEditTheme({
      ...editTheme,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitEdit = (
    e: FormEvent<HTMLFormElement>
  ): void => {
    e.preventDefault();
    if (!editTheme) return;

    console.log("Updated theme:", editTheme);

    setOpenEditModal(false);
    setEditTheme(null);
  };

  const handleDeleteTheme = async (): Promise<void> => {
    if (!selectedThemeId) return;

    console.log("Delete theme:", selectedThemeId);

    setOpenDeleteDialog(false);
    setSelectedThemeId(null);
  };

  if (loading) return <LoadingCustom />;

  if (error || !data?.listThemes?.themes) {
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
      header: translations.messageAdminThemeColumnAction,
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEdit(row)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            onClick={() => {
              setSelectedThemeId(row.id);
              setOpenDeleteDialog(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary transition-colors"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      ),
      headerClassName: "rounded-tr-2xl",
    },
  ];

  return (
    <div className="space-y-10">
      <TextAdmin type="h1">
        {translations.messageAdminThemeListTitle}
      </TextAdmin>

      <Table columns={columns} data={themes} />

      {/* ===== EDIT MODAL ===== */}
      <ModalCustom
        open={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          setEditTheme(null);
        }}
        width="520px"
      >
        {editTheme && (
          <>
            <div className="mb-4 flex w-full items-center justify-between">
              <TextAdmin type="h2">
                {translations.messageAdminThemeEditTitle}
              </TextAdmin>

              <button
                onClick={() => {
                  setOpenEditModal(false);
                  setEditTheme(null);
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmitEdit}
              className="w-full space-y-4"
            >
              <input
                type="text"
                name="name"
                value={editTheme.name}
                onChange={handleEditChange}
                placeholder="Name"
                className="w-full rounded-lg border px-3 py-2"
              />

              <input
                type="text"
                name="nameEN"
                value={editTheme.nameEN}
                onChange={handleEditChange}
                placeholder="Name (EN)"
                className="w-full rounded-lg border px-3 py-2"
              />

              <input
                type="text"
                name="nameFR"
                value={editTheme.nameFR}
                onChange={handleEditChange}
                placeholder="Name (FR)"
                className="w-full rounded-lg border px-3 py-2"
              />

              <div className="flex justify-end gap-3 pt-4">
                <ButtonCustom
                  text={
                    translations.messageAdminThemeEditCancel
                  }
                  onClick={() => {
                    setOpenEditModal(false);
                    setEditTheme(null);
                  }}
                  disable={false}
                  disableHover={false}
                />

                <ButtonCustom
                  text={
                    translations.messageAdminThemeEditSave
                  }
                  type="submit"
                  disable={false}
                  disableHover={false}
                />
              </div>
            </form>
          </>
        )}
      </ModalCustom>

      {/* ===== DELETE CONFIRM ===== */}
      <ConfirmDialog
        open={openDeleteDialog}
        title={translations.messageAdminThemeDeleteTitle}
        description={
          translations.messageAdminThemeDeleteDescription
        }
        confirmLabel={
          translations.messageAdminThemeDeleteConfirm
        }
        cancelLabel={
          translations.messageAdminThemeDeleteCancel
        }
        onConfirm={handleDeleteTheme}
        onCancel={() => {
          setOpenDeleteDialog(false);
          setSelectedThemeId(null);
        }}
      />
    </div>
  );
};

export default ThemeList;