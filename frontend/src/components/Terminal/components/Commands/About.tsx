import { Typography } from "@mui/material";
import { useLang } from "@/context/Lang/LangContext";
import { Message } from "../Message";
import type Lang from "@/lang/typeLang";
import { useAppSelector } from "@/store/hook";
import { sanitizeHtml } from "@/utils/sanitizeHtml";

const About: React.FC = (): JSX.Element => {
  const { translations, lang }: { translations: Lang; lang: Lang["file"] } = useLang();
  const aboutMe: AboutMe | null = useAppSelector((state) => state.aboutMe.dataAboutMe);

  const title: string = aboutMe ? (lang === "fr" ? aboutMe.titleFR : aboutMe.titleEN) : translations.titleAboutMe;
  const description: string = aboutMe ? (lang === "fr" ? aboutMe.descriptionFR : aboutMe.descriptionEN) : translations.descriptionAboutMe;

  return (
    <>
      <style>{`
        .ql-size-small { font-size: 0.875rem; }
        .ql-size-large { font-size: 1.5rem; }
        .ql-size-huge { font-size: 2.25rem; }
      `}</style>
      <Message>
        <div className="bg-body p-6 shadow-lg mt-[1%] text-center sm:max-w-[90%] md:max-w-[75%] lg:max-w-[60%] xl:max-w-[40%]">
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(title) }} />
          <div 
            className="text-text mt-4"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
          />
        </div>
      </Message>
    </>
  );
};

export default About;