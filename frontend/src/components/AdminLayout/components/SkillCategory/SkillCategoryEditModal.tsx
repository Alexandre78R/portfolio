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
import InputMultiSelect, { SelectOption } from "../Input/InputMultiSelect";
import { X } from "lucide-react";
import { SkillCategoryRow } from "./SkillCategoryTable";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import CustomToast from "@/components/ToastCustom/CustomToast";
import {
  useUpdateSkillCategoryMutation,
  GetSkillsListQuery,
  UpdateCategoryInput,
  useGetSkillCategoryByIdQuery,
  useGetSkillsListQuery,
  useSearchSkillsLazyQuery,
} from "@/types/graphql";
import ButtonCustom from "@/components/Button/Button";
import LoadingCustom from "@/components/Loading/LoadingCustom";

interface SkillCategoryEditModalProps {
  category: SkillCategoryRow | null;
  onClose: () => void;
  onRefresh: () => Promise<
    void | import("@apollo/client").ApolloQueryResult<GetSkillsListQuery>
  >;
}

export interface SkillCategoryFormData {
  id: number;
  categoryEN: string;
  categoryFR: string;
  skillIds: number[];
}

const SkillCategoryEditModal = ({
  category,
  onClose,
  onRefresh,
}: SkillCategoryEditModalProps): ReactElement | null => {
  const { translations }: { translations: Lang } = useLang();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const [form, setForm] = useState<SkillCategoryFormData | null>(null);
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updateCategoryMutation] = useUpdateSkillCategoryMutation();

  const { data, loading: categoryLoading } = useGetSkillCategoryByIdQuery({
    variables: { id: category?.id ?? 0 },
    skip: !category,
    fetchPolicy: "network-only",
  });

  const { data: allSkillsData } = useGetSkillsListQuery({
    fetchPolicy: "cache-and-network",
  });

  const [searchSkillsQuery] = useSearchSkillsLazyQuery({
    fetchPolicy: "network-only",
  });

  const skillOptions = useMemo<SelectOption<number>[]>((): SelectOption<number>[] => {
    if (!allSkillsData?.skillList?.categories) return [];
    
    const allSkills: SelectOption<number>[] = [];
    allSkillsData.skillList.categories.forEach(category => {
      if (category?.skills) {
        category.skills.forEach(skill => {
          if (skill) {
            allSkills.push({
              label: skill.name || "",
              value: Number(skill.id),
            });
          }
        });
      }
    });
    
    return allSkills;
  }, [allSkillsData]);

  const handleSkillSearch = useCallback(
    async (searchTerm: string): Promise<SelectOption<number>[]> => {
      try {
        const result: ReturnType<typeof searchSkillsQuery> = await searchSkillsQuery({
          variables: { searchTerm },
        });

        if (!result.data?.searchSkills?.categories) return [];

        const filteredSkills: SelectOption<number>[] = [];

        result.data.searchSkills.categories.forEach(category => {
          if (category?.skills) {
            category.skills.forEach(skill => {
              if (skill) {
                filteredSkills.push({
                  label: skill.name || "",
                  value: Number(skill.id),
                });
              }
            });
          }
        });

        return filteredSkills;
      } catch (error) {
        console.error("Error searching skills:", error);
        return [];
      }
    },
    [searchSkillsQuery]
  );

  useEffect(() => {
    if (data?.skillCategoryById?.categories?.[0]) {
      const categoryData: typeof data.skillCategoryById.categories[0] = data.skillCategoryById.categories[0];

      const linkedSkillIds: number[] = categoryData.skills?.map(skill => Number(skill.id)) ?? [];
      
      const newData: SkillCategoryFormData = {
        id: Number(categoryData.id),
        categoryEN: categoryData.categoryEN ?? "",
        categoryFR: categoryData.categoryFR ?? "",
        skillIds: linkedSkillIds,
      };
      
      setForm(newData);
      setSelectedSkillIds(linkedSkillIds);
    }
  }, [data]);

  if (!category) return null;

  if (categoryLoading || !form) {
    return (
      <ModalCustom open={true} onClose={onClose} width="600px">
        <LoadingCustom />
      </ModalCustom>
    );
  }

  const handleChange = (
    e: string | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    if (typeof e === "string") {
      return;
    } else {
      const { name, value } = e.target;
      setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!form) return;
    
    setLoading(true);
    
    try {
      const updateData: any = {
        categoryEN: form.categoryEN,
        categoryFR: form.categoryFR,
      };

      if (selectedSkillIds.length > 0) {
        updateData.skillIds = selectedSkillIds;
      }

      const { data }: ReturnType<typeof updateCategoryMutation> = await updateCategoryMutation({
        variables: { id: Number(form.id), data: updateData },
      });

      if (data?.updateCategory?.code === 200) {
        showAlert("success", translations.messageAdminSkillCategoryEditSuccess);
        await onRefresh();
        onClose();
      } else {
        showAlert("error", translations.messageAdminSkillCategoryEditError);
      }
    } catch (err) {
      console.error("Mutation error:", err);
      showAlert("error", translations.messageAdminSkillCategoryEditError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalCustom open={true} onClose={onClose} width="600px">
      <div className="mb-4 flex items-center justify-between">
        <TextAdmin type="h2">
          {translations.messageAdminSkillCategoryEditTitle}
        </TextAdmin>
        <button onClick={onClose} className="text-red-500">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="categoryEN"
          label={translations.messageAdminSkillCategoryInputEN}
          name="categoryEN"
          value={form.categoryEN}
          onChange={handleChange}
          required
        />
        <InputField
          id="categoryFR"
          label={translations.messageAdminSkillCategoryInputFR}
          name="categoryFR"
          value={form.categoryFR}
          onChange={handleChange}
          required
        />
        
        {skillOptions.length > 0 && (
          <InputMultiSelect<number>
            id="skillIds"
            label={translations.messageAdminSkillCategorySelectSkills || "Select Skills (optional)"}
            value={selectedSkillIds}
            options={skillOptions}
            onChange={setSelectedSkillIds}
            onSearch={handleSkillSearch}
            required={false}
          />
        )}

        <div className="flex justify-end gap-3 mt-6">
          <ButtonCustom text={translations.messageAdminSkillCategoryEditCancel} onClick={onClose} />
          <ButtonCustom
            text={translations.messageAdminSkillCategoryEditConfirm}
            type="submit"
            disable={loading}
          />
        </div>
      </form>
    </ModalCustom>
  );
};

export default SkillCategoryEditModal;
