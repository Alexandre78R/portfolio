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
import TextAdmin from "../../../components/Text/TextAdmin";
import InputField from "@/components/InputField/InputField";
import InputMultiSelect, {
  SelectOption,
} from "../../../components/Input/InputMultiSelect";
import ButtonCustom from "@/components/Button/Button";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import CustomToast from "@/components/ToastCustom/CustomToast";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import {
  useCreateSkillCategoryMutation,
  CreateCategoryInput,
  useGetSkillsListQuery,
  CreateSkillCategoryMutation,
} from "@/types/graphql";
import { FetchResult } from "@apollo/client";

interface SkillCategoryFormWithSkills extends CreateCategoryInput {
  skillIds?: number[];
}

const defaultForm: SkillCategoryFormWithSkills = {
  categoryEN: "",
  categoryFR: "",
  skillIds: [],
};

const SkillCategoryCreate = (): ReactElement => {
  const { translations }: { translations: Lang } = useLang();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } = CustomToast();

  const [form, setForm]: [SkillCategoryFormWithSkills, React.Dispatch<React.SetStateAction<SkillCategoryFormWithSkills>>] = useState<SkillCategoryFormWithSkills>(defaultForm);
  const [selectedSkillIds, setSelectedSkillIds]: [number[], React.Dispatch<React.SetStateAction<number[]>>] = useState<number[]>([]);

  const [createCategoryMutation, { loading }] = useCreateSkillCategoryMutation();

  const { data: skillsData, loading: skillsLoading } = useGetSkillsListQuery({
    fetchPolicy: "cache-and-network",
  });

    const allSkillsOptions: SelectOption<number>[] = useMemo<SelectOption<number>[]>(() => {
    if (!skillsData?.listSkillCategories?.categories) return [];

    const map: Map<number, SelectOption<number>> = new Map<number, SelectOption<number>>();

    skillsData.listSkillCategories.categories.forEach(category => {
        category?.skills?.forEach(skill => {
        if (skill && !map.has(Number(skill.id))) {
            map.set(Number(skill.id), {
            label: skill.name ?? "",
            value: Number(skill.id),
            });
        }
        });
    });

    return Array.from(map.values());
    }, [skillsData]);

  const handleChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ): void => {
      const { name, value } = e.target;

      setForm(prev => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();

      try {
        const submitData: CreateCategoryInput & {
          skillIds?: number[];
        } = {
          categoryEN: form.categoryEN,
          categoryFR: form.categoryFR,
        };

        if (selectedSkillIds.length > 0) {
          submitData.skillIds = selectedSkillIds;
        }

        const res: FetchResult<CreateSkillCategoryMutation> = await createCategoryMutation({
          variables: { data: submitData },
        });

        const response = res.data?.createCategory;

        if (response?.code === 200) {
          showAlert(
            "success",
            translations.messageAdminSkillCategoryCreateSuccess
          );
          setForm(defaultForm);
          setSelectedSkillIds([]);
        } else {
          showAlert(
            "error",
            response?.message ||
              translations.messageAdminSkillCategoryCreateError
          );
        }
      } catch (err) {
        console.error(err);
        showAlert("error", translations.messageErrorServerOff);
      }
    },
    [
      form,
      selectedSkillIds,
      createCategoryMutation,
      showAlert,
      translations,
    ]
  );

  return (
    <AuthFormLayout
      title={
        <TextAdmin type="h2">
          {translations.messageAdminSkillCategoryCreateTitle}
        </TextAdmin>
      }
    >
      {loading && <LoadingCustom />}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <InputField
          id="categoryEN"
          name="categoryEN"
          label="Category (EN)"
          type="text"
          placeholder="e.g., Programming"
          value={form.categoryEN}
          onChange={handleChange}
          required
        />

        <InputField
          id="categoryFR"
          name="categoryFR"
          label="Category (FR)"
          type="text"
          placeholder="e.g., Programmation"
          value={form.categoryFR}
          onChange={handleChange}
          required
        />

        {skillsLoading ? (
          <div className="text-center py-4">Loading skills...</div>
        ) : allSkillsOptions.length > 0 ? (
          <InputMultiSelect<number>
            id="skillIds"
            label={
              translations.messageAdminSkillCategorySelectSkills ||
              "Select skills (optional)"
            }
            value={selectedSkillIds}
            options={allSkillsOptions}
            onChange={setSelectedSkillIds}
            required={false}
          />
        ) : null}

        <div className="flex justify-center mt-8">
          <ButtonCustom
            text={
              loading
                ? translations.messageAdminSkillCategoryCreateLoading
                : translations.messageAdminSkillCategoryCreateConfirm
            }
            type="submit"
            disable={loading}
          />
        </div>
      </form>
    </AuthFormLayout>
  );
};

SkillCategoryCreate.displayName = "SkillCategoryCreate";

export default SkillCategoryCreate;
