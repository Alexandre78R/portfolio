import { Typography } from "@mui/material";
import { useLang } from "@/context/Lang/LangContext";
import { Message } from "../Message";
import type Lang from "@/lang/typeLang";

const About = (): JSX.Element => {
  const { translations } = useLang() as { translations: Lang };

  return (
    <Message>
      <div className="bg-body p-6 shadow-lg mt-[1%] text-center sm:max-w-[90%] md:max-w-[75%] lg:max-w-[60%] xl:max-w-[40%]">
        <Typography
          variant="h3"
          component="h3"
          className="text-text text-2xl"
        >
          {translations.titleAboutMe}
        </Typography>

        <p className="text-text mt-4">
          {translations.descriptionAboutMe1}
        </p>
        <p className="text-text mt-4">
          {translations.descriptionAboutMe2}
        </p>
        <p className="text-text mt-4">
          {translations.descriptionAboutMe3}
        </p>
      </div>
    </Message>
  );
};

export default About;