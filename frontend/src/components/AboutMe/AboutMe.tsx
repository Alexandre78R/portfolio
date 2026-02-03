import React, { ReactElement, MouseEventHandler } from "react";
import { useLang } from "@/context/Lang/LangContext";
import ButtonCustom from "../Button/Button";
import TitleH3 from "../Title/TitleH3";
import Lang from "@/lang/typeLang";
import { useCvQuery, CvQuery } from "@/types/graphql";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { useAppSelector } from "@/store/hook";
import { sanitizeHtml } from "@/utils/sanitizeHtml";

const AboutMe: React.FC = (): JSX.Element => {
  const { translations, lang }: { translations: Lang; lang: Lang["file"] } = useLang();
  const aboutMe: AboutMe | null = useAppSelector((state) => state.aboutMe.dataAboutMe);

  const { data, loading, error } = useCvQuery<CvQuery>();

  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const handleClick: MouseEventHandler<HTMLButtonElement> = (): void => {
    if (loading) {
      showAlert("error", translations.messageCVLoading);
      return;
    }

    if (error) {
      showAlert("error", translations.messageCVNotFetch);
      return;
    }
    if (data?.cvUrl) {
      const baseUrl: string =
        process.env.NEXT_PUBLIC_API_URL || window.location.origin;
      window.open(`${baseUrl}${data.cvUrl}`, "_blank");
    } else {
      showAlert("success", translations.messageCVNotFound);
    }
  };

  const title: string = aboutMe ? (lang === "fr" ? aboutMe.titleFR : aboutMe.titleEN) : translations.titleAboutMe;
  const description: string = aboutMe ? (lang === "fr" ? aboutMe.descriptionFR : aboutMe.descriptionEN) : translations.descriptionAboutMe;

  return (
    <>
      <style>{`
        .ql-size-small { font-size: 0.875rem; }
        .ql-size-large { font-size: 1.5rem; }
        .ql-size-huge { font-size: 2.25rem; }
      `}</style>
      <div className="flex flex-col items-center">
        <div className="bg-body p-6 shadow-lg mt-[1%] text-center sm:max-w-[90%] md:max-w-[75%] lg:max-w-[60%] xl:max-w-[50%]">
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(title) }} />
          <div 
            className="text-text mt-4"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
          />
          <div className="mt-2">
            <ButtonCustom text={translations.buttonCV} onClick={handleClick} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutMe;