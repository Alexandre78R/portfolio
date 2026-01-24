import React, { ReactElement, MouseEventHandler } from "react";
import { useLang } from "@/context/Lang/LangContext";
import ButtonCustom from "../Button/Button";
import TitleH3 from "../Title/TitleH3";
import Lang from "@/lang/typeLang";
import { useCvQuery } from "@/types/graphql";
import CustomToast from "@/components/ToastCustom/CustomToast";

const AboutMe: React.FC = (): JSX.Element => {
  const { translations }: { translations: Lang } = useLang();

  const { data, loading, error }= useCvQuery();

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

  return (
    <div className="flex flex-col items-center">
      <div className="bg-body p-6 shadow-lg mt-[1%] text-center sm:max-w-[90%] md:max-w-[75%] lg:max-w-[60%] xl:max-w-[50%]">
        <TitleH3 title={translations.titleAboutMe} />
        <p className="text-text mt-4">
          {translations.descriptionAboutMe1} {translations.descriptionAboutMe2} {translations.descriptionAboutMe3}
        </p>
        <div className="mt-2">
          <ButtonCustom text={translations.buttonCV} onClick={handleClick} />
        </div>
      </div>
    </div>
  );
};

export default AboutMe;