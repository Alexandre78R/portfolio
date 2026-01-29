import React, {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useEffect,
  useState,
} from "react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";
import TextAdmin from "../../components/Text/TextAdmin";
import HtmlEditor from "../../components/Editor/HtmlEditor";
import ButtonCustom from "@/components/Button/Button";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import { useLang } from "@/context/Lang/LangContext";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { useMutation } from "@apollo/client";
import { useGetAboutMeQuery, type UpdateAboutMeInput } from "@/types/graphql";
import { UPDATE_ABOUT_ME } from "@/requetes/mutations/aboutme.mutations";
import Lang from "@/lang/typeLang";

type UpdateAboutMeResponse = {
  updateAboutMe: {
    code: number;
    message: string;
    aboutMe?: {
      id: string;
      titleEN: string;
      titleFR: string;
      descriptionEN: string;
      descriptionFR: string;
    } | null;
  };
};

const defaultForm: UpdateAboutMeInput = {
  id: 0,
  titleEN: "",
  titleFR: "",
  descriptionEN: "",
  descriptionFR: "",
};

const AboutMeUpdate: React.FC = (): ReactElement => {
  const { translations }: { translations: Lang } = useLang();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const [form, setForm]: [UpdateAboutMeInput, React.Dispatch<React.SetStateAction<UpdateAboutMeInput>>] =
    useState<UpdateAboutMeInput>(defaultForm);

  const { data, loading } = useGetAboutMeQuery();
  const [updateAboutMeMutation, { loading: updating }] = useMutation<
    UpdateAboutMeResponse,
    { data: UpdateAboutMeInput }
  >(UPDATE_ABOUT_ME);

  useEffect((): void => {
    const aboutMe = data?.getAboutMe?.aboutMe;
    if (!aboutMe) {
      return;
    }

    setForm({
      id: Number(aboutMe.id),
      titleEN: aboutMe.titleEN ?? "",
      titleFR: aboutMe.titleFR ?? "",
      descriptionEN: aboutMe.descriptionEN ?? "",
      descriptionFR: aboutMe.descriptionFR ?? "",
    });
  }, [data]);

  const handleTitleFRChange = (content: string): void => {
    setForm((prev) => ({ ...prev, titleFR: content }));
  };

  const handleTitleENChange = (content: string): void => {
    setForm((prev) => ({ ...prev, titleEN: content }));
  };

  const handleDescriptionFRChange = (content: string): void => {
    setForm((prev) => ({ ...prev, descriptionFR: content }));
  };

  const handleDescriptionENChange = (content: string): void => {
    setForm((prev) => ({ ...prev, descriptionEN: content }));
  };

  const handleSubmit: (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => Promise<void> = async (
    e: FormEvent<HTMLFormElement | HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!form.id) {
      showAlert("error", translations.messagePageDashBoardErreurData || "Aucune donnée à mettre à jour.");
      return;
    }

    try {
      const res = await updateAboutMeMutation({
        variables: {
          data: {
            id: form.id,
            titleEN: form.titleEN,
            titleFR: form.titleFR,
            descriptionEN: form.descriptionEN,
            descriptionFR: form.descriptionFR,
          },
        },
      });

      const response = res.data?.updateAboutMe;

      if (response?.code === 200) {
        showAlert("success", response.message || "Mise à jour réussie.");
      } else {
        showAlert("error", response?.message || "Échec de la mise à jour.");
      }
    } catch (error) {
      console.error(error);
      showAlert("error", translations.messageErrorServerOff || "Erreur serveur.");
    }
  };

  return (
    <AuthFormLayout
      title={
        <TextAdmin type="h2">
          {translations["sideBarAdmin-aboutme/update"] || "About Me"}
        </TextAdmin>
      }
    >
      {(loading || updating) && <LoadingCustom />}

      <form className="space-y-12" onSubmit={handleSubmit}>
        <div className="space-y-8">
          <div className="space-y-2">
            <TextAdmin type="p">{translations.titleAboutMe || "Titre (FR)"}</TextAdmin>
            <HtmlEditor
              content={form.titleFR ?? ""}
              onChange={handleTitleFRChange}
            />
          </div>

          <div className="space-y-2">
            <TextAdmin type="p">{translations.titleAboutMe || "Title (EN)"}</TextAdmin>
            <HtmlEditor
              content={form.titleEN ?? ""}
              onChange={handleTitleENChange}
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <TextAdmin type="p">{translations.descriptionAboutMe1 || "Description (FR)"}</TextAdmin>
            <HtmlEditor
              content={form.descriptionFR ?? ""}
              onChange={handleDescriptionFRChange}
            />
          </div>

          <div className="space-y-2">
            <TextAdmin type="p">{translations.descriptionAboutMe1 || "Description (EN)"}</TextAdmin>
            <HtmlEditor
              content={form.descriptionEN ?? ""}
              onChange={handleDescriptionENChange}
            />
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ButtonCustom
            text={updating ? "Sauvegarde..." : "Sauvegarder"}
            type="submit"
            disable={updating}
          />
        </div>
      </form>
    </AuthFormLayout>
  );
};

AboutMeUpdate.displayName = "AboutMeUpdate";

export default AboutMeUpdate;