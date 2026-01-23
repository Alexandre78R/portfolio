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

  const [editProject, setEditProject] = useState<ProjectRow | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<number | null>(null);

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

  const handleEdit = useCallback((project: ProjectRow): void => {
    setEditProject(project);
  }, []);

  const handleDelete = useCallback((projectId: number): void => {
    setDeleteProjectId(projectId);
  }, []);

  const handleCloseEdit = useCallback((): void => {
    setEditProject(null);
  }, []);

  const handleCloseDelete = useCallback((): void => {
    setDeleteProjectId(null);
  }, []);

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  if (loading) return <LoadingCustom />;

  if (error || !data?.listProjects?.projects) {
    return (
      <div className="text-center">
        <TextAdmin type="h1">
          {translations.messageAdminProjectListTitle || "Projects"}
        </TextAdmin>
        <p className="text-error mt-4">
          {translations.messageAdminProjectListNotFound || "No projects found"}
        </p>
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
