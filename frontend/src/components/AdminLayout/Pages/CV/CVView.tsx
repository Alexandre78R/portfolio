import React from "react";
import { useLang } from "@/context/Lang/LangContext";
import ButtonCustom from "@/components/Button/Button";
import TitleH3 from "@/components/Title/TitleH3";
import Lang from "@/lang/typeLang";
import { useCvQuery } from "@/types/graphql";
import CustomToast from "@/components/ToastCustom/CustomToast";

const CVView = (): React.ReactElement => {
  const { translations }: { translations: Lang } = useLang();

  const { data, loading, error } = useCvQuery();

  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const handleOpenCV = (): void => {
    if (loading) {
      showAlert("error", translations.messageCVLoading);
      return;
    }

    if (error) {
      showAlert("error", translations.messageCVNotFetch);
      return;
    }

    if (data?.cvUrl) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || window.location.origin;
      window.open(`${baseUrl}${data.cvUrl}`, "_blank");
    } else {
      showAlert("error", translations.messageCVNotFound);
    }
  };

  return (
    <div className="flex flex-col">
      <p className="text-primary text-lg font-semibold">{translations["sideBarAdmin-cv/view"]}</p>
      <div className="bg-body p-6 shadow-lg mt-[1%] text-center sm:max-w-[90%] md:max-w-[75%] lg:max-w-[60%] xl:max-w-[50%]">
        <div className="mt-4">
          <ButtonCustom text={translations.buttonCV} onClick={handleOpenCV} />
        </div>
      </div>
    </div>
  );
};

export default CVView;