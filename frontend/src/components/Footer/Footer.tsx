import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useLang, LangKey } from "@/context/Lang/LangContext";
import type LangType from "@/lang/typeLang";

const Footer = (): JSX.Element => {
  const { translations } = useLang() as { translations: LangType; lang: LangKey };
  const currentYear: number = new Date().getFullYear();

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
            <a
              href="https://github.com/Alexandre78R"
              target="_blank"
              rel="noopener noreferrer"
              title="Github"
            >
              <GitHubIcon className="text-text hover:text-secondary" />
            </a>
            <a
              href="https://www.linkedin.com/in/alexandrerenard/"
              target="_blank"
              rel="noopener noreferrer"
              title="Linkedin"
            >
              <LinkedInIcon className="text-text hover:text-secondary" />
            </a>
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