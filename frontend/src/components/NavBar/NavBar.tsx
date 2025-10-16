import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ColorLensIcon from "@mui/icons-material/ColorLens";

import { useTheme } from "@/context/Theme/ThemeContext";
import { useLang, LangKey } from "@/context/Lang/LangContext";
import { useSectionRefs } from "@/context/SectionRefs/SectionRefsContext";
import { useChoiceView } from "@/context/ChoiceView/ChoiceViewContext";

import Button from "@/components/Button/Button";
import ToggleButton from "../Button/ToggleButton";
import ChoiceViewButton from "../Button/ChoiceViewButton";
import ButtonLinkNavBar from "../Button/ButtonLinkNavBar";
import BurgerButton from "../Button/BurgerButton";
import ModalCustom from "../ModalCustom/ModalCustom";

import { ThemeKey } from "@/context/Theme/themes";
import type LangType from "@/lang/typeLang";

export type SectionRef = React.RefObject<HTMLDivElement>;

const Navbar = (): JSX.Element => {
  const pathname = usePathname() ?? "/";

  const { lang, setLang, translations } = useLang() as {
    lang: LangKey;
    setLang: (lang: LangKey) => void;
    translations: LangType;
  };

  const {
    aboutMeRef,
    projectRef,
    headerRef,
    skillRef,
    terminalRef,
    educationRef,
    contactRef,
  } = useSectionRefs() as Record<
    | "aboutMeRef"
    | "projectRef"
    | "headerRef"
    | "skillRef"
    | "terminalRef"
    | "educationRef"
    | "contactRef",
    SectionRef
  >;

  const { toggleTheme } = useTheme() as {
    toggleTheme: (theme: ThemeKey) => void;
  };

  const { selectedView } = useChoiceView() as {
    selectedView: "default" | "terminal";
  };

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isCheckedLang, setIsCheckedLang] = useState<boolean>(false);

  const handleOpenModal = (): void => setModalOpen(true);
  const handleCloseModal = (): void => setModalOpen(false);

  const toggleMenu = (): void => {
    setMenuOpen((prev) => !prev);
  };

  const handleChangeColorTheme = (theme: ThemeKey): void => {
    toggleTheme(theme);
    handleCloseModal();
    setMenuOpen(false);
  };

  const toggleCheckedLang = (): void => {
    setIsCheckedLang((prev) => !prev);
    setLang(lang === "fr" ? "en" : "fr");
  };

  const handleScrollToSection = (
    event: React.MouseEvent<HTMLElement>,
    sectionRef: SectionRef
  ): void => {
    event.preventDefault();

    if (!sectionRef.current) return;

    const yOffset = -80;
    const y =
      sectionRef.current.getBoundingClientRect().top +
      window.scrollY +
      yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
    setMenuOpen(false);
  };

  useEffect((): void => {
    setIsCheckedLang(translations.file === "en");
  }, [translations.file]);

  return (
    <nav className="bg-body p-4 fixed top-0 left-0 w-full z-50">
      <section className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex-shrink-0">
          {pathname === "/" ? (
            <ButtonLinkNavBar
              sectionRef={headerRef}
              handleScrollToSection={handleScrollToSection}
              className="hover:text-secondary text-text font-bold text-xl"
            >
              {translations.navbarTitle}
            </ButtonLinkNavBar>
          ) : (
            <Link
              href="/"
              className="hover:text-secondary text-text font-bold text-xl"
            >
              {translations.navbarTitle}
            </Link>
          )}
        </div>

        <menu className="hidden md:block">
          <ul className="flex space-x-5">
            {selectedView !== "terminal" ? (
              <>
                <li>
                  <ButtonLinkNavBar
                    sectionRef={aboutMeRef}
                    handleScrollToSection={handleScrollToSection}
                    className="text-text hover:text-secondary"
                  >
                    {translations.navbarButtonAbout}
                  </ButtonLinkNavBar>
                </li>

                <li>
                  <ButtonLinkNavBar
                    sectionRef={skillRef}
                    handleScrollToSection={handleScrollToSection}
                    className="text-text hover:text-secondary"
                  >
                    {translations.navbarButtonSkill}
                  </ButtonLinkNavBar>
                </li>

                <li>
                  <ButtonLinkNavBar
                    sectionRef={projectRef}
                    handleScrollToSection={handleScrollToSection}
                    className="text-text hover:text-secondary"
                  >
                    {translations.navbarButtonProject}
                  </ButtonLinkNavBar>
                </li>

                <li>
                  <ButtonLinkNavBar
                    sectionRef={educationRef}
                    handleScrollToSection={handleScrollToSection}
                    className="text-text hover:text-secondary"
                  >
                    {translations.navbarButtonCareer}
                  </ButtonLinkNavBar>
                </li>

                <li>
                  <ButtonLinkNavBar
                    sectionRef={contactRef}
                    handleScrollToSection={handleScrollToSection}
                    className="text-text hover:text-secondary"
                  >
                    {translations.navbarButtonContact}
                  </ButtonLinkNavBar>
                </li>

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
                    onClick={handleOpenModal}
                    className="hover:text-secondary text-primary cursor-pointer"
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
                    {translations.navbarButtonTerminal}
                  </ButtonLinkNavBar>
                </li>
              </>
            )}
          </ul>
        </menu>

        <menu className="md:hidden">
          <BurgerButton open={menuOpen} toggleMenu={toggleMenu} />
        </menu>
      </section>

      {menuOpen && (
        <menu className="md:hidden bg-body fixed inset-y-0 right-0 z-40 w-64 px-4 py-6">
        </menu>
      )}

      <ModalCustom open={modalOpen} onClose={handleCloseModal}>
        <Button
          onClick={() => handleChangeColorTheme("dark")}
          text={translations.theme1}
        />
        <Button
          onClick={() => handleChangeColorTheme("light")}
          text={translations.theme2}
        />
        <Button
          onClick={() => handleChangeColorTheme("ubuntu")}
          text={translations.theme3}
        />
      </ModalCustom>
    </nav>
  );
};

export default Navbar;