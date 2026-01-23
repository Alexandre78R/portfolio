import React, { ChangeEvent, FormEvent, ReactElement, useEffect, useState } from "react";
import ModalCustom from "@/components/ModalCustom/ModalCustom";
import InputField from "@/components/InputField/InputField";
import ButtonCustom from "@/components/Button/Button";
import { X } from "lucide-react";
import Lang from "@/lang/typeLang";
import CustomToast from "@/components/ToastCustom/CustomToast";
import {
  useUpdateExperienceMutation,
  useGetExperienceByIdQuery,
  UpdateExperienceInput,
  GetExperiencesListQuery
} from "@/types/graphql";
import { ExperienceRow } from "./ExperienceTable";
import { useLang } from "@/context/Lang/LangContext";
import LoadingCustom from "@/components/Loading/LoadingCustom";

interface ExperienceEditModalProps {
  experience: ExperienceRow | null;
  onClose: () => void;
  onRefresh: () => Promise<void | import("@apollo/client").ApolloQueryResult<GetExperiencesListQuery>>;
}

export interface ExperienceFormData {
  id: number;
  jobFR: string;
  jobEN: string;
  business: string;
  employmentContractFR: string;
  employmentContractEN: string;
  startDateFR: string;
  startDateEN: string;
  endDateFR: string;
  endDateEN: string;
  month: number;
  typeFR: string;
  typeEN: string;
}

const ExperienceEditModal = ({ experience, onClose, onRefresh }: ExperienceEditModalProps): ReactElement | null => {
  const { translations }: { translations: Lang } = useLang();
  const { showAlert } = CustomToast();

  const [form, setForm] = useState<ExperienceFormData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [updateExperienceMutation] = useUpdateExperienceMutation();

  const { data, loading: experienceLoading } = useGetExperienceByIdQuery({
    variables: { id: experience?.id ?? 0 },
    skip: !experience,
    fetchPolicy: "network-only",
  });

  // Remplir le formulaire quand les données sont chargées
  useEffect(() => {
    if (data?.getExperienceById?.experience) {
      const exp = data.getExperienceById.experience;
      setForm({
        id: Number(exp.id),
        jobFR: exp.jobFR,
        jobEN: exp.jobEN ?? "",
        business: exp.business,
        employmentContractFR: exp.employmentContractFR,
        employmentContractEN: exp.employmentContractEN ?? "",
        startDateFR: exp.startDateFR ?? "",
        startDateEN: exp.startDateEN ?? "",
        endDateFR: exp.endDateFR ?? "",
        endDateEN: exp.endDateEN ?? "",
        month: exp.month,
        typeFR: exp.typeFR,
        typeEN: exp.typeEN ?? "",
      });
    }
  }, [data]);

  if (!experience) return null;
  if (experienceLoading || !form)
    return (
      <ModalCustom open={true} onClose={onClose} width="600px">
        <LoadingCustom />
      </ModalCustom>
    );

  // Handle change pour inputs texte et nombre
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => prev ? { ...prev, [name]: value } : prev);
  };

  // Handle change pour les dates (InputField avec picker="date" renvoie directement une string)
  const handleDateChange = (field: keyof Pick<ExperienceFormData, "startDateFR" | "startDateEN" | "endDateFR" | "endDateEN">, value: string) => {
    setForm(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!form) return;

    setLoading(true);
    try {
      const updateData: UpdateExperienceInput = { ...form, month: Number(form.month) };
      const { data } = await updateExperienceMutation({ variables: { data: updateData } });

      if (data?.updateExperience?.code === 200) {
        showAlert("success", translations.messageAdminExperienceEditSuccess);
        await onRefresh();
        onClose();
      } else showAlert("error", translations.messageAdminExperienceEditError);
    } catch {
      showAlert("error", translations.messageAdminExperienceEditError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalCustom open={true} onClose={onClose} width="600px">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">{translations.messageAdminExperienceEditTitle}</h2>
        <button onClick={onClose} className="text-red-500"><X className="h-5 w-5" /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="flex justify-end gap-3 mt-6">
          <ButtonCustom text={translations.messageAdminExperienceEditCancel} onClick={onClose} />
          <ButtonCustom text={translations.messageAdminExperienceEditConfirm} type="submit" disable={loading} />
        </div>
      </form>
    </ModalCustom>
  );
};

export default ExperienceEditModal;