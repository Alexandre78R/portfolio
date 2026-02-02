import { ReactElement, useState, useEffect, useCallback, ChangeEvent, useMemo } from "react";
import ModalCustom from "@/components/ModalCustom/ModalCustom";
import InputField from "@/components/InputField/InputField";
import InputMultiSelect from "@/components/AdminLayout/components/Input/InputMultiSelect";
import InputSelect from "@/components/AdminLayout/components/Input/InputSelect";
import ButtonCustom from "@/components/Button/Button";
import TextAdmin from "@/components/AdminLayout/components/Text/TextAdmin";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { useLang } from "@/context/Lang/LangContext";
import { useUpdateProjectAdmin, useListSkillsAdmin, useUploadProjectMediaAdmin } from "@/utils/hooks";
import type { ProjectRow } from "./ProjectTable";
import type Lang from "@/lang/typeLang";
import { FetchResult, ApolloError } from "@apollo/client";
import { UpdateProjectInput, UpdateProjectMutation, GetSkillsListQuery } from "@/types/graphql";
import { Upload, X } from "lucide-react";

interface ProjectEditModalProps {
  project: ProjectRow | null;
  onClose: () => void;
  onRefresh: () => Promise<any>;
}

interface FormData {
  title: string;
  descriptionFR: string;
  descriptionEN: string;
  typeDisplay: string;
  contentDisplay: string;
  github: string;
  skillIds: number[];
}

type SelectOption<T> = {
  label: string;
  value: T;
};

