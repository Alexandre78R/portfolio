import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useLang } from "@/context/Lang/LangContext";

const Footer: React.FC = (): React.ReactElement => {
  const { translations } = useLang();

  return (
    <footer className="mt-10 bg-footer text-text py-4">
      <div className="container mx-auto flex flex-wrap justify-center">
        <div className="flex flex-col items-center mb-4 md:mb-0  lg:mx-15 flex-1">
          <p className="text-lg font-bold mb-2">{translations.footerTitle}</p>
          <ul>
            <li>
              <a href="#" className="hover:text-secondary">
                {translations.footerAdmin}
              </a>
            </li>
          </ul>
        </div>
        <div className="flex flex-col items-center mx-4 mb-4 md:mb-0 lg:mx-25 flex-1">
          <p className="text-lg font-bold mb-2">
            {translations.footerNetworks}
          </p>
          <div className="flex space-x-4">
            <a
              href="https://github.com/Alexandre78R"
              target="_blank"
              rel="alternate"
              title="Github"
            >
              <GitHubIcon className="text-text hover:text-secondary" />
            </a>
            <a
              href="https://www.linkedin.com/in/alexandrerenard/"
              target="_blank"
              rel="alternate"
              title="Linkedin"
            >
              <LinkedInIcon className="text-text hover:text-secondary" />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center mt-5">
        <p className="text-sm">{translations.footerCopyright}</p>
      </div>
    </footer>
  );
};

export default Footer;
