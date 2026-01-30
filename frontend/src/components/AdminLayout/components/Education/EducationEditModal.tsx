import React, {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useEffect,
  useState,
} from "react";
import ModalCustom from "@/components/ModalCustom/ModalCustom";
import TextAdmin from "../Text/TextAdmin";
import InputField from "@/components/InputField/InputField";
import { X } from "lucide-react";
import { EducationRow } from "./EducationTable";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import CustomToast from "@/components/ToastCustom/CustomToast";
import {
  useUpdateEducationMutation,
  GetEducationsListQuery,
  UpdateEducationInput,
  useGetEducationByIdQuery,
  UpdateEducationMutation,
} from "@/types/graphql";
import ButtonCustom from "@/components/Button/Button";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import { FetchResult } from "@apollo/client/link/core/types";

interface EducationEditModalProps {
  education: EducationRow | null;
  onClose: () => void;
  onRefresh: () => Promise<
    void | import("@apollo/client").ApolloQueryResult<GetEducationsListQuery>
  >;
}

export interface EducationFormData {
  id: number;
  titleFR: string;
  titleEN: string;
  diplomaLevelFR: string;
  diplomaLevelEN: string;
  school: string;
  location: string;
  year: number;
  month?: number;
  typeFR: string;
  typeEN: string;
  startDateFR: string;
  startDateEN: string;
  endDateFR: string;
  endDateEN: string;
}

const EducationEditModal: React.FC<EducationEditModalProps> = ({
  education,
  onClose,
  onRefresh,
}: EducationEditModalProps): ReactElement | null => {
  const { translations }: { translations: Lang } = useLang();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
  CustomToast();

  const [form, setForm]: [EducationFormData | null, React.Dispatch<React.SetStateAction<EducationFormData | null>>] = useState<EducationFormData | null>(null);
  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [updateEducationMutation] = useUpdateEducationMutation();

  const { data, loading: educationLoading } = useGetEducationByIdQuery<GetEducationByIdQuery>({
    variables: { id: education?.id ?? 0 },
    skip: !education,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.getEducationById?.education) {
    const edu = data.getEducationById.education;
    const newData: EducationFormData = {
        id: Number(edu.id),
        school: edu.school,
        location: edu.location,
        titleFR: edu.titleFR,
        titleEN: edu.titleEN ?? "",
        diplomaLevelFR: edu.diplomaLevelFR,
        diplomaLevelEN: edu.diplomaLevelEN ?? "",
        year: edu.year,
        month: edu.month ?? undefined,
        typeFR: edu.typeFR,
        typeEN: edu.typeEN ?? "",
        startDateFR: edu.startDateFR ?? "",
        startDateEN: edu.startDateEN ?? "",
        endDateFR: edu.endDateFR ?? "",
        endDateEN: edu.endDateEN ?? "",
    };
    console.log("newData", newData);
    setForm(newData);
    }
  }, [data]);

  if (!education) return null;

  if (educationLoading || !form) {
    return (
      <ModalCustom open={true} onClose={onClose} width="600px">
        <LoadingCustom />
      </ModalCustom>
    );
  }

  const handleChange: (
    e: string | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void = (
    e: string | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    if (typeof e === "string") {
        return;
    } else {
        const { name, value } = e.target;
        setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
    }
  };

  const handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!form) return;

    setLoading(true);

    try {
      const updateData: UpdateEducationInput = {
        ...form,
        id: Number(form.id),
        year: Number(form.year),
        month: form.month ? Number(form.month) : null,
      };

      const result: FetchResult<UpdateEducationMutation> =
        await updateEducationMutation({
         variables: { data: updateData },
        });

      const { data } = result;

      if (data?.updateEducation?.code === 200) {
        showAlert("success", translations.messageAdminEducationEditSuccess);
        await onRefresh();
        onClose();
      } else {
        showAlert("error", translations.messageAdminEducationEditError);
      }
    } catch {
      showAlert("error", translations.messageAdminEducationEditError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalCustom open={true} onClose={onClose} width="600px">
      <div className="mb-4 flex items-center justify-between">
        <TextAdmin type="h2">
          {translations.messageAdminEducationEditTitle}
        </TextAdmin>
        <button onClick={onClose} className="text-red-500">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField id="school" label="School" name="school" value={form.school} onChange={handleChange} />
        <InputField id="location" label="Location" name="location" value={form.location} onChange={handleChange} />
        <InputField id="titleFR" label="Title FR" name="titleFR" value={form.titleFR} onChange={handleChange} />
        <InputField id="titleEN" label="Title EN" name="titleEN" value={form.titleEN} onChange={handleChange} />

        <div className="grid grid-cols-2 gap-4">
            <InputField
                id="startDateFR"
                label="Start date (FR)"
                name="startDateFR"
                value={form.startDateFR}
                onChange={(val) =>
                setForm((prev) => (prev ? { ...prev, startDateFR: val as string } : prev))
                }
                picker="date"
                locale="fr"
            />

            <InputField
                id="startDateEN"
                label="Start date (EN)"
                name="startDateEN"
                value={form.startDateEN}
                onChange={(val) =>
                setForm((prev) => (prev ? { ...prev, startDateEN: val as string } : prev))
                }
                picker="date"
                locale="en"
            />

            <InputField
                id="endDateFR"
                label="End date (FR)"
                name="endDateFR"
                value={form.endDateFR}
                onChange={(val) =>
                setForm((prev) => (prev ? { ...prev, endDateFR: val as string } : prev))
                }
                picker="date"
                locale="fr"
            />

            <InputField
                id="endDateEN"
                label="End date (EN)"
                name="endDateEN"
                value={form.endDateEN}
                onChange={(val) =>
                setForm((prev) => (prev ? { ...prev, endDateEN: val as string } : prev))
                }
                picker="date"
                locale="en"
            />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <ButtonCustom text={translations.messageAdminEducationEditCancel} onClick={onClose} />
          <ButtonCustom text={translations.messageAdminEducationEditConfirm} type="submit" disable={loading} />
        </div>
      </form>
    </ModalCustom>
  );
};

export default EducationEditModal;