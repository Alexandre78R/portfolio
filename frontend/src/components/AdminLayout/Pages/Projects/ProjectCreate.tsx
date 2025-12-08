import { ReactElement, useState, useCallback, ChangeEvent, useMemo } from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import TextAdmin from "@/components/AdminLayout/components/Text/TextAdmin";
import InputField from "@/components/InputField/InputField";
import InputMultiSelect from "@/components/AdminLayout/components/Input/InputMultiSelect";
import InputSelect from "@/components/AdminLayout/components/Input/InputSelect";
import ButtonCustom from "@/components/Button/Button";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { useLang } from "@/context/Lang/LangContext";
import {
  useCreateProjectMutation,
  useGetSkillsListQuery,
  CreateProjectInput,
} from "@/types/graphql";
import type Lang from "@/lang/typeLang";
import { Upload, X } from "lucide-react";

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

const defaultForm: FormData = {
  title: "",
  descriptionFR: "",
  descriptionEN: "",
  typeDisplay: "image",
  contentDisplay: "full",
  github: "",
  skillIds: [],
};

const ProjectCreate = (): ReactElement => {
  const [createProjectMutation, { loading }] = useCreateProjectMutation();
  const { data: skillsData, loading: skillsLoading } = useGetSkillsListQuery({
    fetchPolicy: "cache-and-network",
  });
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } = CustomToast();
  const { translations }: { translations: Lang } = useLang();

  const [form, setForm] = useState<FormData>(defaultForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  const typeDisplayOptions: SelectOption<string>[] = [
    { label: "Image", value: "image" },
    { label: "Video", value: "video" },
  ];

  const contentDisplayOptions: SelectOption<string>[] = [
    { label: "Full", value: "full" },
    { label: "Half", value: "half" },
  ];

  const allSkills: SelectOption<number>[] = useMemo(() => {
    if (!skillsData?.skillList?.categories) return [];

    return skillsData.skillList.categories.flatMap((category) =>
      (category?.skills || []).map((skill) => ({
        label: skill?.name || "",
        value: Number(skill?.id) || 0,
      }))
    );
  }, [skillsData]);

  const handleChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ): void => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSkillsChange = useCallback((selectedSkills: number[]): void => {
    setForm((prev) => ({ ...prev, skillIds: selectedSkills }));
  }, []);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      const file = e.target.files?.[0];
      if (!file) return;

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleRemoveFile = useCallback((): void => {
    setSelectedFile(null);
    setMediaPreview(null);
    const fileInput = document.getElementById("media-upload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (form.skillIds.length === 0) {
        showAlert(
          "error",
          translations.messageAdminProjectCreateErrorSkills ||
            "Please select at least one skill"
        );
        return;
      }

      try {
        const submitData: CreateProjectInput = {
          title: form.title,
          descriptionFR: form.descriptionFR,
          descriptionEN: form.descriptionEN,
          typeDisplay: form.typeDisplay,
          contentDisplay: form.contentDisplay,
          github: form.github || null,
          skillIds: form.skillIds,
        };

        const res = await createProjectMutation({
          variables: { data: submitData },
        });

        const response = res.data?.createProject;

        if (response?.code === 200) {
          showAlert(
            "success",
            translations.messageAdminProjectCreateSuccess ||
              "Project created successfully!"
          );
          setForm(defaultForm);
          setSelectedFile(null);
          setMediaPreview(null);
        } else {
          showAlert(
            "error",
            response?.message ||
              translations.messageAdminProjectCreateError ||
              "Error creating project"
          );
        }
      } catch (err) {
        console.error(err);
        showAlert(
          "error",
          translations.messageErrorServerOff || "Server error"
        );
      }
    },
    [form, createProjectMutation, showAlert, translations]
  );

  if (skillsLoading) return <LoadingCustom />;

  if (!skillsData?.skillList?.categories || allSkills.length === 0) {
    return (
      <div className="text-center">
        <TextAdmin type="h1">
          {translations.messageAdminProjectCreateTitle || "Create Project"}
        </TextAdmin>
        <p className="text-error mt-4">
          {translations.messageAdminProjectNoSkillsFound ||
            "No skills found. Please create skills first."}
        </p>
      </div>
    );
  }

  return (
    <AuthFormLayout
      title={
        <TextAdmin type="h2">
          {translations.messageAdminProjectCreateTitle || "Create Project"}
        </TextAdmin>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="title"
          label={translations.messageAdminProjectInputTitle || "Title"}
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            id="descriptionFR"
            label={
              translations.messageAdminProjectInputDescriptionFR ||
              "Description (FR)"
            }
            name="descriptionFR"
            type="text"
            value={form.descriptionFR}
            onChange={handleChange}
            required
          />

          <InputField
            id="descriptionEN"
            label={
              translations.messageAdminProjectInputDescriptionEN ||
              "Description (EN)"
            }
            name="descriptionEN"
            type="text"
            value={form.descriptionEN}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputSelect
            id="typeDisplay"
            name="typeDisplay"
            label={
              translations.messageAdminProjectInputTypeDisplay ||
              "Type Display"
            }
            value={form.typeDisplay}
            options={typeDisplayOptions}
            onChange={handleChange}
            required
          />

          <InputSelect
            id="contentDisplay"
            name="contentDisplay"
            label={
              translations.messageAdminProjectInputContentDisplay ||
              "Content Display"
            }
            value={form.contentDisplay}
            options={contentDisplayOptions}
            onChange={handleChange}
            required
          />
        </div>

        <InputField
          id="github"
          label={
            translations.messageAdminProjectInputGithub ||
            "GitHub URL (optional)"
          }
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
          // required
        />

        {/* Media Upload Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text">
            {translations.messageAdminProjectInputMedia ||
              "Media (Image/Video) - Optional"}
          </label>

          {!selectedFile && (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="media-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    Image or Video (MAX. 50MB)
                  </p>
                </div>
                <input
                  id="media-upload"
                  type="file"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          )}

          {selectedFile && mediaPreview && (
            <div className="relative">
              {form.typeDisplay === "video" &&
              selectedFile.type.startsWith("video") ? (
                <video
                  src={mediaPreview}
                  controls
                  className="w-full max-h-64 rounded-lg object-contain"
                />
              ) : (
                <img
                  src={mediaPreview}
                  alt="Preview"
                  className="w-full max-h-64 rounded-lg object-contain"
                />
              )}
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                aria-label="Remove file"
              >
                <X size={20} />
              </button>
              <p className="mt-2 text-sm text-gray-600">
                {selectedFile.name} (
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <ButtonCustom
            text={
              loading
                ? translations.messageAdminProjectCreateLoading ||
                  "Creating..."
                : translations.messageAdminProjectCreateConfirm || "Create"
            }
            type="submit"
            disable={loading}
          />
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default ProjectCreate;
