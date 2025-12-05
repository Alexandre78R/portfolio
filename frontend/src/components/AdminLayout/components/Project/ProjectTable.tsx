import { ReactElement } from "react";
import Table, { ColumnDef } from "@/components/AdminLayout/components/Table/Table";
import ActionButton, { ActionItem } from "@/components/AdminLayout/components/Button/ActionButton";
import { Pencil, Trash } from "lucide-react";
import Lang from "@/lang/typeLang";
import type { SkillSubItem } from "@/types/graphql";

export interface ProjectRow {
  id: number;
  title: string;
  descriptionFR: string;
  descriptionEN: string;
  typeDisplay: string;
  contentDisplay: string;
  github: string | null;
  skills: SkillSubItem[];
}

interface ProjectTableProps {
  projects: ProjectRow[];
  translations: Lang;
  onEdit: (project: ProjectRow) => void;
  onDelete: (projectId: number) => void;
}

const ProjectTable = ({
  projects,
  translations,
  onEdit,
  onDelete,
}: ProjectTableProps): ReactElement => {
  const columns: ColumnDef<ProjectRow>[] = [
    { 
      header: translations.messageAdminProjectColumnTitle || "Title",
      accessor: "title"
    },
    { 
      header: translations.messageAdminProjectColumnTypeDisplay || "Type Display",
      accessor: "typeDisplay"
    },
    { 
      header: translations.messageAdminProjectColumnContentDisplay || "Content Display",
      accessor: "contentDisplay"
    },
    { 
      header: translations.messageAdminProjectColumnSkills || "Skills",
      accessor: (row: ProjectRow) => (
        <span>{row.skills.length} skills</span>
      )
    },
    {
      header: translations.messageAdminProjectColumnAction || "Actions",
      accessor: (row: ProjectRow) => {
        const actions: ActionItem<ProjectRow>[] = [
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

  return <Table columns={columns} data={projects} />;
};

export default ProjectTable;
