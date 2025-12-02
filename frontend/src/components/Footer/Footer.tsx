import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LinkIcon from "@mui/icons-material/Link";
import { useLang, LangKey } from "@/context/Lang/LangContext";
import type LangType from "@/lang/typeLang";
import { useAppSelector } from "@/store/hook";
import { Social } from "@/store/slices/socialsSlice";
import Lang from "@/lang/typeLang";

const Footer = (): JSX.Element => {
  const { translations }: { translations: Lang } = useLang();
  const currentYear: number = new Date().getFullYear();
  const dataSocials: Social[] = useAppSelector((state) => state.socials.dataSocials);

  const getIconComponent = (title: string): JSX.Element => {
    switch (title.toLowerCase()) {
      case "github":
        return <GitHubIcon className="text-text hover:text-secondary" />;
      case "linkedin":
        return <LinkedInIcon className="text-text hover:text-secondary" />;
      default:
        return <LinkIcon className="text-text hover:text-secondary" />;
    }
  };

  return (
    <footer className="mt-10 bg-footer text-text py-4">
      <div className="container mx-auto flex flex-wrap justify-center">
        <div className="flex flex-col items-center mb-4 md:mb-0 lg:mx-15 flex-1">
          <p className="text-lg font-bold mb-2">{translations.footerTitle}</p>
          <ul>
            <li>
              <a href="/admin" className="hover:text-secondary">
                {translations.footerAdmin}
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center mx-4 mb-4 md:mb-0 lg:mx-25 flex-1">
          <p className="text-lg font-bold mb-2">{translations.footerNetworks}</p>
          <div className="flex space-x-4">
            {dataSocials.map((social: Social) => {
              const icon: JSX.Element = getIconComponent(social.title);
              return (
                <a
                  key={social.id}
                  href={social.url}
                  target={social.tab === 3 ? "_blank" : "_self"}
                  rel={social.tab === 3 ? "noopener noreferrer" : undefined}
                  title={social.title}
                >
                  {icon}
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <div className="text-center mt-5">
        <p className="text-sm">
          © 2024 - {currentYear} {translations.footerCopyright}
        </p>
      </div>
    </footer>
  );
};

export default Footer;