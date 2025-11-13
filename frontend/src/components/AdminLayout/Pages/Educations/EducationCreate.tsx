import React, {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useState,
} from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import TextAdmin from "../../components/Text/TextAdmin";
import InputField from "@/components/InputField/InputField";
import ButtonCustom from "@/components/Button/Button";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import CustomToast from "@/components/ToastCustom/CustomToast";
import {
  useCreateEducationMutation,
  CreateEducationInput,
} from "@/types/graphql";
import LoadingCustom from "@/components/Loading/LoadingCustom";

/**
 * Default form values
 * All InputField values MUST be strings
 * Number conversion is handled on submit
 */
const defaultForm: CreateEducationInput = {
  school: "",
  location: "",
  titleFR: "",
  titleEN: "",
  diplomaLevelFR: "",
  diplomaLevelEN: "",
  year: new Date().getFullYear(), // number (converted later)
  month: 0,
  typeFR: "",
  typeEN: "",
  startDateFR: "",
  startDateEN: "",
  endDateFR: "",
  endDateEN: "",
};

const EducationCreate = (): ReactElement => {
  const { translations }: { translations: Lang } = useLang();
  const { showAlert } = CustomToast();

  const [form, setForm] = useState<CreateEducationInput>(defaultForm);
  const [createEducationMutation, { loading }] =
    useCreateEducationMutation();

  /**
   * Handles text / number inputs
   */
  const handleChange = (
    e:
      | string
      | ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
  ): void => {
    if (typeof e === "string") {
      return;
    }

    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Submit form
   */
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement | HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      const payload: CreateEducationInput = {
        ...form,
        year: Number(form.year),
        month: form.month ? Number(form.month) : 0,
      };

      const res = await createEducationMutation({
        variables: { data: payload },
      });

      const response = res.data?.createEducation;

      if (response?.code === 200) {
        showAlert(
          "success",
          translations.messageAdminEducationCreateSuccess
        );
        setForm(defaultForm);
      } else {
        showAlert(
          "error",
          translations.messageAdminEducationCreateError
        );
      }
    } catch {
      showAlert("error", translations.messageErrorServerOff);
    }
  };

  return (
    <AuthFormLayout
      title={
        <TextAdmin type="h2">
          {translations.messageAdminEducationCreateTitle}
        </TextAdmin>
      }
    >
      {loading && <LoadingCustom />}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* General information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            id="school"
            label="School"
            name="school"
            value={form.school}
            onChange={handleChange}
            required
          />
          <InputField
            id="location"
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
          />
        </div>

        {/* Titles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            id="titleFR"
            label="Title FR"
            name="titleFR"
            value={form.titleFR}
            onChange={handleChange}
            required
          />
          <InputField
            id="titleEN"
            label="Title EN"
            name="titleEN"
            value={form.titleEN}
            onChange={handleChange}
          />
        </div>

        {/* Diploma levels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            id="diplomaLevelFR"
            label="Diploma level FR"
            name="diplomaLevelFR"
            value={form.diplomaLevelFR}
            onChange={handleChange}
          />
          <InputField
            id="diplomaLevelEN"
            label="Diploma level EN"
            name="diplomaLevelEN"
            value={form.diplomaLevelEN}
            onChange={handleChange}
          />
        </div>

        {/* Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            id="typeFR"
            label="Type FR"
            name="typeFR"
            value={form.typeFR}
            onChange={handleChange}
          />
          <InputField
            id="typeEN"
            label="Type EN"
            name="typeEN"
            value={form.typeEN}
            onChange={handleChange}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            id="startDateFR"
            label="Start date (FR)"
            name="startDateFR"
            value={form.startDateFR}
            onChange={val =>
              setForm(prev => ({
                ...prev,
                startDateFR: val as string,
              }))
            }
            picker="date"
            locale="fr"
          />
          <InputField
            id="startDateEN"
            label="Start date (EN)"
            name="startDateEN"
            value={form.startDateEN}
            onChange={val =>
              setForm(prev => ({
                ...prev,
                startDateEN: val as string,
              }))
            }
            picker="date"
            locale="en"
          />
          <InputField
            id="endDateFR"
            label="End date (FR)"
            name="endDateFR"
            value={form.endDateFR}
            onChange={val =>
              setForm(prev => ({
                ...prev,
                endDateFR: val as string,
              }))
            }
            picker="date"
            locale="fr"
          />
          <InputField
            id="endDateEN"
            label="End date (EN)"
            name="endDateEN"
            value={form.endDateEN}
            onChange={val =>
              setForm(prev => ({
                ...prev,
                endDateEN: val as string,
              }))
            }
            picker="date"
            locale="en"
          />
        </div>

        {/* Year / Month */}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            id="year"
            label="Year"
            name="year"
            type="number"
            value={String(form.year)}
            onChange={handleChange}
            required
          />
          <InputField
            id="month"
            label="Month"
            name="month"
            type="number"
            value={form.month ? String(form.month) : ""}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-center mt-8">
          <ButtonCustom
            text={
              loading
                ? translations.messageAdminEducationCreateLoading
                : translations.messageAdminEducationCreateConfirm
            }
            type="submit"
            disable={loading}
          />
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default EducationCreate;