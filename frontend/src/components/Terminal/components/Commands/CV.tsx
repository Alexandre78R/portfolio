import { useContext, useEffect } from "react";
import { termContext, Term } from "../../Terminal";
import { getCurrentCmdArry } from "../../util";
import { useCvQuery } from "@/types/graphql";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

const CV = (): JSX.Element => {
  const { history, rerender }: Term = useContext<Term>(termContext);
  const currentCommand: any[] = getCurrentCmdArry(history);

  const { translations }: { translations: Lang } = useLang();

  const { data, loading, error } = useCvQuery();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
  CustomToast();
  
  useEffect(() => {
    if (rerender && currentCommand[0] === "cv") {
      if (loading) {
        showAlert("error", translations.messageCVLoading);
        return;
      }

      if (error) {
        showAlert("error", translations.messageCVNotFetch);
        return;
      }

      if (data?.cvUrl) {
        const baseUrl: string = process.env.NEXT_PUBLIC_API_URL || window.location.origin;
        window.open(`${baseUrl}${data.cvUrl}`, "_blank");
      } else {
        showAlert("error", translations.messageCVNotFound);
      }
    }
  }, [rerender, currentCommand, data, loading, error, showAlert, translations]);

  return <></>;
};

export default CV;