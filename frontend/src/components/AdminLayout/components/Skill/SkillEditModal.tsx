import React, {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import ModalCustom from "@/components/ModalCustom/ModalCustom";
import TextAdmin from "../Text/TextAdmin";
import InputField from "@/components/InputField/InputField";
import InputSelect, { SelectOption } from "../Input/InputSelect";
import { X } from "lucide-react";
import { SkillRow } from "./SkillTable";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import CustomToast from "@/components/ToastCustom/CustomToast";
import {
  useUpdateSkillMutation,
  GetSkillsListQuery,
  useGetSkillsListQuery,
} from "@/types/graphql";
import ButtonCustom from "@/components/Button/Button";
import LoadingCustom from "@/components/Loading/LoadingCustom";

interface SkillEditModalProps {
  skill: SkillRow | null;
  onClose: () => void;
  onRefresh: () => Promise<
    void | import("@apollo/client").ApolloQueryResult<GetSkillsListQuery>
  >;
}

export interface SkillFormData {
  id: number;
  name: string;
  image: string;
  categoryId: number;
}

const SkillEditModal = ({
  skill,
  onClose,
  onRefresh,
}: SkillEditModalProps): ReactElement | null => {
  const { translations }: { translations: Lang } = useLang();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const [form, setForm] = useState<SkillFormData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [updateSkillMutation] = useUpdateSkillMutation();

  // Récupérer la liste des catégories pour le select
  const { data: categoriesData, loading: categoriesLoading } = useGetSkillsListQuery({
    fetchPolicy: "cache-and-network",
  });

  // Préparer les options de catégories pour le select
  const categoryOptions = useMemo<SelectOption<number>[]>(() => {
    if (!categoriesData?.skillList?.categories) return [];
    
    return categoriesData.skillList.categories.map(category => ({
      label: category.categoryEN || "",
      value: Number(category.id),
    }));
  }, [categoriesData]);

  useEffect(() => {
    if (skill) {
      // Trouver la catégorie du skill
      let categoryId = 0;
      if (categoriesData?.skillList?.categories) {
        for (const category of categoriesData.skillList.categories) {
          const foundSkill = category.skills?.find(s => Number(s.id) === skill.id);
          if (foundSkill) {
            categoryId = Number(category.id);
            break;
          }
        }
      }

      setForm({
        id: skill.id,
        name: skill.name,
        image: skill.image,
        categoryId: categoryId,
      });
    }
  }, [skill, categoriesData]);

  if (!skill) return null;

  if (categoriesLoading || !form) {
    return (
      <ModalCustom open={true} onClose={onClose} width="600px">
        <LoadingCustom />
      </ModalCustom>
    );
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => (prev ? { ...prev, [name]: name === "categoryId" ? Number(value) : value } : prev));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!form) return;
    
    setLoading(true);
    
    try {
      const updateData = {
        name: form.name,
        image: form.image,
        categoryId: form.categoryId,
      };

      const { data } = await updateSkillMutation({
        variables: { id: Number(form.id), data: updateData },
      });

      if (data?.updateSkill?.code === 200) {
        showAlert("success", translations.messageAdminSkillEditSuccess || "Skill updated successfully!");
        await onRefresh();
        onClose();
      } else {
        showAlert("error", translations.messageAdminSkillEditError || "Error updating skill");
      }
    } catch (err) {
      console.error("Mutation error:", err);
      showAlert("error", translations.messageAdminSkillEditError || "Error updating skill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalCustom open={true} onClose={onClose} width="600px">
      <div className="mb-4 flex items-center justify-between">
        <TextAdmin type="h2">
          {translations.messageAdminSkillEditTitle || "Edit Skill"}
        </TextAdmin>
        <button onClick={onClose} className="text-red-500">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="name"
          label={translations.messageAdminSkillInputName || "Skill Name"}
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <InputField
          id="image"
          label={translations.messageAdminSkillInputImage || "Image URL"}
          name="image"
          type="url"
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
            />
          </div>
        )}

        {/* Category Select */}
        {categoryOptions.length > 0 && (
          <InputSelect<number>
            id="categoryId"
            label={translations.messageAdminSkillSelectCategory || "Category"}
            name="categoryId"
            value={form.categoryId}
            options={categoryOptions}
            onChange={handleChange}
            required
          />
        )}

        <div className="flex justify-end gap-4 mt-6">
          <ButtonCustom
            text={translations.messageAdminSkillEditCancel || "Cancel"}
            type="button"
            onClick={onClose}
          />
          <ButtonCustom
            text={loading ? (translations.messageAdminSkillEditLoading || "Updating...") : (translations.messageAdminSkillEditConfirm || "Update")}
            type="submit"
            disable={loading}
          />
        </div>
      </form>
    </ModalCustom>
  );
};

export default SkillEditModal;
