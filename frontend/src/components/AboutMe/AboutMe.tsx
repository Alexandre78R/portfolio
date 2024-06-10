import { useLang } from "@/context/Lang/LangContext";
import { Typography } from "@mui/material";

const AboutMe: React.FC = (): React.ReactElement => {
    const { translations } = useLang()

    return (
    <div className="flex flex-col items-center">
        <div className="bg-body p-6 shadow-lg mt-[1%] text-center sm:max-w-[90%] md:max-w-[75%] lg:max-w-[60%] xl:max-w-[50%]">
        <Typography variant="h5" component="h3" className="text-text">{translations.titleAboutMe}</Typography>
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
    </div>
    );
};

export default AboutMe;