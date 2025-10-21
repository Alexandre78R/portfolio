import React, { useEffect, useState, MouseEvent } from "react";
import { useTheme } from "@/context/Theme/ThemeContext";
import { useLang } from "@/context/Lang/LangContext";
import { useSectionRefs } from "@/context/SectionRefs/SectionRefsContext";
import { useChoiceView } from "@/context/ChoiceView/ChoiceViewContext";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import Button from "@/components/Button/Button";
import ToggleButton from "../Button/ToggleButton";
import ChoiceViewButton from "../Button/ChoiceViewButton";
import ButtonLinkNavBar from "../Button/ButtonLinkNavBar";
import BurgerButton from "../Button/BurgerButton";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ModalCustom from "../ModalCustom/ModalCustom";
import themes from "@/context/Theme/themes";

const Navbar: React.FC = (): JSX.Element => {
  
  const pathname: string = usePathname() ?? "/";

  const { lang, setLang, translations } = useLang();
  const { toggleTheme } = useTheme();
  const { selectedView } = useChoiceView();

  const {
    headerRef,
    aboutMeRef,
    skillRef,
    projectRef,
    educationRef,
    terminalRef,
    contactRef,
  } = useSectionRefs();

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [isCheckedLang, setIsCheckedLang] = useState<boolean>(false);

  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);

  const toggleMenu = (): void => setMenuOpen((prev: boolean) => !prev);

  const handleChangeColorTheme = (newTheme: keyof typeof themes): void => {
    toggleTheme(newTheme);
    handleClose();
    setMenuOpen(false);
  };

  const toggleCheckedLang = (): void => {
    setIsCheckedLang((prev: boolean) => !prev);
    setLang(lang === "fr" ? "en" : "fr");
  };

  const handleScrollToSection = (
    event: MouseEvent<HTMLElement>,
    sectionRef: React.RefObject<HTMLDivElement>
  ): void => {
    event.preventDefault();
    if (sectionRef.current) {
      const yOffset: number = -80;
      const y: number =
        sectionRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  useEffect(() => {
    setIsCheckedLang(translations.file === "en");
  }, [translations]);

  return (
    <nav className="bg-body p-4 fixed top-0 left-0 w-full z-50">
      <section className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex-shrink-0">
          <ButtonLinkNavBar
            sectionRef={headerRef}
            handleScrollToSection={handleScrollToSection}
            className="hover:text-secondary text-text font-bold text-xl"
          >
            {translations.navbarTitle}
          </ButtonLinkNavBar>
          {pathname !== "/" && (
            <Link href="/" className="hover:text-secondary text-text font-bold text-xl">
              {translations.navbarTitle}
            </Link>
          )}
        </div>

        {/* Desktop Menu */}
        <menu className="hidden md:block">
          <ul className="flex space-x-5">
            {selectedView !== "terminal" ? (
              <>
                {[
                  { ref: aboutMeRef, label: translations.navbarButtonAbout },
                  { ref: skillRef, label: translations.navbarButtonSkill },
                  { ref: projectRef, label: translations.navbarButtonProject },
                  { ref: educationRef, label: translations.navbarButtonCareer },
                  { ref: contactRef, label: translations.navbarButtonContact },
                ].map(({ ref, label }, i) => (
                  <li key={i}>
                    <ButtonLinkNavBar
                      sectionRef={ref}
                      handleScrollToSection={handleScrollToSection}
                      className="text-text hover:text-secondary"
                    >
                      <span className="hidden md:inline">{label}</span>
                      <span className="md:hidden">{label}</span>
                    </ButtonLinkNavBar>
                  </li>
                ))}
                <li>
                  <ToggleButton
                    toggleChecked={toggleCheckedLang}
                    option1="FR"
                    option2="EN"
                    isChecked={isCheckedLang}
                  />
                </li>
                <li>{pathname === "/" && <ChoiceViewButton />}</li>
                <li>
                  <ColorLensIcon
                    onClick={handleOpen}
                    className="z-999 hover:text-secondary text-primary"
                    fontSize="medium"
                  />
                </li>
              </>
            ) : (
              <>
                <li>{pathname === "/" && <ChoiceViewButton />}</li>
                <li>
                  <ButtonLinkNavBar
                    sectionRef={terminalRef}
                    handleScrollToSection={handleScrollToSection}
                    className="text-text hover:text-secondary"
                  >
                    <span className="hidden md:inline">{translations.navbarButtonTerminal}</span>
                    <span className="md:hidden">{translations.navbarButtonTerminal}</span>
                  </ButtonLinkNavBar>
                </li>
              </>
            )}
          </ul>
        </menu>

        {/* Mobile Burger */}
        <menu className="md:hidden">
          <BurgerButton open={menuOpen} toggleMenu={toggleMenu} />
        </menu>
      </section>

      {/* Mobile Sidebar */}
      {menuOpen && (
        <menu className="md:hidden bg-body fixed inset-y-0 right-0 z-40 w-64 px-4 py-6" data-testid="mobile-menu">
          <ul className="flex flex-col space-y-4">
            {selectedView !== "terminal" ? (
              <>
                {[
                  { ref: aboutMeRef, label: translations.navbarButtonAbout },
                  { ref: skillRef, label: translations.navbarButtonSkill },
                  { ref: projectRef, label: translations.navbarButtonProject },
                  { ref: educationRef, label: translations.navbarButtonCareer },
                ].map(({ ref, label }, i) => (
                  <li key={i} onClick={() => setMenuOpen(false)}>
                    <ButtonLinkNavBar
                      sectionRef={ref}
                      handleScrollToSection={handleScrollToSection}
                      className="text-text hover:text-secondary"
                    >
                      {label}
                    </ButtonLinkNavBar>
                  </li>
                ))}
                <li>
                  <ColorLensIcon
                    onClick={handleOpen}
                    className="hover:text-secondary text-primary"
                  />
                </li>
                <li onClick={() => setMenuOpen(false)}>
                  <ToggleButton
                    toggleChecked={toggleCheckedLang}
                    option1="FR"
                    option2="EN"
                    isChecked={isCheckedLang}
                  />
                </li>
                <li onClick={() => setMenuOpen(false)}>
                  {pathname === "/" && <ChoiceViewButton />}
                </li>
              </>
            ) : (
              <>
                <li onClick={() => setMenuOpen(false)}>
                  {pathname === "/" && <ChoiceViewButton />}
                </li>
                <li>
                  <ButtonLinkNavBar
                    sectionRef={terminalRef}
                    handleScrollToSection={handleScrollToSection}
                    className="text-text hover:text-secondary"
                  >
                    {translations.navbarButtonTerminal}
                  </ButtonLinkNavBar>
                </li>
              </>
            )}
          </ul>
        </menu>
      )}

      <ModalCustom open={open} onClose={handleClose}>
        <Button onClick={() => handleChangeColorTheme("dark")} text={translations.theme1!} />
        <Button onClick={() => handleChangeColorTheme("light")} text={translations.theme2!} />
        <Button onClick={() => handleChangeColorTheme("ubuntu")} text={translations.theme3!} />
      </ModalCustom>
    </nav>
  );
};

export default Navbar;