import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useLang } from '@/context/Lang/LangContext';

const Footer: React.FC = (): React.ReactElement => {

  const { translations } = useLang();
  
  return (
    <footer className="bg-footer text-text py-4">
      <div className="container mx-auto flex flex-wrap justify-center">
        <div className="flex flex-col items-center mb-4 md:mb-0  lg:mx-15 flex-1">
            <h3 className="text-lg font-bold mb-2">{translations.footerTitle}</h3>
            <ul>
                <li><a href="#" className="hover:text-secondary">{translations.footerAdmin}</a></li>
            </ul>
          </div>
          <div className="flex flex-col items-center mx-4 mb-4 md:mb-0 lg:mx-25 flex-1">
            <h3 className="text-lg font-bold mb-2">{translations.footerNetworks}</h3>
            <div className='flex space-x-4'>
                <a href="https://github.com/Alexandre78R" target='_blank'>
                    <GitHubIcon className='text-text hover:text-secondary' /> 
                </a>
                <a href="https://www.linkedin.com/in/alexandrerenard/" target='_blank'>
                    <LinkedInIcon className='text-text hover:text-secondary' /> 
                </a>
            </div>
          </div>
          <div className="flex flex-col items-center mx-4 mb-4 md:mb-0 lg:mx-25 flex-1">
            <h3 className="text-lg font-bold mb-2" >{translations.footerContact}</h3>
                <p>contact@alexandre-renard.dev</p>
          </div>
        </div>
        <div className="text-center mt-5">
            <p className="text-sm">{translations.footerCopyright}</p>
        </div>
    </footer>
  );
};

export default Footer;