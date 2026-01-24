import { ReactElement, useState, useMemo, useCallback } from "react";
import { useGetProjectsListQuery } from "@/types/graphql";
import { useLang } from "@/context/Lang/LangContext";
import TextAdmin from "@/components/AdminLayout/components/Text/TextAdmin";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import ProjectTable from "@/components/AdminLayout/components/Project/ProjectTable";
import ProjectEditModal from "@/components/AdminLayout/components/Project/ProjectEditModal";
import ProjectDeleteDialog from "@/components/AdminLayout/components/Project/ProjectDeleteDialog";
import type { ProjectRow } from "@/components/AdminLayout/components/Project/ProjectTable";
import type Lang from "@/lang/typeLang";

const ProjectsList = (): ReactElement => {
  const { data, loading, error, refetch } = useGetProjectsListQuery({
    fetchPolicy: "cache-and-network",
  });
  const { translations }: { translations: Lang } = useLang();

  const [editProject, setEditProject]: [ProjectRow | null, React.Dispatch<React.SetStateAction<ProjectRow | null>>] = useState<ProjectRow | null>(null);
  const [deleteProjectId, setDeleteProjectId]: [number | null, React.Dispatch<React.SetStateAction<number | null>>] = useState<number | null>(null);

  const projects: ProjectRow[] = useMemo(() => {
    if (!data?.listProjects?.projects) return [];

    return data.listProjects.projects
      .filter((project): project is NonNullable<typeof project> => project !== null)
      .map((project) => ({
        id: Number(project.id),
        title: project.title,
        descriptionFR: project.descriptionFR,
        descriptionEN: project.descriptionEN,
        typeDisplay: project.typeDisplay,
        contentDisplay: project.contentDisplay,
        github: project.github || null,
        skills: project.skills || [],
      }));
  }, [data]);

  const handleEdit: (project: ProjectRow) => void = useCallback((project: ProjectRow): void => {
    setEditProject(project);
  }, []);

  const handleDelete: (projectId: number) => void = useCallback((projectId: number): void => {
    setDeleteProjectId(projectId);
  }, []);

  const handleCloseEdit: () => void = useCallback((): void => {
    setEditProject(null);
  }, []);

  const handleCloseDelete: () => void = useCallback((): void => {
    setDeleteProjectId(null);
  }, []);

  const handleRefresh: () => Promise<void> = useCallback(async (): Promise<void> => {
    await refetch();
  }, [refetch]);

  if (loading) return <LoadingCustom />;

  if (error || !data?.listProjects?.projects) {
    return (
      <div className="text-center">
        <TextAdmin type="h1">
          {translations.messageAdminProjectListTitle || "Projects"}
        </TextAdmin>
        <TextAdmin type="p" className="text-error mt-4">
          {translations.messageAdminProjectListNotFound || "No projects found"}
        </TextAdmin>
      </div>
    );
  }

  return (
    <div>
      <TextAdmin type="h1">
        {translations.messageAdminProjectListTitle || "Projects"}
      </TextAdmin>

      <div className="mt-6">
        <ProjectTable
          projects={projects}
          translations={translations}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <ProjectEditModal
        project={editProject}
        onClose={handleCloseEdit}
        onRefresh={handleRefresh}
      />

      <ProjectDeleteDialog
        projectId={deleteProjectId}
        onClose={handleCloseDelete}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default ProjectsList;
