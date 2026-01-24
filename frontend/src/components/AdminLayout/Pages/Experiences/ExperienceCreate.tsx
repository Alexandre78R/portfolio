import React, { ChangeEvent, FormEvent, ReactElement, useState } from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import InputField from "@/components/InputField/InputField";
import ButtonCustom from "@/components/Button/Button";
import CustomToast from "@/components/ToastCustom/CustomToast";
import Lang from "@/lang/typeLang";
import { useLang } from "@/context/Lang/LangContext";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import { useCreateExperienceMutation, CreateExperienceInput, CreateExperienceMutation } from "@/types/graphql";
import { FetchResult } from "@apollo/client/link/core/types";

const defaultForm: CreateExperienceInput = {
  jobFR: "",
  jobEN: "",
  business: "",
  employmentContractFR: "",
  employmentContractEN: "",
  startDateFR: "",
  startDateEN: "",
  endDateFR: "",
  endDateEN: "",
  month: 0,
  typeFR: "",
  typeEN: "",
};

const ExperienceCreate = (): ReactElement => {
  const { translations }: { translations: Lang } = useLang();
  const { showAlert } = CustomToast();
  const [form, setForm]: [CreateExperienceInput, React.Dispatch<React.SetStateAction<CreateExperienceInput>>] = useState<CreateExperienceInput>(defaultForm);
  const [createExperienceMutation, { loading }] = useCreateExperienceMutation();

  const handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange: (field: keyof Pick<CreateExperienceInput, "startDateFR" | "startDateEN" | "endDateFR" | "endDateEN">, value: string) => void = (field: keyof Pick<CreateExperienceInput, "startDateFR" | "startDateEN" | "endDateFR" | "endDateEN">, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit: (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => Promise<void> = async (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const payload: CreateExperienceInput = { ...form, month: Number(form.month) };
      const res: FetchResult<CreateExperienceMutation> = await createExperienceMutation({ variables: { data: payload } });
      if (res.data?.createExperience?.code === 200) {
        showAlert("success", translations.messageAdminExperienceCreateSuccess);
        setForm(defaultForm);
      } else showAlert("error", translations.messageAdminExperienceCreateError);
    } catch {
      showAlert("error", translations.messageErrorServerOff);
    }
  };

  return (
    <AuthFormLayout title={<h2 className="text-xl font-bold">{translations.messageAdminExperienceCreateTitle}</h2>}>
      {loading && <LoadingCustom />}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Inputs texte et number */}
        <InputField id="jobFR" label="Job FR" name="jobFR" value={form.jobFR} onChange={handleChange} />
        <InputField id="jobEN" label="Job EN" name="jobEN" value={form.jobEN} onChange={handleChange} />
        <InputField id="business" label="Business" name="business" value={form.business} onChange={handleChange} />
        <InputField id="employmentContractFR" label="Contract FR" name="employmentContractFR" value={form.employmentContractFR} onChange={handleChange} />
        <InputField id="employmentContractEN" label="Contract EN" name="employmentContractEN" value={form.employmentContractEN} onChange={handleChange} />
        <InputField id="typeFR" label="Type FR" name="typeFR" value={form.typeFR} onChange={handleChange} />
        <InputField id="typeEN" label="Type EN" name="typeEN" value={form.typeEN} onChange={handleChange} />
        <InputField id="month" label="Month" name="month" type="number" value={String(form.month)} onChange={handleChange} />

        {/* Inputs date */}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            id="startDateFR"
            label="Start FR"
            name="startDateFR"
            value={form.startDateFR}
            onChange={(val) => handleDateChange("startDateFR", val as string)}
            picker="date"
            locale="fr"
          />
          <InputField
            id="startDateEN"
            label="Start EN"
            name="startDateEN"
            value={form.startDateEN}
            onChange={(val) => handleDateChange("startDateEN", val as string)}
            picker="date"
            locale="en"
          />
          <InputField
            id="endDateFR"
            label="End FR"
            name="endDateFR"
            value={form.endDateFR}
            onChange={(val) => handleDateChange("endDateFR", val as string)}
            picker="date"
            locale="fr"
          />
          <InputField
            id="endDateEN"
            label="End EN"
            name="endDateEN"
            value={form.endDateEN}
            onChange={(val) => handleDateChange("endDateEN", val as string)}
            picker="date"
            locale="en"
          />
        </div>

        <div className="flex justify-center mt-8">
          <ButtonCustom
            text={loading ? translations.messageAdminExperienceCreateLoading : translations.messageAdminExperienceCreateConfirm}
            type="submit"
            disable={loading}
          />
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default ExperienceCreate;