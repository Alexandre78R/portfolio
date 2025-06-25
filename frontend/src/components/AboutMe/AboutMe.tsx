import { useLang } from "@/context/Lang/LangContext";
import { Typography } from "@mui/material";
import ButtonCustom from "../Button/Button";
import TitleH3 from "../Title/TitleH3";

const AboutMe: React.FC = (): React.ReactElement => {
  const { translations } = useLang();

  const handleClick: () => void = (): void => {
    window.open("/Alexandre-Renard-CV.pdf", "_blank");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-body p-6 shadow-lg mt-[1%] text-center sm:max-w-[90%] md:max-w-[75%] lg:max-w-[60%] xl:max-w-[50%]">
        <TitleH3 title={translations.titleAboutMe} />
        <p className="text-text mt-4">{translations.descriptionAboutMe1}</p>
        <p className="text-text mt-4">{translations.descriptionAboutMe2}</p>
        <p className="text-text mt-4">{translations.descriptionAboutMe3}</p>
        <div className="mt-2">
          <ButtonCustom text={translations.buttonCV} onClick={handleClick} />
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
