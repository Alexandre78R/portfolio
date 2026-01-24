import { Typography } from "@mui/material";
import { useLang } from "@/context/Lang/LangContext";
import { Message } from "../Message";
import type Lang from "@/lang/typeLang";
import { useAppSelector } from "@/store/hook";

const About: React.FC = (): JSX.Element => {
  const { translations, lang }: { translations: Lang; lang: Lang["file"] } = useLang();
  const aboutMe: AboutMe | null = useAppSelector((state) => state.aboutMe.dataAboutMe);

  const title: string = aboutMe ? (lang === "fr" ? aboutMe.titleFR : aboutMe.titleEN) : translations.titleAboutMe;
  const description: string = aboutMe ? (lang === "fr" ? aboutMe.descriptionFR : aboutMe.descriptionEN) : "";
  
  const paragraphs: string[] = description ? description.split('\n').filter(p => p.trim()) : [
    translations.descriptionAboutMe1,
    translations.descriptionAboutMe2,
    translations.descriptionAboutMe3
  ];

  return (
    <Message>
      <div className="bg-body p-6 shadow-lg mt-[1%] text-center sm:max-w-[90%] md:max-w-[75%] lg:max-w-[60%] xl:max-w-[40%]">
        <Typography
          variant="h3"
          component="h3"
          className="text-text text-2xl"
        >
          {title}
        </Typography>

        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-text mt-4">
            {paragraph}
          </p>
        ))}
      </div>
    </Message>
  );
};

export default About;