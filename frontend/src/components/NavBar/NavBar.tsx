import React, { useEffect, useState } from 'react';
import { useTheme } from "@/context/Theme/ThemeContext";
import { useLang } from '@/context/Lang/LangContext';
import { useSectionRefs } from "@/context/SectionRefs/SectionRefsContext";
import ColorLensIcon from '@mui/icons-material/ColorLens';
import Box from '@mui/material/Box';
import Button from '@/components/Button/Button';
import Modal from '@mui/material/Modal';
import { useChoiceView } from '@/context/ChoiceView/ChoiceViewContext';
import ToggleButton from '../Button/ToggleButton';
import ChoiceViewButton from '../Button/ChoiceViewButton';

const Navbar: React.FC = (): React.ReactElement => {

  const { lang, setLang, translations } = useLang();
  const { aboutMeRef, projectRef, headerRef, skillRef, terminalRef, educationRef, contactRef } = useSectionRefs();
  const { toggleTheme } = useTheme();
  const { selectedView } = useChoiceView();

  const [menuOpen, setMenuOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [open, setOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = React.useState<boolean>(false);
  const [isCheckedLang, setIsCheckedLang]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

  const handleOpen: () => void = () :void => setOpen(true);
  const handleClose: () => void = () :void => setOpen(false);

  const toggleMenu: () => void = () :void => setMenuOpen(!menuOpen);

  const handleChangeColorTheme: (newTheme :string) => void = (newTheme :string) :void => {
    toggleTheme(newTheme);
    handleClose();
    setMenuOpen(false);
  }

  useEffect(() => {
    setIsCheckedLang(translations.file === "en");
  }, [translations]);
  
  const toggleCheckedLang: () => void = () : void => {
    setIsCheckedLang(!isCheckedLang);
    setLang(lang === "fr" ? "en" : "fr");
  };

  const handleScrollToSection: (event: React.MouseEvent<HTMLElement>, sectionRef: React.RefObject<HTMLDivElement>) => void = (event: React.MouseEvent<HTMLElement>, sectionRef: React.RefObject<HTMLDivElement>) : void => {
    event.preventDefault();
    if (sectionRef?.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <nav className="bg-body p-4 fixed top-0 left-0 w-full z-50">
      <section className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex-shrink-0">
          <button onClick={(e) => handleScrollToSection(e, headerRef)} className="hover:text-secondary text-text font-bold text-xl">{translations.navbarTitle}</button>
        </div>
        <menu className="hidden md:block">
          <ul className="flex space-x-5">
            { 
              selectedView !== "terminal" ?
              <>
                <li>
                  <button onClick={(e) => handleScrollToSection(e, aboutMeRef)} className="text-text hover:text-secondary">
                    <span className="hidden md:inline">{translations.navbarButtonAbout}</span>
                    <span className="md:hidden">About</span>
                  </button>
                </li>
                <li>
                  <button onClick={(e) => handleScrollToSection(e, skillRef)} className="text-text hover:text-secondary">
                    <span className="hidden md:inline">{translations.navbarButtonSkill}</span>
                    <span className="md:hidden">Skills</span>
                  </button>
                </li>
                <li>
                  <button onClick={(e) => handleScrollToSection(e, projectRef)} className="text-text hover:text-secondary">
                    <span className="hidden md:inline">{translations.navbarButtonProject}</span>
                    <span className="md:hidden">Projects</span>
                  </button>
                </li>
                <li>
                  <button onClick={(e) => handleScrollToSection(e, educationRef)} className="text-text hover:text-secondary">
                    <span className="hidden md:inline">{translations.navbarButtonCareer}</span>
                    <span className="md:hidden">Education</span>
                  </button>
                </li>
                {/* <li>
                  <button onClick={(e) => handleScrollToSection(e, contactRef)} className="text-text hover:text-secondary">
                    <span className="hidden md:inline">{translations.navbarButtonContact}</span>
                    <span className="md:hidden">Education</span>
                  </button>
                </li> */}
                <li>
                  <ToggleButton
                      toggleChecked={toggleCheckedLang}
                      option1='FR'
                      option2='EN'
                      isChecked={isCheckedLang} 
                    />
                </li>
                <li>
                  <ChoiceViewButton />
                </li>
                <li>
                  <ColorLensIcon onClick={handleOpen} className="z-999 hover:text-secondary text-primary" fontSize="medium" />
                </li>
              </>
              :
              <>
                <li>
                    <ChoiceViewButton />
                </li>
                <li>
                  <button onClick={(e) => handleScrollToSection(e, terminalRef)} className="text-text hover:text-secondary">
                    <span className="hidden md:inline">{translations.navbarButtonTerminal}</span>
                    <span className="md:hidden">Terminal</span>
                  </button>
                </li>
              </>
            }
          </ul>
        </menu>
        <menu className="md:hidden">
          <button className="text-text focus:outline-none relative z-50" onClick={toggleMenu}>
            {menuOpen ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6h16M4 12h16m-7 6h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </menu>
      </section>
      {menuOpen && (
        <menu className="md:hidden bg-body fixed inset-y-0 right-0 z-40 w-64 px-4 py-6">
          <ul className="flex flex-col space-y-4">
            { 
              selectedView !== "terminal" ?
              <>
                <li><button onClick={(e) => handleScrollToSection(e, aboutMeRef)} className="text-text hover:text-secondary">{translations.navbarButtonAbout}</button></li>
                <li><button onClick={(e) => handleScrollToSection(e, skillRef)} className="text-text hover:text-secondary">{translations.navbarButtonSkill}</button></li>
                <li><button onClick={(e) => handleScrollToSection(e, projectRef)} className="text-text hover:text-secondary">{translations.navbarButtonProject}</button></li>
                <li><button onClick={(e) => handleScrollToSection(e, educationRef)} className="text-text hover:text-secondary">{translations.navbarButtonCareer}</button></li>
                <li><ColorLensIcon onClick={handleOpen} className="hover:text-secondary text-primary"/></li>
                <li onClick={() => setMenuOpen(false)}>
                  <ToggleButton
                    toggleChecked={toggleCheckedLang}
                    option1='FR'
                    option2='EN'
                    isChecked={isCheckedLang} 
                  />
                </li>
                <li onClick={() => setMenuOpen(false)}>
                  <ChoiceViewButton />
                </li>
              </>
              : 
              <>
                <li onClick={() => setMenuOpen(false)}>
                  <ChoiceViewButton />
                </li>
                <li>
                  <button onClick={(e) => handleScrollToSection(e, terminalRef)} className="text-text hover:text-secondary">{translations.navbarButtonTerminal}</button>
                </li>
              </>
            }
          </ul>
        </menu>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="bg-body absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-400 p-4 border-none">
          <div className="p-1">
            <Button onClick={() => handleChangeColorTheme("dark")} text={translations?.theme1}/>
            <Button onClick={() => handleChangeColorTheme("light")} text={translations?.theme2}/>
            <Button onClick={() => handleChangeColorTheme("ubuntu")} text={translations?.theme3}/>
          </div>
        </Box>
      </Modal>
    </nav>
  );
};

export default Navbar;