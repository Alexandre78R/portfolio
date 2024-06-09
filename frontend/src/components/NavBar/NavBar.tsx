import React, { useEffect, useState } from 'react';
import { useTheme } from "@/context/Theme/ThemeContext";
import { useLang } from '@/context/Lang/LangContext';
import { useSectionRefs } from "@/context/SectionRefs/SectionRefsContext";
import ColorLensIcon from '@mui/icons-material/ColorLens';
import Box from '@mui/material/Box';
import Button from '@/components/Button/Button';
import Modal from '@mui/material/Modal';

const Navbar: React.FC = (): React.ReactElement => {

  const { lang, setLang, translations } = useLang();
  const { aboutMeRef, projectRef, headerRef, skillRef, choiceViewRef } = useSectionRefs();
  const { toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleOpen = () :void => setOpen(true);
  const handleClose = () :void => setOpen(false);

  const toggleMenu = () :void => setMenuOpen(!menuOpen);

  const handleChangeColorTheme = (newTheme :string) :void => {
    toggleTheme(newTheme);
    handleClose();
    setMenuOpen(false);
  }

  useEffect(() => {
    setIsChecked(translations.file === "en");
  }, [translations]);
  
  const toggleChecked = () : void => {
    setIsChecked(!isChecked);
    setLang(lang === "fr" ? "en" : "fr");
  };

  const handleScrollToSection = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, sectionRef: React.RefObject<HTMLDivElement>) : void => {
    event.preventDefault();
    if (sectionRef?.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  
  return (
    <nav className="bg-body p-3 fixed top-0 left-0 w-full z-50">
      <section className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex-shrink-0">
          <a href="" onClick={(e) => handleScrollToSection(e, headerRef)} className="hover:text-secondary text-text font-bold text-xl">{translations.navbarTitle}</a>
        </div>
        <menu className="hidden md:block">
          <ul className="flex space-x-5">
            <li><a href="" onClick={(e) => handleScrollToSection(e, choiceViewRef)}  className="text-text hover:text-secondary">{translations.navbarButtonChoiceView}</a></li>
            <li><a href="" onClick={(e) => handleScrollToSection(e, aboutMeRef)}  className="text-text hover:text-secondary">{translations.navbarButtonAbout}</a></li>
            <li><a href="" onClick={(e) => handleScrollToSection(e, skillRef)}  className="text-text hover:text-secondary">{translations.navbarButtonSkill}</a></li>
            <li><a href="" onClick={(e) => handleScrollToSection(e, projectRef)}  className="text-text hover:text-secondary">{translations.navbarButtonProject}</a></li>
            <li>
            <button  className="relative inline-block" onClick={toggleChecked}>
              <label htmlFor="toggleButton" className="cursor-pointer">
                <div className={`w-12 h-6 bg-gray-300 rounded-full shadow-inner 'bg-grey'`}>
                  <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-20 w-6 text-xs font-bold text-gray-500 text-center ${!isChecked ? 'text-white' : 'text-gray-500'}`}>{translations.lang1}</div>
                  <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-20 w-6 text-xs font-bold text-gray-500 text-center ${!isChecked ? 'text-gray-500' : 'text-white'}`}>{translations.lang2}</div>
                  <div className={`absolute left-0 w-6 h-6 rounded-full  bg-primary z-10 shadow-md transition-transform duration-300 ${isChecked ? 'transform translate-x-full' : ''}`}></div>
                </div>
              </label>
            </button>
            </li>
            <li><ColorLensIcon onClick={handleOpen} className="z-999 hover:text-secondary text-primary"/></li>
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
          <li><a href="" onClick={(e) => handleScrollToSection(e, choiceViewRef)}  className="text-text hover:text-secondary">{translations.navbarButtonChoiceView}</a></li>
            <li><a href="" onClick={(e) => handleScrollToSection(e, aboutMeRef)} className="text-text hover:text-secondary">{translations.navbarButtonAbout}</a></li>
            <li><a href="" onClick={(e) => handleScrollToSection(e, skillRef)}  className="text-text hover:text-secondary">{translations.navbarButtonSkill}</a></li>
            <li><a href="" onClick={(e) => handleScrollToSection(e, projectRef)} className="text-text hover:text-secondary">{translations.navbarButtonProject}</a></li>
            <li><ColorLensIcon onClick={handleOpen} className="hover:text-secondary text-primary"/></li>
            <li>
            <div className="relative inline-block" onClick={toggleChecked}>
              <label htmlFor="toggleButton" className="cursor-pointer">
                <div className={`w-12 h-6 bg-gray-300 rounded-full shadow-inner 'bg-grey'`}>
                  <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-20 w-6 text-xs font-bold text-gray-500 text-center ${!isChecked ? 'text-white' : 'text-gray-500'}`}>FR</div>
                  <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-20 w-6 text-xs font-bold text-gray-500 text-center ${!isChecked ? 'text-gray-500' : 'text-white'}`}>EN</div>
                  <div className={`absolute left-0 w-6 h-6 rounded-full bg-primary z-10 shadow-md transition-transform duration-300 ${isChecked ? 'transform translate-x-full' : ''}`}></div>
                </div>
              </label>
            </div>
            </li>
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
          <Button onClick={() => handleChangeColorTheme("dark") } text={translations?.theme1}/>
          <Button onClick={() => handleChangeColorTheme("light")}  text={translations?.theme2}/>
          <Button onClick={() => handleChangeColorTheme("ubuntu")} text={translations?.theme3}/>
        </div>
        </Box>
      </Modal>
    </nav>
  );
};

export default Navbar;