const ProjectEditModal: React.FC<ProjectEditModalProps> = ({
  project,
  onClose,
  onRefresh,
}: ProjectEditModalProps): ReactElement | null => {
  const [updateProjectMutation, { loading }] = useUpdateProjectAdmin();
  const [uploadProjectMedia] = useUploadProjectMediaAdmin();
  const { data: skillsData } = useListSkillsAdmin();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } = CustomToast();
  const { translations }: { translations: Lang } = useLang();
  
  const [selectedFile, setSelectedFile]: [File | null, React.Dispatch<React.SetStateAction<File | null>>] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview]: [string | null, React.Dispatch<React.SetStateAction<string | null>>] = useState<string | null>(null);

  const typeDisplayOptions: SelectOption<string>[] = [
    { label: "Image", value: "image" },
    { label: "Video", value: "video" },
  ];

  const contentDisplayOptions: SelectOption<string>[] = [
    { label: "Full", value: "full" },
    { label: "Half", value: "half" },
  ];

  const allSkills: SelectOption<number>[] = useMemo(() => {
    if (!skillsData?.listSkillCategories?.categories) return [];

    return skillsData.listSkillCategories.categories.flatMap((category) =>
      (category?.skills || []).map((skill) => ({
        label: skill?.name || "",
        value: Number(skill?.id) || 0,
      }))
    );
  }, [skillsData]);

  const [form, setForm]: [FormData, React.Dispatch<React.SetStateAction<FormData>>] = useState<FormData>({
    title: project?.title || "",
    descriptionFR: project?.descriptionFR || "",
    descriptionEN: project?.descriptionEN || "",
    typeDisplay: project?.typeDisplay || "image",
    contentDisplay: project?.contentDisplay || "full",
    github: project?.github || "",
    skillIds: project?.skills.map((s) => Number(s.id)) || [],
  });

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title || "",
        descriptionFR: project.descriptionFR || "",
        descriptionEN: project.descriptionEN || "",
        typeDisplay: project.typeDisplay || "image",
        contentDisplay: project.contentDisplay || "full",
        github: project.github || "",
        skillIds: project.skills.map((s) => Number(s.id)) || [],
      } as FormData);
    }
  }, [project]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>  = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ): void => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSkillsChange: (selectedSkills: number[]) => void = useCallback((selectedSkills: number[]): void => {
    setForm((prev) => ({ ...prev, skillIds: selectedSkills }));
  }, []);

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      const file: File | undefined = e.target.files?.[0];
      if (!file) return;

      setSelectedFile(file);

      const reader: FileReader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleRemoveFile: React.MouseEventHandler<HTMLButtonElement> = useCallback((): void => {
    setSelectedFile(null);
    setMediaPreview(null);
    const fileInput: HTMLInputElement | null = document.getElementById("media-upload-edit") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!project) return;

      try {
        if (selectedFile) {
          const isVideo: boolean = selectedFile.type.startsWith("video/");
          const isImage: boolean = selectedFile.type.startsWith("image/");
          if (!isVideo && !isImage) {
            showAlert("error", "Type de fichier non autorisé");
            return;
          }
        }

        const submitData: UpdateProjectInput = {
          id: project.id,
          title: form.title,
          descriptionFR: form.descriptionFR,
          descriptionEN: form.descriptionEN,
          typeDisplay: form.typeDisplay,
          contentDisplay: form.contentDisplay,
          github: form.github || null,
          skillIds: form.skillIds,
        };

const res = await updateProjectMutation({
        data: submitData,
        });

        const response: UpdateProjectMutation["updateProject"] | undefined = res.data?.updateProject;

        if (response?.code === 200) {
          if (selectedFile) {
            const uploadResult = await uploadProjectMedia({
              projectId: Number(project.id),
              file: selectedFile,
            });
            if (uploadResult.data?.uploadProjectMedia.code !== 200) {
              showAlert(
                "error",
                uploadResult.data?.uploadProjectMedia.message ||
                  "Erreur lors de l'upload du média"
              );
              return;
            }
          }

          showAlert(
            "success",
            translations.messageAdminProjectUpdateSuccess || "Project updated successfully"
          );
          await onRefresh();
          onClose();
        } else {
          showAlert(
            "error",
            response?.message || translations.messageAdminProjectUpdateError || "Update failed"
          );
        }
      } catch (err) {
        console.error(err);
        showAlert("error", translations.messageAdminProjectUpdateError || "Update failed");
      }
    },
    [
      project,
      form,
      updateProjectMutation,
      uploadProjectMedia,
      selectedFile,
      showAlert,
      translations,
      onRefresh,
      onClose,
    ]
  );

  if (!project) return null;

  return (
    <ModalCustom open={true} onClose={onClose} width="800px">
      <div className="w-full max-w-4xl mx-auto">
        <TextAdmin type="h2">
          {translations.messageAdminProjectEditTitle || "Edit Project"}
        </TextAdmin>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <InputField
            id="title"
            label={translations.messageAdminProjectInputTitle || "Title"}
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}        
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="descriptionFR"
              label={translations.messageAdminProjectInputDescriptionFR || "Description (FR)"}
              name="descriptionFR"
              type="text"
              value={form.descriptionFR}
              onChange={handleChange}
              multiline
              rows={6}
            />

            <InputField
              id="descriptionEN"
              label={translations.messageAdminProjectInputDescriptionEN || "Description (EN)"}
              name="descriptionEN"
              type="text"
              value={form.descriptionEN}
              onChange={handleChange}
              multiline
              rows={6}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputSelect
              id="typeDisplay"
              name="typeDisplay"
              label={translations.messageAdminProjectInputTypeDisplay || "Type Display"}
              value={form.typeDisplay}
              options={typeDisplayOptions}
              onChange={handleChange}
            />

            <InputSelect
              id="contentDisplay"
              name="contentDisplay"
              label={translations.messageAdminProjectInputContentDisplay || "Content Display"}
              value={form.contentDisplay}
              options={contentDisplayOptions}
              onChange={handleChange}
            />
          </div>

          <InputField
            id="github"
            label={translations.messageAdminProjectInputGithub || "GitHub URL (optional)"}
            name="github"
            type="url"
            value={form.github}
            onChange={handleChange}
          />

          <InputMultiSelect
            id="skillIds"
            label={translations.messageAdminProjectInputSkills || "Skills"}
            value={form.skillIds}
            options={allSkills}
            onChange={handleSkillsChange}
          />

          {/* Media Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {translations.messageAdminProjectInputMedia || "Upload Media (optional)"}
            </label>
            <input
              type="file"
              id="media-upload-edit"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex items-center gap-4">
              <ButtonCustom
                text={
                  <div className="flex items-center gap-2">
                    <Upload size={18} />
                    {translations.messageAdminProjectSelectFile || "Select File"}
                  </div>
                }
                onClick={() => document.getElementById("media-upload-edit")?.click()}
                type="button"
              />
              {selectedFile && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{selectedFile.name}</span>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>
            {mediaPreview && (
              <div className="mt-4">
                {selectedFile?.type.startsWith("image/") ? (
                  <img
                    src={mediaPreview}
                    alt="Preview"
                    className="max-w-full h-auto max-h-64 rounded-md"
                  />
                ) : (
                  <video
                    src={mediaPreview}
                    controls
                    className="max-w-full h-auto max-h-64 rounded-md"
                  />
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <ButtonCustom
              text={translations.messageAdminProjectEditCancel || "Cancel"}
              onClick={onClose}
              type="button"
            />
            <ButtonCustom
              text={
                loading
                  ? translations.messageAdminProjectEditUpdating || "Updating..."
                  : translations.messageAdminProjectEditConfirm || "Save Changes"
              }
              type="submit"
              disable={loading}
            />
          </div>
        </form>
      </div>
    </ModalCustom>
  );
};

export default ProjectEditModal;
