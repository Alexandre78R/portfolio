import React, {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import TextAdmin from "../../components/Text/TextAdmin";
import InputField from "@/components/InputField/InputField";
import InputSelect, { SelectOption } from "../../components/Input/InputSelect";
import ButtonCustom from "@/components/Button/Button";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import CustomToast from "@/components/ToastCustom/CustomToast";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import {
  useCreateSkillMutation,
  CreateSkillInput,
  useGetSkillsListQuery,
} from "@/types/graphql";

interface SkillFormData extends CreateSkillInput {
  categoryId: number;
}

const defaultForm: SkillFormData = {
  name: "",
  image: "",
  categoryId: 0,
};

const SkillCreate = (): ReactElement => {
  const { translations }: { translations: Lang } = useLang();
  const { showAlert } = CustomToast();

  const [form, setForm] = useState<SkillFormData>(defaultForm);

  const [createSkillMutation, { loading }] = useCreateSkillMutation();

  const { data: categoriesData, loading: categoriesLoading } = useGetSkillsListQuery({
    fetchPolicy: "cache-and-network",
  });

  // Préparer les options de catégories pour le select
  const categoryOptions = useMemo<SelectOption<number>[]>(() => {
    if (!categoriesData?.listSkillCategories?.categories) return [];
    
    return categoriesData.listSkillCategories.categories.map(category => ({
      label: category.categoryEN || "",
      value: Number(category.id),
    }));
  }, [categoriesData]);

  const handleChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ): void => {
      const { name, value } = e.target;

      setForm(prev => ({
        ...prev,
        [name]: name === "categoryId" ? Number(value) : value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();

      if (!form.categoryId) {
        showAlert("error", translations.messageAdminSkillCreateErrorCategory || "Please select a category");
        return;
      }

      try {
        const submitData: CreateSkillInput = {
          name: form.name,
          image: form.image,
          categoryId: form.categoryId,
        };

        const res = await createSkillMutation({
          variables: { data: submitData },
        });

        const response = res.data?.createSkill;

        if (response?.code === 200) {
          showAlert(
            "success",
            translations.messageAdminSkillCreateSuccess || "Skill created successfully!"
          );
          setForm(defaultForm);
        } else {
          showAlert(
            "error",
            response?.message || translations.messageAdminSkillCreateError || "Error creating skill"
          );
        }
      } catch (err) {
        console.error(err);
        showAlert("error", translations.messageErrorServerOff || "Server error");
      }
    },
    [
      form,
      createSkillMutation,
      showAlert,
      translations,
    ]
  );

  return (
    <AuthFormLayout
      title={
        <TextAdmin type="h2">
          {translations.messageAdminSkillCreateTitle || "Create New Skill"}
        </TextAdmin>
      }
    >
      {loading && <LoadingCustom />}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <InputField
          id="name"
          name="name"
          label={translations.messageAdminSkillInputName || "Skill Name"}
          type="text"
          placeholder="e.g., React"
          value={form.name}
          onChange={handleChange}
          required
        />

        <InputField
          id="image"
          name="image"
          label={translations.messageAdminSkillInputImage || "Image URL"}
          type="url"
          placeholder="e.g., https://example.com/react-icon.png"
          value={form.image}
          onChange={handleChange}
          required
        />

        {/* Image preview */}
        {form.image && (
          <div className="flex justify-center">
            <img
              src={form.image}
              alt="Preview"
              className="w-20 h-20 object-contain border border-gray-300 rounded"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Category Select */}
        {categoriesLoading ? (
          <div className="text-center py-4">Loading categories...</div>
        ) : categoryOptions.length > 0 ? (
          <InputSelect<number>
            id="categoryId"
            name="categoryId"
            label={translations.messageAdminSkillSelectCategory || "Category"}
            value={form.categoryId}
            options={categoryOptions}
            onChange={handleChange}
            required
          />
        ) : (
          <div className="text-center py-4 text-red-500">
            {translations.messageAdminSkillNoCategoriesFound || "No categories found. Please create a category first."}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <ButtonCustom
            text={
              loading
                ? translations.messageAdminSkillCreateLoading || "Creating..."
                : translations.messageAdminSkillCreateConfirm || "Create Skill"
            }
            type="submit"
            disable={loading || categoryOptions.length === 0}
          />
        </div>
      </form>
    </AuthFormLayout>
  );
};

SkillCreate.displayName = "SkillCreate";

export default SkillCreate;