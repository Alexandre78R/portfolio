import React, { useState, ReactElement } from "react";
import { useListThemesAdmin } from "@/utils/hooks";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import TextAdmin from "../../components/Text/TextAdmin";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import ThemeDeleteDialog from "../../components/Theme/ThemeDeleteDialog";
import ThemeEditModal from "../../components/Theme/ThemeEditModal";
import ThemeTable, { ThemeRow } from "../../components/Theme/ThemeTable";

const ThemeList = (): ReactElement => {
  const { data, loading, error, refetch } = useListThemesAdmin();

  const { translations }: { translations: Lang } = useLang();

  const [editTheme, setEditTheme]: [ThemeRow | null, React.Dispatch<React.SetStateAction<ThemeRow | null>>] = useState<ThemeRow | null>(null);
  const [deleteThemeId, setDeleteThemeId]: [string | null, React.Dispatch<React.SetStateAction<string | null>>] = useState<string | null>(null);

  if (loading) return <LoadingCustom />;

  if (error || !data?.listThemes?.themes) {
    return (
      <p className="p-4 text-primary">
        {translations.messageAdminThemeListNotFound}
      </p>
    );
  }

  const themes: ThemeRow[] = data.listThemes.themes
    .filter((theme): theme is NonNullable<typeof theme> => !!theme)
    .map((theme) => ({
      id: theme.id,
      name: theme.name,
      nameEN: theme.nameEN ?? theme.name,
      nameFR: theme.nameFR ?? theme.name,
      visible: theme.visible,
    }));

  return (
    <div className="space-y-10">
      <TextAdmin type="h1">{translations.messageAdminThemeListTitle}</TextAdmin>

      <ThemeTable
        themes={themes}
        translations={translations}
        onEdit={(theme: ThemeRow) => setEditTheme(theme)}
        onDelete={(id: string) => setDeleteThemeId(id)}
      />

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